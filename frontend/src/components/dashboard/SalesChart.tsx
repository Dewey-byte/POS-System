import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', sales: 2400 },
  { day: 'Tue', sales: 3200 },
  { day: 'Wed', sales: 2800 },
  { day: 'Thu', sales: 4100 },
  { day: 'Fri', sales: 3900 },
  { day: 'Sat', sales: 5200 },
  { day: 'Sun', sales: 4800 },
];

export function SalesChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Sales This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="day" stroke="#a3a3a3" />
            <YAxis stroke="#a3a3a3" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #262626',
                borderRadius: '8px',
                color: '#fafafa',
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}