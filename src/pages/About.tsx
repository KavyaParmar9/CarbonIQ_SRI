import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';

const facultyMentor = {
  name: 'Dr. Tapas Kumar Maiti',
  designation: 'Faculty Mentor',
  bio: 'Faculty member at Dhirubhai Ambani University with research experience in robotics, automation, embedded-AI, and cybernetics.',
  researchInterests: ['Intelligent Devices and Systems', 'Robotics', 'AI-Chip', 'Cybernetics'],
};

const teamMembers = [
  {
    name: 'Kavya Parmar',
    designation: 'Fourth Year Undergraduate Student',
    bio: 'Contributes to data preparation, analysis flow design, and interface refinement.',
    responsibilities: ['Carbon calculator logic', 'Dashboard prototyping', 'Research synthesis'],
  },
  {
    name: 'Bhavya Thakkar',
    designation: 'Fourth Year Undergraduate Student',
    bio: 'Supports dataset structuring, benchmarking views, and report generation workflows.',
    responsibilities: ['Benchmark comparison', 'Report content structure', 'Visualization testing'],
  },
];

const objectives = [
  {
    title: 'Carbon Calculator',
    description: 'Explores sector-specific emissions indicators through a lightweight calculator interface.',
  },
  {
    title: 'Analysis Dashboard',
    description: 'Organizes benchmark and emissions data into a compact analytical view.',
  },
  {
    title: 'Report Generator',
    description: 'Assembles structured summaries for academic review and presentation.',
  },
  {
    title: 'Research Repository',
    description: 'Curates background material and references around industrial decarbonization.',
  },
  {
    title: 'Benchmark Comparison',
    description: 'Compares relevant carbon metrics across key industrial sectors.',
  },
];

export default function About() {
  return (
    <section className="space-y-8 sm:space-y-10">
      <SectionHeading
        title="About CarbonIQ"
        description="A Summer Research Internship project focused on carbon benchmarking, emissions analysis, and academic research presentation."
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-950/10 transition-colors dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/30 sm:p-8"
      >
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">Academic Project</p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-3xl">
              CarbonIQ is a research-oriented web platform for exploring carbon data in industrial contexts.
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              It is being developed as a Summer Research Internship project under the guidance of Dr. Tapas Kumar Maiti at Dhirubhai Ambani University.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-5 dark:border-slate-800/70 dark:bg-slate-950/70">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Research Context</p>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              The project brings together carbon benchmarking, sectoral analysis, and report generation in a compact academic workflow.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-lg shadow-slate-950/10 transition-colors dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/20"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
              {facultyMentor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{facultyMentor.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{facultyMentor.designation}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{facultyMentor.bio}</p>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Research interests</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {facultyMentor.researchInterests.map((interest) => (
                <li key={interest} className="rounded-2xl bg-slate-50/80 px-3 py-2 dark:bg-slate-950/70">
                  {interest}
                </li>
              ))}
            </ul>
          </div>
        </motion.article>

        {teamMembers.map((member, index) => (
          <motion.article
            key={member.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 + index * 0.05 }}
            className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-lg shadow-slate-950/10 transition-colors dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/20"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                {member.name.split(' ').map((part) => part[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{member.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{member.designation}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{member.bio}</p>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Responsibilities</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {member.responsibilities.map((item) => (
                  <li key={item} className="rounded-2xl bg-slate-50/80 px-3 py-2 dark:bg-slate-950/70">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {objectives.map((objective, index) => (
          <motion.div
            key={objective.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.12 + index * 0.04 }}
            className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm shadow-slate-950/5 transition-colors dark:border-slate-800/80 dark:bg-slate-900/90"
          >
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{objective.title}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{objective.description}</p>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
