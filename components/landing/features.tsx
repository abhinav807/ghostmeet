"use client";

import { motion } from "framer-motion";
import {
  FileAudio,
  Brain,
  ListChecks,
  Mail,
  FileText,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: FileAudio,
    title: "Audio Transcription",
    description: "Upload MP3, WAV, or M4A recordings and get accurate AI-powered transcription with speaker identification.",
  },
  {
    icon: Brain,
    title: "Smart Summary",
    description: "AI distills hour-long meetings into concise executive summaries, capturing essential points and outcomes.",
  },
  {
    icon: ListChecks,
    title: "Action Items",
    description: "Automatically extract tasks, assignees, deadlines, and priorities from your meeting discussions.",
  },
  {
    icon: Mail,
    title: "Follow-Up Email",
    description: "Generate professional follow-up emails ready to send, recapping decisions and next steps.",
  },
  {
    icon: FileText,
    title: "Meeting Minutes",
    description: "Create structured, formal meeting minutes with agenda items, decisions, and action items.",
  },
  {
    icon: Clock,
    title: "Instant Processing",
    description: "From upload to insights in minutes. No manual note-taking or tedious recap writing.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Features() {
  return (
    <section className="relative py-24 sm:py-32" id="features">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-cyan-950/5 to-background" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
          >
            Everything you need from{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              every meeting
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Six powerful AI features that transform your meeting recordings into actionable intelligence.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6 hover:border-cyan-500/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-400 mb-4">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
