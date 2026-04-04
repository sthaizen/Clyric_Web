import React from "react";
import { Step, Callout, CodeBlock } from "./DocsComponents";
import { Monitor, Users, Code2, Activity, Layers, Sparkles } from "lucide-react";
import { LANGUAGE_CONFIG } from "../../data/problem";

export const DocsFeatureContent = () => {
  return (
    <div className="mt-15 space-y-15">
      <section id="supported-languages" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 italic transition-transform hover:scale-110">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Multi-Language Support</h2>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed mb-10">
          Clyric supports the industry's most popular programming languages. Each language comes with full syntax highlighting, intelligent autocompletion, and a tailored execution environment for consistent results.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-10">
          {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
            <div
              key={key}
              className="group p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-4 hover:border-white/20 hover:bg-white/[0.08] transition-all cursor-default"
            >
              <div className="w-14 h-14 p-3 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                <img src={lang.logo} alt={lang.name} className="w-full h-full object-contain" />
              </div>
              <p className="font-bold text-zinc-100 text-sm tracking-wide">{lang.name}</p>
            </div>
          ))}
        </div>

        <Callout type="info" title="Environment configurations">
          Each language is executed in a secured, sandboxed container with predefined libraries and memory limits to ensure performance and safety for all users.
        </Callout>
      </section>
      {/* ── INTERVIEW SIMULATOR ── */}
      <section id="interview-simulator" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 italic transition-transform hover:scale-110">
            <Monitor className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Interview Preparation Arena</h2>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed mb-10">
          Practice in a focused environment designed to feel like a real coding interview. Solve problems under pressure, improve your thinking process, and get comfortable with timed technical challenges.
        </p>

        <Callout type="tip" title="Practice with purpose">
          Use timed sessions, topic-based practice, and difficulty filters to simulate real interview conditions and build confidence step by step.
        </Callout>

        <div className="mt-15">
          <h3 className="text-xl font-bold text-zinc-200 mb-6">How to start practicing</h3>
          <Step number="1" title="Choose a problem set">
            Pick problems by difficulty, topic, or company-style pattern depending on what you want to improve.
          </Step>
          <Step number="2" title="Start a focused session">
            Open the coding workspace, set your preferred language, and begin solving in a distraction-free environment.
          </Step>
          <Step number="3" title="Review your performance">
            After solving, check your approach, compare solutions, and understand where you can optimize your logic and speed.
          </Step>
        </div>

        <div className="mt-8">
          <CodeBlock language="javascript">
            {`// Example practice flow
const practiceSession = {
  topic: "Arrays",
  difficulty: "Medium",
  language: "javascript"
};

console.log(\`Start solving \${practiceSession.topic} problems in \${practiceSession.language}\`);`}
          </CodeBlock>
        </div>
      </section>
      {/* ── PROBLEM LIBRARY ── */}
      <section id="problem-library" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 italic transition-transform hover:scale-110">
            <Code2 className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Problem Library</h2>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed mb-10">
          Explore a growing collection of coding problems built to strengthen data structures, algorithms, and interview-focused problem-solving skills.
        </p>

        <Callout type="info" title="Structured learning">
          Every problem is meant to help you practice patterns, improve logic building, and prepare more effectively for technical interviews.
        </Callout>

        <div className="my-12">
          <h3 className="text-xl font-bold text-zinc-200 mb-4">Filtering Options</h3>
          <ul className="space-y-3 text-zinc-400">
            <li className="flex gap-3">
              <Sparkles className="w-5 h-5 text-zinc-600" /> <b>Difficulty:</b> Easy, Medium, and Hard.
            </li>
            <li className="flex gap-3">
              <Sparkles className="w-5 h-5 text-zinc-600" /> <b>Categories:</b> Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming, and more.
            </li>
            <li className="flex gap-3">
              <Sparkles className="w-5 h-5 text-zinc-600" /> <b>Practice Goals:</b> Topic mastery, interview prep, revision, and consistency building.
            </li>
          </ul>
        </div>
      </section>
      {/* ── COLLABORATIVE IDE ── */}
      <section id="collaborative-ide" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 italic transition-transform hover:scale-110">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Collaborative Coding</h2>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed mb-10">
          Practice with friends, peers, or mentors in real time. Collaborate on problems together, discuss approaches, and build confidence through shared learning sessions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <p className="font-bold text-zinc-100 mb-2">Live Shared Editor</p>
            <p className="text-sm text-zinc-500">
              Work on the same codebase together and instantly see each other’s edits while solving problems.
            </p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <p className="font-bold text-zinc-100 mb-2">Pair Problem Solving</p>
            <p className="text-sm text-zinc-500">
              Learn faster by discussing ideas, debugging together, and practicing interview-style collaboration.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-zinc-200 mb-6">How collaboration works</h3>
        <Step number="1" title="Create or join a room">
          Start a collaborative session and invite another user to join your shared coding workspace.
        </Step>
        <Step number="2" title="Solve together in real time">
          Write code, test ideas, and discuss different approaches while working on the same problem live.
        </Step>
      </section>



      {/* ── SKILL ANALYTICS ── */}
      <section id="skill-analytics" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 italic transition-transform hover:scale-110">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Progress Analytics</h2>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed mb-10">
          Track your journey with meaningful insights. Monitor solved problems, consistency, topic strengths, weak areas, and overall progress as you prepare.
        </p>

        <Callout type="warning" title="Improve smarter">
          Use your analytics to identify weak topics, focus on problem patterns you struggle with, and make your preparation more targeted.
        </Callout>

        <CodeBlock language="bash">
          {`# Example progress summary
Solved: 124
Current Streak: 9 days
Strongest Topic: Arrays
Needs Improvement: Dynamic Programming`}
        </CodeBlock>
      </section>
    </div>
  );
};