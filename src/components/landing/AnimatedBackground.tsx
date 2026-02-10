'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, oklch(0.55 0.2 250 / 0.15), transparent 70%)',
          top: '10%',
          left: '15%',
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, oklch(0.6 0.2 300 / 0.12), transparent 70%)',
          bottom: '10%',
          right: '10%',
        }}
        animate={{
          x: [0, -25, 35, 0],
          y: [0, 30, -25, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, oklch(0.6 0.15 180 / 0.1), transparent 70%)',
          top: '50%',
          right: '30%',
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -20, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* DNA Double Helix */}
      <motion.div
        className="hidden sm:block absolute right-[5%] top-[15%] h-[70%] w-[200px] opacity-[0.06]"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          viewBox="0 0 100 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Left strand backbone */}
          <path
            d={`M ${Array.from({ length: 20 }, (_, i) =>
              `${50 - Math.sin(i * 0.6) * 25},${i * 30 + 15}`
            ).join(' L ')}`}
            stroke="oklch(0.65 0.2 250)"
            strokeWidth={1.5}
            fill="none"
          />
          {/* Right strand backbone */}
          <path
            d={`M ${Array.from({ length: 20 }, (_, i) =>
              `${50 + Math.sin(i * 0.6) * 25},${i * 30 + 15}`
            ).join(' L ')}`}
            stroke="oklch(0.7 0.2 300)"
            strokeWidth={1.5}
            fill="none"
          />
          {/* Nodes and rungs */}
          {Array.from({ length: 20 }, (_, i) => {
            const y = i * 30 + 15;
            const offset = Math.sin(i * 0.6) * 25;
            return (
              <g key={i}>
                <line
                  x1={50 - offset} y1={y}
                  x2={50 + offset} y2={y}
                  stroke="oklch(0.65 0.15 250)"
                  strokeWidth={1}
                  strokeOpacity={0.5}
                />
                <circle cx={50 - offset} cy={y} r={3} fill="oklch(0.65 0.2 250)" />
                <circle cx={50 + offset} cy={y} r={3} fill="oklch(0.7 0.2 300)" />
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}
