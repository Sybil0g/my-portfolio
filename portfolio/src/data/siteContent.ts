// ------------------------------------------------------------------
// EDIT THIS FILE to update almost all of the text on your site —
// your name, tagline, bio, skills list, contact info, and social
// links. You don't need to touch any page/component files for
// these changes to show up everywhere they're used.
//
// Your PROJECTS are not edited here — those are managed live from
// the /admin dashboard once you're signed in.
// ------------------------------------------------------------------

const siteContent = {
  name: 'Sybil',
  role: 'Graphic Designer & Developer',

  // Landing page hero
  hero: {
    eyebrow: "// Hi, I'm Sybil",
    headlineStart: 'I ',
    headlineHighlight: 'design',
    headlineEnd: ', organize, and bring ideas to life.',
    
    subtext:
      'A UI/UX and graphic designer with a passion for creating clean, functional, and visually engaging experiences — backed by strong administrative, organizational, and documentation skills.',
  },

  // About page
  about: {
    eyebrow: 'About me',
    heading: "I'm Sybil Mitch — a creative problem-solver who loves turning ideas into meaningful work.",
    // Each string in this array becomes its own paragraph on the About page.
    paragraphs: [
      'A Computer Science graduate from PLM (Pamantasan ng Lungsod ng Maynila) with hands-on experience in software development, UI/UX design, graphic design, and administrative work.',
      'I enjoy bringing ideas to life — from designing clean and intuitive interfaces and creating visual content to developing functional applications and organizing documents, reports, and workflows.',
      "I'm currently looking for opportunities where I can combine my creativity, technical skills, and attention to detail while continuing to learn, grow, and contribute.",
    ],
  },

  // Skills page — group however makes sense to you
  skillGroups: [
    {
      title: 'Frontend',
      skills: ['React', 'TypeScript', 'Vite', 'React Native / Expo', 'Tailwind CSS', 'WordPress', 'HTML5'],
    },
    {
      title: 'Design',
      skills: ['Figma', 'Canva', 'Adobe Photoshop', 'Prototype Design', 'Wireframing', 'UI/UX Design', 'Graphic Design', 'Web Design'],
    },
    {
      title: 'Project Management & Administrative',
      skills: ['Project Planning', 'Task Management', 'Documentation', 'Organization', 'Workflow Optimization', 'Report Preparation', 'Microsoft Office Suite', 'Google Workspace'],
    },
    {
      title: 'Tools & Other',
      skills: ['QA (Quality Assurance) Tester', 'Git / GitHub', 'Notion'],
    },
    {
      title: 'Soft Skills',
      skills: ['Communication', 'Teamwork', 'Problem-Solving', 'Time Management', 'Adaptability', 'Creativity', 'Attention to Detail', 'Multitasking'],
    },
  ],

  // Contact page + footer
  contact: {
    email: 'smsenriquez00@gmail.com',
    location: 'Manila, Philippines',
    availability: 'Available for opportunities in UI/UX Design, Graphic Design, Software Development & Administration.',
    socials: [
      { label: 'GitHub', url: 'https://github.com/your-username' },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/your-username' },
    ],
  },

  // Path to your resume file. Put the actual PDF in /public/resume.pdf
  // (just drop the file in there with that exact name) and this will work.
  resumeUrl: '/resume.pdf',
}

export default siteContent
