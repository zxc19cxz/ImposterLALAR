"use client";

import { SelectField } from "./SelectField";
import type { Category } from "@/types/gameEngine";

export function CategorySelect({
  categories,
  value,
  onChange,
}: {
  categories: Category[];
  value: string;
  onChange: (name: string) => void;
}) {
  return (
    <SelectField
      label="Category"
      value={value}
      onChange={onChange}
      options={categories.map((c) => ({ value: c.name, label: c.name }))}
    />
  );
}

