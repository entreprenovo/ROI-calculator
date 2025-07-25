import React from 'react';

export interface FormData {
  industry: number;
  revenue: number;
  teamSize: number;
  hourlyCost: number;
  leadGenHours: number;
  followUpHours: number;
  dataEntryHours: number;
  schedulingHours: number;
  reportingHours: number;
  emailHours: number;
}

export interface CalculationResults {
  totalMonthlyHours: number;
  monthlyWastedCost: number;
  hoursAutomated: number;
  monthlySavings: number;
  productivityGain: number;
  monthlyRevenueBoost: number;
  roi: number;
}

export interface ROICalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  config: {
    serviceCost: number;
    bookingUrl: string;
  };
}

export interface StepProps {
  data: FormData;
  updateData: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  motionProps: any;
}

export interface SliderProps {
  id: keyof FormData;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}