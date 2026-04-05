import React from "react";
import { Step, Callout } from "../Docs/DocsComponents";
import { FileText, ShieldAlert, UserCheck, Scale, AlertCircle, BookOpen, CreditCard, Users, AlertTriangle, XOctagon, Power, Gavel } from "lucide-react";

export const TermsContent = () => {
  return (
    <div className="mt-15 space-y-15 text-zinc-300">
      
      {/* ── ACCEPTANCE OF TERMS ── */}
      <section id="acceptance" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 italic transition-transform hover:scale-110">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Acceptance of Terms</h2>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed mb-6">
          By registering for, accessing, or using the Clyric platform ("Service"), you agree to be bound by these comprehensive Terms and Conditions ("Terms"). If you do not agree with any part of these terms, you are prohibited from using the Service.
        </p>
        <Callout type="warning" title="Legally Binding Agreement">
          These Terms constitute a legally binding agreement between you and Clyric. They govern your access to the platform, use of our coding environments, live mock interview services, and any premium subscriptions.
        </Callout>
      </section>

      {/* ── DEFINITIONS ── */}
      <section id="definitions" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 italic transition-transform hover:scale-110">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Definitions</h2>
        </div>
        <div className="space-y-4 my-8 pl-4 border-l border-white/10 ml-2">
          <p><strong>"Platform"</strong> refers to the Clyric website, application, coding environments, server infrastructure, and any associated software.</p>
          <p><strong>"User"</strong> refers to any individual or entity that creates an account, accesses the public materials, or utilizes the interactive IDE services on Clyric.</p>
          <p><strong>"Content"</strong> includes all coding problems, articles, documentation, study plans, graphics, and structure provided by Clyric.</p>
          <p><strong>"User Submissions"</strong> refers to any code written, executed, or shared by Users during collaborative sessions or single-player practice modes.</p>
        </div>
      </section>

      {/* ── ACCOUNT SECURITY ── */}
      <section id="account" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 italic transition-transform hover:scale-110">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Account Registration & Security</h2>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed mb-6">
          To utilize the full capabilities of our online IDE and mock interviews, registration is required. You must provide accurate and current info upon registration.
        </p>
        <div className="mt-10">
          <Step number="1" title="Account Credentials">
            You are exclusively responsible for safeguarding the password and external authentication tokens (OAuth via Clerk) you use to access the service.
          </Step>
          <Step number="2" title="Unauthorized Activity">
            You must immediately notify Clyric of any suspected or actual unauthorized use of your account or any other breach of security.
          </Step>
          <Step number="3" title="Single User Principle">
            Your account is strictly personal. Sharing premium account access, credentials, or leveraging automated bot networks to bypass system limits is strictly forbidden and will result in immediate termination without refund.
          </Step>
        </div>
      </section>

      {/* ── SUBSCRIPTIONS ── */}
      <section id="subscriptions" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 italic transition-transform hover:scale-110">
            <CreditCard className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Subscriptions & Payments</h2>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed mb-6">
          Clyric offers specific features such as advanced problem analytics, unbounded execution time, and priority mock interviews via paid subscriptions.
        </p>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 my-6">
          <h3 className="font-bold text-lg text-zinc-100 mb-3">Billing Policies</h3>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li>Payments are processed securely via third-party providers (e.g., Stripe, CosmicCheckout). We do not store full credit card details.</li>
            <li>All fees are strictly non-refundable once the billing cycle begins, except where required by local laws.</li>
            <li>We reserve the right to modify subscription pricing. We will provide a minimum 30-day notice prior to any price adjustments affecting active subscriptions.</li>
            <li>Subscriptions auto-renew unless canceled prior to the renewal date.</li>
          </ul>
        </div>
      </section>

      {/* ── CODE OF CONDUCT ── */}
      <section id="conduct" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 italic transition-transform hover:scale-110">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Code of Conduct & Acceptable Use</h2>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed mb-6">
          Clyric provides collaborative environments powered by live WebSockets and remote code execution infrastructure. To maintain platform stability, stringent acceptable use guidelines apply.
        </p>

        <Callout type="info" title="Strict Prohibitions">
          Executing scripts meant to perform denial-of-service (DoS) attacks, cryptomining, network scanning, or attempting to compromise our server sandbox will trigger immediate and permanent bans without appeal.
        </Callout>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <p className="font-bold text-zinc-100 mb-2">Live Collaborations</p>
            <p className="text-sm text-zinc-500">
              During pair programming or mock interviews, users must maintain professional decorum. Harassment, verbal abuse, or deliberately sabotaging sessions is forbidden.
            </p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <p className="font-bold text-zinc-100 mb-2">Fair Usage Policy</p>
            <p className="text-sm text-zinc-500">
              Compilation and execution resources are dynamically allocated. Spamming executions or attempting to bypass execution timeouts intentionally degrades the experience for others.
            </p>
          </div>
        </div>
      </section>

      {/* ── INTELLECTUAL PROPERTY ── */}
      <section id="intellectual-property" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 italic transition-transform hover:scale-110">
            <Scale className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Intellectual Property Rights</h2>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed mb-6">
          The Service and its original content, logic algorithms, and functionality remain the exclusive property of Clyric.
        </p>
        <Callout type="success" title="Your Code">
          You explicitly retain all ownership rights to the original code you write inside our IDE. However, you grant Clyric a worldwide, royalty-free license to host, execute, and store your solutions solely for the purpose of operating the Service (e.g., maintaining your submission history and calculating performance analytics).
        </Callout>
      </section>

      {/* ── DISCLAIMERS ── */}
      <section id="disclaimer" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 italic transition-transform hover:scale-110">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Disclaimers & Warranties</h2>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed mb-6">
          The platform is provided on an "AS IS" and "AS AVAILABLE" basis. Clyric makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content, or materials included therein.
        </p>
        <ul className="space-y-4 text-zinc-400 my-8 pl-4">
          <li className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-zinc-600 shrink-0 mt-1" />
            <span>We do not guarantee that completing our study plans will result in successful placement or employment.</span>
          </li>
          <li className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-zinc-600 shrink-0 mt-1" />
            <span>We do not warrant that our code execution environments will be perpetually free of defects, inaccuracies, or delays.</span>
          </li>
        </ul>
      </section>

      {/* ── LIMITATION OF LIABILITY ── */}
      <section id="liability" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 italic transition-transform hover:scale-110">
            <XOctagon className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Limitation of Liability</h2>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed mb-6">
          In no event shall Clyric, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service.
        </p>
      </section>

      {/* ── TERMINATION ── */}
      <section id="termination" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 italic transition-transform hover:scale-110">
            <Power className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Termination of Services</h2>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed mb-6">
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
        <p className="text-lg text-zinc-400 leading-relaxed mb-6">
          Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or delete your account through the user dashboard settings.
        </p>
      </section>

      {/* ── GOVERNING LAW ── */}
      <section id="governing-law" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-100 italic transition-transform hover:scale-110">
            <Gavel className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Governing Law</h2>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed mb-6">
          These Terms shall be governed and construed in accordance with the standard prevailing cyber laws of the operating jurisdiction, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
        </p>
      </section>

    </div>
  );
};
