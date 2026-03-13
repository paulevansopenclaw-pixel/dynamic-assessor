"use client";

import { useState, useRef, useEffect } from "react";
import { getModules } from "./actions";

interface Scenario {
  id: string;
  symptom: string[];
  diagnostic_question: string;
  branches: Record<string, string>;
  technical_specs?: string;
  video_url?: string;
}

interface ModuleData {
  id: string;
  module_name: string;
  category: string;
  compliance_anchor: string;
  scenarios: Scenario[];
}

interface Message {
  id: number;
  role: "avatar" | "user" | "specs";
  text: string;
}

type AppState = "PICK_CATEGORY" | "PICK_MODULE" | "PICK_SYMPTOM" | "PICK_BRANCH" | "VOICE_VERIFICATION" | "RESOLUTION";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      role: "avatar", 
      text: "Hey, I'm Wolf. I've got the Landcom Bluebook loaded up. Which category are we looking at today?" 
    },
  ]);
  
  const [currentState, setCurrentState] = useState<AppState>("PICK_CATEGORY");
  const [modulesList, setModulesList] = useState<ModuleData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isCheckingCompetency, setIsCheckingCompetency] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    getModules().then(res => {
      setModulesList(res as unknown as ModuleData[]);
    }).catch(err => {
      console.error("Failed to load modules:", err);
    });
  }, []);

  const speakText = async (text: string) => {
    if (!voiceEnabled) return;
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (err) {
      console.error("Error playing TTS:", err);
    }
  };

  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    if (newState) {
      speakText(messages[messages.length - 1].text);
    }
  };

  const addMessage = (role: "avatar" | "user" | "specs", text: string) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), role, text }]);
    if (role === "avatar") speakText(text);
  };

  const categories = Array.from(new Set(modulesList.map(m => m.category)));

  const handleCategorySelect = (cat: string) => {
    addMessage("user", cat || "General Controls");
    setSelectedCategory(cat);
    setTimeout(() => {
      addMessage("avatar", `Got it. ${cat || "General Controls"}. Which specific control are you checking?`);
      setCurrentState("PICK_MODULE");
    }, 600);
  };

  const handleModuleSelect = (mod: ModuleData) => {
    addMessage("user", mod.module_name.replace(/_/g, " "));
    setSelectedModule(mod);
    setTimeout(() => {
      addMessage("avatar", `What exact issue or symptom are you seeing on site?`);
      setCurrentState("PICK_SYMPTOM");
    }, 600);
  };

  const generateVisual = async (scenario: Scenario) => {
    setIsGeneratingImage(true);
    try {
      const prompt = `A highly realistic technical construction photo showing: ${scenario.symptom.join(", ")}`;
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) setImageUrl(data.imageUrl);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSymptomSelect = (scenario: Scenario) => {
    const userText = Array.isArray(scenario.symptom) ? scenario.symptom.join(" / ") : "This issue";
    addMessage("user", userText);
    setSelectedScenario(scenario);
    generateVisual(scenario);
    
    setTimeout(() => {
      addMessage("avatar", scenario.diagnostic_question);
      setCurrentState("PICK_BRANCH");
    }, 600);
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      addMessage("avatar", "Voice recognition isn't supported in this browser. Try Chrome.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-AU';

    recognition.onstart = () => {
      setIsRecording(true);
      addMessage("avatar", "I'm listening. Explain the technical requirement for this fix...");
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      addMessage("user", transcript);
      setIsRecording(false);
      
      setIsCheckingCompetency(true);
      try {
        const res = await fetch("/api/competency", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            transcript, 
            technicalSpecs: selectedScenario?.technical_specs 
          }),
        });
        const data = await res.json();
        addMessage("avatar", data.feedback);
        if (data.verified) {
          setCurrentState("RESOLUTION");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsCheckingCompetency(false);
      }
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const handleBranchSelect = (branchKey: string, branchAnswer: string) => {
    addMessage("user", branchKey.replace(/_/g, " "));
    const isCritical = /(stop|violation|failed|immediately|fine|failed)/i.test(branchAnswer);

    if (isCritical && selectedModule && selectedScenario) {
      fetch("/api/slack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          moduleName: selectedModule.module_name, 
          issue: Array.isArray(selectedScenario.symptom) ? selectedScenario.symptom.join(", ") : selectedScenario.symptom, 
          answer: branchAnswer 
        }),
      }).catch(console.error);
    }
    
    setTimeout(() => {
      const compliance = selectedModule ? ` (Ref: ${selectedModule.compliance_anchor})` : "";
      addMessage("avatar", `${branchAnswer}${compliance}`);
      
      if (selectedScenario?.technical_specs) {
        setTimeout(() => {
          addMessage("avatar", "Before I grant access, you need to verify your understanding. Use the mic to explain the technical requirement for this control.");
          setCurrentState("VOICE_VERIFICATION");
        }, 800);
      } else {
        setCurrentState("RESOLUTION");
      }
    }, 600);
  };

  const handleReset = () => {
    addMessage("user", "Finish & Request Site Access");
    setImageUrl(null);
    setTimeout(() => {
      setMessages([{ 
        id: Date.now(), 
        role: "avatar", 
        text: "Access granted. Drive safe out there. What else do you need to look at?" 
      }]);
      setCurrentState("PICK_CATEGORY");
      setSelectedCategory(null);
      setSelectedModule(null);
      setSelectedScenario(null);
    }, 600);
  };

  const renderChoices = () => {
    switch (currentState) {
      case "PICK_CATEGORY":
        return categories.map((cat, idx) => (
          <button 
            key={idx} 
            onClick={() => handleCategorySelect(cat)} 
            className="w-full glass-card hover:bg-white/10 text-white text-left px-5 py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] font-medium text-[1.05rem] border border-white/10"
          >
            {cat || "General Controls"}
          </button>
        ));

      case "PICK_MODULE":
        return modulesList.filter(m => m.category === selectedCategory).map((mod, idx) => (
          <button key={idx} onClick={() => handleModuleSelect(mod)} className="w-full glass-card hover:bg-white/10 text-white text-left px-5 py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] font-medium text-[1.05rem] border border-white/10">
            {mod.module_name.replace(/_/g, " ")}
          </button>
        ));

      case "PICK_SYMPTOM":
        return selectedModule?.scenarios.map((scenario, idx) => (
          <button key={idx} onClick={() => handleSymptomSelect(scenario)} className="w-full glass-card hover:bg-white/10 text-white text-left px-5 py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] font-medium text-[1.05rem] border border-white/10">
            {Array.isArray(scenario.symptom) ? scenario.symptom.join(" / ") : scenario.symptom}
          </button>
        ));

      case "PICK_BRANCH":
        return Object.entries(selectedScenario?.branches || {}).map(([key, answer], idx) => (
          <button key={idx} onClick={() => handleBranchSelect(key, answer as string)} className="w-full glass-card hover:bg-white/10 text-white text-left px-5 py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] font-medium text-[1.05rem] capitalize border border-white/10">
            {key.replace(/_/g, " ")}
          </button>
        ));

      case "VOICE_VERIFICATION":
        return (
          <div className="flex flex-col gap-3">
            <button 
              onClick={startRecording} 
              disabled={isRecording || isCheckingCompetency}
              className={`w-full ${isRecording ? 'bg-red-500/80 animate-pulse border-red-400' : 'bg-blue-600/20 border-blue-500/50'} hover:bg-blue-600/30 text-white text-center px-5 py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] font-bold text-[1.1rem] flex items-center justify-center gap-3 border`}
            >
              {isRecording ? '🎤 Listening...' : isCheckingCompetency ? '⌛ Checking...' : '🎤 Verify Competency'}
            </button>
            {selectedScenario?.technical_specs && (
              <div className="text-[0.8rem] text-white/40 italic text-center px-2">
                Mention specifics: {selectedScenario.technical_specs.match(/\d+\s?\w+/g)?.join(", ")}
              </div>
            )}
          </div>
        );

      case "RESOLUTION":
        return (
          <div className="flex flex-col items-center gap-6 py-2">
            <div className="w-full glass-panel border border-green-500/30 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50"></div>
              <div className="text-5xl mb-4 drop-shadow-md">🪪</div>
              <div className="text-green-400 font-black text-2xl tracking-tight uppercase mb-1">Pass Issued</div>
              <div className="text-white/60 text-sm font-medium mb-6">{selectedModule?.module_name.replace(/_/g, " ")}</div>
              <div className="bg-green-500 text-black py-2 px-6 rounded-full text-xs font-black tracking-widest inline-block shadow-lg">SITE ACCESS GRANTED</div>
            </div>
            <button onClick={handleReset} className="w-full bg-white text-black hover:bg-gray-200 px-5 py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] font-bold text-[1.05rem]">
              ✅ Finalize & Close
            </button>
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans text-white antialiased">
      {/* Background ambient glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[120px] -z-10"></div>

      <div className="glass-panel w-full max-w-md h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative border border-white/10">
        
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-xl text-white p-6 pb-4 flex items-center justify-between z-20 border-b border-white/5">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl drop-shadow-md">🐺</span>
              <span className="font-black text-xl tracking-tight uppercase">Wolf</span>
            </div>
            <span className="text-[0.65rem] text-white/40 font-bold tracking-[0.2em] uppercase mt-0.5">Dynamic Assessor v2.6</span>
          </div>
          <button 
            onClick={toggleVoice} 
            className={`p-2.5 rounded-2xl transition-all border ${voiceEnabled ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'bg-white/5 border-white/10 text-white/40'}`}
          >
            {voiceEnabled ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9l-2 2H2v6h5l4 4V11"/><path d="M15.54 15.54a5 5 0 0 0 0-7.07"/><path d="M19.07 19.07a10 10 0 0 0 0-14.14"/></svg>
            )}
          </button>
        </div>

        {/* Visual Viewport */}
        {(imageUrl || isGeneratingImage) && (
          <div className="w-full bg-black/40 h-[220px] shrink-0 border-b border-white/5 relative group overflow-hidden">
            {isGeneratingImage ? (
              <div className="flex flex-col h-full w-full items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
                <div className="text-white/30 font-bold text-xs tracking-widest uppercase">Analyzing Site Condition...</div>
              </div>
            ) : (
              <img src={imageUrl!} alt="Scenario visual" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            )}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
          </div>
        )}

        {/* Chat Log */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar flex flex-col pt-8">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} animate-fade-in`}>
              <div className={`px-4 py-3 rounded-[1.5rem] max-w-[88%] text-[0.95rem] leading-relaxed ${
                msg.role === "avatar" ? "bg-white/10 text-white rounded-tl-sm" :
                msg.role === "specs" ? "bg-orange-500/10 text-orange-400 text-sm border border-orange-500/20 italic" :
                "bg-orange-600 text-white self-end rounded-tr-sm font-medium shadow-lg shadow-orange-900/20"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Controls Overlay */}
        <div className="p-6 bg-black/40 backdrop-blur-2xl border-t border-white/10 flex flex-col gap-4 pb-12 max-h-[45vh] overflow-y-auto no-scrollbar shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          {renderChoices()}
        </div>
      </div>
    </div>
  );
}
