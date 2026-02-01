import { Job } from '@/types/job';

const companies = [
  { name: 'Google', logo: '🔍' },
  { name: 'Amazon', logo: '📦' },
  { name: 'Netflix', logo: '🎬' },
  { name: 'Meta', logo: '👁️' },
  { name: 'Apple', logo: '🍎' },
  { name: 'Microsoft', logo: '🪟' },
  { name: 'Stripe', logo: '💳' },
  { name: 'Vercel', logo: '▲' },
  { name: 'OpenAI', logo: '🤖' },
  { name: 'Figma', logo: '🎨' },
  { name: 'Slack', logo: '💬' },
  { name: 'Spotify', logo: '🎵' },
  { name: 'Airbnb', logo: '🏠' },
  { name: 'Uber', logo: '🚗' },
  { name: 'Discord', logo: '🎮' },
  { name: 'Notion', logo: '📝' },
  { name: 'Linear', logo: '⚡' },
  { name: 'Datadog', logo: '🐕' },
  { name: 'Cloudflare', logo: '☁️' },
  { name: 'Supabase', logo: '⚡' },
];

const titles = [
  'Senior Frontend Engineer',
  'Staff Software Engineer',
  'Full Stack Developer',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Platform Engineer',
  'Product Engineer',
  'React Developer',
  'TypeScript Specialist',
  'AI/ML Engineer',
];

const locations = [
  'San Francisco, CA',
  'New York, NY',
  'Seattle, WA',
  'Austin, TX',
  'Remote',
  'London, UK',
  'Berlin, Germany',
  'Toronto, Canada',
];

const salaryRanges = [
  '$180K - $250K',
  '$200K - $300K',
  '$150K - $220K',
  '$220K - $350K',
  '$160K - $240K',
];

const generateDescription = (company: string, title: string): string => {
  return `Join ${company} as a ${title} and work on cutting-edge technology that impacts millions of users worldwide. You'll collaborate with world-class engineers, drive technical decisions, and help shape the future of our products. We're looking for someone who is passionate about building elegant solutions to complex problems.`;
};

const generateRequirements = (): string[] => {
  const allReqs = [
    '5+ years of experience in software development',
    'Expert knowledge of React and TypeScript',
    'Experience with distributed systems',
    'Strong communication skills',
    'BS/MS in Computer Science or equivalent',
    'Experience with cloud platforms (AWS/GCP/Azure)',
    'Knowledge of CI/CD pipelines',
    'Experience with agile methodologies',
    'Strong problem-solving abilities',
    'Experience mentoring junior developers',
  ];
  
  const shuffled = allReqs.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4 + Math.floor(Math.random() * 3));
};

export const generateMockJobs = (): Job[] => {
  return companies.map((company, index) => ({
    id: `job-${index + 1}`,
    company: company.name,
    title: titles[index % titles.length],
    location: locations[index % locations.length],
    salary: salaryRanges[index % salaryRanges.length],
    status: 'queued' as const,
    logo: company.logo,
    description: generateDescription(company.name, titles[index % titles.length]),
    requirements: generateRequirements(),
  }));
};

export const generateCoverLetter = (job: Job): string => {
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. With my extensive experience in software development and passion for building exceptional products, I believe I would be an excellent fit for your team.

Throughout my career, I have consistently delivered high-quality solutions that drive business value. My expertise in modern web technologies, combined with my collaborative approach, has enabled me to successfully contribute to cross-functional teams.

I am particularly excited about the opportunity to work at ${job.company} because of your commitment to innovation and user-centric design. I am confident that my skills and experience align well with the requirements of this role.

Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.

Best regards,
Autonomous Agent v2.4`;
};

export const generateResumeHighlights = (job: Job): string[] => {
  return [
    `✓ Skills matched: React, TypeScript, ${job.location.includes('Remote') ? 'Remote work experience' : 'On-site availability'}`,
    `✓ Experience level: Senior (7+ years)`,
    `✓ Salary expectation: Aligned with ${job.salary}`,
    `✓ Availability: Immediate start`,
    `✓ Portfolio: 15+ production applications`,
    `✓ Keywords optimized for ATS parsing`,
  ];
};
