import React, { useEffect, useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = {
  low: "#34D399",
  medium: "#FBBF24",
  high: "#F87171",
};

const mapLabel = (key) => {
  if (key === "low") return "Scăzut";
  if (key === "medium") return "Medie";
  if (key === "high") return "Ridicat";
  return key;
};

const TrafficOverview = () => {
  const [dataVeh, setDataVeh] = useState([]);
  const [dataPed, setDataPed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "http://127.0.0.1:8003/api/v1/traffic/snapshots",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const vehCounts = { low: 0, medium: 0, high: 0 };
      const pedCounts = { low: 0, medium: 0, high: 0 };
      data.forEach((s) => {
        vehCounts[s.veh_level] += 1;
        pedCounts[s.ped_level] += 1;
      });

      setDataVeh(
        Object.entries(vehCounts).map(([key, value]) => ({
          key,
          name: mapLabel(key),
          value,
        }))
      );
      setDataPed(
        Object.entries(pedCounts).map(([key, value]) => ({
          key,
          name: mapLabel(key),
          value,
        }))
      );
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <Typography className="text-white text-center py-10">
        Loading stats...
      </Typography>
    );

  return (
    <div className="w-screen bg-gray-900 p-16" >
    <Card className="bg-gray-900 p-6 rounded-2xl shadow-xl max-w-4xl mx-auto space-y-6">
      <Typography variant="h5" className="text-white text-center mb-4">
        Overview Trafic & Aglomerare
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Trafic Auto", data: dataVeh },
          { title: "Aglomerare Pietonală", data: dataPed },
        ].map((chart, i) => (
          <div key={i} className="bg-gray-800 p-4 rounded-lg flex flex-col">
            <Typography className="text-gray-300 text-center mb-2">
              {chart.title}
            </Typography>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 24, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={chart.data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="25%"
                    outerRadius="60%"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {chart.data.map((entry) => (
                      <Cell key={entry.key} fill={COLORS[entry.key]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, mapLabel(name)]}
                    contentStyle={{ background: "#1F2937", border: "none" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend
                    formatter={(value) => mapLabel(value)}
                    verticalAlign="bottom"
                    wrapperStyle={{ color: "#9CA3AF", fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </Card>
    </div>
  );
};

export default TrafficOverview;
