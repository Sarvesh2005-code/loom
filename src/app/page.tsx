"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BackgroundPaths } from "@/components/landing/BackgroundPaths";
import { ArrowRight, Layers, Zap, Image as ImageIcon, Code2, PaintBucket, Sparkles, Check } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-white overflow-x-hidden selection:bg-neutral-200 dark:selection:bg-neutral-800">

      {/* Background */}
      <BackgroundPaths />

      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-black">
              <Layers className="w-5 h-5" />
            </div>
            LOOM
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/signin" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Log In</Link>
            <Button size="sm" asChild className="rounded-full px-5 bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all font-medium">
              <Link href="/auth/signin">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10 pt-32">
        {/* Hero */}
        <section className="container mx-auto px-6 pb-24 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            v2.0 is now live
          </div>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 max-w-4xl mx-auto leading-[0.9]">
            Design at the <br /> speed of thought.
          </h1>

          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Loom transforms your rough sketches into production-ready React code.
            Powered by multimodal AI, built for modern engineering teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Button size="lg" className="h-14 px-8 rounded-full text-lg bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1" asChild>
              <Link href="/auth/signin">
                Start Building <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-lg border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-white/10 backdrop-blur-sm transition-all" asChild>
              <Link href="https://github.com/Sarvesh2005-code/loom" target="_blank">
                View on GitHub
              </Link>
            </Button>
          </div>

          {/* Screenshot Mockup */}
          <div className="mt-20 relative w-full max-w-6xl mx-auto rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 shadow-2xl overflow-hidden aspect-video group">
            <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            {/* Placeholder for actual screenshot - would need a real image here for production */}
            <div className="absolute inset-0 flex items-center justify-center text-neutral-400 font-mono text-sm">
              [App Screenshot Placeholder]
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-32 border-t border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-black">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-20 text-center">
              Everything you need to <br /> ship faster.
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="w-5 h-5" />}
                title="Instant Generation"
                description="Turn wireframes into code in seconds with Gemini 1.5 Flash."
              />
              <FeatureCard
                icon={<PaletteIcon className="w-5 h-5" />}
                title="Design Systems"
                description="Maintain consistency with centralized Type and Color tokens."
              />
              <FeatureCard
                icon={<Code2 className="w-5 h-5" />}
                title="Production Ready"
                description="Export clean, accessible React + Tailwind code."
              />
            </div>
          </div>
        </section>

        {/* CTO Section */}
        <section className="py-32 border-t border-neutral-200 dark:border-white/5">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold tracking-tighter mb-6">Ready to accelerate your workflow?</h2>
            <p className="text-neutral-500 mb-10 max-w-lg mx-auto">Join thousands of developers using Loom to build the future.</p>
            <Button size="lg" className="h-14 px-10 rounded-full text-lg bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200" asChild>
              <Link href="/auth/signin">Get Started for Free</Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-neutral-200 dark:border-white/5 text-center text-sm text-neutral-500">
          <p>© 2024 Loom Inc. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/10 transition-colors">
      <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center mb-6 text-neutral-900 dark:text-white">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-neutral-500 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
  )
}
