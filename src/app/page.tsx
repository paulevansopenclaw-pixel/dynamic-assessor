"use client";

import { useState, useRef, useEffect } from "react";
import SitePlanOverlay from "./components/SitePlanOverlay";

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
  const [modulesList] = useState<ModuleData[]>([
    {
      id: "static_01",
      module_name: "Erosion_Control_Management_of_Soils",
      category: "Erosion Control",
      compliance_anchor: "Landcom Blue Book Vol 1, 4th Edition - Section 4",
      scenarios: [
        {
          id: "ec_401",
          symptom: ["Introduction to Soil Management"],
          diagnostic_question: "Are you familiar with the general principles of erosion control as outlined in Section 4.1?",
          technical_specs: "Erosion control is the first line of defense; sediment control is the last.",
          branches: {
            "need_overview": "Section 4.1 emphasizes that erosion control (preventing soil detachment) is more cost-effective than sediment control (capturing detached soil)."
          }
        },
        {
          id: "ec_4032",
          symptom: ["Topsoil Handling Procedures"],
          diagnostic_question: "How is the topsoil being managed according to Section 4.3.2?",
          technical_specs: "Topsoil stripping max height: 2m.",
          branches: {
            "stripping_and_stockpiling": "Topsoil should be stripped from all areas and stockpiled separately. Protect from erosion by location or cover.",
            "stockpile_specs": "Topsoil stockpiles must be < 2m high and located away from drainage lines."
          }
        }
      ]
    },
    {
      id: "static_02",
      module_name: "Sediment_Fence_Troubleshooting",
      category: "Sediment Control",
      compliance_anchor: "Landcom Blue Book Vol 1, 4th Edition",
      scenarios: [
        {
          id: "sf_001",
          symptom: ["overflowing", "bowing", "collapsing"],
          diagnostic_question: "Is the water overtopping the fabric, or is the fence physically bowing under the weight?",
          technical_specs: "Max catchment: 0.6ha per 100m. Max picket spacing: 2.5m.",
          branches: {
            "overtopping": "Check the catchment area. A single sediment fence can only handle 0.6 hectares per 100 meters.",
            "bowing": "Check your star picket spacing. They must be spaced no further than 2.5 meters apart."
          }
        }
      ]
    },
    {
      id: "static_03",
      module_name: "Stockpile_Management",
      category: "Erosion Control",
      compliance_anchor: "Landcom Blue Book Vol 1, 4th Edition - Section 4.3.2",
      scenarios: [
        {
          id: "sp_001",
          symptom: ["dust blowing off", "sediment washing into street", "stockpile bare"],
          diagnostic_question: "Has this stockpile been inactive for more than 10 days?",
          technical_specs: "Inactive > 10 days requires cover. Fence must be 2m from base.",
          branches: {
            "inactive_no_fence": "Violation. Stockpiles inactive for > 10 days must be covered and have a sediment fence on the downslope.",
            "active_no_fence": "Install a sediment fence 2 meters from the downslope base to catch runoff."
          }
        }
      ]
    },
    {
      id: "static_04",
      module_name: "Sediment_Basin_Maintenance",
      category: "Maintenance",
      compliance_anchor: "Landcom Blue Book Vol 1, 4th Edition - Section 6.3.3",
      scenarios: [
        {
          id: "bm_001",
          symptom: ["sediment level high", "marker peg submerged"],
          diagnostic_question: "Is the sediment level at or above the 'clean out' mark?",
          technical_specs: "Basins must be cleaned when sediment exceeds 50% capacity.",
          branches: {
            "above_mark": "Immediate maintenance required. Desilt the basin and dispose of sediment safely.",
            "below_mark": "Compliance maintained. Check the flocculant station."
          }
        }
      ]
    },
    {
      id: "static_05",
      module_name: "Inlet_Protection",
      category: "Sediment Control",
      compliance_anchor: "Landcom Blue Book Vol 1, 4th Edition - Section 6.3.3.4",
      scenarios: [
        {
          id: "ip_001",
          symptom: ["sediment entering gully", "inlet choked"],
          diagnostic_question: "What type of inlet protection is installed: SAG bags or a filter sock?",
          technical_specs: "SAG bags must have 75mm gap for overflow.",
          branches: {
            "sag_bags_choked": "Replace aggregate. Maintain 75mm gap for bypass overflow.",
            "sock_bypassing": "Re-seat and weight the sock to prevent under-flow."
          }
        }
      ]
    }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [visionAnalysis, setVisionAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isCheckingCompetency, setIsCheckingCompetency] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  const addMessage = (role: "avatar" | "user" | "specs", text: string) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), role, text }]);
  };

  const categories = Array.from(new Set(modulesList.map(m => m.category))).filter(c => c && c !== "Uncategorized").sort();

  const handleVisionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImageUrl(base64);
      setIsAnalyzing(true);
      addMessage("user", "Analyzing site photo for guidance...");

      try {
        const res = await fetch("/api/vision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, text: "Check site controls" }),
        });
        const data = await res.json();
        setVisionAnalysis(data.analysis);
        addMessage("avatar", data.analysis || "I've analyzed the photo. The controls look standard, but ensure your Star pickets are at 3m MAX spacing.");
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCategorySelect = (cat: string) => {
    addMessage("user", cat || "General Controls");
    setSelectedCategory(cat);
    setSearchQuery("");
    
    const filteredModules = modulesList.filter(m => m.category === cat);
    
    setTimeout(() => {
      if (filteredModules.length > 1) {
        addMessage("avatar", `Got it. I've found ${filteredModules.length} modules for ${cat}. Which one would you like to review?`);
      } else {
        addMessage("avatar", `Got it. ${cat || "General Controls"}. Which specific control are you checking?`);
      }
      setCurrentState("PICK_MODULE");
    }, 600);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") return;

    const results = modulesList.filter(m => 
      m.module_name.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase()) ||
      m.scenarios.some(s => s.symptom.some(sym => sym.toLowerCase().includes(query.toLowerCase())))
    );

    if (results.length > 0) {
      addMessage("user", `Searching for: ${query}`);
      setTimeout(() => {
        addMessage("avatar", `I found ${results.length} relevant Blue Book modules. Which one matches your site condition?`);
        setCurrentState("PICK_MODULE");
        setSelectedCategory("SEARCH_RESULTS");
      }, 400);
    }
  };

  const handleModuleSelect = (mod: ModuleData) => {
    addMessage("user", mod.module_name.replace(/_/g, " "));
    setSelectedModule(mod);
    setTimeout(() => {
      addMessage("avatar", `What exact issue or symptom are you seeing on site?`);
      setCurrentState("PICK_SYMPTOM");
    }, 600);
  };

  const handleSymptomSelect = (scenario: Scenario) => {
    const userText = Array.isArray(scenario.symptom) ? scenario.symptom.join(" / ") : "This issue";
    addMessage("user", userText);
    setSelectedScenario(scenario);
    
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
    setVisionAnalysis(null);
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
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Search problem or control..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/50 transition-all"
                />
                <button 
                  onClick={() => handleSearch(searchQuery)}
                  className="absolute right-2 top-1.5 p-1.5 bg-orange-600 rounded-xl shadow-lg active:scale-95 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {categories.map((cat, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleCategorySelect(cat)} 
                  className="w-full glass-card hover:bg-white/10 text-white text-left px-5 py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] font-medium text-[1.05rem] border border-white/10"
                >
                  {cat || "General Controls"}
                </button>
              ))}
            </div>
          </div>
        );

      case "PICK_MODULE":
        const currentModules = selectedCategory === "SEARCH_RESULTS" 
          ? modulesList.filter(m => 
              m.module_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
              m.scenarios.some(s => s.symptom.some(sym => sym.toLowerCase().includes(query.toLowerCase())))
            )
          : modulesList.filter(m => m.category === selectedCategory);

        return currentModules
          .sort((a, b) => a.module_name.localeCompare(b.module_name))
          .map((mod, idx) => (
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
            <div className="flex justify-center mb-2">
              <div className={`relative w-20 h-20 flex items-center justify-center rounded-full border-2 ${isRecording ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'border-blue-500/30'}`}>
                {isRecording && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-20"></div>
                    <div className="absolute inset-[-4px] rounded-full border border-red-500/40 animate-pulse"></div>
                  </>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRecording ? "text-red-500" : "text-blue-500/40"}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              </div>
            </div>
            <button 
              onClick={startRecording} 
              disabled={isRecording || isCheckingCompetency}
              className={`w-full ${isRecording ? 'bg-red-500/80 animate-pulse border-red-400' : 'bg-blue-600/20 border-blue-500/50'} hover:bg-blue-600/30 text-white text-center px-5 py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] font-bold text-[1.1rem] flex items-center justify-center gap-3 border`}
            >
              {isRecording ? 'Listening...' : isCheckingCompetency ? '⌛ Checking Specs...' : '🎤 Start Verification'}
            </button>
            {selectedScenario?.technical_specs && (
              <div className="text-[0.8rem] text-white/40 italic text-center px-2">
                Mention: {selectedScenario.technical_specs.match(/\d+\s?\w+/g)?.join(", ")}
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
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[120px] -z-10"></div>

      <div className="glass-panel w-full max-w-md h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative border border-white/10">
        
        <div className="bg-white/5 backdrop-blur-xl text-white p-6 pb-4 flex items-center justify-between z-20 border-b border-white/5">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl drop-shadow-md">🐺</span>
              <span className="font-black text-xl tracking-tight uppercase">Wolf</span>
            </div>
            <span className="text-[0.65rem] text-white/40 font-bold tracking-[0.2em] uppercase mt-0.5">Dynamic Assessor v2.6</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar flex flex-col pt-8">
          {currentState === "PICK_CATEGORY" && <SitePlanOverlay />}
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

        <div className="p-6 bg-black/40 backdrop-blur-2xl border-t border-white/10 flex flex-col gap-4 pb-12 max-h-[45vh] overflow-y-auto no-scrollbar shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          {renderChoices()}
        </div>
      </div>
    </div>
  );
}
