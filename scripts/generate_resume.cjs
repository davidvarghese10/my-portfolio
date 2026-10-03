const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'pt',
  format: 'a4',
});

const pageWidth = doc.internal.pageSize.getWidth();
const margin = 45;
const contentWidth = pageWidth - margin * 2;

// Primary colors matching the document
const primaryBlue = [36, 123, 160];
const textDark = [30, 41, 59];
const textMuted = [100, 116, 139];

let y = 50;

function drawSectionHeading(title) {
  y += 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryBlue);
  doc.text(title.toUpperCase(), margin, y);
  
  const textWidth = doc.getTextWidth(title.toUpperCase());
  doc.setDrawColor(...primaryBlue);
  doc.setLineWidth(0.75);
  doc.line(margin + textWidth + 8, y - 3, pageWidth - margin, y - 3);
  y += 14;
}

// ---------------- PAGE 1 ----------------
// Name
doc.setFont('helvetica', 'bold');
doc.setFontSize(24);
doc.setTextColor(...primaryBlue);
doc.text('David Varghese', pageWidth / 2, y, { align: 'center' });
y += 18;

// Contact info
doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
doc.setTextColor(...textDark);
const contactLine = 'davidvarghese1000@gmail.com   |   +91 9746233005';
doc.text(contactLine, pageWidth / 2, y, { align: 'center' });
y += 14;

doc.setTextColor(...primaryBlue);
const linksLine = 'linkedin.com/in/david-varghese-solchadav-group   |   leetcode.com/u/david_1000/';
doc.text(linksLine, pageWidth / 2, y, { align: 'center' });
y += 8;

// OBJECTIVE
drawSectionHeading('OBJECTIVE');
doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(...textDark);
const objective = 'A motivated first-year Computer Science student and aspiring software innovator with a strong interest in programming and app development. Seeking opportunities to apply problem-solving skills, teamwork, and leadership abilities while learning from peers and contributing to technical and academic initiatives.';
const objLines = doc.splitTextToSize(objective, contentWidth);
doc.text(objLines, margin, y);
y += objLines.length * 12 + 6;

// EDUCATION
drawSectionHeading('EDUCATION');

// B.Tech
doc.setFont('helvetica', 'bold');
doc.setFontSize(9.5);
doc.setTextColor(...textDark);
doc.text('Bachelor of Technology in Computer Science Engineering', margin, y);
doc.setFont('helvetica', 'normal');
doc.text('2025–2029', pageWidth - margin, y, { align: 'right' });
y += 12;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(...textMuted);
doc.text('Rajagiri School of Engineering & Technology, Kakkanad', margin, y);
y += 12;

doc.setTextColor(...textDark);
doc.text('✓ S1 SGPA: 10.00 / 10.00', margin + 10, y);
y += 11;
doc.text('✓ S2 SGPA: 10.00 / 10.00', margin + 10, y);
y += 15;

// Higher Secondary
doc.setFont('helvetica', 'bold');
doc.setFontSize(9.5);
doc.setTextColor(...textDark);
doc.text('Higher Secondary Education (XII)', margin, y);
doc.setFont('helvetica', 'normal');
doc.text('2023–2025', pageWidth - margin, y, { align: 'right' });
y += 12;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(...textMuted);
doc.text('Devamatha CMI Public School, Thrissur', margin, y);
y += 12;

doc.setTextColor(...textDark);
doc.text('✓ PERCENTAGE: 96%', margin + 10, y);
y += 11;
doc.text('✓ Board: Central Board of Secondary Education (CBSE)', margin + 10, y);
y += 15;

// High School
doc.setFont('helvetica', 'bold');
doc.setFontSize(9.5);
doc.setTextColor(...textDark);
doc.text('High School Education (X)', margin, y);
doc.setFont('helvetica', 'normal');
doc.text('2022–2023', pageWidth - margin, y, { align: 'right' });
y += 12;

doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(...textMuted);
doc.text('CMI Public School, Chalakudy', margin, y);
y += 12;

doc.setTextColor(...textDark);
doc.text('✓ PERCENTAGE: 97.6%', margin + 10, y);
y += 11;
doc.text('✓ Board: Central Board of Secondary Education (CBSE)', margin + 10, y);
y += 10;

// PROJECTS
drawSectionHeading('PROJECTS');

function addProject(title, bullet1, bullet2) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...textDark);
  doc.text(title, margin, y);
  y += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textDark);

  if (bullet1) {
    const lines1 = doc.splitTextToSize('✓ ' + bullet1, contentWidth - 12);
    doc.text(lines1, margin + 10, y);
    y += lines1.length * 11 + 2;
  }
  if (bullet2) {
    const lines2 = doc.splitTextToSize(bullet2, contentWidth - 20);
    doc.text(lines2, margin + 20, y);
    y += lines2.length * 11 + 4;
  }
}

addProject(
  'Python-Based Mathematical Equation Solver',
  'Developed a Python-based application to solve linear and quadratic equations involving one and two variables with accurate results.',
  'Implemented an integrated calculator and user-friendly logic to enhance usability and computational efficiency.'
);

addProject(
  'Smartphone Specification Search & Chatbot Application',
  'Developed a Python-based application that allows users to search smartphones and view detailed specifications in an organized manner.',
  'Integrated a chatbot feature to handle user queries related to smartphone specifications, improving accessibility and user interaction.'
);

addProject(
  'Interview Fraud Detector',
  'Developed an interview fraud detection system that analyzes candidate behavior and interaction patterns to identify potential dishonest or suspicious activities during online interviews.'
);

addProject(
  'Immersive Regional Weather Experience Application',
  'Developed an immersive weather application featuring region-specific visuals and dynamic weather sound effects such as rain, thunder, and wind to enhance the user experience.'
);

// ---------------- PAGE 2 ----------------
doc.addPage();
y = 50;

// SKILLS
drawSectionHeading('SKILLS');
doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(...textDark);

const skills = [
  'Python',
  'Programming in C',
  'Object-oriented programming using Java',
  'SQL',
  'Cybersecurity Fundamentals',
  'Data Science Fundamentals',
  'Swift Programming Basics',
  'Problem solving skills',
  'Logical thinking',
  'Team Collaboration'
];

skills.forEach(skill => {
  doc.text('•  ' + skill, margin + 10, y);
  y += 14;
});
y += 6;

// CERTIFICATIONS
drawSectionHeading('CERTIFICATIONS');
doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(...textDark);

const certs = [
  'Artificial Intelligence Fundamentals - IBM',
  'Cybersecurity Fundamentals - IBM',
  'Cyber Threat Management - Cisco',
  'Software Engineering Essentials - IBM',
  'Fundamentals of Digital Marketing - Google',
  'Quantum Machine Learning - IBM'
];

certs.forEach(cert => {
  doc.text('•  ' + cert, margin + 10, y);
  y += 14;
});
doc.setFont('helvetica', 'italic');
doc.setTextColor(...textMuted);
doc.text('35+ additional certifications (IBM, Google, Cisco, Infosys Springboard, IEEE, etc.)', margin + 20, y);
y += 20;

// PROFESSIONAL DEVELOPMENT
drawSectionHeading('PROFESSIONAL DEVELOPMENT');
doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(...textDark);

const profDev = [
  'Secured 3rd Prize at Vibe Night, a cultural event conducted as part of the Abhiyanthriki Tech Fest at Rajagiri School of Engineering & Technology.',
  'Participated in the Smart India Hackathon, gaining hands-on experience in problem-solving and collaborative development.',
  'Participated in Hacksus, a national-level hackathon organized by Rajagiri School of Engineering & Technology (RSET), collaborating on innovative solutions and applying technical skills in a competitive environment.'
];

profDev.forEach(item => {
  const lines = doc.splitTextToSize('✓ ' + item, contentWidth - 12);
  doc.text(lines, margin + 10, y);
  y += lines.length * 12 + 6;
});
y += 6;

// LANGUAGES
drawSectionHeading('LANGUAGES');
doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(...textDark);
doc.text('- English: Fluent', margin + 10, y);
y += 14;
doc.text('- Malayalam: Mother tongue', margin + 10, y);

// Output file
const outDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outPath = path.join(outDir, 'David_Varghese_Resume.pdf');
fs.writeFileSync(outPath, Buffer.from(doc.output('arraybuffer')));
console.log('Resume PDF generated successfully at:', outPath);
