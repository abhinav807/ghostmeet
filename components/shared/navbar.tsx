"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Ghost, Moon, Sun, Menu, X, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/upload", label: "Upload" },
];

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLanding = pathname === "/";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isLanding
          ? "bg-transparent"
          : "bg-background/60 backdrop-blur-xl border-b border-white/10"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <Ghost className="h-8 w-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg group-hover:bg-cyan-300/30 transition-colors" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-foreground">Ghost</span>
            <span className="text-cyan-400">Meet</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "relative text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-cyan-400"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-400 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isDemo && (
            <Badge
              variant="outline"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium border-amber-500/30 bg-amber-500/10 text-amber-400"
            >
              <FlaskConical className="h-3 w-3" />
              Demo Mode
            </Badge>
          )}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
          <Link href="/upload" className="hidden md:block">
            <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 shadow-lg shadow-cyan-500/25">
              New Meeting
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10 px-4 pb-4"
        >
          {isDemo && (
            <div className="mb-3">
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium border-amber-500/30 bg-amber-500/10 text-amber-400"
              >
                <FlaskConical className="h-3 w-3" />
                Demo Mode
              </Badge>
            </div>
          )}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block py-2.5 text-sm font-medium transition-colors",
                pathname === link.href ? "text-cyan-400" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/upload" onClick={() => setMobileOpen(false)}>
            <Button className="mt-2 w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold">
              New Meeting
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
}
