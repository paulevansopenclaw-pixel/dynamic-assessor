import React from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateIncident } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NativeSelect } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { CreateIncidentRequestIncidentType, CreateIncidentRequestSeverity } from '@workspace/api-client-react/src/generated/api.schemas';

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Provide a detailed description"),
  incidentType: z.enum([
    "injury", "near_miss", "property_damage", "environmental", 
    "medical_treatment", "lost_time", "fatality"
  ]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  location: z.string().min(3, "Location is required"),
  reportedBy: z.string().min(2, "Name is required"),
  dateOccurred: z.string().min(1, "Date is required"),
});

type FormValues = z.infer<typeof schema>;

export default function ReportIncident() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateIncident();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      incidentType: "injury",
      severity: "medium",
      dateOccurred: new Date().toISOString().slice(0, 16) // YYYY-MM-DDThh:mm
    }
  });

  const onSubmit = (data: FormValues) => {
    mutate({ data: { ...data, siteId: 1 } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/incidents'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
        toast({
          title: "Incident Reported",
          description: "The incident has been logged successfully.",
          variant: "default",
        });
        setLocation('/incidents');
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to submit report. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="bg-destructive text-white p-6 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 flex items-center gap-4">
        <AlertTriangle className="w-12 h-12 shrink-0" />
        <div>
          <h1 className="text-3xl font-display tracking-wide uppercase">Report an Incident</h1>
          <p className="font-sans font-medium">Log an event that has occurred resulting in injury or damage.</p>
        </div>
      </div>

      <Card className="border-4 shadow-hard">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="title">Short Title</Label>
              <Input id="title" placeholder="e.g. Slipped on wet concrete" {...register("title")} />
              {errors.title && <p className="text-destructive font-sans text-sm font-bold">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="incidentType">Incident Type</Label>
                <NativeSelect id="incidentType" {...register("incidentType")}>
                  <option value="injury">Injury</option>
                  <option value="property_damage">Property Damage</option>
                  <option value="environmental">Environmental</option>
                  <option value="medical_treatment">Medical Treatment</option>
                  <option value="lost_time">Lost Time</option>
                  <option value="fatality">Fatality</option>
                  <option value="near_miss">Near Miss</option>
                </NativeSelect>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <NativeSelect id="severity" {...register("severity")}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </NativeSelect>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea id="description" placeholder="Describe exactly what happened, who was involved, and any immediate actions taken..." {...register("description")} />
              {errors.description && <p className="text-destructive font-sans text-sm font-bold">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30 p-6 border-2 border-foreground">
              <div className="space-y-2">
                <Label htmlFor="location">Exact Location</Label>
                <Input id="location" placeholder="e.g. Level 2, Scaffold B" {...register("location")} />
                {errors.location && <p className="text-destructive font-sans text-sm font-bold">{errors.location.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOccurred">Date & Time</Label>
                <Input id="dateOccurred" type="datetime-local" {...register("dateOccurred")} />
                {errors.dateOccurred && <p className="text-destructive font-sans text-sm font-bold">{errors.dateOccurred.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="reportedBy">Reported By (Your Name)</Label>
                <Input id="reportedBy" placeholder="John Doe" {...register("reportedBy")} />
                {errors.reportedBy && <p className="text-destructive font-sans text-sm font-bold">{errors.reportedBy.message}</p>}
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" className="w-full" onClick={() => setLocation(-1)}>Cancel</Button>
              <Button type="submit" className="w-full text-xl" disabled={isPending}>
                {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Report"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
