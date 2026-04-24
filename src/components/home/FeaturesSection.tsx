"use client";

import { motion, Variants } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Terminal, ShieldAlert, BarChart3, Globe } from "lucide-react";

const features = [
  {
    title: "Isolated Sandboxes",
    description: "Train in safe, entirely isolated terminal environments that simulate real vulnerable networks and systems.",
    icon: Terminal,
    glow: "cyan" as const,
  },
  {
    title: "Evolving Threats",
    description: "Face dynamically generated attack scenarios ranging from simple phishing to complex zero-days.",
    icon: ShieldAlert,
    glow: "purple" as const,
  },
  {
    title: "Real-time Telemetry",
    description: "Monitor your defensive capabilities with live logs and instant feedback loops directly from the simulation.",
    icon: BarChart3,
    glow: "cyan" as const,
  },
  {
    title: "Global Grid",
    description: "Compete on the global leaderboard. Earn security badges and rank up your hacker reputation.",
    icon: Globe,
    glow: "purple" as const,
  },
];

export function FeaturesSection() {
  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 tracking-widest uppercase">
          System <span className="text-accent drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]">Capabilities</span>
        </h2>
        <p className="text-foreground/70 max-w-2xl mx-auto text-lg font-sans">
          CyberSim provides a comprehensive suite of tools designed to elevate your defensive and offensive skills.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <Card glow={feature.glow} className="h-full flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                <div 
                  className={`w-14 h-14 rounded-lg bg-[#020202] border flex items-center justify-center mb-6 transition-colors duration-300 ${
                    feature.glow === 'cyan' 
                      ? 'border-accent/30 text-accent group-hover:bg-accent/10 group-hover:border-accent shadow-[0_0_10px_rgba(0,240,255,0.1)]' 
                      : 'border-accent-alt/30 text-accent-alt group-hover:bg-accent-alt/10 group-hover:border-accent-alt shadow-[0_0_10px_rgba(122,95,255,0.1)]'
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-heading tracking-wider uppercase">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed flex-grow font-sans">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
