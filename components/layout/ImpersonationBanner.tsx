"use client";

import { Icon } from "./Icon";
import { Button } from "@/components/ui/Button";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName, useCurrentUser } from "@/lib/store/hooks";
import { APP_ROLE_LABELS } from "@/lib/utils/labels";

export function ImpersonationBanner() {
  const impersonating = useDemoStore((s) => s.impersonatingId);
  const impersonate = useDemoStore((s) => s.impersonate);
  const user = useCurrentUser();
  if (!impersonating) return null;
  return (
    <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
      <Icon name="supervised_user_circle" className="text-warning text-[24px]" filled />
      <p className="flex-1 text-body-sm text-on-surface">
        Vous voyez l&apos;application en tant que <strong>{fullName(user, true)}</strong> · {user.roleLabel} (
        {APP_ROLE_LABELS[user.appRole]}).
      </p>
      <Button size="sm" variant="secondary" icon="undo" onClick={() => impersonate(null)}>
        Revenir à mon compte
      </Button>
    </div>
  );
}
