"use client";

import { useState, useRef, useEffect } from "react";
import SitePlanOverlay from "./components/SitePlanOverlay";
import TechnicalDiagram from "./components/TechnicalDiagram";

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

type AppState = "PICK_CATEGORY" | "PICK_MODULE" | "PICK_SYMPTOM" | "PICK_BRANCH" | "RESOLUTION";

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
      id: "static_06",
      module_name: "Site_Planning_and_Disturbance",
      category: "Planning",
      compliance_anchor: "Landcom Blue Book Vol 1, 4th Edition - Section 4.2",
      scenarios: [
        {
          id: "pl_001",
          symptom: ["large area disturbance", "excessive clearing"],
          diagnostic_question: "Is the disturbed area exceeding 0.5 hectares at any one time?",
          technical_specs: "Limit disturbance to 0.5ha or what can be stabilized in 1-2 days.",
          branches: {
            "large_area": "Violation of Section 4.2. Staged clearing is mandatory to minimize exposure.",
            "staged_clearing": "Maintain stabilization within the 0.5ha limit per stage."
          }
        }
      ]
    },
    {
      id: "static_07",
      module_name: "Site_Stabilization_Compliance",
      category: "Compliance",
      compliance_anchor: "Landcom Blue Book Vol 1, 4th Edition - Section 7",
      scenarios: [
        {
          id: "cp_001",
          symptom: ["bare soil on slopes", "dust complaints"],
          diagnostic_question: "How long has the slope been left bare?",
          technical_specs: "Slopes > 2:1 must be stabilized within 10 days of completion.",
          branches: {
            "slope_bare_long": "Critical failure. Temporary stabilization (mulch or spray) required immediately.",
            "slope_active": "Ensure permanent stabilization plan is ready for completion date."
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
  const [searchQuery, setSearchQuery] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (role: "avatar" | "user" | "specs", text: string) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), role, text }]);
  };

  const categories = ["Planning", "Erosion Control", "Sediment Control", "Maintenance", "Compliance"];

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

  const handleBranchSelect = (branchKey: string, branchAnswer: string) => {
    addMessage("user", branchKey.replace(/_/g, " "));
    
    setTimeout(() => {
      const compliance = selectedModule ? ` (Ref: ${selectedModule.compliance_anchor})` : "";
      addMessage("avatar", `${branchAnswer}${compliance}`);
      
      if (selectedScenario?.technical_specs) {
        addMessage("specs", `TECHNICAL REQUIREMENT: ${selectedScenario.technical_specs}`);
      }
      setCurrentState("RESOLUTION");
    }, 600);
  };

  const renderDiagram = () => {
    if (selectedModule?.id === "static_02") return <TechnicalDiagram type="sediment-fence" />;
    if (selectedModule?.id === "static_05") return <TechnicalDiagram type="inlet-protection" />;
    if (selectedModule?.id === "static_06") return <TechnicalDiagram type="disturbed-area" />;
    return null;
  };

  const handleReset = () => {
    setImageUrl(null);
    setVisionAnalysis(null);
    setCurrentState("PICK_CATEGORY");
    setSelectedCategory(null);
    setSelectedModule(null);
    setSelectedScenario(null);
    setMessages([{ 
      id: Date.now(), 
      role: "avatar", 
      text: "Issue resolved. Back to the main menu. What else are we looking at?" 
    }]);
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
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleVisionUpload} className="hidden" id="vision-upload" />
                <label htmlFor="vision-upload" className="flex items-center justify-center p-3 bg-blue-600 rounded-2xl cursor-pointer hover:bg-blue-500 transition-all shadow-lg active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {categories.map((cat, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleCategorySelect(cat)} 
                  className="w-full glass-card hover:bg-white/10 text-white text-left px-5 py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] font-medium text-[1.05rem] border border-white/10"
                >
                  {cat}
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
              m.scenarios.some(s => s.symptom.some(sym => sym.toLowerCase().includes(searchQuery.toLowerCase())))
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

      case "RESOLUTION":
        return (
          <div className="flex flex-col items-center gap-6 py-2">
            <button onClick={handleReset} className="w-full bg-white text-black hover:bg-gray-200 px-5 py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] font-bold text-[1.05rem]">
              ✅ Issue Resolved - Back to Home
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
          {currentState === "PICK_CATEGORY" && (
            <div className="mb-4">
              <SitePlanOverlay />
            </div>
          )}
          {renderDiagram()}
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
