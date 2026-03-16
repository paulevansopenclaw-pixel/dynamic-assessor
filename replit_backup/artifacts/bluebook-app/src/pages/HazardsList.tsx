import React, { useState } from 'react';
import { useListHazards } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Search, Plus, Filter } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { ListHazardsStatus } from '@workspace/api-client-react/src/generated/api.schemas';

export default function HazardsList() {
  const [statusFilter, setStatusFilter] = useState<ListHazardsStatus | ''>('');
  const [search, setSearch] = useState('');
  
  const { data: hazards, isLoading } = useListHazards({ 
    siteId: 1, 
    status: statusFilter !== '' ? statusFilter as ListHazardsStatus : undefined 
  });

  const filteredHazards = hazards?.filter(h => h.title.toLowerCase().includes(search.toLowerCase()) || h.reportedBy.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-foreground pb-4">
        <div>
          <h1 className="text-4xl font-display tracking-wide uppercase">Hazard Register</h1>
          <p className="text-muted-foreground font-sans font-medium">Identify, assess, and control risks</p>
        </div>
        <Link href="/hazards/new">
          <Button className="w-full md:w-auto bg-safety-amber text-black hover:bg-safety-amber/90"><Plus className="w-5 h-5 mr-2" /> Report Hazard</Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted/50 border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search hazards..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 md:w-1/3">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <NativeSelect 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="actioned">Actioned</option>
            <option value="closed">Closed</option>
          </NativeSelect>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-muted border-2 border-foreground animate-pulse"></div>)}
        </div>
      ) : filteredHazards?.length === 0 ? (
        <div className="p-12 text-center border-4 border-dashed border-muted-foreground/30 bg-muted/10">
          <h3 className="font-display text-2xl text-muted-foreground uppercase">No Hazards Found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHazards?.map(haz => (
            <Link key={haz.id} href={`/hazards/${haz.id}`}>
              <Card className="hover:-translate-y-1 transition-transform cursor-pointer border-l-8" style={{ borderLeftColor: haz.riskLevel === 'extreme' ? 'var(--color-safety-red)' : haz.riskLevel === 'high' ? 'var(--color-safety-orange)' : haz.riskLevel === 'medium' ? 'var(--color-safety-amber)' : 'var(--color-safety-green)' }}>
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2 md:mb-0">
                      <Badge variant="outline" className="bg-white">{haz.status}</Badge>
                      <span className="text-sm font-sans font-bold text-muted-foreground">{formatDate(haz.createdAt)}</span>
                    </div>
                    <h3 className="font-display text-2xl uppercase leading-none">{haz.title}</h3>
                    <p className="font-sans text-sm text-secondary truncate max-w-2xl">{haz.location}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden md:block">
                      <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">Rating</p>
                      <p className="font-display text-xl">{haz.riskRating}</p>
                    </div>
                    <Badge className="px-4 py-2 text-sm" variant={haz.riskLevel === 'extreme' ? 'destructive' : haz.riskLevel === 'high' ? 'warning' : haz.riskLevel === 'medium' ? 'default' : 'success'}>
                      {haz.riskLevel} Risk
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
