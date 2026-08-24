import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, FileCheck, CheckCircle2, Calendar, Award } from 'lucide-react';

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  year: string;
  field: string;
  skills: string[];
  credentialId?: string;
}

const CERTIFICATES: Certificate[] = [
  {
    id: 1,
    title: "Full Stack Software Development",
    issuer: "Coursera / Meta",
    year: "2025",
    field: "Software Engineering",
    skills: ["React", "TypeScript", "RESTful APIs", "System Design"],
    credentialId: "CERT-FS-2025-01"
  },
  {
    id: 2,
    title: "Cybersecurity Fundamentals & Threat Defense",
    issuer: "Google / Cisco Networking Academy",
    year: "2024",
    field: "Information Security",
    skills: ["Network Security", "Vulnerability Analysis", "Authentication Protocols"],
    credentialId: "CERT-SEC-2024-88"
  },
  {
    id: 3,
    title: "Applied Machine Learning & Python",
    issuer: "DeepLearning.AI / Stanford Online",
    year: "2024",
    field: "Artificial Intelligence",
    skills: ["Python", "Supervised Learning", "Classification Models", "Data Preprocessing"],
    credentialId: "CERT-ML-2024-42"
  },
  {
    id: 4,
    title: "Data Structures & Algorithmic Analysis",
    issuer: "University Computer Science Academy",
    year: "2024",
    field: "Computer Science Core",
    skills: ["Algorithm Design", "Graph Theory", "Dynamic Programming", "Optimization"],
    credentialId: "CERT-DSA-2024-19"
  }
];

const Certificates: React.FC = () => {
  return (
    <div 
      id="certificates" 
      className="pt-36 pb-24 px-6 md:px-12 bg-transparent relative z-10 min-h-screen flex flex-col justify-between"
    >
      <div className="max-w-[90vw] mx-auto w-full">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-16 border-b border-neutral-800 pb-8"
        >
          <div>
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#00f3ff] mb-4 flex items-center gap-2">
              <BadgeCheck size={14} className="text-[#00f3ff]" />
              // Accreditations &bull; Credentials
            </span>
            <h2 className="liquid-glass-text text-5xl md:text-8xl font-bold uppercase tracking-tighter">
              Verified<br/>Certificates
            </h2>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 block mb-1">
              (2024 — 2026)
            </span>
            <span className="text-[11px] font-mono text-[#00f3ff]/80">
              {CERTIFICATES.length} Professional Accreditations
            </span>
          </div>
        </motion.div>

        {/* Certificates List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CERTIFICATES.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex flex-col justify-between hover:border-[#00f3ff]/40 hover:bg-black/60 transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00f3ff] px-3 py-1 rounded-full border border-[#00f3ff]/20 bg-[#00f3ff]/10">
                    {cert.field}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500">
                    <Calendar size={12} />
                    {cert.year}
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white group-hover:text-[#00f3ff] transition-colors mb-2">
                  {cert.title}
                </h3>

                <p className="text-xs font-mono text-neutral-400 mb-6 flex items-center gap-1.5">
                  <Award size={13} className="text-[#00f3ff]" />
                  Issued by {cert.issuer}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {cert.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="text-[11px] font-mono text-neutral-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer credential info */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-500 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-[#00f3ff]" />
                  Verified Credential
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  {cert.credentialId}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-[90vw] mx-auto w-full mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs font-mono text-neutral-600">
        <p>&copy; 2026 David Varghese</p>
        <p className="text-neutral-500">Accreditations &amp; Verifications</p>
      </div>
    </div>
  );
};

export default Certificates;
