import React, { useState, useEffect } from "react";
import { ToneEntry } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Heart, Zap, Shield, Users, TrendingUp, Brain } from "lucide-react";
import { motion } from "framer-motion";

import MetricCard from "../components/dashboard/MetricCard";
import ToneChart from "../components/dashboard/ToneChart";
import RecentEntries from "../components/dashboard/RecentEntries";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const data = await ToneEntry.list("-submission_time", 50);
      setEntries(data);
    } catch (error) {
      console.error("Error loading entries:", error);
    }
    setIsLoading(false);
  };

  // Calculate metrics
  const todayEntries = entries.filter(entry => {
    const today = new Date().toDateString();
    const entryDate = new Date(entry.submission_time).toDateString();
    return today === entryDate;
  });

  const averageMood = entries.length > 0 
    ? entries.reduce((sum, entry) => {
        const moodValue = entry.overall_mood === 'very_positive' ? 5 : 
                         entry.overall_mood === 'positive' ? 4 :
                         entry.overall_mood === 'neutral' ? 3 :
                         entry.overall_mood === 'negative' ? 2 : 1;
        return sum + moodValue;
      }, 0) / entries.length
    : 0;

  const averageEnergy = entries.length > 0
    ? entries.reduce((sum, entry) => {
        const energyValue = entry.energy_level === 'very_high' ? 5 :
                           entry.energy_level === 'high' ? 4 :
                           entry.energy_level === 'moderate' ? 3 :
                           entry.energy_level === 'low' ? 2 : 1;
        return sum + energyValue;
      }, 0) / entries.length
    : 0;

  const averageStress = entries.length > 0
    ? entries.reduce((sum, entry) => {
        const stressValue = entry.stress_level === 'very_low' ? 1 :
                           entry.stress_level === 'low' ? 2 :
                           entry.stress_level === 'moderate' ? 3 :
                           entry.stress_level === 'high' ? 4 : 5;
        return sum + stressValue;
      }, 0) / entries.length
    : 0;

  const uniqueEmployees = new Set(entries.map(entry => entry.employee_name)).size;

  const getMoodLabel = (score) => {
    if (score >= 4.5) return "Excellent";
    if (score >= 3.5) return "Good";
    if (score >= 2.5) return "Fair";
    if (score >= 1.5) return "Poor";
    return "Critical";
  };

  const getEnergyLabel = (score) => {
    if (score >= 4.5) return "Very High";
    if (score >= 3.5) return "High";
    if (score >= 2.5) return "Moderate";
    if (score >= 1.5) return "Low";
    return "Very Low";
  };

  const getStressLabel = (score) => {
    if (score <= 1.5) return "Very Low";
    if (score <= 2.5) return "Low";
    if (score <= 3.5) return "Moderate";
    if (score <= 4.5) return "High";
    return "Critical";
  };

  const getStressColor = (score) => {
    if (score <= 2.5) return "emerald";
    if (score <= 3.5) return "amber";
    return "red";
  };

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Workplace Pulse</h1>
            <p className="text-slate-600">Monitor your team's mood, energy, and overall atmosphere</p>
          </div>
          <Link to={createPageUrl("LogPulse")}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Log Team Pulse
            </Button>
          </Link>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Team Mood"
            value={averageMood > 0 ? getMoodLabel(averageMood) : "--"}
            subtitle={averageMood > 0 ? `${averageMood.toFixed(1)}/5.0` : "No data"}
            icon={Heart}
            color="emerald"
            delay={0.1}
          />
          <MetricCard
            title="Energy Level"
            value={averageEnergy > 0 ? getEnergyLabel(averageEnergy) : "--"}
            subtitle={averageEnergy > 0 ? `${averageEnergy.toFixed(1)}/5.0` : "No data"}
            icon={Zap}
            color="amber"
            delay={0.2}
          />
          <MetricCard
            title="Stress Level"
            value={averageStress > 0 ? getStressLabel(averageStress) : "--"}
            subtitle={averageStress > 0 ? `${averageStress.toFixed(1)}/5.0` : "No data"}
            icon={Shield}
            color={averageStress > 0 ? getStressColor(averageStress) : "slate"}
            delay={0.3}
          />
          <MetricCard
            title="Active Team"
            value={uniqueEmployees > 0 ? uniqueEmployees : "--"}
            subtitle={`${todayEntries.length} check-ins today`}
            icon={Users}
            color="blue"
            delay={0.4}
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ToneChart data={entries.slice(0, 10)} title="Pulse Trends" />
          </div>
          <div>
            <RecentEntries entries={entries} isLoading={isLoading} />
          </div>
        </div>

        {/* Insights Section */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 text-white"
          >
            <div className="flex items-start gap-4">
              <Brain className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-3">Pulse Insights</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-300 mb-2">Most Active Department:</p>
                    <p className="font-medium text-emerald-400">
                      {entries.length > 0 
                        ? Object.entries(
                            entries.reduce((acc, entry) => {
                              acc[entry.department] = (acc[entry.department] || 0) + 1;
                              return acc;
                            }, {})
                          ).sort(([,a], [,b]) => b - a)[0]?.[0]?.replace(/_/g, ' ') || "N/A"
                        : "N/A"
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-300 mb-2">Overall Trend:</p>
                    <p className="font-medium text-emerald-400">
                      {averageMood >= 3.5 ? "Positive Workplace Environment" :
                       averageMood >= 2.5 ? "Stable Team Morale" :
                       "Needs Attention"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}