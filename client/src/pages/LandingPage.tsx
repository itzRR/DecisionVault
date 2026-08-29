import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, CheckCircle, Target, GitPullRequest, ArrowRight, Activity, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <Brain className="w-6 h-6" />
          <span>DecisionVault</span>
        </div>
        <Link to="/auth" className="btn-secondary">Sign In</Link>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
              DecisionVault
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-gradient mb-8">
              Decide. Record. Learn.
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Make better decisions by tracking what you believed, what you chose, and what actually happened. Your decision history becomes a mirror for your thinking.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                Start Decision Tracking <ArrowRight className="w-5 h-5" />
              </Link>
              <button onClick={() => document.getElementById('steps')?.scrollIntoView({ behavior: 'smooth' })} className="btn-ghost text-lg px-8 py-4">
                See how it works
              </button>
            </div>
          </motion.div>
        </section>

        {/* Steps Section */}
        <section id="steps" className="py-24 bg-white px-6">
          <div className="max-w-7xl mx-auto">
            <h3 className="section-title text-center mb-16">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Capture', icon: <Target className="w-8 h-8 text-indigo-500" />, desc: 'Record what you are deciding, your options, and your confidence level before you make the call.' },
                { step: '02', title: 'Analyze', icon: <Activity className="w-8 h-8 text-amber-500" />, desc: 'Get an AI-generated Decision Brief highlighting risks, unknowns, and trade-offs to sharpen your thinking.' },
                { step: '03', title: 'Replay', icon: <GitPullRequest className="w-8 h-8 text-emerald-500" />, desc: 'Log the actual outcome and compare it with your original expectations to uncover personal biases.' }
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="card p-8 relative overflow-hidden"
                >
                  <div className="text-6xl font-black text-slate-100 absolute -top-4 -right-4 z-0">{s.step}</div>
                  <div className="relative z-10">
                    <div className="mb-4 bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center shadow-sm">
                      {s.icon}
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-3">{s.title}</h4>
                    <p className="text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Preview Section */}
        <section className="py-24 bg-slate-900 text-white px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-6">Your Decision Brief</h3>
              <p className="text-slate-400 text-lg mb-6">
                Before you commit, DecisionVault generates a comprehensive brief. It acts as an impartial sounding board to catch what you might have missed.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-300"><CheckCircle className="text-emerald-400 w-5 h-5" /> Highlights critical trade-offs</li>
                <li className="flex items-center gap-3 text-slate-300"><Zap className="text-amber-400 w-5 h-5" /> Identifies hidden risks</li>
                <li className="flex items-center gap-3 text-slate-300"><Brain className="text-indigo-400 w-5 h-5" /> Surfaces unknown variables</li>
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
                <div className="text-sm text-indigo-400 font-semibold mb-2">DECISION BRIEF</div>
                <div className="text-xl font-bold mb-4">Gaming PC Purchase</div>
                <div className="space-y-4">
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <div className="font-semibold text-amber-400 flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4" /> Risks identified
                    </div>
                    <ul className="text-sm text-slate-300 list-disc list-inside">
                      <li>New GPU generation releasing in 3 months</li>
                      <li>Custom build requires time and troubleshooting</li>
                    </ul>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <div className="font-semibold text-emerald-400 mb-2">Recommendation</div>
                    <p className="text-sm text-slate-300">Wait for the Q3 release to potentially save 15% on current generation hardware.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <Brain className="w-12 h-12 text-indigo-200 mx-auto mb-6" />
            <blockquote className="text-3xl font-medium text-slate-800 italic leading-snug">
              "Your decision history becomes a mirror for your thinking."
            </blockquote>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 py-12 text-center text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-5 h-5" />
          <span className="font-bold">DecisionVault</span>
        </div>
        <p>© {new Date().getFullYear()} DecisionVault. All rights reserved.</p>
      </footer>
    </div>
  );
}
