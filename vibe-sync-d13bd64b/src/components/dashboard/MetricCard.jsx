import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = "emerald", 
  trend,
  delay = 0 
}) {
  const colorClasses = {
    emerald: "from-emerald-500 to-emerald-600 text-emerald-600 bg-emerald-50",
    amber: "from-amber-500 to-amber-600 text-amber-600 bg-amber-50",
    slate: "from-slate-500 to-slate-600 text-slate-600 bg-slate-50",
    blue: "from-blue-500 to-blue-600 text-blue-600 bg-blue-50",
    red: "from-red-500 to-red-600 text-red-600 bg-red-50"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                {title}
              </p>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                {subtitle && (
                  <p className="text-sm text-slate-600">{subtitle}</p>
                )}
              </div>
              {trend && (
                <p className={`text-xs font-medium ${trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {trend.value}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-xl ${colorClasses[color].split(' ')[2]} ${colorClasses[color].split(' ')[3]}`}>
              <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[1]}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}