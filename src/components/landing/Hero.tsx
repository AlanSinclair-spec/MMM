'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-medium rounded-full border border-border/50 bg-secondary/50 text-muted-foreground"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Interactive 3D Molecular Visualization
          </motion.div>

          {/* Title */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-6 leading-[0.95]">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {"Matthew's"}
            </span>
            <br />
            <span className="text-foreground">Protein Lab</span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Explore the molecular world in 3D
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/explore">
              <Button
                size="lg"
                className="text-base px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-[1.02]"
              >
                Start Exploring
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 border-border/50 hover:bg-secondary/80 transition-all duration-300 hover:scale-[1.02]"
              >
                Ask AI About Proteins
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto"
        >
          {[
            { value: '200K+', label: 'PDB Structures' },
            { value: '4', label: 'Render Modes' },
            { value: 'Real-time', label: '3D Interaction' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
