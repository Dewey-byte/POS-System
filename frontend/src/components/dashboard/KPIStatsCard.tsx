import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';

interface KPIStatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
}

export function KPIStatsCard({ title, value, change, trend, icon: Icon }: KPIStatsCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">{title}</p>
          <div className="bg-primary/10 p-2 rounded-lg">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <h3 className="text-foreground">{value}</h3>
          <div className="flex items-center gap-1">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
              {change}
            </span>
            <span className="text-muted-foreground">vs last week</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
