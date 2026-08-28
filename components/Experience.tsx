import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Building2, CheckCircle2, Award, Sparkles, ExternalLink, Laptop, ShieldCheck } from 'lucide-react';

interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  collaboration: string;
  type: string;
  duration: string;
  location: string;
  summary: string;
  highlights: string[];
  skills: string[];
  featured?: boolean;
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: "edunet-ibm",
    role: "Technical Intern",
    organization: "Edunet Foundation",
    collaboration: "In collaboration with IBM SkillsBuild",
    type: "4-Week Internship",
    duration: "4 Weeks",
    location: "Virtual / Remote, India",
    summary: "Completed an intensive 4-week industry-oriented technical internship program powered by Edunet Foundation in collaboration with IBM SkillsBuild, focusing on foundational emerging technologies, cloud workflows, and real-world problem solving.",
    highlights: [
      "Engaged in hands-on industry curriculum covering modern software paradigms, artificial intelligence concepts, and cloud computing principles.",
      "Completed practical project modules and technical evaluations administered through the IBM SkillsBuild learning ecosystem.",
      "Collaborated with peers and industry mentors to analyze real-world case studies and implement technical problem-solving workflows."
    ],
    skills: ["IBM SkillsBuild", "Cloud Computing", "AI Foundations", "Technical Problem Solving", "Software Paradigms", "Collaborative Engineering"],
    featured: true
  }
];

const Experience: React.FC = () => {
  return (
    <div className="pt-28 md:pt-36 pb-24 px-6 md:px-12 flex flex-col justify-between min-h-[calc(100vh-100px)]">
      <div className="max-w-[90vw] mx-auto w-full">
        {/* Header / Intro */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#00f3ff] mb-2">
              <Briefcase size={14} className="text-[#00f3ff]" />
              Work &amp; Industry Exposure
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-poppins text-white tracking-tight">
              Experience
            </h2>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 block mb-1">
              (Industry Internships)
            </span>
            <span className="text-[11px] font-mono text-[#00f3ff]/80">
              Edunet Foundation &bull; IBM SkillsBuild
            </span>
          </div>
        </motion.div>

        {/* Experience Timeline / Cards */}
        <div className="space-y-8 mb-16">
          {EXPERIENCES.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: idx * 0.12 }}
              className={`relative bg-black/40 backdrop-blur-xl border rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden transition-all ${
                exp.featured
                  ? 'border-[#00f3ff]/30 hover:border-[#00f3ff]/60 bg-gradient-to-br from-black/60 via-black/40 to-[#00f3ff]/5'
                  : 'border-white/10 hover:border-white/20 hover:bg-black/60'
              }`}
            >
              {/* Subtle ambient glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f3ff]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Badges & Meta */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                    {exp.type}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                    <Calendar size={13} className="text-[#00f3ff]" />
                    {exp.duration}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                    <MapPin size={13} className="text-[#00f3ff]" />
                    {exp.location}
                  </span>
                </div>

                {/* Role & Org */}
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-4xl font-bold font-poppins text-white tracking-tight leading-tight">
                    {exp.role}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-base md:text-lg font-medium text-neutral-200">
                    <div className="flex items-center gap-2">
                      <Building2 size={18} className="text-[#00f3ff] shrink-0" />
                      <span className="text-white font-semibold">{exp.organization}</span>
                    </div>
                    <span className="hidden sm:inline text-neutral-600">&bull;</span>
                    <span className="text-[#00f3ff] font-light">
                      {exp.collaboration}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-neutral-300 text-sm md:text-base leading-relaxed max-w-4xl">
                  {exp.summary}
                </p>

                {/* Key Highlights */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#00f3ff]">
                    Key Takeaways &amp; Contributions:
                  </h4>
                  <ul className="space-y-2.5">
                    {exp.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-3 text-xs md:text-sm text-neutral-300">
                        <CheckCircle2 size={16} className="text-[#00f3ff] shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech & Skills Pill Tags */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex flex-wrap items-center gap-2">
                    {exp.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-neutral-300 hover:border-[#00f3ff]/40 hover:text-white transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Milestone / Recognition Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 md:p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#00f3ff]/30 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#00f3ff]/10 border border-[#00f3ff]/20 flex items-center justify-center mb-6">
              <Laptop size={22} className="text-[#00f3ff]" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 font-poppins">Industry Collaboration</h4>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
              Curated by Edunet Foundation in direct partnership with IBM SkillsBuild for applied technical training.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 md:p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#00f3ff]/30 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#00f3ff]/10 border border-[#00f3ff]/20 flex items-center justify-center mb-6">
              <Sparkles size={22} className="text-[#00f3ff]" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 font-poppins">Practical Implementations</h4>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
              Focused on foundational cloud paradigms, artificial intelligence concepts, and real-world system modeling.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 md:p-8 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#00f3ff]/30 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#00f3ff]/10 border border-[#00f3ff]/20 flex items-center justify-center mb-6">
              <ShieldCheck size={22} className="text-[#00f3ff]" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 font-poppins">Continuous Growth</h4>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
              Bridging academic rigour with professional industry workflows and real-world engineering standards.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-[90vw] mx-auto w-full mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs font-mono text-neutral-600">
        <p>&copy; 2026 David Varghese</p>
        <p className="text-neutral-500">Edunet Foundation &bull; IBM SkillsBuild Internship</p>
      </div>
    </div>
  );
};

export default Experience;
