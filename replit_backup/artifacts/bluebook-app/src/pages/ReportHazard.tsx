import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateHazard } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NativeSelect } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RiskMatrix } from '@/components/RiskMatrix';
import { useToast } from '@/hooks/use-toast';
import { ShieldAlert, Loader2 } from 'lucide-react';

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Provide a detailed description"),
  hazardType: z.enum([
    "physical", "chemical", "biological", "ergonomic", 
    "psychosocial", "electrical", "fire", "environmental"
  ]),
  likelihood: z.number().min(1).max(5),
  consequence: z.number().min(1).max(5),
  location: z.string().min(3, "Location is required"),
  reportedBy: z.string().min(2, "Name is required"),
});

type FormValues = z.infer<typeof schema>;

export default function ReportHazard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateHazard();

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      hazardType: "physical",
      likelihood: 3,
      consequence: 3
    }
  });

  const onSubmit = (data: FormValues) => {
    mutate({ data: { ...data, siteId: 1 } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/hazards'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
        toast({
          title: "Hazard Reported",
          description: "Risk assessment saved successfully.",
        });
        setLocation('/hazards');
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to submit.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="bg-safety-amber text-black p-6 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 flex items-center gap-4">
        <ShieldAlert className="w-12 h-12 shrink-0" />
        <div>
          <h1 className="text-3xl font-display tracking-wide uppercase">Report a Hazard</h1>
          <p className="font-sans font-bold">Identify a potential risk before it causes harm.</p>
        </div>
      </div>

      <Card className="border-4 shadow-hard">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Section 1: Details */}
            <div className="space-y-6">
              <h3 className="font-display text-2xl border-b-2 border-foreground pb-2">1. Hazard Details</h3>
              <div className="space-y-2">
                <Label htmlFor="title">Short Title</Label>
                <Input id="title" placeholder="e.g. Unsecured edge on Level 3" {...register("title")} />
                {errors.title && <p className="text-destructive font-sans text-sm font-bold">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hazardType">Hazard Type</Label>
                <NativeSelect id="hazardType" {...register("hazardType")}>
                  <option value="physical">Physical (falls, trips, machinery)</option>
                  <option value="electrical">Electrical</option>
                  <option value="chemical">Chemical (fumes, spills)</option>
                  <option value="ergonomic">Ergonomic (lifting, repetitive)</option>
                  <option value="fire">Fire / Explosion</option>
                  <option value="environmental">Environmental (noise, weather)</option>
                  <option value="biological">Biological</option>
                  <option value="psychosocial">Psychosocial (stress, fatigue)</option>
                </NativeSelect>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea id="description" placeholder="Describe the hazard in detail..." {...register("description")} />
              </div>
            </div>

            {/* Section 2: Risk Assessment */}
            <div className="space-y-6 bg-muted/20 p-6 border-2 border-foreground">
              <h3 className="font-display text-2xl border-b-2 border-foreground pb-2">2. Risk Assessment</h3>
              <Controller
                name="likelihood"
                control={control}
                render={({ field: { value: lVal } }) => (
                  <Controller
                    name="consequence"
                    control={control}
                    render={({ field: { value: cVal } }) => (
                      <RiskMatrix 
                        likelihood={lVal} 
                        consequence={cVal} 
                        onChange={(l, c) => {
                          setValue('likelihood', l);
                          setValue('consequence', c);
                        }} 
                      />
                    )}
                  />
                )}
              />
            </div>

            {/* Section 3: Location & Reporter */}
            <div className="space-y-6">
              <h3 className="font-display text-2xl border-b-2 border-foreground pb-2">3. Location & Reporting</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Exact Location</Label>
                  <Input id="location" placeholder="e.g. Plant Room B" {...register("location")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportedBy">Reported By</Label>
                  <Input id="reportedBy" placeholder="Your Name" {...register("reportedBy")} />
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" className="w-full" onClick={() => setLocation(-1)}>Cancel</Button>
              <Button type="submit" className="w-full text-xl bg-safety-amber text-black hover:bg-safety-amber/80" disabled={isPending}>
                {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Log Hazard"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
