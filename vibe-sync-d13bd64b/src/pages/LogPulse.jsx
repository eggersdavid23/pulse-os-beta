import React, { useState } from "react";
import { ToneEntry } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Zap, Shield, Users, Target, MessageCircle } from "lucide-react";

export default function LogPulse() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employee_name: "",
    department: "",
    overall_mood: "",
    energy_level: "",
    stress_level: "",
    collaboration_feeling: "",
    productivity_feeling: "",
    notes: "",
    submission_time: new Date().toISOString()
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await ToneEntry.create(formData);
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error submitting pulse entry:", error);
    }
    
    setIsSubmitting(false);
  };

  const moodOptions = [
    { value: "very_positive", label: "😊 Very Positive", color: "text-emerald-600" },
    { value: "positive", label: "🙂 Positive", color: "text-green-600" },
    { value: "neutral", label: "😐 Neutral", color: "text-amber-600" },
    { value: "negative", label: "🙁 Negative", color: "text-orange-600" },
    { value: "very_negative", label: "😞 Very Negative", color: "text-red-600" }
  ];

  const energyOptions = [
    { value: "very_high", label: "⚡ Very High Energy", color: "text-emerald-600" },
    { value: "high", label: "🔋 High Energy", color: "text-green-600" },
    { value: "moderate", label: "🔋 Moderate Energy", color: "text-amber-600" },
    { value: "low", label: "🪫 Low Energy", color: "text-orange-600" },
    { value: "very_low", label: "🪫 Very Low Energy", color: "text-red-600" }
  ];

  const stressOptions = [
    { value: "very_low", label: "😌 Very Low Stress", color: "text-emerald-600" },
    { value: "low", label: "🙂 Low Stress", color: "text-green-600" },
    { value: "moderate", label: "😐 Moderate Stress", color: "text-amber-600" },
    { value: "high", label: "😰 High Stress", color: "text-orange-600" },
    { value: "very_high", label: "😫 Very High Stress", color: "text-red-600" }
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Log Your Daily Pulse</h1>
            <p className="text-slate-600 mt-1">Help us understand how you're feeling at work today</p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-600" />
                How are you feeling today?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee_name" className="text-slate-700 font-medium">
                      Your Name *
                    </Label>
                    <Input
                      id="employee_name"
                      value={formData.employee_name}
                      onChange={(e) => handleInputChange('employee_name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="border-slate-200 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-slate-700 font-medium">
                      Department *
                    </Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleInputChange('department', value)}
                      required
                    >
                      <SelectTrigger className="border-slate-200 focus:border-emerald-500">
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="customer_service">Customer Service</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Mood Metrics */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium flex items-center gap-2">
                      <Heart className="w-4 h-4 text-emerald-600" />
                      Overall Mood *
                    </Label>
                    <Select
                      value={formData.overall_mood}
                      onValueChange={(value) => handleInputChange('overall_mood', value)}
                      required
                    >
                      <SelectTrigger className="border-slate-200 focus:border-emerald-500">
                        <SelectValue placeholder="How are you feeling?" />
                      </SelectTrigger>
                      <SelectContent>
                        {moodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className={option.color}>{option.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      Energy Level *
                    </Label>
                    <Select
                      value={formData.energy_level}
                      onValueChange={(value) => handleInputChange('energy_level', value)}
                      required
                    >
                      <SelectTrigger className="border-slate-200 focus:border-emerald-500">
                        <SelectValue placeholder="Your energy level" />
                      </SelectTrigger>
                      <SelectContent>
                        {energyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className={option.color}>{option.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-600" />
                      Stress Level *
                    </Label>
                    <Select
                      value={formData.stress_level}
                      onValueChange={(value) => handleInputChange('stress_level', value)}
                      required
                    >
                      <SelectTrigger className="border-slate-200 focus:border-emerald-500">
                        <SelectValue placeholder="Your stress level" />
                      </SelectTrigger>
                      <SelectContent>
                        {stressOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className={option.color}>{option.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      Productivity Feeling
                    </Label>
                    <Select
                      value={formData.productivity_feeling}
                      onValueChange={(value) => handleInputChange('productivity_feeling', value)}
                    >
                      <SelectTrigger className="border-slate-200 focus:border-emerald-500">
                        <SelectValue placeholder="How productive do you feel?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="very_high">🎯 Very High</SelectItem>
                        <SelectItem value="high">🎯 High</SelectItem>
                        <SelectItem value="moderate">🎯 Moderate</SelectItem>
                        <SelectItem value="low">🎯 Low</SelectItem>
                        <SelectItem value="very_low">🎯 Very Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Collaboration */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    Team Collaboration
                  </Label>
                  <Select
                    value={formData.collaboration_feeling}
                    onValueChange={(value) => handleInputChange('collaboration_feeling', value)}
                  >
                    <SelectTrigger className="border-slate-200 focus:border-emerald-500">
                      <SelectValue placeholder="How do you feel about team collaboration?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">🤝 Excellent</SelectItem>
                      <SelectItem value="good">👥 Good</SelectItem>
                      <SelectItem value="fair">🤷 Fair</SelectItem>
                      <SelectItem value="poor">😕 Poor</SelectItem>
                      <SelectItem value="very_poor">😞 Very Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-indigo-600" />
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Share anything else about how you're feeling today..."
                    className="border-slate-200 focus:border-emerald-500 h-20"
                  />
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-medium"
                  >
                    {isSubmitting ? "Submitting..." : "Submit My Pulse Check-in"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}