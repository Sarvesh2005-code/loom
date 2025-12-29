import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <div className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">
          S2C is now public beta
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          Sketch to Code with AI
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Turn your wireframes and sketches into production-ready code in seconds.
          Powered by extensive AI models and a Figma-like canvas.
        </p>
        <div className="flex gap-4">
          <Button size="lg" asChild>
            <Link href="/auth/signin">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="https://github.com/Sarvesh2005-code/loom">
              GitHub
            </Link>
          </Button>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
    </div>
  );
}
