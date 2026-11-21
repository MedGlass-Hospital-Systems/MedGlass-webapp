"use client";

import { create } from "zustand";
import type { Tone } from "@/lib/utils/labels";

export interface Toast {
  id: number;
  message: string;
  tone: Tone;
}

interface ToastState {
  toasts: Toast[];
  push: (message: string, tone?: Tone) => void;
  dismiss: (id: number) => void;
}

let counter = 0;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (message, tone = "success") => {
    const id = ++counter;
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
    setTimeout(() => get().dismiss(id), 3500);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Raccourci : toast("Congé envoyé") */
export const toast = (message: string, tone?: Tone) => useToastStore.getState().push(message, tone);
