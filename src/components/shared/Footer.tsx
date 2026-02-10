export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Built with 🧬 for{' '}
            <span className="text-foreground font-medium">Matthew</span>
            {' '}by{' '}
            <span className="text-foreground font-medium">William</span>
          </p>
          <p className="text-xs text-muted-foreground/60">
            Data from RCSB Protein Data Bank
          </p>
        </div>
      </div>
    </footer>
  );
}
