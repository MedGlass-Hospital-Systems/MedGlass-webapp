"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { RulesList } from "@/components/rules/RulesList";
import { AddRuleForm } from "@/components/rules/RulesModal";

export function StepRules() {
  const [adding, setAdding] = useState(false);
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h2 className="text-headline-md font-headline-md mb-2">Règles métier</h2>
          <p className="text-on-surface-variant">Les règles actives seront respectées lors de la génération.</p>
        </div>
        <Button variant="secondary" size="sm" icon={adding ? "close" : "add"} onClick={() => setAdding((a) => !a)}>
          {adding ? "Fermer" : "Nouvelle règle"}
        </Button>
      </div>
      {adding && (
        <div className="mb-4">
          <AddRuleForm onAdded={() => setAdding(false)} />
        </div>
      )}
      <RulesList />
    </div>
  );
}
