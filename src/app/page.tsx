"use client";

import { useState, useRef, useEffect } from "react";
import SitePlanOverlay from "./components/SitePlanOverlay";
import TechnicalDiagram from "./components/TechnicalDiagram";

// --- Types ---
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

type AppMode = "ASSISTANT" | "FIELD";
type AppState = "PICK_CATEGORY" | "PICK_MODULE" | "PICK_SYMPTOM" | "PICK_BRANCH" | "RESOLUTION";

export default function Home() {
  // --- Core State ---
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      role: "avatar", 
      text: "Hey, I'm Wolf. I've got the Landcom Bluebook loaded up. Which category are we looking at today?" 
    },
  ]);
  
  const [currentState, setCurrentState] = useState<AppState>("PICK_CATEGORY");
  const [appMode, setAppMode] = useState<AppMode>("ASSISTANT"); // Default to Assistant
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Data (Simulated DB) ---
  const [modulesList] = useState<ModuleData[]>([
    {
      id: "static_01",
      module_name: "Soil Management",
      category: "Erosion Control",
      compliance_anchor: "Section 4",
      scenarios: [
        {
          id: "ec_4032",
          symptom: ["Topsoil Stockpiles", "Muddy Runoff"],
          diagnostic_question: "How is the topsoil being managed according to Section 4.3.2?",
          technical_specs: "Max height: 2m. Keep away from drainage.",
          branches: { "stockpile_specs": "Topsoil stockpiles must be < 2m high and located away from drainage lines." }
        }
      ]
    },
    {
      id: "static_02",
      module_name: "Sediment Fence",
      category: "Sediment Control",
      compliance_anchor: "Section 6",
      scenarios: [
        {
          id: "sf_001",
          symptom: ["Fence Bowing", "Overtopping", "Mud on Road"],
          diagnostic_question: "Is the water overtopping the fabric, or is the fence physically bowing?",
          technical_specs: "Max picket spacing: 2.5m. Max catchment: 0.6ha/100m.",
          branches: {
            "overtopping": "Check catchment area. Max 0.6ha per 100m.",
            "bowing": "Check star picket spacing. Max 2.5m spacing required."
          }
        }
      ]
    },
    {
      id: "static_05",
      module_name: "Inlet Protection",
      category: "Sediment Control",
      compliance_anchor: "Section 6.3.3.4",
      scenarios: [
        {
          id: "ip_001",
          symptom: ["Mud in Drain", "Gully Choked"],
          diagnostic_question: "What type of inlet protection is installed?",
          technical_specs: "SAG bags must have 75mm gap for overflow.",
          branches: { "sag_bags": "Maintain 75mm gap for bypass overflow." }
        }
      ]
    },
    {
      id: "static_06",
      module_name: "Wind Erosion",
      category: "Erosion Control",
      compliance_anchor: "Section 7",
      scenarios: [
        {
          id: "dust_001",
          symptom: ["Dust Plumes", "Haul Road Dust"],
          diagnostic_question: "Is dust suppression active?",
          technical_specs: "Staged clearing is mandatory.",
          branches: { "water_cart": "Apply water to haul roads." }
        }
      ]
    }
  ]);

  const categories = ["Planning", "Erosion Control", "Sediment Control", "Maintenance", "Compliance"];

  // --- Logic ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (role: "avatar" | "user" | "specs", text: string) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), role, text }]);
  };

  const handleCategorySelect = (cat: string) => {
    addMessage("user", cat);
    setSelectedCategory(cat);
    setCurrentState("PICK_MODULE");
  };

  const handleModuleSelect = (mod: ModuleData) => {
    addMessage("user", mod.module_name);
    setSelectedModule(mod);
    setCurrentState("PICK_SYMPTOM");
  };

  const handleSymptomSelect = (scenario: Scenario) => {
    addMessage("user", scenario.symptom[0]);
    setSelectedScenario(scenario);
    setCurrentState("PICK_BRANCH");
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    const results = modulesList.filter(m => 
      m.module_name.toLowerCase().includes(query.toLowerCase()) ||
      m.scenarios.some(s => s.symptom.some(sym => sym.toLowerCase().includes(query.toLowerCase())))
    );
    if (results.length > 0) {
      addMessage("user", `Searching: ${query}`);
      setSelectedCategory("SEARCH");
      setCurrentState("PICK_MODULE");
    } else {
        addMessage("avatar", `I couldn't find a module for "${query}". Try searching "Fence" or "Mud".`);
    }
  };

  const handleReset = () => {
    setCurrentState("PICK_CATEGORY");
    setSelectedCategory(null);
    setSelectedModule(null);
    setSelectedScenario(null);
  };

  // --- UI Components ---

  const renderDiagram = () => {
    if (selectedModule?.id === "static_02") return <TechnicalDiagram type="sediment-fence" imageUrl="/scenarios/silt-fence-fail.png" />;
    if (selectedModule?.id === "static_05") return <TechnicalDiagram type="inlet-protection" imageUrl="/scenarios/basin-flood.png" />;
    if (selectedModule?.id === "static_06") return <TechnicalDiagram type="disturbed-area" imageUrl="/scenarios/dust-clouds.png" />;
    return null;
  };

  const FieldModeUI = () => (
    <div className="flex flex-col h-full bg-yellow-400 text-black font-bold p-2">
      {/* Search Front & Center */}
      <div className="bg-black p-4 rounded-xl mb-4">
        <input 
          type="text" 
          placeholder="SEARCH PROBLEM (e.g. MUD)" 
          className="w-full bg-white text-2xl p-4 rounded-lg uppercase placeholder:text-gray-400"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch((e.target as HTMLInputElement).value)}
        />
        <label className="mt-2 block bg-white text-black font-bold p-4 rounded-lg text-center cursor-pointer uppercase">
          Upload Site Plan
          <input type="file" accept="image/*" className="hidden" />
        </label>
      </div>

      {/* Proactive Weather Alerts */}
      <div className="bg-red-600 text-white p-4 rounded-xl mb-4 animate-pulse shadow-lg">
        <h3 className="text-xl uppercase tracking-widest">⚠️ WEATHER ALERT: HIGH WINDS</h3>
        <p className="text-sm font-normal mt-1 opacity-90">Forecast: 40km/h gusts. Pre-emptive check required.</p>
        <button 
          onClick={() => handleSearch("Dust")}
          className="w-full bg-white text-red-600 font-bold p-3 mt-3 rounded-lg uppercase text-sm"
        >
          View Wind Checklist
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 px-2">
        {/* Rapid Index / Symptoms */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => handleSearch("Mud")} className="bg-black text-white p-8 rounded-2xl text-2xl flex flex-col items-center justify-center border-4 border-white active:bg-gray-800">
            <span>⚠️</span>
            <span>MUD</span>
          </button>
          <button onClick={() => handleSearch("Dust")} className="bg-black text-white p-8 rounded-2xl text-2xl flex flex-col items-center justify-center border-4 border-white active:bg-gray-800">
            <span>💨</span>
            <span>DUST</span>
          </button>
          <button onClick={() => handleSearch("Fence")} className="bg-black text-white p-8 rounded-2xl text-2xl flex flex-col items-center justify-center border-4 border-white active:bg-gray-800">
            <span>🚧</span>
            <span>FENCE</span>
          </button>
          <button onClick={() => handleSearch("Drain")} className="bg-black text-white p-8 rounded-2xl text-2xl flex flex-col items-center justify-center border-4 border-white active:bg-gray-800">
            <span>🕳️</span>
            <span>DRAIN</span>
          </button>
        </div>

        {/* Dynamic Context Area */}
        {selectedScenario ? (
          <div className="bg-white border-8 border-black p-6 rounded-3xl animate-fade-in shadow-2xl">
            <h2 className="text-4xl mb-4 underline">SPECIFICATION</h2>
            <p className="text-3xl mb-4 leading-tight">{selectedScenario.technical_specs}</p>
            <div className="bg-yellow-200 p-4 border-4 border-black mb-4">
              <p className="text-xl italic">Ref: {selectedModule?.compliance_anchor}</p>
            </div>
            <button onClick={handleReset} className="w-full bg-red-600 text-white p-6 rounded-xl text-3xl border-4 border-black">CLOSE</button>
          </div>
        ) : selectedModule ? (
          <div className="space-y-4">
            <h2 className="text-2xl uppercase bg-black text-white p-2 text-center">SYMPTOMS: {selectedModule.module_name}</h2>
            {selectedModule.scenarios.map(s => (
              <button key={s.id} onClick={() => handleSymptomSelect(s)} className="w-full bg-white border-4 border-black p-6 rounded-xl text-2xl text-left flex justify-between items-center">
                <span>{s.symptom[0]}</span>
                <span>➡️</span>
              </button>
            ))}
          </div>
        ) : selectedCategory === "SEARCH" ? (
          <div className="space-y-4">
             <h2 className="text-2xl uppercase bg-black text-white p-2 text-center">MATCHING CONTROLS</h2>
             {modulesList.map(m => (
               <button key={m.id} onClick={() => handleModuleSelect(m)} className="w-full bg-white border-4 border-black p-6 rounded-xl text-2xl text-left">{m.module_name}</button>
             ))}
          </div>
        ) : null}
      </div>

      {/* Navigation Dock */}
      <div className="bg-black p-4 grid grid-cols-3 gap-2 mt-4 rounded-t-3xl">
        <button onClick={handleReset} className="bg-yellow-400 p-4 rounded-xl text-xl">HOME</button>
        <label className="bg-blue-600 text-white p-4 rounded-xl text-xl cursor-pointer flex items-center justify-center">
          PHOTO
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => {
             const file = e.target.files?.[0];
             if (file) {
               addMessage("user", "Analyzing photo...");
               // In a real app, this would upload/analyze
               setTimeout(() => addMessage("avatar", "Photo analyzed. It looks like the fence is bowed. Checking Blue Book..."), 1000);
             }
          }} />
        </label>
        <button onClick={() => setAppMode("ASSISTANT")} className="bg-white p-4 rounded-xl text-xl">MODE</button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${appMode === 'FIELD' ? 'bg-yellow-400' : 'bg-black'} flex items-center justify-center font-sans antialiased transition-colors duration-500`}>
      {appMode === "FIELD" ? (
        <div className="w-full max-w-md h-screen md:h-[90vh] overflow-hidden shadow-2xl">
          <FieldModeUI />
        </div>
      ) : (
        <div className="glass-panel w-full max-w-md h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative border border-white/10">
          {/* Assistant Header */}
          <div className="bg-white/5 backdrop-blur-xl text-white p-6 flex items-center justify-between border-b border-white/5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐺</span>
                <span className="font-black text-xl tracking-tight uppercase">Wolf</span>
              </div>
              <span className="text-[0.6rem] text-white/40 font-bold tracking-widest">DYNAMIC ASSESSOR V3.0</span>
            </div>
            <button onClick={() => setAppMode("FIELD")} className="bg-orange-600 px-4 py-2 rounded-full text-xs font-bold animate-pulse shadow-lg shadow-orange-900/50">FIELD MODE</button>
          </div>

          {/* Assistant Chat Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} animate-fade-in`}>
                <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-[0.95rem] ${
                  msg.role === "avatar" ? "bg-white/10 text-white" : "bg-orange-600 text-white font-medium"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Assistant Input/Action Area */}
          <div className="p-6 bg-black/40 backdrop-blur-2xl border-t border-white/10 max-h-[45vh] overflow-y-auto no-scrollbar">
             {currentState === "PICK_CATEGORY" && (
               <div className="space-y-3">
                 <div className="flex gap-2 mb-2">
                   <input 
                    type="text" 
                    id="search-input"
                    placeholder="Ask me anything about the Bluebook..." 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch((e.target as HTMLInputElement).value)}
                  />
                  <button onClick={() => {
                    const input = document.getElementById('search-input') as HTMLInputElement;
                    handleSearch(input.value);
                  }} className="bg-orange-600 px-4 rounded-xl">🔍</button>
                 </div>
                 <div className="grid grid-cols-1 gap-2">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => handleCategorySelect(cat)} className="glass-card w-full p-4 rounded-xl text-left hover:bg-white/10 transition-all">{cat}</button>
                  ))}
                </div>
               </div>
             )}
             {currentState === "PICK_MODULE" && (
               <div className="space-y-2">
                 {modulesList.filter(m => selectedCategory === "SEARCH" || m.category === selectedCategory).map(mod => (
                   <button key={mod.id} onClick={() => handleModuleSelect(mod)} className="glass-card w-full p-4 rounded-xl text-left">{mod.module_name}</button>
                 ))}
                 <button onClick={handleReset} className="w-full p-4 text-white/40">Cancel</button>
               </div>
             )}
             {/* ... Other States Simplified for Proto ... */}
             {currentState === "PICK_SYMPTOM" && selectedModule && (
               <div className="space-y-2">
                 {selectedModule.scenarios.map(s => (
                   <button key={s.id} onClick={() => handleSymptomSelect(s)} className="glass-card w-full p-4 rounded-xl text-left">{s.symptom[0]}</button>
                 ))}
               </div>
             )}
             {currentState === "PICK_BRANCH" && (
               <div className="space-y-4">
                 <div className="bg-orange-600/20 p-4 rounded-xl border border-orange-600/50">
                   <p className="text-orange-400 font-bold uppercase text-xs mb-2">Technical Specs</p>
                   <p className="text-white text-lg">{selectedScenario?.technical_specs}</p>
                   {renderDiagram()}
                 </div>
                 <button onClick={handleReset} className="w-full bg-white text-black p-4 rounded-xl font-bold">DISMISS</button>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
