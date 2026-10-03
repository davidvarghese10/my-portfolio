import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { SKILLS_DATA } from '../constants';
import { motion } from 'framer-motion';

const SkillChart: React.FC = () => {
  return (
    <div className="w-full h-[380px] md:h-[420px] bg-transparent rounded-lg p-2 select-none relative">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full relative z-10"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="68%" data={SKILLS_DATA}>
            <PolarGrid stroke="#00f3ff" strokeOpacity={0.25} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#ffffff', fontSize: 11, fontWeight: 600 }} 
            />
            <Radar
              name="Skills"
              dataKey="A"
              stroke="#00f3ff"
              strokeWidth={2.4}
              fill="#00f3ff"
              fillOpacity={0.3}
              dot={{ r: 3.5, fill: '#00f3ff', stroke: '#ffffff', strokeWidth: 1.5 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default SkillChart;