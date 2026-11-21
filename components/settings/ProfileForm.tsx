"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Form";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName, useCurrentUser, useServiceName } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { APP_ROLE_LABELS, CONTRACT_LABELS } from "@/lib/utils/labels";
import { initialsOf } from "@/lib/utils/id";

export function ProfileForm() {
  const user = useCurrentUser();
  const serviceName = useServiceName(user.service);
  const update = useDemoStore((s) => s.updateStaff);
  const pick = () => ({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, roleLabel: user.roleLabel });
  const [form, setForm] = useState(pick);
  useEffect(() => {
    setForm(pick());
  }, [user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const dirty = JSON.stringify(form) !== JSON.stringify(pick());
  const submit = (e: FormEvent) => {
    e.preventDefault();
    update(user.id, { ...form, initials: initialsOf(form.firstName, form.lastName) });
    toast("Profil mis à jour");
  };

  return (
    <form onSubmit={submit}>
      <div className="flex flex-wrap items-center gap-6 mb-8">
        <Avatar initials={initialsOf(form.firstName, form.lastName)} size="lg" />
        <div>
          <p className="font-semibold text-lg">{fullName({ ...user, ...form }, true)}</p>
          <p className="text-on-surface-variant text-body-sm">
            {form.roleLabel} · {serviceName}
          </p>
          <div className="flex gap-2 mt-2">
            <Badge tone="primary">{APP_ROLE_LABELS[user.appRole]}</Badge>
            <Badge tone="neutral">{CONTRACT_LABELS[user.contract]}</Badge>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Prénom">
          <Input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        </Field>
        <Field label="Nom">
          <Input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        </Field>
        <Field label="Adresse e-mail">
          <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Téléphone">
          <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>
        <Field label="Fonction affichée" className="md:col-span-2">
          <Input value={form.roleLabel} onChange={(e) => setForm({ ...form, roleLabel: e.target.value })} />
        </Field>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="ghost" disabled={!dirty} onClick={() => setForm(pick())}>
          Annuler
        </Button>
        <Button type="submit" icon="save" disabled={!dirty}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
