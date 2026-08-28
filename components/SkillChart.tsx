import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { SKILLS_DATA } from '../constants';
import { motion } from 'framer-motion';

const SkillChart: React.FC = () => {
  return (
    <div className="w-full h-[400px] bg-transparent rounded-lg p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={SKILLS_DATA}>
            <PolarGrid stroke="#333333" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#a3a3a3', fontSize: 11, fontWeight: 500 }} 
            />
            <Radar
              name="Skills"
              dataKey="A"
              stroke="#00f3ff"
              strokeWidth={2}
              fill="#00f3ff"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default SkillChart;