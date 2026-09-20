import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BadgeCheck, 
  CheckCircle2, 
  Calendar, 
  Award, 
  ExternalLink, 
  RotateCw, 
  Maximize2, 
  X, 
  ShieldCheck 
} from 'lucide-react';

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  year: string;
  field: string;
  skills: string[];
  imageUrl: string;
  verifyUrl?: string;
}

const CERTIFICATES: Certificate[] = [
  // 2026
  {
    id: 1,
    title: "Vulnerability Management",
    issuer: "IBM SkillsBuild",
    year: "2026",
    field: "Cybersecurity & Defense",
    skills: ["Vulnerability Assessment", "Risk Mitigation", "Security Auditing"],
    imageUrl: "certificates/IBM - Vulnerability Management.png",
    verifyUrl: "https://www.credly.com/badges/43e0c9c4-350a-438d-8fca-dc5d22194ed0"
  },
  {
    id: 2,
    title: "Data Science & Analytics",
    issuer: "HP LIFE",
    year: "2026",
    field: "Data Science & Analytics",
    skills: ["Data Analysis", "Predictive Modeling", "Statistical Analysis"],
    imageUrl: "certificates/HP - Data Science & Analytics.png"
  },
  {
    id: 3,
    title: "Programming Fundamentals Using Python",
    issuer: "Infosys Springboard",
    year: "2026",
    field: "Software Development",
    skills: ["Python", "Algorithm Logic", "Data Structures"],
    imageUrl: "certificates/Infosys - Programming Fundamentals using Python -  Part 2.png",
    verifyUrl: "https://verify.onwingspan.com"
  },
  {
    id: 4,
    title: "Artificial Intelligence",
    issuer: "Infosys Springboard",
    year: "2026",
    field: "Artificial Intelligence",
    skills: ["Machine Learning", "Neural Networks", "AI Ethics"],
    imageUrl: "certificates/Infosys - Artificial Intelligence.png",
    verifyUrl: "https://verify.onwingspan.com"
  },
  {
    id: 5,
    title: "Describe the Concepts of Cybersecurity",
    issuer: "Microsoft",
    year: "2026",
    field: "Information Security",
    skills: ["Zero Trust", "Threat Protection", "Cloud Security"],
    imageUrl: "certificates/Microsoft - Describe the concept of cybersecurity.png"
  },
  {
    id: 6,
    title: "Digital 101 (30 Hours)",
    issuer: "FutureSkills Prime / NASSCOM",
    year: "2026",
    field: "Digital Literacy & Emerging Tech",
    skills: ["Digital Technologies", "Cloud Concepts", "Cyber Hygiene"],
    imageUrl: "certificates/Digital 101.jpg"
  },

  // 2025
  {
    id: 7,
    title: "Cybersecurity Fundamentals",
    issuer: "IBM SkillsBuild",
    year: "2024",
    field: "Cybersecurity",
    skills: ["Network Defense", "Cryptography", "Security Architecture"],
    imageUrl: "certificates/IBM - Cybersecurity Fundamentals.png",
    verifyUrl: "https://www.credly.com/go/NgWRQZ6A"
  },
  {
    id: 8,
    title: "Cyber Threat Management",
    issuer: "Cisco Networking Academy",
    year: "2025",
    field: "Threat Intelligence",
    skills: ["Incident Response", "Threat Hunting", "SOC Analysis"],
    imageUrl: "certificates/Cisco - Cyber Threat Management.png"
  },
  {
    id: 9,
    title: "Introduction to IoT and Digital Transformation",
    issuer: "Cisco Networking Academy",
    year: "2025",
    field: "IoT & Systems",
    skills: ["IoT Architecture", "Sensors & Actuators", "Automation"],
    imageUrl: "certificates/Cisco - Introduction to IoT.png"
  },
  {
    id: 10,
    title: "Technology Job Simulation",
    issuer: "Deloitte",
    year: "2026",
    field: "Industry & Engineering",
    skills: ["Software Architecture", "Client Solutions", "Agile Methodologies"],
    imageUrl: "certificates/Deloitte - Technology Job Simulation.png"
  },
  {
    id: 11,
    title: "English for Technical Professionals",
    issuer: "IEEE",
    year: "2025",
    field: "Technical Communication",
    skills: ["Technical Documentation", "Engineering Presentations", "Professional Writing"],
    imageUrl: "certificates/IEEE - English for Technical Professionals.png"
  },
  {
    id: 12,
    title: "Quantum Machine Learning",
    issuer: "IBM",
    year: "2026",
    field: "Quantum & AI",
    skills: ["Quantum Computing", "Qiskit", "Hybrid Quantum-Classical ML"],
    imageUrl: "certificates/IBM - Quantum Machine Learning.png",
    verifyUrl: "https://www.credly.com/badges/a703a668-b1bb-4086-9ac4-c3a2f2a0cc89"
  },

  // 2024
  {
    id: 13,
    title: "AI Fundamentals",
    issuer: "IBM SkillsBuild",
    year: "2024",
    field: "Artificial Intelligence",
    skills: ["Machine Learning", "Natural Language Processing", "Computer Vision"],
    imageUrl: "certificates/IBM - Artificial Intellignece Fundamentals.png",
    verifyUrl: "https://www.credly.com/go/6qPjvf90"
  },
  {
    id: 14,
    title: "Developing Front-End Apps with React",
    issuer: "IBM | Coursera",
    year: "2024",
    field: "Frontend Engineering",
    skills: ["React", "Component Architecture", "State Management", "Hooks"],
    imageUrl: "certificates/IBM - Developing Front-End Apps with React.jpg",
    verifyUrl: "https://coursera.org/verify/VF2CYUCD98M5"
  },
  {
    id: 15,
    title: "Software Engineering Essentials",
    issuer: "IBM | Coursera",
    year: "2024",
    field: "Software Engineering",
    skills: ["SDLC", "Git & GitHub", "Design Patterns", "Agile"],
    imageUrl: "certificates/IBM - Software Engineering Essentials.png",
    verifyUrl: "https://www.credly.com/go/P0alTIQw"
  },
  {
    id: 16,
    title: "Introduction to Software Engineering (with Honors)",
    issuer: "IBM | Coursera",
    year: "2024",
    field: "Software Engineering",
    skills: ["Object-Oriented Design", "System Modularity", "Software Quality"],
    imageUrl: "certificates/IBM - Introduction to Software Engineering.jpg",
    verifyUrl: "https://coursera.org/verify/T9MUSW7DUYSP"
  },
  {
    id: 17,
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    year: "2024",
    field: "Information Security",
    skills: ["Network Security", "Data Confidentiality", "Malware Defense"],
    imageUrl: "certificates/Cisco - Introduction to Cybersecurity.png"
  },

  // 2023
  {
    id: 18,
    title: "Fundamentals of Digital Marketing",
    issuer: "Google",
    year: "2023",
    field: "Digital Strategy",
    skills: ["Analytics", "SEO / SEM", "Content Strategy", "Digital Growth"],
    imageUrl: "certificates/Digital Marketing.jpg"
  }
];

const Certificates: React.FC = () => {
  const [activeModalCert, setActiveModalCert] = useState<Certificate | null>(null);
  const [tappedCertId, setTappedCertId] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const toggleTapCard = (id: number) => {
    setTappedCertId(prev => (prev === id ? null : id));
  };

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
              <span className="text-[11px] font-mono text-[#00f3ff]/80 flex items-center gap-1.5 md:justify-end">
                <RotateCw size={12} className="text-[#00f3ff] animate-spin-slow" />
                Hover tiles to flip &amp; view certificates
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

        {/* Certificates 3D Flip Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERTIFICATES.map((cert, index) => {
            const isTapped = tappedCertId === cert.id;

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                className="group relative h-[360px] md:h-[370px] w-full [perspective:1200px] cursor-pointer"
                onClick={() => toggleTapCard(cert.id)}
              >
                {/* 3D Flipping Container */}
                <div 
                  className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ease-out group-hover:[transform:rotateY(180deg)] ${
                    isTapped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [webkit-backface-visibility:hidden] bg-black/45 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col justify-between group-hover:border-[#00f3ff]/40 group-hover:bg-black/60 transition-all duration-300 shadow-xl overflow-hidden">
                    {/* Background subtle neon glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00f3ff]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00f3ff]/10 transition-colors" />

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

                    {/* Front Footer: Verified Accreditation + Flip Prompt */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="flex items-center gap-1.5 text-[11px] text-neutral-300 font-medium">
                        <CheckCircle2 size={13} className="text-[#00f3ff]" />
                        Verified
                      </span>
                      
                      {/* Flip Hint Indicator */}
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#00f3ff] bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 border border-[#00f3ff]/30 px-2.5 py-1 rounded-full transition-colors">
                        <RotateCw size={11} className="transition-transform duration-500 group-hover:rotate-180" />
                        <span>Hover to flip</span>
                      </span>
                    </div>
                  </div>

                  {/* BACK SIDE (Certificate Image) */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [webkit-backface-visibility:hidden] [transform:rotateY(180deg)] bg-neutral-950/95 backdrop-blur-2xl border border-[#00f3ff]/50 p-4 rounded-2xl flex flex-col justify-between shadow-[0_0_35px_rgba(0,243,255,0.18)] overflow-hidden">
                    {/* Top Bar with Issuer & Actions */}
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00f3ff] bg-[#00f3ff]/10 border border-[#00f3ff]/30 px-2 py-0.5 rounded-full truncate">
                          {cert.issuer}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline">
                          Credential
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                        {cert.verifyUrl && (
                          <a
                            href={cert.verifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-[#00f3ff]/20 text-neutral-300 hover:text-[#00f3ff] border border-white/10 hover:border-[#00f3ff]/40 transition-colors"
                            title="Verify on Issuer Portal"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                        <button
                          onClick={() => setActiveModalCert(cert)}
                          className="p-1.5 rounded-lg bg-[#00f3ff]/10 hover:bg-[#00f3ff]/25 text-[#00f3ff] border border-[#00f3ff]/30 transition-colors"
                          title="Enlarge Certificate"
                        >
                          <Maximize2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Certificate Image Frame */}
                    <div 
                      className="relative flex-1 w-full my-2.5 rounded-xl overflow-hidden bg-neutral-900/90 border border-white/10 flex items-center justify-center p-2 group/img hover:border-[#00f3ff]/40 transition-all shadow-inner"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalCert(cert);
                      }}
                    >
                      {!failedImages[cert.id] ? (
                        <>
                          <img 
                            src={cert.imageUrl} 
                            alt={`${cert.title} Certificate`}
                            className="w-full h-full object-contain rounded-lg drop-shadow-lg transition-transform duration-300 group-hover/img:scale-[1.02]"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            onError={() => {
                              setFailedImages(prev => ({ ...prev, [cert.id]: true }));
                            }}
                          />

                          {/* Hover Overlay Hint */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-lg gap-1.5 backdrop-blur-[2px]">
                            <span className="text-xs font-mono font-semibold text-white bg-black/80 px-3 py-1.5 rounded-full border border-[#00f3ff]/40 flex items-center gap-1.5">
                              <Maximize2 size={12} className="text-[#00f3ff]" />
                              Click to enlarge
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-3 h-full w-full">
                          <div className="w-10 h-10 rounded-full bg-[#00f3ff]/10 border border-[#00f3ff]/30 flex items-center justify-center mb-2">
                            <Award size={20} className="text-[#00f3ff]" />
                          </div>
                          <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider mb-1 line-clamp-1">
                            {cert.title}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400 mb-2">
                            {cert.issuer} &bull; {cert.year}
                          </span>
                          <span className="text-[9px] font-mono text-[#00f3ff] bg-[#00f3ff]/10 border border-[#00f3ff]/20 px-2 py-0.5 rounded-full">
                            Certificate File Slot
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Back Footer */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                      <span className="flex items-center gap-1 text-[#00f3ff] font-medium">
                        <ShieldCheck size={13} />
                        Official Certificate
                      </span>
                      <span className="text-neutral-500 text-[10px]">
                        Hover away to flip back
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
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

      {/* Lightbox Certificate Enlarge Modal */}
      <AnimatePresence>
        {activeModalCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalCert(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative z-10 max-w-4xl w-full bg-neutral-950 border border-[#00f3ff]/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,243,255,0.25)] flex flex-col max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00f3ff] bg-[#00f3ff]/10 border border-[#00f3ff]/30 px-3 py-0.5 rounded-full">
                      {activeModalCert.issuer}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      {activeModalCert.year}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    {activeModalCert.title}
                  </h3>
                </div>

                <button 
                  onClick={() => setActiveModalCert(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-[#00f3ff]/20 text-neutral-400 hover:text-white border border-white/10 hover:border-[#00f3ff]/40 transition-colors shrink-0"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Certificate Image in Lightbox */}
              <div className="w-full flex-1 min-h-[300px] md:min-h-[440px] bg-black/60 rounded-2xl border border-white/10 p-4 md:p-6 flex items-center justify-center overflow-hidden">
                {!failedImages[activeModalCert.id] ? (
                  <img 
                    src={activeModalCert.imageUrl} 
                    alt={activeModalCert.title}
                    className="max-h-[60vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                    referrerPolicy="no-referrer"
                    onError={() => {
                      setFailedImages(prev => ({ ...prev, [activeModalCert.id]: true }));
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-[#00f3ff]/10 border border-[#00f3ff]/30 flex items-center justify-center mb-4">
                      <Award size={32} className="text-[#00f3ff]" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{activeModalCert.title}</h4>
                    <p className="text-xs font-mono text-neutral-400 mb-4">
                      {activeModalCert.issuer} &bull; {activeModalCert.year}
                    </p>
                    <div className="text-xs font-mono text-neutral-300 bg-white/5 border border-white/10 rounded-xl p-4 text-left w-full space-y-2">
                      <div className="flex justify-between text-neutral-400">
                        <span>Target File:</span>
                        <span className="text-[#00f3ff] font-semibold truncate max-w-[200px]">
                          {activeModalCert.imageUrl.replace('certificates/', '')}
                        </span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Domain:</span>
                        <span className="text-white">{activeModalCert.field}</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Status:</span>
                        <span className="text-emerald-400 font-semibold">Verified Credential</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 mt-5 border-t border-neutral-800">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <ShieldCheck size={15} className="text-[#00f3ff]" />
                  <span>Issued to <strong className="text-white">David Varghese</strong></span>
                </div>

                <div className="flex items-center gap-3">
                  {activeModalCert.verifyUrl && (
                    <a
                      href={activeModalCert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-[#00f3ff] hover:bg-[#00d9e6] shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <button
                    onClick={() => setActiveModalCert(null)}
                    className="px-4 py-2 rounded-full text-xs font-mono text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-[90vw] mx-auto w-full mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs font-mono text-neutral-600">
        <p>&copy; 2026 David Varghese</p>
        <p className="text-neutral-500">Accreditations &amp; Verifications</p>
      </div>
    </div>
  );
};

export default Certificates;
