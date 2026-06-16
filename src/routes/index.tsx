import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Phone, Sparkles, Clock, Award, Check, ChevronDown, Home, BadgeCheck, Frame, Droplets, Star, ArrowRight, Mail, Menu, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import windowBefore from "@/assets/window-before.jpg.asset.json";
import windowAfter from "@/assets/window-after.jpg.asset.json";
import windowBefore2 from "@/assets/window-before-2.jpg.asset.json";
import windowAfter2 from "@/assets/window-after-2.jpg.asset.json";
import windowBefore3 from "@/assets/window-before-3.jpg.asset.json";
import windowAfter3 from "@/assets/window-after-3.jpg.asset.json";
import windowBefore4 from "@/assets/window-before-4.jpg.asset.json";
import windowAfter4 from "@/assets/window-after-4.jpg.asset.json";
import logoAsset from "@/assets/overlease-logo.png.asset.json";
import ogAsset from "@/assets/overlease-og.png.asset.json";
import { Nav } from "@/components/Nav";


const PHONE = "9134247527";
const PHONE_DISPLAY = "913 424 7527";
const EMAIL = "info@overleaseoutdoorservices.com";
const BRAND = "Overlease Outdoor Services";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overlease Outdoor Services" },
      { name: "description", content: "Professional residential window cleaning across the Kansas area. Streak-free glass, spotless frames and sills. Call 913 424 7527." },
      { property: "og:title", content: "Overlease Outdoor Services" },
      { property: "og:description", content: "Residential window cleaning across Kansas. Licensed, insured, streak-free." },
      { property: "og:image", content: ogAsset.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ogAsset.url },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Toaster position="top-center" richColors />
      <Nav />
      <Hero />
      <Services />
      <WhyUs />
      <Gallery />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div
        className="absolute inset-0 -z-10 opacity-50"
        style={{ backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.85 0.16 90 / 0.4), transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.78 0.14 220 / 0.5), transparent 55%)" }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.08]"
        style={{ backgroundImage: "linear-gradient(oklch(1 0 0 / 0.6) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.6) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-36 md:pt-44 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-32">
        <div className="text-foreground">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider ring-1 ring-white/20 backdrop-blur-md">
            <BadgeCheck className="h-3.5 w-3.5" /> LICENSED & INSURED · SERVING KANSAS · TRUSTED BY MANY HOMES
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Outdoor Services,<br />
            <span className="bg-gradient-to-r from-[oklch(0.65_0.15_250)] to-[oklch(0.55_0.18_250)] bg-clip-text text-transparent">
              done right.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-foreground md:text-xl">
            Professional window cleaning and outdoor property care across Kansas. Spotless results, reliable service, every time.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:scale-[1.03]"
              style={{ background: "var(--gradient-sun)" }}
            >
              <Phone className="h-5 w-5" /> Call {PHONE_DISPLAY}
            </a>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              5 / 5 from 2 reviews
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}

const quoteSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100, { message: "Name must be under 100 characters" }),
  phone: z.string().trim().min(1, { message: "Phone Number is required" }).max(20, { message: "Phone must be under 20 characters" }),
  service: z.string().trim().max(120, { message: "Service must be under 120 characters" }).optional(),
  windowCount: z.string().trim().max(10, { message: "Window count must be under 10 characters" }).optional(),
  windowType: z.string().trim().max(60, { message: "Window type must be under 60 characters" }).optional(),
  message: z.string().trim().max(500, { message: "Details must be under 500 characters" }).optional(),
});

function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", service: "", windowCount: "", windowType: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = quoteSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/public/submit-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error("Request failed");
      toast.success("Thanks! We'll call you back within 15 minutes.");
      setForm({ name: "", phone: "", service: "", windowCount: "", windowType: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please call us directly.");
    } finally {
      setLoading(false);
    }
  };


  const inputError = (field: string) =>
    errors[field] ? "border-destructive focus-visible:ring-destructive" : "";

  return (
    <div id="quote" className="scroll-mt-24 rounded-3xl bg-card/95 p-7 shadow-[var(--shadow-card)] backdrop-blur-xl ring-1 ring-foreground/10 md:p-8">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Get a free quote</h2>
        <p className="mt-1 text-sm text-muted-foreground">No commitment. We reply within 15 minutes.</p>
      </div>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="name" className="flex items-center gap-1">
            Your Name<br /><span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your Name"
            className={`mt-1.5 ${inputError("name")}`}
            maxLength={100}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && <p id="name-error" className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="phone" className="flex items-center gap-1">
            Phone Number <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Your Number"
            className={`mt-1.5 ${inputError("phone")}`}
            maxLength={20}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && <p id="phone-error" className="mt-1 text-xs text-destructive">{errors.phone}</p>}
        </div>
        <div>
          <Label htmlFor="service">Service needed</Label>
          <Select
            value={form.service}
            onValueChange={(value) => setForm({ ...form, service: value })}
          >
            <SelectTrigger id="service" className="mt-1.5 w-full">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exterior">Exterior Window Cleaning</SelectItem>
              <SelectItem value="interior">Interior Window Cleaning</SelectItem>
              <SelectItem value="full">Full Service (Interior + Exterior)</SelectItem>
              <SelectItem value="frames">Frames &amp; Sills Cleaning</SelectItem>
              <SelectItem value="screens">Screen Cleaning</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="windowCount">Number of windows</Label>
            <Input
              id="windowCount"
              type="number"
              min={1}
              value={form.windowCount}
              onChange={(e) => setForm({ ...form, windowCount: e.target.value })}
              placeholder="e.g. 12"
              className="mt-1.5"
              maxLength={10}
            />
          </div>
          <div>
            <Label htmlFor="windowType">Window type</Label>
            <Select
              value={form.windowType}
              onValueChange={(value) => setForm({ ...form, windowType: value })}
            >
              <SelectTrigger id="windowType" className="mt-1.5 w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-pane">Single Pane</SelectItem>
                <SelectItem value="french">French Windows</SelectItem>
                <SelectItem value="double-pane">Double Pane</SelectItem>
                <SelectItem value="bay">Bay / Bow</SelectItem>
                <SelectItem value="sliding">Sliding</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="message">Details <span className="text-muted-foreground">(optional)</span></Label>
          <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Frames, sills, screens..." className="mt-1.5 min-h-[80px]" maxLength={500} />
        </div>
        <Button type="submit" disabled={loading} className="w-full rounded-full py-6 text-base font-semibold shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
          {loading ? "Sending..." : (<>Request my quote <ArrowRight className="ml-1 h-4 w-4" /></>)}
        </Button>
      </form>
    </div>
  );
}

const services = [
  { icon: Sparkles, title: "Exterior Glass", desc: "Streak-free, crystal clear glass on every window of your home." },
  { icon: Home, title: "Interior Glass", desc: "Inside windows wiped to a perfect, fingerprint-free shine." },
  { icon: Frame, title: "Frames & Sills", desc: "We don't just do glass. Frames, sills, tracks, and screens — fully detailed." },
  { icon: Droplets, title: "Screens & Tracks", desc: "Dust, debris, cobwebs and grime cleared from every corner." },
];


function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">What we do</span>
        <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Every part of your window. Cleaned.</h2>
        <p className="mt-4 text-lg text-muted-foreground">From the glass to the very corner of every sill, nothing gets missed.</p>
      </div>
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-glass)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 transition group-hover:opacity-100" style={{ background: "var(--gradient-primary)", filter: "blur(40px)" }} />
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const whyUs = [
  { icon: BadgeCheck, title: "Licensed & Insured", desc: "Fully licensed and insured — your home and our team are protected on every job." },
  { icon: Sparkles, title: "Streak-free guarantee", desc: "If you see a streak, we come back. Period." },
  { icon: Clock, title: "On time, every time", desc: "We respect your schedule. 15-min arrival window confirmation." },
  { icon: Award, title: "5-star rated team", desc: "Trained residential specialists. Five-star reviews from local homeowners." },
];


function WhyUs() {
  return (
    <section id="why" className="relative overflow-hidden py-24 md:py-32 scroll-mt-24" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, oklch(0.55 0.18 250 / 0.4), transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.60 0.15 250 / 0.4), transparent 50%)" }} />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center text-foreground">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Why {BRAND}</span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">The difference is clear.</h2>
          <p className="mt-4 text-lg text-foreground">We're obsessed with detail. You'll see — literally.</p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl bg-card p-7 text-foreground shadow-[var(--shadow-glass)] ring-1 ring-border">
              <Icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const beforeAfter = [
  { before: windowBefore.url, after: windowAfter.url, label: "Real customer window — before and after cleaning" },
  { before: windowBefore2.url, after: windowAfter2.url, label: "Real window frame and glass — before and after cleaning" },
  { before: windowBefore3.url, after: windowAfter3.url, label: "Sliding patio door — before and after cleaning" },
  { before: windowBefore4.url, after: windowAfter4.url, label: "Streaky exterior window — before and after cleaning" },
];

function Gallery() {
  return (
    <section id="gallery" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">Before & After</span>
        <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">The proof is in the glass.</h2>
        <p className="mt-4 text-lg text-muted-foreground">Real homes. Real results. Slide your eyes from grimy to gleaming.</p>
      </div>
      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        {beforeAfter.map((item, idx) => (
          <div key={idx} className="overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="grid grid-cols-2 gap-3">
              <figure className="relative overflow-hidden rounded-2xl">
                <img src={item.before} alt={`Before cleaning — ${item.label}`} loading="lazy" width={800} height={800} className="aspect-square w-full object-cover" />
                <figcaption className="absolute left-3 top-3 rounded-full bg-foreground/85 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-background backdrop-blur">Before</figcaption>
              </figure>
              <figure className="relative overflow-hidden rounded-2xl">
                <img src={item.after} alt={`After cleaning — ${item.label}`} loading="lazy" width={800} height={800} className="aspect-square w-full object-cover" />
                <figcaption className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur" style={{ background: "var(--gradient-sun)" }}>After</figcaption>
              </figure>
            </div>
            <div className="px-2 pb-1 pt-4 text-sm font-medium text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Maggie",
    location: "Shawnee",
    text: "Henry did a great and thorough job within a timely manner! Best of both worlds :)",
    rating: 5,
  },
];

function Testimonials() {
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">Reviews</span>
        <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">What customers say</h2>
        <p className="mt-4 text-lg text-muted-foreground">Real feedback from real Kansas homeowners.</p>
      </div>
      <div className="mt-14 grid gap-6 grid-cols-1 max-w-md mx-auto">
        {testimonials.map((t, i) => (
          <div key={i} className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, s) => (
                <Star key={s} className={`h-4 w-4 ${s < t.rating ? "fill-primary text-primary" : "text-muted"}`} />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground">&ldquo;{t.text}&rdquo;</p>
            <div className="mt-5">
              <div className="text-sm font-semibold text-foreground">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.location}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const faqs = [
  { q: "Do you clean window frames and sills too?", a: "Yes — that's our specialty. Glass, frames, sills, tracks, and screens are all included in every standard clean." },
  { q: "How much does it cost?", a: "Pricing depends on the number of windows and access. Most homes are a small flat fee per window. Call us for a free, no-obligation quote." },
  { q: "Are you insured?", a: "Absolutely. We carry full public liability insurance, so you're protected on every job." },
  { q: "How long does it take?", a: "An average home (10–15 windows) takes around 1.5 to 2.5 hours, depending on condition and access." },
  { q: "What if it rains after?", a: "Rain on clean glass doesn't leave streaks — only dirt does. But if you're unhappy, we'll come back free of charge." },
  { q: "Do you do high-rise or commercial buildings?", a: "Yes. We service everything from single-story homes to multi-story commercial buildings with certified rope-access technicians." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-24 md:py-32">
      <div className="text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">FAQ</span>
        <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Questions, answered.</h2>
      </div>
      <div className="mt-12 space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-glass)]">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
              <span className="text-base font-semibold tracking-tight md:text-lg">{f.q}</span>
              <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="px-6 pb-5 text-muted-foreground">{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 -z-10 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, oklch(0.55 0.18 250 / 0.5), transparent 50%)" }} />
      <div className="mx-auto max-w-4xl px-6 text-center text-foreground">
        <h2 className="text-4xl font-bold tracking-tight md:text-6xl">Ready for windows that <span className="bg-gradient-to-r from-[oklch(0.65_0.15_250)] to-[oklch(0.55_0.18_250)] bg-clip-text text-transparent">disappear</span>?</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-foreground">One call. One spotless result. Book your clean today and see the difference.</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:scale-[1.03]" style={{ background: "var(--gradient-sun)" }}>
            <Phone className="h-5 w-5" /> Call {PHONE_DISPLAY}
          </a>
          <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 rounded-full bg-foreground/10 px-6 py-4 text-base font-semibold text-foreground ring-1 ring-foreground/20 backdrop-blur-md transition hover:bg-foreground/20">
            <Mail className="h-5 w-5" /> {EMAIL}
          </a>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4" /> Free quote · No obligation
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-primary" /> {BRAND} · Kansas
        </div>
        <div className="flex flex-col items-center gap-1 md:flex-row md:gap-4">
          <a href={`tel:${PHONE}`} className="hover:text-primary">{PHONE_DISPLAY}</a>
          <a href={`mailto:${EMAIL}`} className="hover:text-primary">{EMAIL}</a>
        </div>
        <div>© {new Date().getFullYear()} {BRAND}. All rights reserved.</div>
      </div>
    </footer>
  );
}
