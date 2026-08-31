import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, CheckCircle2, Calendar, Award, ExternalLink } from 'lucide-react';

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  year: string;
  field: string;
  skills: string[];
}

const CERTIFICATES: Certificate[] = [
  // 2026
  {
    id: 1,
    title: "Vulnerability Management",
    issuer: "IBM",
    year: "2026",
    field: "Cybersecurity & Defense",
    skills: ["Vulnerability Assessment", "Risk Mitigation", "Security Auditing"]
  },
  {
    id: 2,
    title: "Data Science & Analytics",
    issuer: "HP",
    year: "2026",
    field: "Data Science & Analytics",
    skills: ["Data Analysis", "Predictive Modeling", "Statistical Analysis"]
  },
  {
    id: 3,
    title: "Programming Fundamentals Using Python",
    issuer: "Infosys Springboard",
    year: "2026",
    field: "Software Development",
    skills: ["Python", "Algorithm Logic", "Data Structures"]
  },
  {
    id: 4,
    title: "Artificial Intelligence",
    issuer: "Infosys Springboard",
    year: "2026",
    field: "Artificial Intelligence",
    skills: ["Machine Learning", "Neural Networks", "AI Ethics"]
  },
  {
    id: 5,
    title: "Describe the Concepts of Cybersecurity",
    issuer: "Microsoft",
    year: "2026",
    field: "Information Security",
    skills: ["Zero Trust", "Threat Protection", "Cloud Security"]
  },
  {
    id: 6,
    title: "Digital 101 (30 Hours)",
    issuer: "FutureSkills Prime",
    year: "2026",
    field: "Digital Literacy & Emerging Tech",
    skills: ["Digital Technologies", "Cloud Concepts", "Cyber Hygiene"]
  },

  // 2025
  {
    id: 7,
    title: "Cybersecurity Fundamentals",
    issuer: "IBM",
    year: "2025",
    field: "Cybersecurity",
    skills: ["Network Defense", "Cryptography", "Security Architecture"]
  },
  {
    id: 8,
    title: "Cyber Threat Management",
    issuer: "Cisco",
    year: "2025",
    field: "Threat Intelligence",
    skills: ["Incident Response", "Threat Hunting", "SOC Analysis"]
  },
  {
    id: 9,
    title: "Introduction to IoT and Digital Transformation",
    issuer: "Cisco",
    year: "2025",
    field: "IoT & Systems",
    skills: ["IoT Architecture", "Sensors & Actuators", "Automation"]
  },
  {
    id: 10,
    title: "Technology Job Simulation",
    issuer: "Deloitte",
    year: "2025",
    field: "Industry & Engineering",
    skills: ["Software Architecture", "Client Solutions", "Agile Methodologies"]
  },
  {
    id: 11,
    title: "English for Technical Professionals",
    issuer: "IEEE",
    year: "2025",
    field: "Technical Communication",
    skills: ["Technical Documentation", "Engineering Presentations", "Professional Writing"]
  },
  {
    id: 12,
    title: "Quantum Machine Learning",
    issuer: "IBM",
    year: "2025",
    field: "Quantum & AI",
    skills: ["Quantum Computing", "Qiskit", "Hybrid Quantum-Classical ML"]
  },

  // 2024
  {
    id: 13,
    title: "AI Fundamentals",
    issuer: "IBM",
    year: "2024",
    field: "Artificial Intelligence",
    skills: ["Machine Learning", "Natural Language Processing", "Computer Vision"]
  },
  {
    id: 14,
    title: "Developing Front-End Apps with React",
    issuer: "IBM",
    year: "2024",
    field: "Frontend Engineering",
    skills: ["React", "Component Architecture", "State Management", "Hooks"]
  },
  {
    id: 15,
    title: "Software Engineering Essentials",
    issuer: "IBM",
    year: "2024",
    field: "Software Engineering",
    skills: ["SDLC", "Git & GitHub", "Design Patterns", "Agile"]
  },
  {
    id: 16,
    title: "Introduction to Software Engineering (with Honors)",
    issuer: "IBM",
    year: "2024",
    field: "Software Engineering",
    skills: ["Object-Oriented Design", "System Modularity", "Software Quality"]
  },
  {
    id: 17,
    title: "Introduction to Cybersecurity",
    issuer: "Cisco",
    year: "2024",
    field: "Information Security",
    skills: ["Network Security", "Data Confidentiality", "Malware Defense"]
  },

  // 2023
  {
    id: 18,
    title: "Fundamentals of Digital Marketing",
    issuer: "Google",
    year: "2023",
    field: "Digital Strategy",
    skills: ["Analytics", "SEO / SEM", "Content Strategy", "Digital Growth"]
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
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-neutral-800 pb-8"
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
          
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="text-left md:text-right">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 block mb-1">
                (2023 — 2026)
              </span>
              <span className="text-[11px] font-mono text-[#00f3ff]/80">
                41 Professional Accreditations
              </span>
            </div>

            {/* LinkedIn Quick Link */}
            <a
              href="https://www.linkedin.com/in/david-varghese-solchadav-group/details/certifications/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-[#00f3ff] hover:bg-[#00d9e6] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all transform hover:-translate-y-0.5"
            >
              <span>View On LinkedIn</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CERTIFICATES.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              className="group relative bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-[#00f3ff]/40 hover:bg-black/60 transition-all duration-300 shadow-xl"
            >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00f3ff] px-2.5 py-0.5 rounded-full border border-[#00f3ff]/20 bg-[#00f3ff]/10 truncate max-w-[70%]">
                      {cert.field}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-mono text-neutral-400 shrink-0">
                      <Calendar size={12} className="text-[#00f3ff]" />
                      <span className="font-semibold text-white">{cert.year}</span>
                    </div>
                  </div>

                  <h3 className="text-lg md:text-xl font-medium tracking-tight text-white group-hover:text-[#00f3ff] transition-colors mb-2 line-clamp-2">
                    {cert.title}
                  </h3>

                  <p className="text-xs font-mono text-neutral-400 mb-4 flex items-center gap-1.5">
                    <Award size={13} className="text-[#00f3ff] shrink-0" />
                    <span className="text-neutral-300 font-medium">{cert.issuer}</span>
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cert.skills.map((skill, sIdx) => (
                      <span 
                        key={sIdx}
                        className="text-[10px] font-mono text-neutral-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer verification badge */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                    <CheckCircle2 size={12} className="text-[#00f3ff]" />
                    Verified Accreditation
                  </span>
                  <span className="text-[10px] text-[#00f3ff]/60">#{String(cert.id).padStart(2, '0')}</span>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Centered Fitted "More Certificates" CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 md:mt-20 flex justify-center w-full"
        >
          <a 
            href="https://www.linkedin.com/in/david-varghese-solchadav-group/details/certifications/"
            target="_blank"
            rel="noopener noreferrer" 
            className="group relative inline-flex items-center gap-4 px-8 py-4 md:px-10 md:py-5 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 hover:border-[#00f3ff]/40 shadow-2xl transition-all"
          >
            {/* Liquid Swipe Color Background */}
            <div className="absolute inset-0 bg-[#00f3ff] origin-right scale-x-0 transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
            
            {/* Content */}
            <span className="relative z-10 text-lg md:text-2xl font-bold uppercase tracking-tight font-poppins text-neutral-200 group-hover:text-black transition-colors duration-300">
              More Certificates
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="relative z-10 w-6 h-6 md:w-7 md:h-7 text-neutral-400 group-hover:text-black transition-colors duration-300 shrink-0"
            >
              <path d="M6 18 L15.2 8.8" />
              <path d="M18 6 L9 6" />
              <path d="M18 10 L18 16" />
            </svg>
          </a>
        </motion.div>
      </div>

      <div className="max-w-[90vw] mx-auto w-full mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs font-mono text-neutral-600">
        <p>&copy; 2026 David Varghese</p>
        <p className="text-neutral-500">Accreditations &amp; Verifications</p>
      </div>
    </div>
  );
};

export default Certificates;
