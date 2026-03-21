"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface NavLinkItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  ativo: boolean;
}

export function NavLinkItem({ href, label, icon: Icon, ativo }: NavLinkItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        ativo
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon size={17} />
      {label}
    </Link>
  );
}
