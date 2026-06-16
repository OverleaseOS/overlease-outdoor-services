import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Phone, Menu, X, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/overlease-logo.png.asset.json";

const PHONE = "9134247527";
const PHONE_DISPLAY = "913 424 7527";
const BRAND = "Overlease Outdoor Services";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#why", label: "Why Us" },
  { href: "#gallery", label: "Gallery" },
  { href: "#faq", label: "FAQ" },
  { href: "#quote", label: "Contact" },
];

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    const checkForUserId = async (userId: string | undefined) => {
      if (!userId) {
        if (active) setIsAdmin(false);
        return;
      }
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      if (!active) return;
      if (error) {
        console.error("[useIsAdmin] role fetch failed", error);
        setIsAdmin(false);
        return;
      }
      setIsAdmin((roles ?? []).some((r) => r.role === "admin"));
    };

    supabase.auth.getSession().then(({ data }) => {
      checkForUserId(data.session?.user?.id);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "INITIAL_SESSION" ||
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        checkForUserId(session?.user?.id);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return isAdmin;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const isAdmin = useIsAdmin();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <a href="/" className="flex items-center text-foreground">
          <img src={logoAsset.url} alt={`${BRAND} logo`} className="h-18 w-auto object-contain" />
          <span className="ml-2 text-lg font-semibold">{BRAND}</span>
        </a>

        <nav className="hidden items-center gap-1 rounded-full bg-white/10 px-2 py-1.5 backdrop-blur-md ring-1 ring-white/20 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-foreground/90 transition hover:bg-white/15 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-primary"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Estimate Requests
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${PHONE}`}
            className="hidden items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-md ring-1 ring-white/25 transition hover:bg-white/20 md:inline-flex"
          >
            <Phone className="h-4 w-4" />
            {PHONE_DISPLAY}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-foreground backdrop-blur-md ring-1 ring-white/25 transition hover:bg-white/20 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-4 rounded-2xl bg-card/95 p-3 shadow-[var(--shadow-card)] ring-1 ring-foreground/10 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition hover:bg-foreground/5"
              >
                {l.label}
              </a>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-primary"
              >
                <ShieldCheck className="h-4 w-4" />
                Estimate Requests
              </Link>
            )}
            <a
              href={`tel:${PHONE}`}
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Phone className="h-4 w-4" /> Call {PHONE_DISPLAY}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
