"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import { RulesList } from "./RulesList";
import { useDemoStore } from "@/lib/store/demoStore";
import { toast } from "@/lib/store/toastStore";
import { RULE_CATEGORY_LABELS } from "@/lib/utils/labels";
import type { RuleCategory } from "@/lib/types/planning";

/** Formulaire compact d'ajout de règle, réutilisé dans la modale et l'assistant. */
export function AddRuleForm({ onAdded }: { onAdded?: () => void }) {
  const addRule = useDemoStore((s) => s.addRule);
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState<RuleCategory>("interne");
  const [description, setDescription] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    addRule({ label: label.trim(), category, description: description.trim() || undefined, enabled: true });
    toast("Règle ajoutée et activée");
    setLabel("");
    setDescription("");
    onAdded?.();
  };

  return (
    <form onSubmit={submit} className="p-4 rounded-lg border border-primary/20 bg-primary/[0.04] grid grid-cols-1 md:grid-cols-[1fr_180px] gap-3">
      <Field label="Nouvelle règle">
        <Input required value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex. Pas plus de 2 nuits consécutives" />
      </Field>
      <Field label="Catégorie">
        <Select value={category} onChange={(e) => setCategory(e.target.value as RuleCategory)}>
          {(Object.keys(RULE_CATEGORY_LABELS) as RuleCategory[]).map((c) => (
            <option key={c} value={c}>
              {RULE_CATEGORY_LABELS[c]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Précision (optionnel)" className="md:col-span-2">
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" size="sm" icon="add">
          Ajouter la règle
        </Button>
      </div>
    </form>
  );
}

export function RulesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      icon="rule"
      title="Règles de planification"
      description="Les règles actives sont appliquées par l'assistant à chaque génération de planning."
      footer={<Button onClick={onClose}>Terminé</Button>}
    >
      <div className="space-y-5">
        <AddRuleForm />
        <RulesList editable />
      </div>
    </Modal>
  );
}
