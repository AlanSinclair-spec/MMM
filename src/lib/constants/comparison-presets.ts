export interface ComparisonPreset {
  label: string;
  description: string;
  proteinA: { pdbId: string; name: string };
  proteinB: { pdbId: string; name: string };
  color: string;
}

export const COMPARISON_PRESETS: ComparisonPreset[] = [
  {
    label: 'Normal vs Sickle Cell Hemoglobin',
    description: 'See how a single amino acid change alters hemoglobin structure',
    proteinA: { pdbId: '1A3N', name: 'Normal Hemoglobin' },
    proteinB: { pdbId: '2HBS', name: 'Sickle Cell Hemoglobin' },
    color: 'from-red-500 to-pink-500',
  },
  {
    label: 'Wild-type vs Mutant p53',
    description: 'Compare the tumor suppressor in its normal and mutant forms',
    proteinA: { pdbId: '1TUP', name: 'Wild-type p53' },
    proteinB: { pdbId: '2PCX', name: 'Mutant p53' },
    color: 'from-indigo-500 to-purple-500',
  },
  {
    label: 'Human vs Bacterial Insulin',
    description: 'Explore evolutionary conservation of the insulin hormone',
    proteinA: { pdbId: '4INS', name: 'Human Insulin' },
    proteinB: { pdbId: '1ZNJ', name: 'Bacterial Insulin' },
    color: 'from-blue-500 to-cyan-500',
  },
];
