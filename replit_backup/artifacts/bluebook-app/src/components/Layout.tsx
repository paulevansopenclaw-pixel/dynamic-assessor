import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Home, AlertTriangle, ShieldAlert, Activity, Plus, X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/incidents', label: 'Incidents', icon: AlertTriangle },
    { href: '/hazards', label: 'Hazards', icon: ShieldAlert },
    { href: '/near-misses', label: 'Near Misses', icon: Activity },
  ];

  const reportOptions = [
    { href: '/incidents/new', label: 'Report Incident', icon: AlertTriangle, color: 'bg-safety-red text-white' },
    { href: '/hazards/new', label: 'Report Hazard', icon: ShieldAlert, color: 'bg-safety-amber text-black' },
    { href: '/near-misses/new', label: 'Report Near Miss', icon: Activity, color: 'bg-primary text-black' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20 md:pb-0 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-foreground text-white border-b-4 border-primary px-4 h-16 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-8 h-8 filter invert" />
          <h1 className="font-display text-2xl tracking-widest pt-1">BLUEBOOK <span className="text-primary">WHS</span></h1>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn(
              "px-4 py-2 font-display text-lg tracking-wider transition-colors hover:text-primary uppercase flex items-center gap-2",
              location === item.href ? "text-primary border-b-2 border-primary" : "text-muted"
            )}>
              <item.icon className="w-5 h-5 mb-1" />
              {item.label}
            </Link>
          ))}
          <button 
            onClick={() => setIsReportMenuOpen(true)}
            className="ml-4 bg-primary text-black px-6 py-2 font-display text-lg tracking-widest uppercase hover:bg-primary/90 flex items-center gap-2 border-2 border-primary"
          >
            <Plus className="w-5 h-5 mb-1" />
            Report
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-foreground text-white overflow-hidden border-b-4 border-primary"
          >
            <div className="flex flex-col py-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={cn(
                  "px-6 py-4 font-display text-xl tracking-wider border-b border-white/10 uppercase flex items-center gap-4",
                  location === item.href ? "text-primary bg-white/5" : "text-muted hover:text-white"
                )}>
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-card border-t-2 border-foreground shadow-[0_-4px_0_0_rgba(0,0,0,1)] flex items-center justify-around px-2 z-40">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}>
              <item.icon className={cn("w-6 h-6", isActive && "fill-primary/20 text-primary stroke-[2.5px]")} />
              <span className="text-[10px] font-display uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile FAB */}
      <button 
        onClick={() => setIsReportMenuOpen(true)}
        className="md:hidden fixed bottom-6 right-1/2 translate-x-1/2 translate-y-1/2 w-16 h-16 bg-primary text-black border-4 border-foreground rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center z-50 hover:-translate-y-1 transition-transform"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Report Modal/Sheet */}
      <AnimatePresence>
        {isReportMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/80 backdrop-blur-sm z-50"
              onClick={() => setIsReportMenuOpen(false)}
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 20 }}
              className="fixed bottom-0 left-0 right-0 bg-background border-t-4 border-foreground p-6 z-50 rounded-t-3xl md:top-1/2 md:bottom-auto md:left-1/2 md:right-auto md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl md:border-4 md:w-full md:max-w-md md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-3xl">What are you reporting?</h2>
                <button onClick={() => setIsReportMenuOpen(false)} className="p-2 bg-muted border-2 border-foreground hover:bg-secondary hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                {reportOptions.map((opt) => (
                  <Link key={opt.href} href={opt.href} onClick={() => setIsReportMenuOpen(false)}>
                    <div className={cn("flex items-center gap-4 p-4 border-4 border-foreground cursor-pointer hover:-translate-y-1 hover:shadow-hard transition-all", opt.color)}>
                      <opt.icon className="w-8 h-8" />
                      <span className="font-display text-2xl uppercase tracking-widest">{opt.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
