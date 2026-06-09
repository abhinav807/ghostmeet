"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            AI-Powered Meeting Intelligence
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          Never lose a{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent">
              meeting insight
            </span>
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
              <path d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round" />
              <defs>
                <linearGradient id="underline-gradient" x1="0" y1="0" x2="300" y2="0">
                  <stop stopColor="#22d3ee" />
                  <stop offset="0.5" stopColor="#2dd4bf" />
                  <stop offset="1" stopColor="#67e8f9" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <br />
          again
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Upload your meeting recording and let AI transcribe, summarize, extract action items,
          and draft follow-up emails. Turn conversations into actionable outcomes in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/upload">
            <Button
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 h-12 text-base shadow-lg shadow-cyan-500/25 group"
            >
              Start for Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="lg"
              className="border-white/10 hover:border-white/20 px-8 h-12 text-base"
            >
              View Dashboard
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 relative"
        >
          <div className="relative mx-auto max-w-4xl rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-1 shadow-2xl shadow-cyan-500/10">
            <div className="rounded-lg bg-background/80 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">meeting-q4-review.mp3</span>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 text-sm font-mono shrink-0">00:42</span>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Speaker 1:</span> Let&apos;s review the Q4 targets. We need to hit 2M ARR by December.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 text-sm font-mono shrink-0">01:15</span>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Speaker 2:</span> The pipeline looks strong. We have 400K in committed deals and another 800K in qualified opportunities.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 text-sm font-mono shrink-0">02:03</span>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Speaker 1:</span> Great. Action item - Sarah to close the enterprise deals by end of month.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                  <p className="text-xs text-cyan-400 font-medium mb-1">AI Generated Summary</p>
                  <p className="text-sm text-muted-foreground">Q4 review confirmed 2M ARR target. 400K committed, 800K qualified pipeline. Action: Sarah to close enterprise deals by month end.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
