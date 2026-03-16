import React from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateNearMiss } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Activity, Loader2 } from 'lucide-react';

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Provide a detailed description"),
  potentialConsequence: z.string().min(5, "Required"),
  location: z.string().min(3, "Location is required"),
  reportedBy: z.string().min(2, "Name is required"),
  immediateActions: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ReportNearMiss() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateNearMiss();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    mutate({ data: { ...data, siteId: 1 } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/nearmisses'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
        toast({ title: "Near Miss Logged" });
        setLocation('/near-misses');
      },
      onError: () => toast({ title: "Error", variant: "destructive" })
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="bg-primary text-black p-6 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 flex items-center gap-4">
        <Activity className="w-12 h-12 shrink-0" />
        <div>
          <h1 className="text-3xl font-display tracking-wide uppercase">Report a Near Miss</h1>
          <p className="font-sans font-bold">Log an event that could have caused harm but didn't.</p>
        </div>
      </div>

      <Card className="border-4 shadow-hard">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="title">What almost happened?</Label>
              <Input id="title" placeholder="e.g. Dropped tool nearly hit worker" {...register("title")} />
              {errors.title && <p className="text-destructive text-sm font-bold">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea id="description" placeholder="Describe the circumstances..." {...register("description")} />
            </div>

            <div className="space-y-2 p-4 bg-muted/30 border-2 border-foreground border-dashed">
              <Label htmlFor="potentialConsequence">Potential Consequence</Label>
              <Textarea id="potentialConsequence" className="min-h-[80px]" placeholder="What could have happened if things went wrong? (e.g. Serious head injury)" {...register("potentialConsequence")} />
              {errors.potentialConsequence && <p className="text-destructive text-sm font-bold">{errors.potentialConsequence.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="immediateActions">Immediate Actions Taken (Optional)</Label>
              <Input id="immediateActions" placeholder="e.g. Stopped work, cleared area" {...register("immediateActions")} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportedBy">Reported By</Label>
                <Input id="reportedBy" {...register("reportedBy")} />
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" className="w-full" onClick={() => setLocation(-1)}>Cancel</Button>
              <Button type="submit" className="w-full text-xl" disabled={isPending}>
                {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
