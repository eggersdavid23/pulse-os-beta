import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

export default function ToneChart({ data, title = "Tone Trends" }) {
  const chartData = data?.map(entry => ({
    date: format(new Date(entry.submission_time), 'MMM dd'),
    mood: entry.overall_mood === 'very_positive' ? 5 : 
          entry.overall_mood === 'positive' ? 4 :
          entry.overall_mood === 'neutral' ? 3 :
          entry.overall_mood === 'negative' ? 2 : 1,
    energy: entry.energy_level === 'very_high' ? 5 :
            entry.energy_level === 'high' ? 4 :
            entry.energy_level === 'moderate' ? 3 :
            entry.energy_level === 'low' ? 2 : 1,
    stress: entry.stress_level === 'very_low' ? 5 :
           entry.stress_level === 'low' ? 4 :
           entry.stress_level === 'moderate' ? 3 :
           entry.stress_level === 'high' ? 2 : 1
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-slate-900">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  domain={[1, 5]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#059669" 
                  strokeWidth={3}
                  dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                  name="Mood"
                />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#d97706" 
                  strokeWidth={3}
                  dot={{ fill: '#d97706', strokeWidth: 2, r: 4 }}
                  name="Energy"
                />
                <Line 
                  type="monotone" 
                  dataKey="stress" 
                  stroke="#1e293b" 
                  strokeWidth={3}
                  dot={{ fill: '#1e293b', strokeWidth: 2, r: 4 }}
                  name="Stress (Inverted)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
              <span className="text-slate-600">Mood</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-600"></div>
              <span className="text-slate-600">Energy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-800"></div>
              <span className="text-slate-600">Stress (Inverted)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}