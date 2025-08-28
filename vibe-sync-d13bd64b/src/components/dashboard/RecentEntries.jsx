import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, User, Building2 } from "lucide-react";

export default function RecentEntries({ entries, isLoading }) {
  const moodColors = {
    very_positive: "bg-emerald-100 text-emerald-800 border-emerald-200",
    positive: "bg-green-100 text-green-800 border-green-200", 
    neutral: "bg-amber-100 text-amber-800 border-amber-200",
    negative: "bg-orange-100 text-orange-800 border-orange-200",
    very_negative: "bg-red-100 text-red-800 border-red-200"
  };

  const moodLabels = {
    very_positive: "Excellent",
    positive: "Good",
    neutral: "Neutral", 
    negative: "Poor",
    very_negative: "Very Poor"
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-slate-900">Recent Check-ins</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {!isLoading && entries?.length > 0 ? (
              entries.slice(0, 5).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{entry.employee_name}</span>
                        <Badge variant="outline" className="text-xs">
                          <Building2 className="w-3 h-3 mr-1" />
                          {entry.department}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {format(new Date(entry.submission_time), 'MMM dd, h:mm a')}
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-slate-600 italic">"{entry.notes}"</p>
                      )}
                    </div>
                    <Badge className={moodColors[entry.overall_mood] + " border"}>
                      {moodLabels[entry.overall_mood]}
                    </Badge>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">No check-ins yet today</p>
                <p className="text-sm text-slate-400 mt-1">Entries will appear here as your team logs their mood</p>
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}