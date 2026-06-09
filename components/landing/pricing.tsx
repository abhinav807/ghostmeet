"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "0",
    description: "Perfect for trying out GhostMeet",
    features: [
      "3 meetings per month",
      "Audio transcription",
      "AI summary generation",
      "Action items extraction",
      "Follow-up email drafts",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "19",
    description: "For professionals who meet daily",
    features: [
      "Unlimited meetings",
      "Audio transcription",
      "AI summary generation",
      "Action items extraction",
      "Follow-up email drafts",
      "Meeting minutes",
      "Priority processing",
      "Export to PDF",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "49",
    description: "For teams that collaborate constantly",
    features: [
      "Everything in Pro",
      "Team workspace",
      "Shared meeting library",
      "Role-based access",
      "API access",
      "SSO integration",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section className="relative py-24 sm:py-32" id="pricing">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
          >
            Simple, transparent{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              pricing
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Start free. Upgrade when you need more.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-xl border p-6 lg:p-8 ${
                plan.highlighted
                  ? "border-cyan-500/30 bg-cyan-500/5 shadow-lg shadow-cyan-500/10"
                  : "border-white/5 bg-white/[0.02]"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-500 text-black text-xs font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <Link href="/upload">
                <Button
                  className={`w-full mb-6 font-semibold ${
                    plan.highlighted
                      ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/25"
                      : "bg-white/10 hover:bg-white/15 text-foreground"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
