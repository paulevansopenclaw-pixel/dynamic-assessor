import React, { useState } from 'react';
import { useListNearMisses } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Search, Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function NearMissesList() {
  const [search, setSearch] = useState('');
  
  const { data: nearMisses, isLoading } = useListNearMisses({ siteId: 1 });

  const filtered = nearMisses?.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.reportedBy.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-foreground pb-4">
        <div>
          <h1 className="text-4xl font-display tracking-wide uppercase">Near Misses</h1>
          <p className="text-muted-foreground font-sans font-medium">Close calls and learning opportunities</p>
        </div>
        <Link href="/near-misses/new">
          <Button className="w-full md:w-auto"><Plus className="w-5 h-5 mr-2" /> Report Near Miss</Button>
        </Link>
      </div>

      <div className="flex gap-4 p-4 bg-muted/50 border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search near misses..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-muted border-2 border-foreground animate-pulse"></div>)}
        </div>
      ) : filtered?.length === 0 ? (
        <div className="p-12 text-center border-4 border-dashed border-muted-foreground/30 bg-muted/10">
          <h3 className="font-display text-2xl text-muted-foreground uppercase">No Near Misses Found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered?.map(nm => (
            <Card key={nm.id} className="border-l-8 border-l-primary">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-sans font-bold text-muted-foreground">{formatDate(nm.createdAt)}</span>
                  <h3 className="font-display text-2xl uppercase leading-none">{nm.title}</h3>
                  <p className="font-sans text-sm text-secondary truncate max-w-2xl"><span className="font-bold">Location:</span> {nm.location}</p>
                </div>
                
                <div className="bg-muted p-3 border-2 border-foreground w-full md:w-1/3">
                  <p className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-1">Potential Consequence</p>
                  <p className="font-sans font-medium text-sm line-clamp-2">{nm.potentialConsequence}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
