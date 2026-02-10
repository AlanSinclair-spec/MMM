import Hero from '@/components/landing/Hero';
import AnimatedBackground from '@/components/landing/AnimatedBackground';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <Hero />
    </main>
  );
}
