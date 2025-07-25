
import { FormData } from './types';

export const INDUSTRY_OPTIONS = [
  { label: "General Business", value: 1.0 },
  { label: "Professional Services", value: 1.3 },
  { label: "E-commerce", value: 1.2 },
  { label: "Real Estate", value: 1.4 },
  { label: "Healthcare", value: 1.5 },
  { label: "Technology", value: 1.3 },
  { label: "Manufacturing", value: 1.2 },
  { label: "Financial Services", value: 1.6 },
  { label: "Marketing Agency", value: 1.4 },
];

export const INITIAL_FORM_DATA: FormData = {
  industry: 1.0,
  revenue: 250000,
  teamSize: 15,
  hourlyCost: 95,
  leadGenHours: 20,
  followUpHours: 16,
  dataEntryHours: 12,
  schedulingHours: 8,
  reportingHours: 6,
  emailHours: 10,
};

export const TOTAL_STEPS = 3;
