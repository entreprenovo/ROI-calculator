
import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Robot, Sparkle, Clock, CurrencyDollar, TrendUp, ChartBar, CalendarBlank } from 'phosphor-react';
import type { CalculationResults, FormData, ROICalculatorProps } from '../types.ts';
import AnimatedCounter from './ui/AnimatedCounter.tsx';
import { generateInsights } from '../services/geminiService.ts';

interface Step3Props {
  results: CalculationResults;
  formData: FormData;
  config: ROICalculatorProps['config'];
  motionProps: any;
}

const InsightSkeleton: React.FC = () => (
    <div className="mt-6 p-6 bg-gray-900/70 rounded-xl border border-brand-accent/30 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
          <Sparkle size={20} className="text-brand-accent"/>
          <div className="h-5 w-3/4 bg-gray-700 rounded"></div>
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="w-5 h-5 rounded-full bg-gray-700 flex-shrink-0 mt-1"></div>
            <div className="h-4 bg-gray-700 rounded w-full flex-grow"></div>
          </div>
        ))}
      </div>
    </div>
);


const PIE_CHART_COLORS = ['#8B5CF6', '#60a5fa', '#facc15', '#f87171', '#c084fc', '#818cf8'];
const BAR_CHART_COLORS = { manual: '#4b5563', automated: '#34D399' };

const Step3: React.FC<Step3Props> = ({ results, formData, config, motionProps }) => {
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleBookCall = () => {
    window.open(config.bookingUrl, '_blank');
  };

  const handleGenerateInsights = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const generatedText = await generateInsights(formData);
      setInsights(generatedText);
    } catch (e) {
      setError('Failed to generate insights. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const costData = useMemo(() => [
    { name: 'Manual Work Cost', Cost: results.monthlyWastedCost, fill: BAR_CHART_COLORS.manual },
    { name: 'Cost After Automation', Cost: results.monthlyWastedCost - results.monthlySavings, fill: BAR_CHART_COLORS.automated },
  ], [results.monthlyWastedCost, results.monthlySavings]);

  const timeData = useMemo(() => [
    { name: 'Lead Gen', value: formData.leadGenHours },
    { name: 'Follow-ups', value: formData.followUpHours },
    { name: 'Data Entry', value: formData.dataEntryHours },
    { name: 'Scheduling', value: formData.schedulingHours },
    { name: 'Reporting', value: formData.reportingHours },
    { name: 'Email Mgmt', value: formData.emailHours },
  ].filter(d => d.value > 0), [formData]);
  
  const metricCards = [
    { id: 'moneySaved', value: results.monthlySavings, label: "Monthly Cost Savings", prefix: "$", icon: CurrencyDollar, highlight: true },
    { id: 'revenueBoost', value: results.monthlyRevenueBoost, label: "Add. Revenue Potential", prefix: "$", icon: TrendUp, highlight: true },
    { id: 'timeSaved', value: results.hoursAutomated, label: "Hours Automated/Month", suffix: " hrs", icon: Clock, highlight: false },
    { id: 'productivityGain', value: results.productivityGain, label: "Productivity Increase", suffix: "%", icon: ChartBar, highlight: false },
  ];
  
  const tooltipStyle = { 
    backgroundColor: '#1f2937', 
    border: '1px solid #374151',
    zIndex: 1000 // Ensure tooltip is on top
  };
  const tooltipLabelStyle = { color: '#d1d5db' };
  const tooltipItemStyle = { color: '#d1d5db' };
  
  return (
    <motion.div {...motionProps}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-100">Your Automation ROI Potential</h3>
        <p className="text-gray-400">Here's how AI automation can transform your business.</p>
      </div>

      <div className="bg-gray-800/30 border border-purple-500/30 rounded-2xl p-6 md:p-10 text-center shadow-2xl shadow-purple-500/10 mb-8 relative overflow-hidden">
        <div className="absolute -inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_50%)]"></div>
        <div className="relative">
            <h4 className="text-lg font-medium text-purple-300 mb-2 tracking-wide">Stunning First-Year Return</h4>
            <div className="text-6xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-300 tracking-tighter">
                <AnimatedCounter from={0} to={results.roi === Infinity ? 10000 : results.roi} />%
            </div>
            <p className="mt-2 text-gray-400 max-w-md mx-auto">Based on your inputs, this is your potential ROI after implementing our AI solutions.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metricCards.map(metric => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center shadow-sm hover:bg-gray-800 hover:border-gray-600 transition-all duration-300">
              <Icon weight="bold" className={`mx-auto h-7 w-7 mb-2 ${metric.highlight ? 'text-brand-success' : 'text-brand-accent'}`} />
              <div className="text-2xl md:text-3xl font-bold text-white">
                <AnimatedCounter from={0} to={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
              </div>
              <div className="text-xs text-gray-400 mt-1">{metric.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-700/50">
          <h4 className="font-bold text-gray-300 mb-4 text-center">Monthly Cost: Manual vs. Automated</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={costData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} interval={0} tick={{ dy: 10 }} />
              <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `$${(value as number / 1000)}k`}/>
              <Tooltip cursor={{fill: 'rgba(55, 65, 81, 0.5)'}} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value as number)} />
              <Bar dataKey="Cost" radius={[4, 4, 0, 0]}>
                {costData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-700/50 relative">
           <h4 className="font-bold text-gray-300 mb-4 text-center">Weekly Hours Spent on Manual Tasks</h4>
           <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={timeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  return (percent as number) > 0.05 ? <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">{`${(percent * 100).toFixed(0)}%`}</text> : null;
                }}>
                  {timeData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} stroke="none" />)}
                </Pie>
                <Tooltip cursor={{fill: 'rgba(55, 65, 81, 0.5)'}} contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} formatter={(value, name) => [`${value} hrs/week`, name]} />
                <Legend iconSize={10} wrapperStyle={{fontSize: '12px', color: '#9ca3af'}}/>
              </PieChart>
           </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <p className="text-2xl font-bold text-white">{timeData.reduce((acc, item) => acc + item.value, 0)}</p>
                    <p className="text-xs text-gray-400">Total hrs/week</p>
                </div>
            </div>
        </div>
      </div>
      
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 shadow-sm">
        {!insights && !isLoading && !error && (
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="flex-shrink-0">
                 <Robot size={40} className="text-gray-200"/>
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-lg text-gray-100">Ready for the Next Step?</h4>
                <p className="text-gray-400">Generate your personalized AI strategy, or book a free call to discuss your automation potential.</p>
              </div>
              <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                 <button onClick={handleGenerateInsights} disabled={isLoading} className="w-full sm:w-auto bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-brand-accent/20 hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                    <Sparkle size={20} weight="bold" />
                    Generate AI Insights
                 </button>
                 <button onClick={handleBookCall} className="w-full sm:w-auto bg-brand-success hover:bg-brand-success-dark text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-green-500/20 hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                    <CalendarBlank size={20} weight="bold" />
                    Book a Free Consultation
                 </button>
              </div>
            </div>
        )}

        {isLoading && <InsightSkeleton />}
        
        {error && 
            <div className="text-center text-red-400 p-4">
                <p>{error}</p>
                <button onClick={handleGenerateInsights} className="mt-4 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition-all">
                    Try Again
                </button>
            </div>
        }

        {!isLoading && insights && (
            <>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h5 className="font-bold text-gray-200 mb-4 flex items-center gap-2 text-lg"><Sparkle size={20} weight="bold" className="text-brand-accent"/>Your Personalized Automation Strategy:</h5>
                  <div className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: insights }} />
                </motion.div>
                <div className="border-t border-gray-700/80 pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="flex-grow text-center md:text-left">
                        <h4 className="font-bold text-lg text-gray-100">Ready to unlock these results?</h4>
                        <p className="text-gray-400">Schedule a free, no-obligation consultation to get a detailed automation roadmap for your business.</p>
                      </div>
                      <div className="flex-shrink-0 w-full md:w-auto">
                         <button onClick={handleBookCall} className="w-full bg-brand-success hover:bg-brand-success-dark text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-green-500/20 hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                            <CalendarBlank size={20} weight="bold" />
                            Book a Free Consultation
                         </button>
                      </div>
                    </div>
                </div>
            </>
        )}
      </div>
    </motion.div>
  );
};

export default Step3;