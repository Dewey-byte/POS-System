import { cn } from '../../lib/utils';

interface CategoryFilterTabsProps {
  selected: string;
  onSelect: (category: string) => void;
}

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'helmets', label: 'Helmets' },
  { id: 'gear', label: 'Riding Gear' },
  { id: 'parts', label: 'Parts' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'oils', label: 'Oils & Fluids' },
];

export function CategoryFilterTabs({ selected, onSelect }: CategoryFilterTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            'px-4 py-2 rounded-lg whitespace-nowrap transition-colors',
            selected === category.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border text-foreground hover:bg-accent'
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
