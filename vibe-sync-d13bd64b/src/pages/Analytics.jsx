
import React, { useState, useEffect } from "react";
import { ToneEntry } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Users, Calendar, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format, subDays, isAfter } from "date-fns";

export default function Analytics() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("7d");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const data = await ToneEntry.list("-submission_time", 100);
      setEntries(data);
    } catch (error) {
      console.error("Error loading entries:", error);
    }
    setIsLoading(false);
  };

  const getFilteredEntries = () => {
    let filtered = [...entries];
    
    // Time filter
    const now = new Date();
    let cutoffDate;
    switch (timeFilter) {
      case "1d": cutoffDate = subDays(now, 1); break;
      case "7d": cutoffDate = subDays(now, 7); break;
      case "30d": cutoffDate = subDays(now, 30); break;
      default: cutoffDate = subDays(now, 7);
    }
    filtered = filtered.filter(entry => isAfter(new Date(entry.submission_time), cutoffDate));
    
    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter(entry => entry.department === departmentFilter);
    }
    
    return filtered;
  };

  const getDepartmentData = () => {
    const filtered = getFilteredEntries();
    const deptCounts = {};
    const deptMoods = {};
    
    filtered.forEach(entry => {
      const dept = entry.department;
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
      
      const moodValue = entry.overall_mood === 'very_positive' ? 5 : 
                       entry.overall_mood === 'positive' ? 4 :
                       entry.overall_mood === 'neutral' ? 3 :
                       entry.overall_mood === 'negative' ? 2 : 1;
      
      if (!deptMoods[dept]) deptMoods[dept] = [];
      deptMoods[dept].push(moodValue);
    });
    
    return Object.keys(deptCounts).map(dept => ({
      department: dept.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count: deptCounts[dept],
      avgMood: deptMoods[dept].reduce((a, b) => a + b, 0) / deptMoods[dept].length
    }));
  };

  const getMoodDistribution = () => {
    const filtered = getFilteredEntries();
    const moodCounts = {
      'Very Positive': 0,
      'Positive': 0,
      'Neutral': 0,
      'Negative': 0,
      'Very Negative': 0
    };
    
    filtered.forEach(entry => {
      switch (entry.overall_mood) {
        case 'very_positive': moodCounts['Very Positive']++; break;
        case 'positive': moodCounts['Positive']++; break;
        case 'neutral': moodCounts['Neutral']++; break;
        case 'negative': moodCounts['Negative']++; break;
        case 'very_negative': moodCounts['Very Negative']++; break;
      }
    });
    
    return Object.entries(moodCounts).map(([name, value]) => ({ name, value }));
  };

  const getTimeSeriesData = () => {
    const filtered = getFilteredEntries();
    const dailyData = {};
    
    filtered.forEach(entry => {
      const date = format(new Date(entry.submission_time), 'MMM dd');
      if (!dailyData[date]) {
        dailyData[date] = { date, moods: [], energy: [], stress: [] };
      }
      
      const moodValue = entry.overall_mood === 'very_positive' ? 5 : 
                       entry.overall_mood === 'positive' ? 4 :
                       entry.overall_mood === 'neutral' ? 3 :
                       entry.overall_mood === 'negative' ? 2 : 1;
      
      const energyValue = entry.energy_level === 'very_high' ? 5 :
                         entry.energy_level === 'high' ? 4 :
                         entry.energy_level === 'moderate' ? 3 :
                         entry.energy_level === 'low' ? 2 : 1;
      
      const stressValue = entry.stress_level === 'very_low' ? 1 :
                         entry.stress_level === 'low' ? 2 :
                         entry.stress_level === 'moderate' ? 3 :
                         entry.stress_level === 'high' ? 4 : 5;
      
      dailyData[date].moods.push(moodValue);
      dailyData[date].energy.push(energyValue);
      dailyData[date].stress.push(stressValue);
    });
    
    return Object.values(dailyData).map(day => ({
      date: day.date,
      mood: day.moods.reduce((a, b) => a + b, 0) / day.moods.length,
      energy: day.energy.reduce((a, b) => a + b, 0) / day.energy.length,
      stress: day.stress.reduce((a, b) => a + b, 0) / day.stress.length
    })).slice(-7);
  };

  const COLORS = ['#059669', '#10b981', '#fbbf24', '#f59e0b', '#ef4444'];

  const departmentData = getDepartmentData();
  const moodDistribution = getMoodDistribution();
  const timeSeriesData = getTimeSeriesData();
  const uniqueDepartments = [...new Set(entries.map(e => e.department))];

  return (
    <div className="p-6 md:p-8 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
                Advanced Analytics
              </h1>
              <p className="text-slate-600 mt-1">Deep insights into your workplace pulse patterns</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last Day</SelectItem>
                <SelectItem value="7d">Last Week</SelectItem>
                <SelectItem value="30d">Last Month</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {uniqueDepartments.map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Mood Distribution */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                      Mood Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={moodDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                          >
                            {moodDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4 text-sm">
                      {moodDistribution.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-slate-600">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Time Series */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-amber-600" />
                      Daily Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={timeSeriesData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                          <YAxis stroke="#64748b" fontSize={12} domain={[1, 5]} />
                          <Tooltip />
                          <Bar dataKey="mood" fill="#059669" name="Mood" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Department Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" stroke="#64748b" fontSize={12} />
                        <YAxis dataKey="department" type="category" stroke="#64748b" fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="avgMood" fill="#059669" name="Average Mood" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Comprehensive Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} domain={[1, 5]} />
                        <Tooltip />
                        <Bar dataKey="mood" fill="#059669" name="Mood" />
                        <Bar dataKey="energy" fill="#d97706" name="Energy" />
                        <Bar dataKey="stress" fill="#ef4444" name="Stress" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
