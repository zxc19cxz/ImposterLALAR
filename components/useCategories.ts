"use client";

import { useEffect, useMemo, useState } from "react";
import baseData from "@/data/data.json";
import type { Category } from "@/types/gameEngine";

const STORAGE_KEY = "imposter:customCategories";

type CustomCategory = Category & { custom?: boolean };

function readCustom(): CustomCategory[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CustomCategory[];
    return parsed.map((c) => ({ ...c, custom: true }));
  } catch {
    return [];
  }
}

export function useCategories() {
  const [custom, setCustom] = useState<CustomCategory[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const next = readCustom();
    setCustom(next);
    setLoaded(true);
  }, []);

  const categories: Category[] = useMemo(
    () => [...baseData.categories, ...custom],
    [custom],
  );

  const saveCustom = (next: CustomCategory[]) => {
    setCustom(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(next.map((c) => ({ ...c, custom: true }))),
      );
    }
  };

  const resetCustom = () => saveCustom([]);

  return { categories, custom, saveCustom, resetCustom, loaded };
}

