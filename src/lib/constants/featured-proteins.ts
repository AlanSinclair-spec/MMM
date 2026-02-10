import { FeaturedProtein } from '@/types/protein';

export const FEATURED_PROTEINS: FeaturedProtein[] = [
  {
    pdbId: '4INS',
    name: 'Insulin',
    description: 'Hormone regulating blood sugar',
    category: 'Hormone',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    pdbId: '1A3N',
    name: 'Hemoglobin',
    description: 'Oxygen transport protein in blood',
    category: 'Transport',
    color: 'from-red-500 to-pink-500',
  },
  {
    pdbId: '5F9R',
    name: 'CRISPR-Cas9',
    description: 'Gene editing molecular scissors',
    category: 'Enzyme',
    color: 'from-green-500 to-emerald-500',
  },
  {
    pdbId: '6VXX',
    name: 'COVID Spike Protein',
    description: 'SARS-CoV-2 viral entry protein',
    category: 'Viral',
    color: 'from-orange-500 to-red-500',
  },
  {
    pdbId: '1EMA',
    name: 'Green Fluorescent Protein',
    description: 'Bioluminescent marker protein',
    category: 'Fluorescent',
    color: 'from-green-400 to-lime-500',
  },
  {
    pdbId: '1BNA',
    name: 'DNA Double Helix',
    description: 'The molecule of heredity',
    category: 'Nucleic Acid',
    color: 'from-purple-500 to-pink-500',
  },
  {
    pdbId: '5ARA',
    name: 'ATP Synthase',
    description: 'Cellular energy production machinery',
    category: 'Enzyme',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    pdbId: '1TUP',
    name: 'p53 Tumor Suppressor',
    description: 'Guardian of the genome',
    category: 'Regulatory',
    color: 'from-indigo-500 to-purple-500',
  },
];
