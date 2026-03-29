"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  User,
} from "lucide-react";
import type { Usuario } from "@/types/usuario";
import { NavLinkItem } from "@/components/molecules/NavLinkItem";

const links = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/demandas", icon: ClipboardList, label: "Demandas" },
  { href: "/dashboard/funcionarios", icon: Users, label: "Funcionários" },
  { href: "/dashboard/perfil", icon: User, label: "Perfil" },
];

export function Sidebar({ usuario }: { usuario: Usuario }) {
  const pathname = usePathname();

  return (
    <aside className="w-52 bg-white border-r border-gray-200 flex flex-col p-4 shrink-0">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 rounded-full bg-blue-600" />
        <p className="text-blue-600 font-bold text-lg">TaskFlow</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ href, icon, label }) => {
          if (href === "/dashboard/funcionarios" && usuario.role !== "gestor")
            return null;
          const ativo = pathname === href;
          return (
            <NavLinkItem
              key={href}
              href={href}
              label={label}
              icon={icon}
              ativo={ativo}
            />
          );
        })}
      </nav>

      <div className="border-t border-gray-200 pt-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {usuario.nome[0]}
        </div>
        <div className="overflow-hidden">
          <p className="text-gray-800 text-sm truncate">{usuario.nome}</p>
          <p className="text-gray-400 text-xs">
            {usuario.role === "gestor" ? "Gestor" : "Funcionário"}
          </p>
        </div>
      </div>
    </aside>
  );
}
