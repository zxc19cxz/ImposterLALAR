"use client";

type StepperFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  helperText?: string;
};

export function StepperField({
  label,
  value,
  min,
  max,
  onChange,
  helperText,
}: StepperFieldProps) {
  const decDisabled = value <= min;
  const incDisabled = value >= max;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-900">
          {label}
        </div>
        <div className="text-[13px] text-zinc-500">
          Min {min} · Max {max}
        </div>
      </div>
      <div className="flex items-center gap-3 bg-white rounded-[18px] ring-1 ring-zinc-200 px-3 py-2">
        <button
          type="button"
          onClick={() => !decDisabled && onChange(value - 1)}
          disabled={decDisabled}
          className="h-10 w-10 rounded-full bg-zinc-100 text-zinc-900 text-[20px] font-semibold disabled:text-zinc-300 disabled:bg-zinc-50"
          aria-label="Decrease"
        >
          –
        </button>
        <div className="flex-1 text-center text-[24px] font-semibold tracking-[-0.02em] text-zinc-950">
          {value}
        </div>
        <button
          type="button"
          onClick={() => !incDisabled && onChange(value + 1)}
          disabled={incDisabled}
          className="h-10 w-10 rounded-full bg-zinc-900 text-white text-[20px] font-semibold disabled:bg-zinc-200 disabled:text-zinc-400"
          aria-label="Increase"
        >
          +
        </button>
      </div>
      {helperText ? (
        <div className="mt-2 text-[12px] text-zinc-500">{helperText}</div>
      ) : null}
    </div>
  );
}

