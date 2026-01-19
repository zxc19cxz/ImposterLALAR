"use client";

import { StepperField } from "./StepperField";

export function PlayerCountSelect({
  value,
  onChange,
  min = 3,
  max = 12,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <StepperField
      label="Players"
      value={value}
      min={min}
      max={max}
      onChange={onChange}
      helperText=""
    />
  );
}

