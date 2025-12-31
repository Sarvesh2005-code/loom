import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Layers, Zap, Image as ImageIcon, Code2, PaintBucket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-neutral-50 dark:bg-black text-foreground antialiased font-sans overflow-x-hidden selection:bg-indigo-500/30">

      {/* Navbar with Glassmorphism */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Layers className="w-5 h-5" />
            </div>
            LOOM
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/auth/signin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Sign In</Link>
            <Button size="sm" asChild className="rounded-full px-6 shadow-none hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
              <Link href="/auth/signin">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative pt-32 pb-40 md:pt-48 md:pb-64 overflow-hidden flex flex-col items-center justify-center text-center">
          {/* Apple-style animated background mesh */}
          <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000 pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

          <div className="container mx-auto px-4 relative z-10 max-w-5xl">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-sm">
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Introduced: Multimodal AI Generation 2.0
              </span>
            </div>

            <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[1.1] mb-8 text-neutral-900 dark:text-white">
              Design at the speed <br className="hidden sm:inline" />
              of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">Thought.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed text-neutral-600 dark:text-neutral-300 mb-12">
              Transform your wireframes into production-ready React code instantly.
              The most intuitive way to build user interfaces, powered by Gemini 1.5.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-indigo-600/20 hover:scale-105 transition-transform duration-300 bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100" asChild>
                <Link href="/auth/signin">
                  Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-black/10 dark:border-white/10 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 backdrop-blur-sm" asChild>
                <Link href="https://github.com/Sarvesh2005-code/loom" target="_blank">
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-neutral-900 dark:text-white">Pro-grade tools. <br />Zero complexity.</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Everything you need to go from idea to shipped product in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<Layers className="w-8 h-8 text-indigo-500" />}
              title="Infinite Canvas"
              description="A fluid, boundless workspace. Drag, drop, and sketch freely."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-amber-500" />}
              title="AI Code Generation"
              description="Instant React + Tailwind code. Powered by Gemini 1.5 Flash."
            />
            <FeatureCard
              icon={<ImageIcon className="w-8 h-8 text-pink-500" />}
              title="Mood Boards"
              description="Upload inspiration. The AI sees what you see and matches the vibe."
            />
            <FeatureCard
              icon={<PaintBucket className="w-8 h-8 text-emerald-500" />}
              title="Style System"
              description="Define tokens for Color, Typography, and Radius. Consistent every time."
            />
            <FeatureCard
              icon={<Code2 className="w-8 h-8 text-blue-500" />}
              title="Clean Export"
              description="Copy-paste ready. Typescript, Lucide Icons, and accessible HTML."
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-purple-500" />}
              title="Smart Iteration"
              description="Tweak the canvas, regenerate, and watch your UI evolve."
            />
          </div>
        </section>

        {/* Pricing Teaser / CTA */}
        <section className="container mx-auto px-4 py-24">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-900 dark:bg-white text-white dark:text-black p-8 md:p-20 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-500 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Create your next masterpiece.</h2>
                <p className="text-lg text-neutral-300 dark:text-neutral-600">
                  Join thousands of developers using Loom to build faster.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"><Sparkles className="w-3 h-3 text-green-500" /></div>
                    <span>Unlimited Generations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><Layers className="w-3 h-3 text-blue-500" /></div>
                    <span>Advanced Canvas Tools</span>
                  </div>
                </div>
                <Button size="lg" className="h-12 px-8 rounded-full bg-white text-black hover:bg-neutral-100 dark:bg-black dark:text-white dark:hover:bg-neutral-900 mt-4" asChild>
                  <Link href="/auth/signin">Get Started</Link>
                </Button>
              </div>

              <div className="hidden md:flex justify-center">
                <div className="relative w-64 h-64 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex items-center justify-center transform rotate-6 hover:rotate-0 transition-all duration-500">
                  <span className="text-6xl font-black opacity-20 user-select-none">S2C</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 dark:border-white/5 py-12 bg-neutral-50 dark:bg-black">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <p>© 2024 Loom Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="https://github.com/Sarvesh2005-code/loom" className="hover:text-foreground">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-black/5 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 rounded-2xl group cursor-default">
      <CardHeader>
        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <CardTitle className="text-xl font-semibold mb-2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
