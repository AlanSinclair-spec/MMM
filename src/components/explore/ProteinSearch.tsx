'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProteinSearchProps {
  onSelect: (pdbId: string) => void;
}

export default function ProteinSearch({ onSelect }: ProteinSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim().toUpperCase();
    if (trimmed) {
      onSelect(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-md">
      <Input
        type="text"
        placeholder="Enter PDB ID (e.g. 1BNA, 6LU7)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground/60 h-11"
      />
      <Button
        type="submit"
        className="h-11 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0"
      >
        Load
      </Button>
    </form>
  );
}
