"use client";

import * as React from "react";

type Option = { value: string; label: string; disabled?: boolean };

export function SelectField({
  label,
  value,
  onChange,
  options,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  helperText?: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[13px] font-semibold tracking-[-0.01em] text-zinc-900">
        {label}
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-2xl bg-white px-4 pr-10 text-[15px] text-zinc-900 ring-1 ring-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500">
          <span className="text-[12px]">⌄</span>
        </div>
      </div>
      {helperText ? (
        <div className="mt-2 text-[12px] text-zinc-500">{helperText}</div>
      ) : null}
    </label>
  );
}

