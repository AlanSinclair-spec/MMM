'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CompareInputsProps {
  onCompare: (pdbIdA: string, pdbIdB: string) => void;
  initialA?: string;
  initialB?: string;
}

export default function CompareInputs({ onCompare, initialA = '', initialB = '' }: CompareInputsProps) {
  const [idA, setIdA] = useState(initialA);
  const [idB, setIdB] = useState(initialB);

  useEffect(() => { setIdA(initialA); }, [initialA]);
  useEffect(() => { setIdB(initialB); }, [initialB]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const a = idA.trim().toUpperCase();
    const b = idB.trim().toUpperCase();
    if (a && b) {
      onCompare(a, b);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
      <div className="flex-1 space-y-1.5">
        <label className="text-xs text-muted-foreground uppercase tracking-wider">
          Protein A
        </label>
        <Input
          type="text"
          placeholder="PDB ID (e.g. 1A3N)"
          value={idA}
          onChange={(e) => setIdA(e.target.value)}
          className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground/60 h-11"
        />
      </div>
      <div className="flex-1 space-y-1.5">
        <label className="text-xs text-muted-foreground uppercase tracking-wider">
          Protein B
        </label>
        <Input
          type="text"
          placeholder="PDB ID (e.g. 2HBS)"
          value={idB}
          onChange={(e) => setIdB(e.target.value)}
          className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground/60 h-11"
        />
      </div>
      <Button
        type="submit"
        className="h-11 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 whitespace-nowrap"
      >
        Compare
      </Button>
    </form>
  );
}
