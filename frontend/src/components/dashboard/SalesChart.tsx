import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function SalesChart() {
  const API_URL = "http://127.0.0.1:5000/api/sales";

  const [salesData, setSalesData] = useState<any[]>([]);

  const fetchSalesReports = async () => {
    try {
      const response = await fetch(`${API_URL}/reports`);
      const data = await response.json();

      setSalesData(data);
    } catch (error) {
      console.error("Error fetching sales chart:", error);
    }
  };

  useEffect(() => {
    fetchSalesReports();
  }, []);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Sales Trend</CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />

            {/* Match your API keys */}
            <XAxis dataKey="date" stroke="#a3a3a3" />
            <YAxis stroke="#a3a3a3" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #262626",
                borderRadius: "8px",
                color: "#fafafa",
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#f97316"
              strokeWidth={2}
              name="Sales (₱)"
              dot={{ fill: "#f97316", r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              type="monotone"
              dataKey="transactions"
              stroke="#fb923c"
              strokeWidth={2}
              name="Transactions"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}