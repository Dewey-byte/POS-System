import { Search } from 'lucide-react';
import { Input } from '../ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search products by name or SKU..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-input border-border"
      />
    </div>
  );
}
