import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useGetIncident, useUpdateIncident } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NativeSelect } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, ArrowLeft, Loader2, Save } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { UpdateIncidentRequestStatus } from '@workspace/api-client-react/src/generated/api.schemas';

export default function IncidentDetail() {
  const [, params] = useRoute('/incidents/:id');
  const id = parseInt(params?.id || '0', 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: incident, isLoading } = useGetIncident(id);
  const { mutate, isPending } = useUpdateIncident();

  const [status, setStatus] = useState<UpdateIncidentRequestStatus | ''>('');
  const [actions, setActions] = useState('');

  // Initialize state when data loads
  React.useEffect(() => {
    if (incident && !status) {
      setStatus(incident.status);
      setActions(incident.correctiveActions || '');
    }
  }, [incident]);

  if (isLoading) return <div className="p-8 text-center font-display text-2xl animate-pulse">Loading...</div>;
  if (!incident) return <div className="p-8 text-center text-destructive">Incident not found</div>;

  const handleUpdate = () => {
    if (!status) return;
    mutate({ id, data: { status, correctiveActions: actions } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/incidents'] });
        queryClient.invalidateQueries({ queryKey: [`/api/incidents/${id}`] });
        toast({ title: "Updated successfully" });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <Link href="/incidents" className="inline-flex items-center font-sans font-bold text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Register
      </Link>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end border-b-4 border-foreground pb-4">
        <div className="space-y-2 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-foreground text-white">INC-{incident.id.toString().padStart(4, '0')}</Badge>
            <Badge variant={incident.status === 'closed' ? 'secondary' : 'default'}>{incident.status.replace('_', ' ')}</Badge>
            <Badge variant={incident.severity === 'critical' ? 'destructive' : incident.severity === 'high' ? 'warning' : 'default'}>{incident.severity}</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-display tracking-wide uppercase leading-tight">{incident.title}</h1>
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
                <p className="font-sans text-lg mt-1 whitespace-pre-wrap">{incident.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 border-2 border-foreground">
                <div>
                  <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">Type</p>
                  <p className="font-sans font-bold capitalize">{incident.incidentType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">Date Occurred</p>
                  <p className="font-sans font-bold">{formatDate(incident.dateOccurred)}</p>
                </div>
                <div>
                  <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">Location</p>
                  <p className="font-sans font-bold">{incident.location}</p>
                </div>
                <div>
                  <p className="text-xs font-display uppercase tracking-widest text-muted-foreground">Reported By</p>
                  <p className="font-sans font-bold">{incident.reportedBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-primary/10">
            <CardHeader className="bg-primary text-black border-b-4 border-foreground">
              <CardTitle className="flex items-center gap-2">
                <Save className="w-5 h-5" /> Resolution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label className="text-xs font-display uppercase tracking-widest font-bold">Status</label>
                <NativeSelect value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  <option value="open">Open</option>
                  <option value="under_investigation">Under Investigation</option>
                  <option value="closed">Closed</option>
                </NativeSelect>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-display uppercase tracking-widest font-bold">Corrective Actions</label>
                <Textarea 
                  value={actions} 
                  onChange={(e) => setActions(e.target.value)} 
                  placeholder="What was done to fix this?"
                  className="bg-white"
                />
              </div>
              <Button onClick={handleUpdate} disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Status"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
