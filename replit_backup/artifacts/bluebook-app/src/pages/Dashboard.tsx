import React from 'react';
import { useGetDashboard } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ShieldAlert, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const { data, isLoading, isError } = useGetDashboard({ siteId: 1 }); // Hardcoded site 1 for demo

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-12 bg-muted w-1/3 border-2 border-foreground"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted border-2 border-foreground"></div>)}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8 border-4 border-destructive bg-destructive/10 text-center">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="font-display text-2xl uppercase text-destructive">Error Loading Dashboard</h2>
        <p className="font-sans font-medium">Could not connect to worksite database.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-foreground pb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display tracking-wide uppercase text-foreground">Worksite Status</h1>
          <p className="text-muted-foreground font-sans font-medium text-lg">Site ID: #1 • Live Overview</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-primary text-black border-4 shadow-hard hover:-translate-y-1 transition-transform">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full space-y-2">
            <AlertTriangle className="w-8 h-8 opacity-80" />
            <span className="text-5xl font-display tracking-wider">{data.openIncidents}</span>
            <span className="font-display text-sm uppercase tracking-widest opacity-80">Open Incidents</span>
          </CardContent>
        </Card>
        
        <Card className={data.extremeRiskHazards > 0 ? "bg-safety-red text-white border-4 shadow-hard hover:-translate-y-1 transition-transform" : "bg-card border-4 shadow-hard hover:-translate-y-1 transition-transform"}>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full space-y-2">
            <ShieldAlert className="w-8 h-8 opacity-80" />
            <span className="text-5xl font-display tracking-wider">{data.extremeRiskHazards}</span>
            <span className="font-display text-sm uppercase tracking-widest opacity-80">Extreme Hazards</span>
          </CardContent>
        </Card>

        <Card className="bg-card border-4 shadow-hard hover:-translate-y-1 transition-transform">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full space-y-2">
            <ShieldAlert className="w-8 h-8 text-safety-amber" />
            <span className="text-5xl font-display tracking-wider">{data.openHazards}</span>
            <span className="font-display text-sm uppercase tracking-widest text-muted-foreground">Open Hazards</span>
          </CardContent>
        </Card>

        <Card className="bg-card border-4 shadow-hard hover:-translate-y-1 transition-transform">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full space-y-2">
            <Activity className="w-8 h-8 text-secondary" />
            <span className="text-5xl font-display tracking-wider">{data.totalNearMisses}</span>
            <span className="font-display text-sm uppercase tracking-widest text-muted-foreground">Total Near Misses</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Incidents */}
        <Card className="border-4 shadow-hard">
          <CardHeader className="bg-foreground text-white flex flex-row justify-between items-center py-4">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-primary" />
              Recent Incidents
            </CardTitle>
            <Link href="/incidents" className="text-sm font-sans font-bold hover:text-primary flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentIncidents.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground font-sans font-medium">No recent incidents.</div>
            ) : (
              <div className="divide-y-2 divide-foreground">
                {data.recentIncidents.map(inc => (
                  <Link key={inc.id} href={`/incidents/${inc.id}`}>
                    <div className="p-4 hover:bg-muted/50 cursor-pointer transition-colors flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                      <div>
                        <h4 className="font-display text-xl uppercase truncate max-w-[250px]">{inc.title}</h4>
                        <p className="text-sm text-muted-foreground font-sans">{formatDate(inc.createdAt)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{inc.incidentType.replace('_', ' ')}</Badge>
                        <Badge variant={inc.severity === 'critical' ? 'destructive' : inc.severity === 'high' ? 'warning' : 'default'}>
                          {inc.severity}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Hazards */}
        <Card className="border-4 shadow-hard">
          <CardHeader className="bg-foreground text-white flex flex-row justify-between items-center py-4">
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-primary" />
              Recent Hazards
            </CardTitle>
            <Link href="/hazards" className="text-sm font-sans font-bold hover:text-primary flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentHazards.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground font-sans font-medium">No recent hazards.</div>
            ) : (
              <div className="divide-y-2 divide-foreground">
                {data.recentHazards.map(haz => (
                  <Link key={haz.id} href={`/hazards/${haz.id}`}>
                    <div className="p-4 hover:bg-muted/50 cursor-pointer transition-colors flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                      <div>
                        <h4 className="font-display text-xl uppercase truncate max-w-[250px]">{haz.title}</h4>
                        <p className="text-sm text-muted-foreground font-sans">{formatDate(haz.createdAt)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{haz.status}</Badge>
                        <Badge variant={haz.riskLevel === 'extreme' ? 'destructive' : haz.riskLevel === 'high' ? 'warning' : haz.riskLevel === 'medium' ? 'primary' : 'success'}>
                          {haz.riskLevel} - {haz.riskRating}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
