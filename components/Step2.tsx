
import React from 'react';
import { motion } from 'framer-motion';
import type { StepProps } from '../types.ts';
import Slider from './ui/Slider.tsx';

const Step2: React.FC<StepProps> = ({ data, updateData, motionProps }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    updateData(id as keyof typeof data, parseFloat(value));
  };
  
  const tasks = [
    { id: 'leadGenHours', label: 'Lead Generation', min: 0, max: 50 },
    { id: 'followUpHours', label: 'Customer Follow-ups', min: 0, max: 40 },
    { id: 'dataEntryHours', label: 'Data Entry & Admin', min: 0, max: 30 },
    { id: 'schedulingHours', label: 'Scheduling & Coordination', min: 0, max: 25 },
    { id: 'reportingHours', label: 'Reporting & Analytics', min: 0, max: 20 },
    { id: 'emailHours', label: 'Email Management', min: 0, max: 25 },
  ];

  const totalWeeklyHours = tasks.reduce((sum, task) => sum + (data[task.id as keyof typeof data] as number), 0);

  return (
    <motion.div {...motionProps} className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-100">Analyze Manual Processes</h3>
        <p className="text-gray-400 mb-4">Estimate the hours per week your team spends on these tasks.</p>
        <div className="inline-block bg-brand-accent/20 text-brand-accent font-semibold py-2 px-5 rounded-full transition-all duration-300">
          Total Weekly Hours: <span className="font-bold">{totalWeeklyHours}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map(task => (
           <div key={task.id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 shadow-sm">
              <Slider
                id={task.id as keyof typeof data}
                label={`${task.label} (hrs/week)`}
                value={data[task.id as keyof typeof data] as number}
                min={task.min}
                max={task.max}
                onChange={handleInputChange}
              />
           </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Step2;