
import { GoogleGenAI } from '@google/genai';
import type { FormData } from '../types.ts';
import { INDUSTRY_OPTIONS } from '../constants.ts';

const formatInsights = (text: string): string => {
  return text
    .split('\n')
    .map(line => line.trim().replace(/^\s*[-*]\s*/, '')) // remove leading bullet points
    .filter(line => line.length > 0)
    .map(line => `
      <div class="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 text-brand-success mt-1"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
        <p class="flex-grow">${line.replace(/^([^:]+):/, '<strong>$1:</strong>')}</p>
      </div>
    `)
    .join('');
};

export const generateInsights = async (data: FormData): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const industryName = INDUSTRY_OPTIONS.find(opt => opt.value === data.industry)?.label || 'General Business';
  const totalWeeklyHours = data.leadGenHours + data.followUpHours + data.dataEntryHours + data.schedulingHours + data.reportingHours + data.emailHours;
  
  const prompt = `
    You are a world-class business automation consultant and copywriter. A potential client from the "${industryName}" industry has provided data from an ROI calculator.
    Your task is to generate 3 short, compelling, and actionable bullet points (using markdown) that highlight the most impactful benefits of AI automation for them.
    
    **Instructions:**
    1.  **Be Persuasive & Benefit-Oriented:** Don't just state facts. Frame each point around a tangible business outcome (e.g., "Supercharge your sales pipeline...", "Unlock strategic growth...", "Elevate your customer experience...").
    2.  **Use Specific Data:** Weave in the client's data to make your points concrete and personalized. Mention specific hour savings or task names.
    3.  **Keep it Concise:** Each bullet point should be a single, powerful sentence.
    4.  **Format:** Start each line with a hyphen (-). Do not include any introductory or concluding text, just the bullet points. Bold key phrases or numbers using markdown's **bold**.

    **Client Data:**
    - Industry: ${industryName}
    - Monthly Revenue: $${data.revenue.toLocaleString()}
    - Team Size: ${data.teamSize}
    - Total manual hours per week on repetitive tasks: ${totalWeeklyHours} hours
    - Key Tasks & Hours/Week:
      - Lead Generation: ${data.leadGenHours} hrs
      - Customer Follow-ups: ${data.followUpHours} hrs
      - Data Entry & Admin: ${data.dataEntryHours} hrs
      - Scheduling: ${data.schedulingHours} hrs

    **Example Output:**
    - Reclaim **${data.leadGenHours + data.followUpHours} hours/week** from lead generation and follow-ups to let your sales team focus exclusively on closing deals and building relationships.
    - Eliminate **${data.dataEntryHours + data.schedulingHours} hours/week** of tedious administrative work, boosting team morale and unlocking more time for high-value strategic planning.
    - Enhance your client experience by automating routine communications, ensuring lightning-fast responses that build loyalty and drive repeat business.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return formatInsights(response.text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the AI service.");
  }
};