"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  Home,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/registro", label: "Registrar", icon: Activity },
  { href: "/historial", label: "Historial", icon: BookOpen },
  { href: "/estadisticas", label: "Estadísticas", icon: BarChart3 },
  { href: "/patrones", label: "Patrones", icon: Brain },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 h-full w-56 bg-white border-r border-border flex-col shadow-sm z-40">
        <div className="p-6 border-b">
          <h1 className="text-lg font-bold text-primary flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Pain Tracker
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Registro de dolor corporal
          </p>
        </div>
        <div className="flex-1 py-4">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-primary/10 text-primary border-r-2 border-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
        <div className="p-4 border-t text-xs text-muted-foreground text-center">
          Datos guardados localmente
        </div>
      </nav>

      {/* Mobile navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-base font-bold text-primary flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Pain Tracker
          </h1>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md hover:bg-muted"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t bg-white py-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Mobile bottom navigation bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 shadow-md">
        <div className="grid grid-cols-5 h-16">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                pathname === href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px]">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
