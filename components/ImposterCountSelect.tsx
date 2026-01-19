"use client";

import { StepperField } from "./StepperField";

export function ImposterCountSelect({
  players,
  value,
  onChange,
  min = 1,
  max = 3,
}: {
  players: number;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  const hardMax = Math.max(min, Math.min(max, players - 1));

  return (
    <StepperField
      label="Imposters"
      value={value}
      min={min}
      max={hardMax}
      onChange={onChange}
      helperText=""
    />
  );
}

