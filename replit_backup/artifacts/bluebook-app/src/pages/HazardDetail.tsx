import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useGetIncident, useUpdateHazard, listHazards } from '@workspace/api-client-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NativeSelect } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ShieldAlert, ArrowLeft, Loader2, Save } from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import type { UpdateHazardRequestStatus } from '@workspace/api-client-react/src/generated/api.schemas';

export default function HazardDetail() {
  const [, params] = useRoute('/hazards/:id');
  const id = parseInt(params?.id || '0', 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Orval doesn't generate getHazard, we must filter from list since we only have listHazards
  const { data: hazards, isLoading } = useQuery({
    queryKey: ['/api/hazards'],
    queryFn: () => listHazards()
  });
  
  const hazard = hazards?.find(h => h.id === id);
  const { mutate, isPending } = useUpdateHazard();

  const [status, setStatus] = useState<UpdateHazardRequestStatus | ''>('');
  const [measures, setMeasures] = useState('');

  React.useEffect(() => {
    if (hazard && !status) {
      setStatus(hazard.status);
      setMeasures(hazard.controlMeasures || '');
    }
  }, [hazard]);

  if (isLoading) return <div className="p-8 text-center font-display text-2xl animate-pulse">Loading...</div>;
  if (!hazard) return <div className="p-8 text-center text-destructive">Hazard not found</div>;

  const handleUpdate = () => {
    if (!status) return;
    mutate({ id, data: { status, controlMeasures: measures } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/hazards'] });
        toast({ title: "Hazard updated successfully" });
      }
    });
  };

  const riskColor = hazard.riskLevel === 'extreme' ? 'bg-safety-red text-white' : 
                    hazard.riskLevel === 'high' ? 'bg-safety-orange text-white' : 
                    hazard.riskLevel === 'medium' ? 'bg-safety-amber text-black' : 
                    'bg-safety-green text-white';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <Link href="/hazards" className="inline-flex items-center font-sans font-bold text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Register
      </Link>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end border-b-4 border-foreground pb-4">
        <div className="space-y-2 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-foreground text-white">HAZ-{hazard.id.toString().padStart(4, '0')}</Badge>
            <Badge variant="outline" className="bg-white">{hazard.status}</Badge>
            <Badge variant={hazard.riskLevel === 'extreme' ? 'destructive' : hazard.riskLevel === 'high' ? 'warning' : 'default'}>{hazard.hazardType}</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-display tracking-wide uppercase leading-tight">{hazard.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-4 shadow-hard">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <p className="text-sm font-display uppercase tracking-widest text-muted-foreground">Description</p>
                <p className="font-sans text-lg mt-1 whitespace-pre-wrap">{hazard.description}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/20 p-4 border-2 border-foreground">
                  <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">Location</p>
                  <p className="font-sans font-bold">{hazard.location}</p>
                </div>
                <div className="bg-muted/20 p-4 border-2 border-foreground">
                  <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">Reported By</p>
                  <p className="font-sans font-bold">{hazard.reportedBy} <span className="text-muted-foreground font-normal text-sm block">{formatDate(hazard.createdAt)}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className={cn("border-b-4 border-foreground flex flex-row items-center justify-between", riskColor)}>
              <CardTitle className="text-inherit">Risk Level</CardTitle>
              <span className="font-display text-4xl">{hazard.riskRating}</span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex divide-x-2 divide-foreground border-b-2 border-foreground text-center">
                <div className="flex-1 p-3 bg-muted/20">
                  <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Likelihood</p>
                  <p className="font-display text-2xl">{hazard.likelihood}</p>
                </div>
                <div className="flex-1 p-3 bg-muted/20">
                  <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Consequence</p>
                  <p className="font-display text-2xl">{hazard.consequence}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-display uppercase tracking-widest font-bold">Status</label>
                  <NativeSelect value={status} onChange={(e) => setStatus(e.target.value as any)}>
                    <option value="open">Open</option>
                    <option value="actioned">Actioned / Controlled</option>
                    <option value="closed">Closed / Eliminated</option>
                  </NativeSelect>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-display uppercase tracking-widest font-bold">Control Measures</label>
                  <Textarea 
                    value={measures} 
                    onChange={(e) => setMeasures(e.target.value)} 
                    placeholder="Describe controls put in place..."
                  />
                </div>
                <Button onClick={handleUpdate} disabled={isPending} className="w-full">
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Controls"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
