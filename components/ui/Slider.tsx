
import React from 'react';
import type { SliderProps } from '../../types.ts';

const Slider: React.FC<SliderProps> = ({ id, label, value, min, max, step = 1, unit = '', onChange }) => {
  const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;
  
  const sliderStyle: React.CSSProperties = {
    background: `linear-gradient(to right, #8B5CF6 ${percentage}%, #374151 ${percentage}%)`,
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="text-sm font-medium text-gray-300">{label}</label>
        <span className={`text-sm font-semibold px-2 py-1 rounded-md bg-gray-700/80 text-gray-100`}>
          {unit}{value.toLocaleString()}
        </span>
      </div>
      <input
        type="range"
        id={id}
        name={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        style={sliderStyle}
        className="w-full h-2.5 rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-6
                   [&::-webkit-slider-thumb]:h-6
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-white
                   [&::-webkit-slider-thumb]:shadow-md
                   [&::-webkit-slider-thumb]:ring-2
                   [&::-webkit-slider-thumb]:ring-offset-0
                   [&::-webkit-slider-thumb]:ring-purple-500/50
                   [&::-moz-range-thumb]:appearance-none
                   [&::-moz-range-thumb]:w-6
                   [&::-moz-range-thumb]:h-6
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-white
                   [&::-moz-range-thumb]:shadow-md
                   [&::-moz-range-thumb]:border-2
                   [&::-moz-range-thumb]:border-purple-500/50"
      />
    </div>
  );
};

export default Slider;