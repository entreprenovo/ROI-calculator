
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'phosphor-react';
import type { ROICalculatorProps, FormData, CalculationResults } from '../types.ts';
import { INITIAL_FORM_DATA, TOTAL_STEPS } from '../constants.ts';
import Step1 from './Step1.tsx';
import Step2 from './Step2.tsx';
import Step3 from './Step3.tsx';

const ROICalculator: React.FC<ROICalculatorProps> = ({ isOpen, onClose, config }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [results, setResults] = useState<CalculationResults | null>(null);

  const updateData = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setCurrentStep(1);
        setFormData(INITIAL_FORM_DATA);
        setResults(null);
      }, 300); // Wait for closing animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const calculateROI = useCallback(() => {
    const { industry, revenue, teamSize, hourlyCost, leadGenHours, followUpHours, dataEntryHours, schedulingHours, reportingHours, emailHours } = formData;
    const totalWeeklyHours = leadGenHours + followUpHours + dataEntryHours + schedulingHours + reportingHours + emailHours;
    const totalMonthlyHours = totalWeeklyHours * 4.33;
    const monthlyWastedCost = totalMonthlyHours * hourlyCost;
    const automationEfficiency = 0.8;
    const hoursAutomated = Math.round(totalMonthlyHours * automationEfficiency);
    const monthlySavings = hoursAutomated * hourlyCost;
    const productivityGain = totalMonthlyHours > 0 ? Math.round((hoursAutomated / totalMonthlyHours) * 100 * 1.2) : 0;
    const revenueBoostPercentage = industry * 0.15;
    const monthlyRevenueBoost = revenue * revenueBoostPercentage;
    const totalMonthlyBenefit = monthlySavings + monthlyRevenueBoost;
    const annualBenefit = totalMonthlyBenefit * 12;
    const annualCost = config.serviceCost;
    const roi = annualCost > 0 ? Math.round(((annualBenefit - annualCost) / annualCost) * 100) : Infinity;

    setResults({ totalMonthlyHours, monthlyWastedCost, hoursAutomated, monthlySavings, productivityGain, monthlyRevenueBoost, roi });
  }, [formData, config.serviceCost]);

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      if (currentStep === TOTAL_STEPS - 1) {
        calculateROI();
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const stepMotionProps = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.4, ease: "easeInOut" }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={handleClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[95vh] md:max-h-[90vh] flex flex-col overflow-hidden text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="p-4 sm:p-6 text-center border-b border-gray-700/80 relative">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-100">Your Personalized ROI Analysis</h2>
              <p className="text-sm sm:text-base text-gray-400 mt-1">Just a few steps to quantify your potential.</p>
              <button onClick={handleClose} aria-label="Close" className="absolute top-3 right-3 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700/50 transition-colors">
                <X size={24} weight="bold" />
              </button>
            </header>
            
            <div className="px-4 sm:px-8 pt-6">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="bg-brand-accent h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>
            </div>

            <main className="flex-grow overflow-y-auto p-4 sm:p-8">
              <AnimatePresence mode="wait">
                {currentStep === 1 && <Step1 key="step1" data={formData} updateData={updateData} motionProps={stepMotionProps} />}
                {currentStep === 2 && <Step2 key="step2" data={formData} updateData={updateData} motionProps={stepMotionProps} />}
                {currentStep === 3 && results && <Step3 key="step3" results={results} formData={formData} config={config} motionProps={stepMotionProps} />}
              </AnimatePresence>
            </main>

            {currentStep < TOTAL_STEPS && (
              <footer className="p-4 sm:p-6 border-t border-gray-700/80 flex justify-between items-center bg-gray-900/70">
                <button 
                  onClick={prevStep} 
                  disabled={currentStep === 1} 
                  className="p-3 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all" 
                  aria-label="Previous step"
                >
                  <ArrowLeft size={24} weight="bold" />
                </button>
                <button 
                  onClick={nextStep} 
                  className="bg-brand-accent hover:bg-brand-accent-dark text-white font-semibold py-3 px-8 rounded-full shadow-md shadow-brand-accent/20 transform hover:-translate-y-0.5 transition-all"
                >
                  {currentStep === TOTAL_STEPS - 1 ? 'Calculate ROI' : 'Next Step'}
                </button>
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ROICalculator;