import { FC } from "react";

export interface RequirementAnimation {
  title: string;
  spec: string;
  AnimationComponent: FC;
}

export type AnimationMap = Record<string, (RequirementAnimation | null)[]>;
