"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { useCategories } from "@/components/useCategories";
import type { Category } from "@/types/gameEngine";
import { Check } from "lucide-react";

const SELECTED_KEY = "imposter:selectedCategories";

type Draft = {
  name: string;
  words: string;
};

function readSelected(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(SELECTED_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default function CategoriesPage() {
  const router = useRouter();
  const { categories, custom, saveCustom, resetCustom, loaded } = useCategories();
  const [selected, setSelected] = useState<string[]>([]);

  const [draft, setDraft] = useState<Draft>({ name: "", words: "" });
  const [error, setError] = useState<string | null>(null);

  const baseCategories = useMemo(
    () => categories.filter((c) => !("custom" in c)),
    [categories],
  );

  useEffect(() => {
    const persisted = readSelected();
    if (persisted.length) setSelected(persisted);
    else if (categories.length) setSelected([categories[0].name]);
  }, [categories]);

  const saveSelection = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(SELECTED_KEY, JSON.stringify(selected));
    }
    router.push("/");
  };

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name],
    );
  };

  const handleSave = () => {
    const trimmedName = draft.name.trim();
    const wordList = draft.words
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);

    if (!trimmedName) {
      setError("Category needs a name.");
      return;
    }
    if (wordList.length < 2) {
      setError("Add at least two words.");
      return;
    }
    if (
      [...baseCategories, ...custom].some(
        (c) => c.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      setError("Name already exists.");
      return;
    }

    const next = [
      ...custom,
      { name: trimmedName, words: wordList, custom: true } as Category & {
        custom?: boolean;
      },
    ];
    saveCustom(next);
    setDraft({ name: "", words: "" });
    setError(null);
  };

  const handleDelete = (name: string) => {
    saveCustom(custom.filter((c) => c.name !== name));
    setSelected((prev) => prev.filter((x) => x !== name));
  };

  return (
    <div className="min-h-screen bg-[rgb(242,242,247)]">
      <main className="max-w-md mx-auto px-4 py-8 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <div className="text-[13px] text-zinc-600">Categories</div>
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-zinc-950">
              Select & manage
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              fullWidth={false}
              className="h-10 rounded-xl px-4"
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
            <Button
              fullWidth={false}
              className="h-10 rounded-xl px-4"
              onClick={saveSelection}
              disabled={selected.length === 0}
            >
              Save
            </Button>
          </div>
        </header>

        <section className="bg-white rounded-[20px] shadow-[0_10px_24px_rgba(0,0,0,0.07)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-semibold text-zinc-900">Selected</div>
            <div className="text-[13px] text-zinc-500">{selected.length} selected</div>
          </div>
          <div className="text-[12px] text-zinc-500">
            Choose one or more categories. The word will come from a random selected category.
          </div>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((c) => {
              const checked = selected.includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => toggle(c.name)}
                  className={[
                    "aspect-square rounded-2xl p-4 flex flex-col items-center justify-center text-center",
                    "border-2 transition-colors",
                    checked 
                      ? "bg-zinc-900 border-zinc-900 text-white" 
                      : "bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50"
                  ].join(" ")}
                >
                  <div className="text-[15px] font-semibold">{c.name}</div>
                  <div className="mt-1">
                    {checked ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <div className="w-5 h-5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

