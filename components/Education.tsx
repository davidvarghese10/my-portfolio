import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Calendar, MapPin, Building2, CheckCircle2, TrendingUp, Sparkles, BookCheck } from 'lucide-react';

interface EducationItem {
  id: string;
  degree: string;
  field?: string;
  institute: string;
  location: string;
  year: string;
  level: string;
  board?: string;
  metrics: {
    label: string;
    value: string;
    highlight?: boolean;
  }[];
  featured?: boolean;
}

const EDUCATION_DATA: EducationItem[] = [
  {
    id: "btech",
    degree: "Bachelor of Technology (B.Tech)",
    field: "Computer Science & Engineering (CSE)",
    institute: "Rajagiri School of Engineering & Technology",
    location: "Kakkanad, Kochi, Kerala",
    year: "2025 — 2029",
    level: "Undergraduate Degree",
    metrics: [
      { label: "Semester 1 (S1) SGPA", value: "10.00 / 10.00", highlight: true },
      { label: "Semester 2 (S2) SGPA", value: "10.00 / 10.00", highlight: true }
    ],
    featured: true
  },
  {
    id: "xii",
    degree: "Higher Secondary Education (Class XII)",
    field: "Computer Science (with Maths) Stream",
    institute: "Devamatha CMI Public School",
    location: "Thrissur, Kerala",
    year: "2023 — 2025",
    level: "Senior Secondary (XII)",
    board: "CBSE",
    metrics: [
      { label: "Board Percentage", value: "96.0%", highlight: true },
      { label: "Board", value: "CBSE" }
    ]
  },
  {
    id: "x",
    degree: "High School Education (Class X)",
    institute: "CMI Public School",
    location: "Chalakudy, Kerala",
    year: "2022 — 2023",
    level: "Secondary School (X)",
    board: "CBSE",
    metrics: [
      { label: "Board Percentage", value: "97.6%", highlight: true },
      { label: "Board", value: "CBSE" }
    ]
  }
];

const ACADEMIC_PILLARS = [
  {
    icon: Sparkles,
    title: "Perfect SGPA Record",
    description: "Achieved a flawless 10.00 / 10.00 SGPA across both Semester 1 and Semester 2 in B.Tech CSE at Rajagiri."
  },
  {
    icon: Award,
    title: "CBSE Board Distinctions",
    description: "Secured top-tier percentiles with 96.0% in Class XII (Devamatha CMI) and 97.6% in Class X (CMI Public School)."
  },
  {
    icon: TrendingUp,
    title: "Algorithmic & Engineering Focus",
    description: "Combining consistent academic distinction with rigorous real-world software architecture and cybersecurity defense."
  }
];

const Education: React.FC = () => {
  return (
    <div 
      id="education" 
      className="pt-36 pb-24 px-6 md:px-12 bg-transparent relative z-10 min-h-screen flex flex-col justify-between"
    >
      <div className="max-w-[90vw] mx-auto w-full">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-neutral-800 pb-8"
        >
          <div>
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#00f3ff] mb-4 flex items-center gap-2">
              <GraduationCap size={14} className="text-[#00f3ff]" />
              // Academic Background &bull; Higher Studies
            </span>
            <h2 className="liquid-glass-text text-5xl md:text-8xl font-bold uppercase tracking-tighter">
              Academic<br/>Journey
            </h2>
          </div>
          <div className="text-left md:text-right">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 block mb-1">
              (2022 — 2029)
            </span>
            <span className="text-[11px] font-mono text-[#00f3ff]/80">
              Rajagiri School of Engineering &amp; Technology
            </span>
          </div>
        </motion.div>

        {/* Education Timeline / Cards Stack */}
        <div className="space-y-8 mb-16">
          {EDUCATION_DATA.map((edu, idx) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: idx * 0.12 }}
              className={`relative bg-black/40 backdrop-blur-xl border rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden transition-all ${
                edu.featured
                  ? 'border-[#00f3ff]/30 hover:border-[#00f3ff]/60 bg-gradient-to-br from-black/60 via-black/40 to-[#00f3ff]/5'
                  : 'border-white/10 hover:border-white/20 hover:bg-black/60'
              }`}
            >
              {/* Subtle ambient glow for featured card */}
              {edu.featured && (
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f3ff]/10 rounded-full blur-3xl pointer-events-none" />
              )}

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* Left Side: Qualification Details */}
                <div className="space-y-4 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                      edu.featured
                        ? 'text-black bg-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                        : 'text-[#00f3ff] bg-[#00f3ff]/10 border border-[#00f3ff]/20'
                    }`}>
                      {edu.level}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                      <Calendar size={13} className="text-[#00f3ff]" />
                      {edu.year}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                      <MapPin size={13} className="text-[#00f3ff]" />
                      {edu.location}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-4xl font-bold font-poppins text-white tracking-tight leading-tight">
                      {edu.degree}
                    </h3>
                    {edu.field && (
                      <p className="text-lg md:text-xl text-[#00f3ff] font-light mt-1">
                        {edu.field}
                      </p>
                    )}
                  </div>

                  {/* Institute Name */}
                  <div className="flex items-center gap-2 text-sm md:text-base font-mono text-neutral-300 pt-1">
                    <Building2 size={16} className="text-[#00f3ff] shrink-0" />
                    <span className="font-semibold text-white">{edu.institute}</span>
                  </div>
                </div>

                {/* Right Side: Performance Score / SGPA Box */}
                <div className="flex flex-wrap lg:flex-col items-stretch gap-3 shrink-0 lg:min-w-[240px]">
                  {edu.metrics.map((metric, mIdx) => (
                    <div 
                      key={mIdx}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-center flex-1 lg:flex-none"
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                        {metric.label}
                      </span>
                      <span className={`text-xl md:text-2xl font-bold font-mono ${
                        metric.highlight ? 'text-[#00f3ff]' : 'text-white'
                      }`}>
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Academic Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACADEMIC_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                className="p-6 md:p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#00f3ff]/30 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#00f3ff]/10 border border-[#00f3ff]/20 flex items-center justify-center mb-6">
                  <Icon size={22} className="text-[#00f3ff]" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2 font-poppins">
                  {pillar.title}
                </h4>
                <p className="text-xs md:text-sm text-neutral-400 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Footer */}
      <div className="max-w-[90vw] mx-auto w-full mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs font-mono text-neutral-600">
        <p>&copy; 2026 David Varghese</p>
        <p className="text-neutral-500">Rajagiri School of Engineering &amp; Technology &bull; CSE</p>
      </div>
    </div>
  );
};

export default Education;

