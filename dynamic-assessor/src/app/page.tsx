"use client";

import { useState, useRef, useEffect } from "react";
import { getModules } from "./actions";

// Type definitions based on the provided JSON structure
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
  role: "avatar" | "user";
  text: string;
}

type AppState = "PICK_SECTION" | "PICK_MODULE" | "PICK_SYMPTOM" | "PICK_BRANCH" | "RESOLUTION";

const BLUE_BOOK_SECTIONS = [
  "Planning",
  "Erosion Control",
  "Sediment Control",
  "Maintenance",
  "Compliance"
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      role: "avatar", 
      text: "Hey, I'm Wolf, your Dynamic Assessor. I've got the Landcom Blue Book training modules ready. Which section are we focusing on today?" 
    },
  ]);
  
  const [currentState, setCurrentState] = useState<AppState>("PICK_SECTION");
  const [modulesList, setModulesList] = useState<ModuleData[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Load data from DB on mount
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

  const addMessage = (role: "avatar" | "user", text: string) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), role, text }]);
    if (role === "avatar") speakText(text);
  };

  // --- Image Generator ---
  const generateVisual = async (scenario: Scenario) => {
    setIsGeneratingImage(true);
    try {
      const prompt = `A photorealistic high-resolution construction site photo showing: ${scenario.symptom.join(", ")}. Standard Australian safety gear visible.`;
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

  // --- Handlers for each state ---

  const handleSectionSelect = (section: string) => {
    addMessage("user", section);
    setSelectedSection(section);
    
    setTimeout(() => {
      addMessage("avatar", `Opening ${section} modules. Which specific control or problem are we looking at?`);
      setCurrentState("PICK_MODULE");
    }, 600);
  };

  const handleModuleSelect = (mod: ModuleData) => {
    addMessage("user", mod.module_name.replace(/_/g, " "));
    setSelectedModule(mod);
    
    setTimeout(() => {
      addMessage("avatar", `Got it. ${mod.module_name.replace(/_/g, " ")}. What are the symptoms or issues you've identified?`);
      setCurrentState("PICK_SYMPTOM");
    }, 600);
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

  const handleBranchSelect = (branchKey: string, branchAnswer: string) => {
    addMessage("user", branchKey.replace(/_/g, " "));

    const isCritical = /(stop|violation|failed|immediately|fine)/i.test(branchAnswer);

    if (isCritical) {
      const moduleName = selectedModule?.module_name.replace(/_/g, " ") || "Unknown Module";
      const issue = Array.isArray(selectedScenario?.symptom) 
        ? selectedScenario?.symptom.join(", ") 
        : "Unknown Issue";

      fetch("/api/slack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleName, issue, answer: branchAnswer }),
      }).catch(console.error);
    }
    
    setTimeout(() => {
      const compliance = selectedModule ? ` (Ref: ${selectedModule.compliance_anchor})` : "";
      const technicalNote = selectedScenario?.technical_specs ? `\n\nTechnical Spec: ${selectedScenario.technical_specs}` : "";
      const passFailText = isCritical ? " This critical failure has been logged for supervisor review." : " Your competency on this standard is verified.";
      
      addMessage("avatar", `${branchAnswer}${compliance}${technicalNote}.${passFailText}`);
      setCurrentState("RESOLUTION");
    }, 600);
  };

  const handleReset = () => {
    addMessage("user", "Finish & Request Site Access");
    setImageUrl(null);
    
    setTimeout(() => {
      setMessages([{ 
        id: Date.now(), 
        role: "avatar", 
        text: "Training session complete. Access granted. Drive safe. Need help with another section?" 
      }]);
      setCurrentState("PICK_SECTION");
      setSelectedSection(null);
      setSelectedModule(null);
      setSelectedScenario(null);
      if (voiceEnabled) {
        speakText("Training session complete. Access granted. Drive safe. Need help with another section?");
      }
    }, 600);
  };

  // --- Render logic for buttons based on state ---
  const renderChoices = () => {
    switch (currentState) {
      case "PICK_SECTION":
        return BLUE_BOOK_SECTIONS.map((section, idx) => (
          <button
            key={idx}
            onClick={() => handleSectionSelect(section)}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white text-left px-5 py-4 rounded-xl shadow-md transition-transform active:scale-[0.98] font-medium text-[1.05rem]"
          >
            {section}
          </button>
        ));

      case "PICK_MODULE":
        return modulesList
          .filter(m => !selectedSection || m.category === selectedSection)
          .map((mod, idx) => (
            <button
              key={idx}
              onClick={() => handleModuleSelect(mod)}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white text-left px-5 py-4 rounded-xl shadow-md transition-transform active:scale-[0.98] font-medium text-[1.05rem]"
            >
              {mod.module_name.replace(/_/g, " ")}
            </button>
          ));

      case "PICK_SYMPTOM":
        if (!selectedModule) return null;
        return selectedModule.scenarios.map((scenario, idx) => (
          <button
            key={idx}
            onClick={() => handleSymptomSelect(scenario)}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white text-left px-5 py-4 rounded-xl shadow-md transition-transform active:scale-[0.98] font-medium text-[1.05rem]"
          >
            {Array.isArray(scenario.symptom) ? scenario.symptom.join(" / ") : scenario.symptom}
          </button>
        ));

      case "PICK_BRANCH":
        if (!selectedScenario || !selectedScenario.branches) return null;
        return Object.entries(selectedScenario.branches).map(([key, answer], idx) => (
          <button
            key={idx}
            onClick={() => handleBranchSelect(key, answer)}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white text-left px-5 py-4 rounded-xl shadow-md transition-transform active:scale-[0.98] font-medium text-[1.05rem] capitalize"
          >
            {key.replace(/_/g, " ")}
          </button>
        ));

      case "RESOLUTION":
        return (
          <button
            onClick={handleReset}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-center px-5 py-4 rounded-xl shadow-md transition-transform active:scale-[0.98] font-bold text-[1.05rem]"
          >
            ✅ Finish & Request Site Access
          </button>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="bg-white w-full max-w-md h-[85vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border-8 border-neutral-800 relative">
        
        {/* Header */}
        <div className="bg-blue-900 text-white p-4 text-center font-bold text-lg flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-2 text-sm">
            <span>📘</span> Blue Book Training
          </div>
          <button 
            onClick={toggleVoice}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${voiceEnabled ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-200'}`}
          >
            {voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
          </button>
        </div>

        {/* Visualizer Area */}
        {(imageUrl || isGeneratingImage) && (
          <div className="w-full bg-black h-[180px] shrink-0 border-b border-gray-300 relative">
            {isGeneratingImage ? (
              <div className="flex h-full w-full items-center justify-center text-gray-400 font-medium animate-pulse">
                Generating site visual...
              </div>
            ) : (
              <img src={imageUrl!} alt="Scenario visual" className="w-full h-full object-cover" />
            )}
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                msg.role === "avatar"
                  ? "bg-blue-100 text-blue-900 self-start rounded-tl-sm border-l-4 border-blue-600 shadow-sm"
                  : "bg-orange-500 text-white self-end rounded-tr-sm shadow-sm"
              } transition-all animate-fade-in`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Action Area */}
        <div className="p-4 bg-white border-t border-gray-200 flex flex-col gap-3 pb-8 max-h-[40vh] overflow-y-auto">
          {renderChoices()}
          {currentState !== "PICK_SECTION" && (
             <button 
                onClick={() => {
                   setMessages([{id: Date.now(), role: 'avatar', text: 'Resetting. Pick a new section:'}]);
                   setCurrentState('PICK_SECTION');
                   setImageUrl(null);
                }}
                className="text-center text-xs text-gray-400 hover:text-gray-600 mt-2"
             >
                ← Back to Sections
             </button>
          )}
        </div>
      </div>
    </div>
  );
}
