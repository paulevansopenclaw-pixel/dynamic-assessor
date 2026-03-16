import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Incident } from "@/data/incidents";

const STORAGE_KEY = "@bluebook_incidents";

interface IncidentsContextType {
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, "id" | "createdAt">) => Promise<void>;
  updateIncident: (id: string, updates: Partial<Incident>) => Promise<void>;
  isLoading: boolean;
}

const IncidentsContext = createContext<IncidentsContextType | null>(null);

export function IncidentsProvider({ children }: { children: React.ReactNode }) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setIncidents(JSON.parse(raw));
        } catch {
          setIncidents([]);
        }
      }
      setIsLoading(false);
    });
  }, []);

  const save = useCallback(async (data: Incident[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setIncidents(data);
  }, []);

  const addIncident = useCallback(async (incident: Omit<Incident, "id" | "createdAt">) => {
    const newIncident: Incident = {
      ...incident,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      createdAt: new Date().toISOString(),
    };
    await save([newIncident, ...incidents]);
  }, [incidents, save]);

  const updateIncident = useCallback(async (id: string, updates: Partial<Incident>) => {
    const updated = incidents.map((i) => i.id === id ? { ...i, ...updates } : i);
    await save(updated);
  }, [incidents, save]);

  return (
    <IncidentsContext.Provider value={{ incidents, addIncident, updateIncident, isLoading }}>
      {children}
    </IncidentsContext.Provider>
  );
}

export function useIncidents() {
  const ctx = useContext(IncidentsContext);
  if (!ctx) throw new Error("useIncidents must be used within IncidentsProvider");
  return ctx;
}
