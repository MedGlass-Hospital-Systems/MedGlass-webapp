"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./Icon";
import { NavLinks } from "./NavLinks";
import { HOSPITAL } from "@/lib/store/seed";
import { useCurrentUser, usePermissions, useServiceName } from "@/lib/store/hooks";

function SidebarHeader({ onNavigate }: { onNavigate?: () => void }) {
  const user = useCurrentUser();
  const serviceName = useServiceName(user.service);
  const { isManager } = usePermissions();
  return (
    <div className="px-6 pb-6 mb-6 border-b border-white/10">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-primary leading-tight">{HOSPITAL.name}</h2>
        <p className="text-body-sm text-on-surface-variant">{serviceName}</p>
      </div>
      {isManager ? (
        <Link
          href="/wizard?nouveau=1"
          onClick={onNavigate}
          className="w-full py-2 px-4 rounded-lg bg-primary text-on-primary font-label-caps text-label-caps flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
        >
          <Icon name="add" className="text-[18px]" />
          Nouveau planning
        </Link>
      ) : (
        <Link
          href="/souhaits"
          onClick={onNavigate}
          className="w-full py-2 px-4 rounded-lg bg-primary/15 text-primary font-label-caps text-label-caps flex items-center justify-center gap-2 hover:bg-primary/25 transition-colors"
        >
          <Icon name="favorite" className="text-[18px]" />
          Saisir mes souhaits
        </Link>
      )}
    </div>
  );
}

export function Sidebar() {
  return (
    <nav className="h-screen w-64 left-0 top-0 fixed flex-col pt-20 pb-4 glass-strong border-r border-white/10 shadow-md z-40 hidden md:flex">
      <SidebarHeader />
      <NavLinks />
    </nav>
  );
}

/** Version tiroir de la sidebar pour mobile, ouverte depuis le bouton menu de la TopNav. */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[45] bg-black/50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="h-full w-72 flex flex-col pt-20 pb-4 glass-strong border-r border-white/10"
          >
            <SidebarHeader onNavigate={onClose} />
            <NavLinks onNavigate={onClose} />
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
