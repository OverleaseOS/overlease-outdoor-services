import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Sparkles, Shield, Clock, Award, Check, ChevronDown, Home, Building2, Frame, Droplets, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import heroImg from "@/assets/hero.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";

const PHONE = "91333020530";
const PHONE_DISPLAY = "+91 333 020 530";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CrystalView — Premium Window Cleaning. Frames, Sills & Glass." },
      { name: "description", content: "Streak-free windows, spotless frames and sills. Book your professional window cleaning today. Call +91 333 020 530." },
      { property: "og:title", content: "CrystalView — Premium Window Cleaning" },
      { property: "og:description", content: "Streak-free windows, spotless frames and sills. Book today." },
      { property: "og:image", content: heroImg },
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
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#" className="flex items-center gap-2 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-md ring-1 ring-white/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">CrystalView</span>
        </a>
        <a
          href={`tel:${PHONE}`}
          className="hidden items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md ring-1 ring-white/25 transition hover:bg-white/20 md:inline-flex"
        >
          <Phone className="h-4 w-4" />
          {PHONE_DISPLAY}
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt="Professional window cleaner at work on a high-rise glass facade"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(120deg, oklch(0.18 0.08 245 / 0.85) 0%, oklch(0.25 0.1 240 / 0.65) 45%, oklch(0.4 0.12 235 / 0.4) 100%)" }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-36 md:pt-44 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-32">
        <div className="text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider ring-1 ring-white/20 backdrop-blur-md">
            <Droplets className="h-3.5 w-3.5" /> Trusted by 2,000+ homes & offices
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Windows so clean,<br />
            <span className="bg-gradient-to-r from-[oklch(0.92_0.16_90)] to-[oklch(0.85_0.18_60)] bg-clip-text text-transparent">
              they vanish.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85 md:text-xl">
            Streak-free glass, spotless frames, immaculate sills. We clean every inch of your windows — inside, out, and everything in between.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-sun)] px-6 py-3.5 text-base font-semibold text-[oklch(0.2_0.05_60)] shadow-[var(--shadow-glow)] transition hover:scale-[1.03]"
              style={{ background: "var(--gradient-sun)" }}
            >
              <Phone className="h-5 w-5" /> Call {PHONE_DISPLAY}
            </a>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[oklch(0.85_0.16_90)] text-[oklch(0.85_0.16_90)]" />
                ))}
              </div>
              4.9 / 5 from 480+ reviews
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}

function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", service: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please add your name and phone number.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Thanks! We'll call you back within 15 minutes.");
      setForm({ name: "", phone: "", service: "", message: "" });
    }, 800);
  };

  return (
    <div className="rounded-3xl bg-white/95 p-7 shadow-[var(--shadow-card)] backdrop-blur-xl ring-1 ring-white/40 md:p-8">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Get a free quote</h2>
        <p className="mt-1 text-sm text-muted-foreground">No commitment. We reply within 15 minutes.</p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" className="mt-1.5" maxLength={100} />
        </div>
        <div>
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 ..." className="mt-1.5" maxLength={20} />
        </div>
        <div>
          <Label htmlFor="service">Service needed</Label>
          <Input id="service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} placeholder="e.g. Residential, 12 windows" className="mt-1.5" maxLength={120} />
        </div>
        <div>
          <Label htmlFor="message">Details (optional)</Label>
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
  { icon: Home, title: "Residential Windows", desc: "Houses, apartments, villas — inside and out, every pane spotless." },
  { icon: Building2, title: "Commercial & Office", desc: "Storefronts, offices, and high-rises. Scheduled or one-off." },
  { icon: Frame, title: "Frames & Sills", desc: "We don't just do glass. Frames, sills, tracks, and screens — fully detailed." },
  { icon: Droplets, title: "Post-Construction", desc: "Paint splatter, dust, stickers, mineral deposits — all gone." },
];

function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">What we do</span>
        <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Every part of your window. Cleaned.</h2>
        <p className="mt-4 text-lg text-muted-foreground">From the glass to the tiniest corner of the sill — nothing gets missed.</p>
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
  { icon: Shield, title: "Fully insured", desc: "Total peace of mind. We're insured for every job, every time." },
  { icon: Sparkles, title: "Streak-free guarantee", desc: "If you see a streak, we come back. Period." },
  { icon: Clock, title: "On time, every time", desc: "We respect your schedule. 15-min arrival window confirmation." },
  { icon: Award, title: "5-star rated team", desc: "Trained professionals. 480+ five-star reviews and counting." },
];

function WhyUs() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, oklch(0.85 0.16 90 / 0.4), transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.78 0.14 220 / 0.4), transparent 50%)" }} />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center text-white">
          <span className="text-sm font-semibold uppercase tracking-wider text-[oklch(0.85_0.16_90)]">Why CrystalView</span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">The difference is clear.</h2>
          <p className="mt-4 text-lg text-white/85">We're obsessive about detail. You'll see — literally.</p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl bg-white/10 p-7 text-white backdrop-blur-md ring-1 ring-white/20">
              <Icon className="h-8 w-8 text-[oklch(0.85_0.16_90)]" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const items = [
    { src: g1, alt: "Squeegee cleaning sparkling glass window", className: "md:col-span-2 md:row-span-2" },
    { src: g2, alt: "Pristine windows on a modern home" },
    { src: g3, alt: "Detailed cleaning of a white window frame and sill" },
    { src: g4, alt: "Reflective glass office building facade", className: "md:col-span-2" },
  ];
  return (
    <section id="gallery" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">Our work</span>
        <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">See for yourself.</h2>
        <p className="mt-4 text-lg text-muted-foreground">Real jobs. Real shine.</p>
      </div>
      <div className="mt-12 grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-4">
        {items.map((it, i) => (
          <div key={i} className={`group relative overflow-hidden rounded-2xl shadow-[var(--shadow-glass)] ${it.className ?? ""}`}>
            <img src={it.src} alt={it.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

const faqs = [
  { q: "Do you clean window frames and sills too?", a: "Yes — that's our specialty. Glass, frames, sills, tracks, and screens are all included in every standard clean." },
  { q: "How much does it cost?", a: "Pricing depends on the number of windows and access. Most homes are between a small flat fee per window. Call us for a free, no-obligation quote." },
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
      <div className="absolute inset-0 -z-10 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, oklch(0.85 0.16 90 / 0.5), transparent 50%)" }} />
      <div className="mx-auto max-w-4xl px-6 text-center text-white">
        <h2 className="text-4xl font-bold tracking-tight md:text-6xl">Ready for windows that <span className="bg-gradient-to-r from-[oklch(0.92_0.16_90)] to-[oklch(0.85_0.18_60)] bg-clip-text text-transparent">disappear</span>?</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">One call. One spotless result. Book your clean today and see the difference.</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-semibold text-[oklch(0.2_0.05_60)] shadow-[var(--shadow-glow)] transition hover:scale-[1.03]" style={{ background: "var(--gradient-sun)" }}>
            <Phone className="h-5 w-5" /> Call {PHONE_DISPLAY}
          </a>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Check className="h-4 w-4" /> Free quote · No obligation
          </div>
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
          <Sparkles className="h-4 w-4 text-primary" /> CrystalView Window Cleaning
        </div>
        <a href={`tel:${PHONE}`} className="hover:text-primary">{PHONE_DISPLAY}</a>
        <div>© {new Date().getFullYear()} CrystalView. All rights reserved.</div>
      </div>
    </footer>
  );
}
