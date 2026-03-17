import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Droplet, Activity, AlertTriangle, CheckCircle2, Info,
  BookOpen, ShieldAlert, Microscope, RotateCcw, User,
  Zap, ChevronRight, FlaskConical, HeartPulse, Brain, Trophy,
  Sun, Moon, Star, Target, ArrowRight, Lightbulb, Medal
} from 'lucide-react';

/* ─── Utilities ──────────────────────────────────────── */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Cursor-tracking tilt card ─────────────────────── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale3d(1.02,1.02,1.02)`;
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
  }, []);
  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
  }, []);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={`tilt-card ${className}`}
      style={{ transition: 'transform 0.15s ease', willChange: 'transform', position: 'relative' }}>
      {children}
    </div>
  );
}

/* ─── Animated progress bar ─────────────────────────── */
function AnimatedBar({ value, color }: { value: number; color: string }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setTimeout(() => setWidth(value), 100); observer.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);
  return (
    <div ref={ref} className="w-full bg-zinc-200 dark:bg-zinc-700 h-4 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} relative overflow-hidden`}
        style={{ width: `${width}%`, transition: 'width 1.2s cubic-bezier(0.23,1,0.32,1)' }}>
        <span className="absolute inset-0 opacity-30"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)', animation: 'shimmer 2s infinite' }} />
      </div>
    </div>
  );
}

/* ─── Static data ────────────────────────────────────── */
const drugData = [
  { name: 'Dabigatran', type: 'Direct Thrombin Inhibitor', target: 'Factor IIa', tMax: '1–3 h', halfLife: '12–17 h', renalExcretion: 80, reversal: 'Idarucizumab · aPCC 80 U/kg · Dialysis', accent: '#3b82f6', bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-200 dark:border-blue-800', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', bar: 'bg-blue-500', textAccent: 'text-blue-600 dark:text-blue-400', notes: '80% renal — highest AKI risk; dialysable (low protein binding ~35%)' },
  { name: 'Rivaroxaban', type: 'Factor Xa Inhibitor', target: 'Factor Xa', tMax: '2–4 h', halfLife: '5–9 h', renalExcretion: 36, reversal: 'Andexanet Alfa · 4F-PCC 50 U/kg', accent: '#6366f1', bg: 'bg-indigo-50 dark:bg-indigo-950/40', border: 'border-indigo-200 dark:border-indigo-800', badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300', bar: 'bg-indigo-500', textAccent: 'text-indigo-600 dark:text-indigo-400', notes: 'PT prolonged but reagent-dependent; calibrated anti-Xa is gold standard' },
  { name: 'Apixaban', type: 'Factor Xa Inhibitor', target: 'Factor Xa', tMax: '1–3 h', halfLife: '8–14 h', renalExcretion: 25, reversal: 'Andexanet Alfa · 4F-PCC 50 U/kg', accent: '#8b5cf6', bg: 'bg-violet-50 dark:bg-violet-950/40', border: 'border-violet-200 dark:border-violet-800', badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300', bar: 'bg-violet-500', textAccent: 'text-violet-600 dark:text-violet-400', notes: 'Lowest renal clearance; protein binding ~87% — not dialysable' },
  { name: 'Edoxaban', type: 'Factor Xa Inhibitor', target: 'Factor Xa', tMax: '1–2 h', halfLife: '10–14 h', renalExcretion: 50, reversal: 'Andexanet Alfa · 4F-PCC 50 U/kg', accent: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300', bar: 'bg-emerald-500', textAccent: 'text-emerald-600 dark:text-emerald-400', notes: '50% renal; protein binding ~55% — partially dialysable; contraindicated in AF if CrCl >95 mL/min' }
];

type McqQuestion = {
  id: number; question: string; options: string[]; correct: number;
  insight: string; topic: string; tab: string;
};
type EmqScenario = { id: number; text: string; answer: string; topic: string; tab: string; };

const mcqsSource: McqQuestion[] = [
  { id: 1, question: 'Which TSOAC is most susceptible to accumulation in AKI due to its 80% renal excretion?', options: ['Rivaroxaban', 'Apixaban', 'Dabigatran', 'Edoxaban'], correct: 2, insight: 'Dabigatran (80% renal) — AKI can extend half-life beyond 24h. Compare: Edoxaban 50%, Rivaroxaban 36%, Apixaban 25%.', topic: 'Pharmacokinetics & Renal Clearance', tab: 'Drug Profiles' },
  { id: 2, question: 'In a patient bleeding on Rivaroxaban, which test most reliably quantifies drug concentration?', options: ['Prothrombin Time (PT)', 'aPTT', 'Thrombin Time (TT)', 'Calibrated Anti-Factor Xa Assay'], correct: 3, insight: 'Calibrated anti-Xa (rivaroxaban-specific) is the gold standard. PT is reagent-dependent and unreliable. Same principle applies to Edoxaban and Apixaban.', topic: 'Laboratory Monitoring', tab: 'Lab Interpretation' },
  { id: 3, question: 'Edoxaban is contraindicated in AF stroke prevention when creatinine clearance exceeds which threshold?', options: ['50 mL/min', '75 mL/min', '95 mL/min', '120 mL/min'], correct: 2, insight: 'At CrCl >95 mL/min, Edoxaban is cleared too rapidly — subtherapeutic levels lead to paradoxical ischaemic stroke risk. Unique among all TSOACs.', topic: 'Edoxaban Special Considerations', tab: 'Drug Profiles' },
  { id: 4, question: 'What is the recommended 4F-PCC dose for life-threatening bleeding with a Factor Xa inhibitor?', options: ['25 U/kg', '50 U/kg', '80 U/kg', '100 U/kg'], correct: 1, insight: '50 U/kg 4F-PCC for Xa inhibitors when Andexanet Alfa is unavailable. Dabigatran uses aPCC at 80 U/kg — a different dose for a different mechanism.', topic: 'PCC Dosing in Xa Inhibitor Bleeding', tab: 'Management Protocol' },
  { id: 5, question: 'Which reversal agent is preferred for Dabigatran bleeding when Idarucizumab is unavailable?', options: ['4-Factor PCC', 'Activated PCC (aPCC / FEIBA)', 'Fresh Frozen Plasma', 'Vitamin K'], correct: 1, insight: 'aPCC (80 U/kg) aggressively bypasses thrombin inhibition via the common pathway. FFP has no role in TSOAC reversal for any of the four agents.', topic: 'Dabigatran-Specific Reversal', tab: 'Management Protocol' }
];

const emqOptions = [
  { id: 'A', label: 'Dabigatran' }, { id: 'B', label: 'Rivaroxaban' },
  { id: 'C', label: 'Apixaban' }, { id: 'D', label: 'Edoxaban' },
  { id: 'E', label: 'Warfarin' }, { id: 'F', label: 'Unfractionated Heparin' }
];

const emqScenariosSource: EmqScenario[] = [
  { id: 1, text: 'A 75-year-old with AF and epistaxis. PT is normal but Thrombin Time is markedly prolonged.', answer: 'A', topic: 'Identifying Dabigatran by Lab Pattern', tab: 'Lab Interpretation' },
  { id: 2, text: 'Long-term anticoagulant with T-Max 2–4h and 36% renal clearance. Patient needs urgent surgery.', answer: 'B', topic: 'Rivaroxaban Pharmacokinetics', tab: 'Drug Profiles' },
  { id: 3, text: 'Factor Xa inhibitor with the lowest renal excretion among all TSOACs (25%). Not dialysable.', answer: 'C', topic: 'Apixaban Profile & Dialysability', tab: 'Drug Profiles' },
  { id: 4, text: 'Factor Xa inhibitor with ~50% renal excretion, contraindicated in AF when CrCl exceeds 95 mL/min.', answer: 'D', topic: 'Edoxaban CrCl Threshold', tab: 'Drug Profiles' },
  { id: 5, text: 'Drug effect is best quantified by the "Hemoclot" diluted thrombin time assay at specialist centres.', answer: 'A', topic: 'Specialist Coagulation Assays', tab: 'Lab Interpretation' }
];

const labMatrix = [
  { test: 'PT / INR', cells: [{ label: 'Insensitive', cls: 'text-zinc-400 dark:text-zinc-500 italic' }, { label: '↑ Prolonged', cls: 'text-red-600 dark:text-red-400 font-bold' }, { label: 'Insensitive', cls: 'text-zinc-400 dark:text-zinc-500 italic' }, { label: 'Mildly ↑', cls: 'text-amber-600 dark:text-amber-400 font-semibold' }] },
  { test: 'aPTT', cells: [{ label: '↑ Prolonged', cls: 'text-red-600 dark:text-red-400 font-bold' }, { label: 'Variable', cls: 'text-amber-600 dark:text-amber-400 font-semibold' }, { label: 'Insensitive', cls: 'text-zinc-400 dark:text-zinc-500 italic' }, { label: 'Mildly ↑', cls: 'text-amber-600 dark:text-amber-400 font-semibold' }] },
  { test: 'Thrombin Time', cells: [{ label: '✓ High Sensitivity', cls: 'text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-900/50 px-2 py-0.5 rounded' }, { label: '—', cls: 'text-zinc-300 dark:text-zinc-600' }, { label: '—', cls: 'text-zinc-300 dark:text-zinc-600' }, { label: '—', cls: 'text-zinc-300 dark:text-zinc-600' }] },
  { test: 'Calibrated Anti-Xa', cells: [{ label: '—', cls: 'text-zinc-300 dark:text-zinc-600' }, { label: '✓ Gold Standard', cls: 'text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-900/50 px-2 py-0.5 rounded' }, { label: '✓ Gold Standard', cls: 'text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-900/50 px-2 py-0.5 rounded' }, { label: '✓ Gold Standard', cls: 'text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-900/50 px-2 py-0.5 rounded' }] },
  { test: 'Hemoclot Assay', cells: [{ label: '✓ Specialist', cls: 'text-blue-700 dark:text-blue-300 font-bold bg-blue-50 dark:bg-blue-900/50 px-2 py-0.5 rounded' }, { label: '—', cls: 'text-zinc-300 dark:text-zinc-600' }, { label: '—', cls: 'text-zinc-300 dark:text-zinc-600' }, { label: '—', cls: 'text-zinc-300 dark:text-zinc-600' }] }
];

/* ─── Shuffle MCQ options ────────────────────────────── */
function shuffleMcqOptions(q: McqQuestion): McqQuestion {
  const indices = q.options.map((_, i) => i);
  const shuffled = shuffleArray(indices);
  return { ...q, options: shuffled.map(i => q.options[i]), correct: shuffled.indexOf(q.correct) };
}

function buildShuffledMcqs(): McqQuestion[] {
  return shuffleArray(mcqsSource).map(shuffleMcqOptions);
}

function buildShuffledEmqs(): EmqScenario[] {
  return shuffleArray(emqScenariosSource);
}

type TabId = 'overview' | 'monitoring' | 'strategy' | 'quiz';

/* ─── Final Assessment Panel ─────────────────────────── */
function FinalAssessment({
  quizScore, shuffledMcqs, shuffledEmqs,
  selectedAnswers, emqAnswers, onReset, onTabChange
}: {
  quizScore: { mcq: number; emq: number };
  shuffledMcqs: McqQuestion[];
  shuffledEmqs: EmqScenario[];
  selectedAnswers: Record<number, number>;
  emqAnswers: Record<number, string>;
  onReset: () => void;
  onTabChange: (tab: TabId) => void;
}) {
  const total = quizScore.mcq + quizScore.emq;
  const pct = (total / 10) * 100;

  // Find which questions were wrong
  const wrongMcqs = shuffledMcqs.filter(q => selectedAnswers[q.id] !== q.correct);
  const wrongEmqs = shuffledEmqs.filter(s => emqAnswers[s.id] !== s.answer);

  // Collect unique improvement areas from wrong answers
  const improvementMap = new Map<string, { tab: TabId; count: number }>();
  [...wrongMcqs, ...wrongEmqs].forEach(q => {
    const topic = q.topic;
    const tab = q.tab === 'Drug Profiles' ? 'overview' : q.tab === 'Lab Interpretation' ? 'monitoring' : 'strategy';
    if (!improvementMap.has(topic)) improvementMap.set(topic, { tab, count: 1 });
    else improvementMap.get(topic)!.count++;
  });

  const improvements = Array.from(improvementMap.entries()).map(([topic, { tab, count }]) => ({
    topic, tab, count,
    tabLabel: tab === 'overview' ? 'Drug Profiles' : tab === 'monitoring' ? 'Lab Interpretation' : 'Management Protocol'
  }));

  const tier = pct >= 90 ? 'excellent' : pct >= 70 ? 'good' : pct >= 50 ? 'developing' : 'early';

  const messages = {
    excellent: {
      headline: 'Outstanding Performance!',
      sub: 'You have shown a commanding grasp of TSOAC reversal. This is the level of knowledge that saves lives in emergency haematology. Dr. Mannan would be truly proud to have you by his side in clinic.',
      color: 'from-emerald-600 to-teal-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-300 dark:border-emerald-700',
      scoreColor: 'bg-emerald-500',
      icon: <Medal size={28} className="text-white" />
    },
    good: {
      headline: 'Excellent Work — You\'re Getting There!',
      sub: 'A solid score that shows real understanding of the subject. You clearly have a strong foundation. A little more focus on the areas below and you will be performing at the highest level. Keep going — you are very close.',
      color: 'from-blue-600 to-indigo-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-300 dark:border-blue-700',
      scoreColor: 'bg-blue-500',
      icon: <Trophy size={28} className="text-white" />
    },
    developing: {
      headline: 'You\'re Building Real Knowledge!',
      sub: 'Every great haematologist started exactly where you are right now. This score tells us not where you have failed, but where the opportunity for growth is. The concepts here are genuinely challenging — the fact that you are engaging with them already puts you ahead of most.',
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-300 dark:border-amber-700',
      scoreColor: 'bg-amber-500',
      icon: <Target size={28} className="text-white" />
    },
    early: {
      headline: 'Every Expert Starts With a First Attempt!',
      sub: 'Do not be discouraged — this quiz covers specialist-level clinical knowledge that takes time and repetition to master. The very fact that you attempted it shows courage and curiosity. Use the improvement guide below, revisit the relevant modules, and come back for another attempt. You will be amazed at the progress.',
      color: 'from-red-500 to-rose-600',
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-200 dark:border-red-900',
      scoreColor: 'bg-red-500',
      icon: <Star size={28} className="text-white" />
    }
  };

  const m = messages[tier];

  // Score breakdown visual
  const mcqDots = shuffledMcqs.map((q, i) => ({ i, ok: selectedAnswers[q.id] === q.correct }));
  const emqDots = shuffledEmqs.map((s, i) => ({ i, ok: emqAnswers[s.id] === s.answer }));

  return (
    <div className="space-y-5">
      {/* Main score card */}
      <Card className={`border-2 ${m.border} ${m.bg} overflow-hidden transition-colors`}>
        <div className={`h-1.5 w-full bg-gradient-to-r ${m.color}`} />
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Score circle */}
            <div className="shrink-0 relative">
              <div className={`w-24 h-24 rounded-full ${m.scoreColor} flex items-center justify-center shadow-xl`}
                style={{ boxShadow: `0 0 0 6px ${m.scoreColor}30, 0 8px 24px ${m.scoreColor}40` }}>
                <div className="text-center">
                  <div className="text-3xl font-black text-white leading-none">{total}</div>
                  <div className="text-white/70 text-xs font-bold">/10</div>
                </div>
              </div>
              <div className={`absolute -top-1 -right-1 w-8 h-8 rounded-full ${m.scoreColor} flex items-center justify-center`}>
                {m.icon}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-2">{m.headline}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{m.sub}</p>
            </div>
          </div>

          {/* Score breakdown dots */}
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="bg-white/60 dark:bg-zinc-800/60 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Part I · MCQs</span>
                <span className="font-black text-zinc-800 dark:text-zinc-200">{quizScore.mcq}/5</span>
              </div>
              <div className="flex gap-2">
                {mcqDots.map(d => (
                  <div key={d.i} className={`flex-1 h-2.5 rounded-full ${d.ok ? 'bg-emerald-500' : 'bg-red-400'}`} />
                ))}
              </div>
            </div>
            <div className="bg-white/60 dark:bg-zinc-800/60 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Part II · EMQs</span>
                <span className="font-black text-zinc-800 dark:text-zinc-200">{quizScore.emq}/5</span>
              </div>
              <div className="flex gap-2">
                {emqDots.map(d => (
                  <div key={d.i} className={`flex-1 h-2.5 rounded-full ${d.ok ? 'bg-emerald-500' : 'bg-red-400'}`} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Improvement areas — shown when score < 70% */}
      {pct < 70 && improvements.length > 0 && (
        <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <Lightbulb size={16} className="text-amber-500" />
              Your Personalised Improvement Plan
            </CardTitle>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
              These are the exact topics where focused revision will give you the biggest jump in marks. Each one is a door waiting to be opened — not a failure, but an invitation.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {improvements.map(item => (
              <div key={item.topic}
                className="flex items-center justify-between gap-4 bg-white dark:bg-zinc-900 rounded-xl p-4 border border-amber-100 dark:border-amber-900 transition-colors">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0 mt-0.5">
                    <Target size={12} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{item.topic}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Revisit the <span className="font-bold text-amber-600 dark:text-amber-400">{item.tabLabel}</span> module
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onTabChange(item.tab as TabId)}
                  className="flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors shrink-0 bg-amber-100 dark:bg-amber-900/40 px-3 py-1.5 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800/50"
                >
                  Go there <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* When score >= 70% — strengths acknowledged */}
      {pct >= 70 && pct < 100 && improvements.length > 0 && (
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black flex items-center gap-2 text-blue-800 dark:text-blue-300">
              <Info size={15} className="text-blue-500" />
              Fine-Tuning Opportunities
            </CardTitle>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">
              You've cleared the 70% bar — that's a real achievement. These remaining areas, once polished, will take you from good to excellent.
            </p>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-2">
            {improvements.map(item => (
              <div key={item.topic} className="flex items-center justify-between gap-3 bg-white dark:bg-zinc-900 rounded-xl p-3 border border-blue-100 dark:border-blue-900 transition-colors">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <ChevronRight size={13} className="text-blue-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{item.topic}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">→ {item.tabLabel}</p>
                  </div>
                </div>
                <button
                  onClick={() => onTabChange(item.tab as TabId)}
                  className="flex items-center gap-1 text-xs font-black text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 shrink-0 transition-colors"
                >
                  Review <ArrowRight size={11} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Perfect score message */}
      {pct === 100 && (
        <Card className="border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 transition-colors">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="text-3xl">🌟</div>
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 leading-relaxed">
              Perfect 10/10! You have achieved complete mastery of this assessment. Dr. Mannan extends his highest professional compliments. Share this achievement — it reflects real expertise.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reset button */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
          Questions are reshuffled every attempt to sharpen your memory
        </p>
        <button
          onClick={onReset}
          className="flex items-center gap-2.5 font-black text-sm px-8 py-3.5 rounded-full border-2 border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:border-red-400 hover:text-red-600 dark:hover:border-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
        >
          <RotateCcw size={15} /> New Attempt — Reshuffled Questions
        </button>
      </div>
    </div>
  );
}

/* ─── Main App ───────────────────────────────────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [dark, setDark] = useState(false);
  const [quizScore, setQuizScore] = useState<{ mcq: number; emq: number } | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [emqAnswers, setEmqAnswers] = useState<Record<number, string>>({});
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [pulse, setPulse] = useState(false);
  const [shuffledMcqs, setShuffledMcqs] = useState<McqQuestion[]>(() => buildShuffledMcqs());
  const [shuffledEmqs, setShuffledEmqs] = useState<EmqScenario[]>(() => buildShuffledEmqs());

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  useEffect(() => {
    const h = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h); return () => window.removeEventListener('mousemove', h);
  }, []);
  useEffect(() => {
    const iv = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 600); }, 2000);
    return () => clearInterval(iv);
  }, []);

  const handleMcqSelect = (qId: number, oIdx: number) => {
    if (quizScore !== null) return;
    setSelectedAnswers(p => ({ ...p, [qId]: oIdx }));
  };

  const calculateResults = () => {
    let m = 0; shuffledMcqs.forEach(q => { if (selectedAnswers[q.id] === q.correct) m++; });
    let e = 0; shuffledEmqs.forEach(s => { if (emqAnswers[s.id] === s.answer) e++; });
    setQuizScore({ mcq: m, emq: e });
  };

  const handleReset = () => {
    setQuizScore(null);
    setSelectedAnswers({});
    setEmqAnswers({});
    setShuffledMcqs(buildShuffledMcqs());
    setShuffledEmqs(buildShuffledEmqs());
  };

  const totalAnswered = Object.keys(selectedAnswers).length + Object.keys(emqAnswers).length;
  const canSubmit = Object.keys(selectedAnswers).length === shuffledMcqs.length && Object.keys(emqAnswers).length === shuffledEmqs.length;

  const tabs: { id: TabId; short: string; icon: React.ReactNode }[] = [
    { id: 'overview', short: 'Drugs', icon: <Droplet size={15} /> },
    { id: 'monitoring', short: 'Labs', icon: <Microscope size={15} /> },
    { id: 'strategy', short: 'Protocol', icon: <ShieldAlert size={15} /> },
    { id: 'quiz', short: 'Quiz', icon: <BookOpen size={15} /> }
  ];

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes bloodDrop { 0%,100%{transform:scale(1);filter:drop-shadow(0 0 0px #ef4444)} 50%{transform:scale(1.25);filter:drop-shadow(0 0 8px #ef4444aa)} }
        @keyframes floatUp { 0%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes ripple { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.2);opacity:0} }
        .blood-pulse { animation: bloodDrop 2s ease-in-out infinite; }
        .float-up { animation: floatUp 0.4s ease both; }
        .tilt-card::after { content:''; position:absolute; inset:0; border-radius:inherit; background:radial-gradient(circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,0.12) 0%,transparent 70%); pointer-events:none; opacity:0; transition:opacity 0.2s; }
        .tilt-card:hover::after { opacity:1; }
        .cursor-glow { pointer-events:none; position:fixed; border-radius:9999px; filter:blur(60px); opacity:0.07; transition:left 0.06s,top 0.06s; z-index:0; }
        .dark .cursor-glow { opacity:0.12; }
      `}</style>

      <div className="cursor-glow w-72 h-72 bg-red-500" style={{ left: cursorPos.x - 144, top: cursorPos.y - 144 }} />

      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans flex flex-col transition-colors duration-300">

        {/* ─── Header ─── */}
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 select-none">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <span className={`absolute inset-0 rounded-full bg-red-500 ${pulse ? 'opacity-40' : 'opacity-0'} transition-opacity duration-300`}
                  style={{ animation: pulse ? 'ripple 0.6s ease-out' : undefined }} />
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <Droplet size={17} className={`text-white fill-white ${pulse ? 'blood-pulse' : ''}`} />
                </div>
              </div>
              <div>
                <h1 className="text-base font-black leading-none tracking-tight">
                  <span className="text-red-600">Blood</span><span className="text-red-500 mx-0.5">🩸</span><span className="text-zinc-900 dark:text-zinc-100">Doctor</span>
                </h1>
                <p className="text-[10px] text-zinc-400 font-semibold tracking-widest uppercase mt-0.5">TSOAC Reverse-Master</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 transition-colors">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${activeTab === tab.id ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}`}>
                  {tab.icon}{tab.short}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'quiz' && quizScore === null && (
                <Badge variant="outline" className={`text-xs font-bold hidden sm:flex dark:border-zinc-700 ${canSubmit ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' : ''}`}>
                  {totalAnswered}/10
                </Badge>
              )}
              <button onClick={() => setDark(d => !d)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                {dark ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            </div>
          </div>

          <div className="md:hidden flex border-t border-zinc-100 dark:border-zinc-800">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 text-[10px] font-bold transition-colors ${activeTab === tab.id ? 'text-red-600 border-t-2 border-red-600 -mt-px' : 'text-zinc-400 dark:text-zinc-500'}`}>
                {tab.icon}{tab.short}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 relative z-10">

          {/* ═══════════ OVERVIEW ═══════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-6 float-up">
              <div>
                <h2 className="text-2xl font-black mb-1">Pharmacokinetic Atlas</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-2xl">Mastering half-life and clearance pathways predicts bleeding risk and drives reversal strategy.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {drugData.map(drug => (
                  <TiltCard key={drug.name}>
                    <Card className={`border-2 ${drug.border} bg-white dark:bg-zinc-900 h-full transition-colors duration-300`}>
                      <CardHeader className={`${drug.bg} rounded-t-xl pb-4 transition-colors duration-300`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-xl font-black">{drug.name}</CardTitle>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">{drug.type}</p>
                          </div>
                          <Badge className={`${drug.badge} text-[10px] font-bold border-0 shrink-0 mt-0.5`}>{drug.target}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-5 space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          {[{ label: 'T-Max', val: drug.tMax }, { label: 'Half-Life', val: drug.halfLife }].map(item => (
                            <div key={item.label} className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 transition-colors">
                              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">{item.label}</p>
                              <p className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">{item.val}</p>
                            </div>
                          ))}
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Renal Clearance</span>
                            <span className={`text-sm font-black ${drug.textAccent}`}>{drug.renalExcretion}%</span>
                          </div>
                          <AnimatedBar value={drug.renalExcretion} color={drug.bar} />
                        </div>
                        <Separator className="dark:border-zinc-700" />
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-2">Reversal</p>
                          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 leading-relaxed">{drug.reversal}</p>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 flex gap-2 transition-colors">
                          <Brain size={13} className="text-zinc-400 mt-0.5 shrink-0" />
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{drug.notes}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TiltCard>
                ))}
              </div>

              <TiltCard>
                <div className="rounded-xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg,#2563eb 0%,#4f46e5 50%,#7c3aed 100%)' }}>
                  <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, white, transparent 40%)` }} />
                  <div className="relative p-6 flex items-start gap-4">
                    <div className="p-2.5 bg-white/15 rounded-lg mt-0.5 shrink-0"><Zap size={20} className="text-white" /></div>
                    <div>
                      <h4 className="font-black text-lg text-white mb-1">Dr. Mannan's Insight: The Renal Paradox</h4>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        Dabigatran's 80% renal excretion makes it the most dangerous in AKI — half-life can exceed 24h. Yet it is the <em>only</em> TSOAC cleared by haemodialysis due to low protein binding (~35%). Edoxaban sits in the middle: 50% renal, ~55% protein-bound, partially dialysable. Apixaban/Rivaroxaban are highly protein-bound and dialysis-resistant. And the critical Edoxaban pearl: contraindicated in AF if CrCl &gt;95 mL/min — paradoxical stroke risk from over-rapid clearance.
                      </p>
                    </div>
                  </div>
                </div>
              </TiltCard>

              <Card className="dark:bg-zinc-900 dark:border-zinc-800 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-black flex items-center gap-2">
                    <Activity size={16} className="text-red-500" />Renal Excretion — Interactive Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {drugData.map(drug => (
                    <div key={drug.name} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{drug.name}</span>
                        <span className={`text-sm font-black ${drug.textAccent} tabular-nums`}>{drug.renalExcretion}%</span>
                      </div>
                      <div className="relative">
                        <AnimatedBar value={drug.renalExcretion} color={drug.bar} />
                        <div className={`absolute inset-0 ${drug.bar} opacity-0 group-hover:opacity-10 rounded-full transition-opacity`} />
                      </div>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 h-4 opacity-0 group-hover:opacity-100 transition-opacity">{drug.notes}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ═══════════ MONITORING ═══════════ */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6 float-up">
              <div>
                <h2 className="text-2xl font-black mb-1">Lab Interpretation Matrix</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-2xl leading-relaxed">Knowing which test to trust — and which to dismiss — is often the difference between precision reversal and a clinical disaster.</p>
              </div>
              <Card className="dark:bg-zinc-900 dark:border-zinc-800 transition-colors">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 transition-colors">
                          <th className="text-left px-5 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest w-36">Test</th>
                          {drugData.map(d => (
                            <th key={d.name} className="text-left px-5 py-4">
                              <span className="font-black text-zinc-800 dark:text-zinc-200">{d.name}</span>
                              <Badge className={`ml-2 ${d.badge} text-[10px] font-bold border-0`}>{d.target}</Badge>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {labMatrix.map((row, i) => (
                          <tr key={row.test} className={`border-b border-zinc-50 dark:border-zinc-800 transition-colors group ${i % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-50/50 dark:bg-zinc-800/30'} hover:bg-red-50/30 dark:hover:bg-red-950/20`}>
                            <td className="px-5 py-4 font-bold text-zinc-700 dark:text-zinc-300">{row.test}</td>
                            {row.cells.map((cell, ci) => <td key={ci} className={`px-5 py-4 ${cell.cls}`}>{cell.label}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              <div className="grid md:grid-cols-2 gap-5">
                <TiltCard>
                  <Alert className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 h-full transition-colors">
                    <AlertTriangle className="text-amber-600 dark:text-amber-400 shrink-0" size={16} />
                    <AlertDescription className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed ml-1">
                      <strong className="block mb-1">Critical Warning</strong>
                      Anti-Xa assays must be <strong>specifically calibrated</strong> for the drug being tested. Standard LMWH calibrations produce misleading results.
                    </AlertDescription>
                  </Alert>
                </TiltCard>
                <TiltCard>
                  <Alert className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 h-full transition-colors">
                    <Info className="text-blue-600 dark:text-blue-400 shrink-0" size={16} />
                    <AlertDescription className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed ml-1">
                      <strong className="block mb-1">Normal Results Don't Exclude Drug Effect</strong>
                      A normal PT/aPTT does NOT rule out significant Apixaban or Edoxaban levels. Never withhold reversal on a normal routine screen alone.
                    </AlertDescription>
                  </Alert>
                </TiltCard>
              </div>
              <Card className="dark:bg-zinc-900 dark:border-zinc-800 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-black flex items-center gap-2">
                    <FlaskConical size={16} className="text-indigo-500" />Quick Reference: Which Test for Which Drug
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-3">
                  {[
                    { drug: 'Dabigatran', test: 'TT qualitative · Hemoclot diluted TT quantitative', color: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/30' },
                    { drug: 'Rivaroxaban', test: 'Calibrated anti-Xa (rivaroxaban-specific — not LMWH)', color: 'border-l-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' },
                    { drug: 'Apixaban', test: 'Calibrated anti-Xa (apixaban-specific); PT unreliable', color: 'border-l-violet-500 bg-violet-50 dark:bg-violet-950/30' },
                    { drug: 'Edoxaban', test: 'Calibrated anti-Xa (edoxaban-specific); PT mildly ↑ but not quantitative', color: 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' }
                  ].map(item => (
                    <div key={item.drug} className={`border-l-4 ${item.color} pl-4 py-2.5 rounded-r-lg transition-colors`}>
                      <p className="font-black text-sm text-zinc-800 dark:text-zinc-200">{item.drug}</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">{item.test}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ═══════════ STRATEGY ═══════════ */}
          {activeTab === 'strategy' && (
            <div className="space-y-6 float-up">
              <div>
                <h2 className="text-2xl font-black mb-1">Clinical Management Protocol</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-2xl leading-relaxed">Stepwise approach from minor nuisance to life-threatening haemorrhage — with specific agents and doses.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                <TiltCard>
                  <Card className="border-2 border-yellow-200 dark:border-yellow-800 bg-white dark:bg-zinc-900 h-full transition-colors">
                    <CardHeader className="bg-yellow-50 dark:bg-yellow-950/30 rounded-t-xl pb-3 transition-colors">
                      <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-full bg-yellow-400" /><CardTitle className="text-sm font-black uppercase tracking-tight">Minor Bleeding</CardTitle></div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                      {['Local compression / packing', 'Delay or omit next TSOAC dose', 'Re-check coagulation labs at 4h', 'Ensure adequate hydration', 'Consider wound care / ENT review'].map(s => (
                        <div key={s} className="flex items-start gap-2.5 group"><CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" /><span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{s}</span></div>
                      ))}
                    </CardContent>
                  </Card>
                </TiltCard>
                <TiltCard>
                  <Card className="border-2 border-orange-200 dark:border-orange-800 bg-white dark:bg-zinc-900 h-full transition-colors">
                    <CardHeader className="bg-orange-50 dark:bg-orange-950/30 rounded-t-xl pb-3 transition-colors">
                      <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-full bg-orange-500" /><CardTitle className="text-sm font-black uppercase tracking-tight">Moderate Bleeding</CardTitle></div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                      {['IV fluid resuscitation', 'Activated charcoal if <2h post-ingestion', 'Tranexamic Acid 1g IV', 'Consider transfusion thresholds', 'Haematology review + monitoring'].map(s => (
                        <div key={s} className="flex items-start gap-2.5 group"><CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" /><span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{s}</span></div>
                      ))}
                    </CardContent>
                  </Card>
                </TiltCard>
                <TiltCard>
                  <Card className="border-2 border-red-300 dark:border-red-800 bg-white dark:bg-zinc-900 h-full transition-colors">
                    <CardHeader className="bg-red-50 dark:bg-red-950/30 rounded-t-xl pb-3 transition-colors">
                      <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" /><CardTitle className="text-sm font-black uppercase tracking-tight text-red-800 dark:text-red-400">Life-Threatening</CardTitle></div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                      {/* Dabigatran */}
                      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-red-200 dark:border-red-900 p-3 hover:border-red-400 transition-colors">
                        <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Dabigatran</p>
                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Idarucizumab 5g IV (preferred)</p>
                        <p className="text-xs text-zinc-500 mt-0.5 italic">or aPCC (FEIBA) 80 U/kg if unavailable</p>
                      </div>
                      {/* Apixaban / Rivaroxaban — NICE TA697 restricted */}
                      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-amber-300 dark:border-amber-700 p-3 hover:border-amber-500 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">Apixaban / Rivaroxaban</p>
                          <span className="text-[9px] font-black bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-600">NICE TA697</span>
                        </div>
                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Andexanet Alfa — GI tract bleeds only</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 font-semibold">⚠ NICE restriction: GI tract life-threatening bleeds ONLY</p>
                        <p className="text-xs text-zinc-500 mt-0.5 italic">All other sites → 4F-PCC 50 U/kg (andexanet not NICE-approved)</p>
                      </div>
                      {/* Edoxaban — andexanet not NICE-approved */}
                      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-red-200 dark:border-red-900 p-3 hover:border-red-400 transition-colors">
                        <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Edoxaban</p>
                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">4F-PCC 50 U/kg</p>
                        <p className="text-xs text-zinc-500 mt-0.5 italic">Andexanet Alfa not NICE-approved for Edoxaban</p>
                      </div>
                      {['Urgent surgical / endoscopic haemostasis', 'Haemodialysis (Dabigatran only)'].map(s => (
                        <div key={s} className="flex items-start gap-2.5"><CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" /><span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{s}</span></div>
                      ))}
                    </CardContent>
                  </Card>
                </TiltCard>
              </div>
              <TiltCard>
                <Alert className="border-2 border-zinc-700 bg-zinc-900 dark:bg-zinc-950 dark:border-zinc-700 transition-colors">
                  <ShieldAlert className="text-red-400 shrink-0" size={16} />
                  <AlertDescription className="text-sm text-zinc-300 leading-relaxed ml-1">
                    <strong className="text-white block mb-1">FFP Has No Role in TSOAC Reversal</strong>
                    Fresh Frozen Plasma does NOT neutralise any of the four TSOACs. It may only be used for concurrent coagulopathy or volume expansion. Definitive surgical haemostasis must run in parallel with pro-haemostatic therapy.
                  </AlertDescription>
                </Alert>
              </TiltCard>
              {/* NICE TA697 Alert */}
              <TiltCard>
                <div className="rounded-xl border-2 border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/40 p-4 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white text-xs font-black">NICE</span>
                    </div>
                    <div>
                      <p className="font-black text-amber-800 dark:text-amber-300 text-sm mb-1">TA697 — Andexanet Alfa: Critical Prescribing Restriction</p>
                      <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed mb-2">
                        NICE Technology Appraisal <strong>TA697</strong> (published May 2021, updated <strong>January 2025</strong>) recommends andexanet alfa only when:
                      </p>
                      <ul className="space-y-1.5 text-sm text-amber-900 dark:text-amber-200">
                        <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" /><span>The patient has <strong>life-threatening or uncontrolled bleeding</strong>, AND</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" /><span>The anticoagulant is <strong>apixaban or rivaroxaban</strong> (not dabigatran, not edoxaban), AND</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" /><span>The bleed is <strong>in the gastrointestinal tract</strong></span></li>
                      </ul>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-3 font-semibold border-t border-amber-300 dark:border-amber-700 pt-2">
                        For ICH, other non-GI life-threatening bleeds, or bleeds on edoxaban → use 4F-PCC 50 U/kg. Andexanet alfa is not NICE-approved in these contexts.
                      </p>
                    </div>
                  </div>
                </div>
              </TiltCard>
              <Card className="dark:bg-zinc-900 dark:border-zinc-800 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-black flex items-center gap-2"><HeartPulse size={16} className="text-red-500" />Reversal Decision Tree</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[{ q: 'Which drug?', a: 'Identify from prescription / drug level if time allows' }, { q: 'Last dose timing?', a: '<2h → consider charcoal; >5 half-lives → drug largely cleared' }, { q: 'Renal function?', a: 'AKI + Dabigatran → assume accumulation; consider dialysis' }, { q: 'Specific antidote available?', a: 'Yes → use it. No → PCC bridge while arranging antidote' }].map(item => (
                      <TiltCard key={item.q}>
                        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 border border-zinc-100 dark:border-zinc-700 hover:border-red-200 dark:hover:border-red-800 transition-colors cursor-default">
                          <p className="font-black text-sm text-zinc-700 dark:text-zinc-200 mb-1.5 flex items-center gap-1.5"><ChevronRight size={13} className="text-red-500" />{item.q}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pl-5">{item.a}</p>
                        </div>
                      </TiltCard>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ═══════════ QUIZ ═══════════ */}
          {activeTab === 'quiz' && (
            <div className="space-y-6 float-up">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl font-black mb-1">Competency Assessment</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">5 MCQs + 5 EMQs · Total 10 marks · Questions reshuffled each attempt</p>
                </div>
                {quizScore === null && (
                  <Badge variant="outline" className={`text-sm font-bold px-3 py-1.5 dark:border-zinc-700 ${canSubmit ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' : ''}`}>
                    {totalAnswered}/10
                  </Badge>
                )}
              </div>

              {/* ── MCQs (static — no TiltCard) ── */}
              {quizScore === null && (
                <>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-full border-0">Part I</Badge>
                      <h3 className="font-black text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-widest">Multiple Choice Questions</h3>
                    </div>
                    <div className="space-y-4">
                      {shuffledMcqs.map((q, idx) => {
                        const isAnswered = selectedAnswers[q.id] !== undefined;
                        return (
                          <Card key={q.id} className={`border-2 transition-colors dark:bg-zinc-900 ${isAnswered ? 'border-zinc-400 dark:border-zinc-600' : 'border-zinc-200 dark:border-zinc-800'}`}>
                            <CardContent className="p-6">
                              <p className="font-bold mb-5 leading-relaxed text-sm">
                                <span className="text-red-500 font-black mr-2">Q{idx + 1}.</span>{q.question}
                              </p>
                              <div className="grid sm:grid-cols-2 gap-2.5">
                                {q.options.map((opt, oIdx) => {
                                  const isSel = selectedAnswers[q.id] === oIdx;
                                  return (
                                    <button key={oIdx} onClick={() => handleMcqSelect(q.id, oIdx)}
                                      className={`text-left p-4 rounded-lg border-2 transition-all text-sm font-semibold flex items-center gap-3 cursor-pointer
                                        ${isSel ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900' : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-700'}`}>
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 transition-colors ${isSel ? 'bg-red-500 text-white' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-300'}`}>
                                        {String.fromCharCode(65 + oIdx)}
                                      </div>
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── EMQs (static — no TiltCard) ── */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-indigo-600 text-white text-[11px] font-black px-3 py-1 rounded-full border-0">Part II</Badge>
                      <h3 className="font-black text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-widest">Extended Matching Questions</h3>
                    </div>
                    <Card className="border-zinc-800 bg-zinc-900 dark:bg-zinc-950 text-white mb-4 transition-colors overflow-hidden relative">
                      <div className="absolute inset-0 opacity-10"
                        style={{ background: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, #ef4444, transparent 35%)` }} />
                      <CardContent className="p-5 relative">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Option List</p>
                        <div className="flex flex-wrap gap-2">
                          {emqOptions.map(opt => (
                            <div key={opt.id} className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-3 py-1.5">
                              <span className="font-black text-red-400 text-sm">{opt.id}</span>
                              <span className="text-sm font-semibold text-zinc-200">{opt.label}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <div className="space-y-3">
                      {shuffledEmqs.map((s, idx) => {
                        const answered = emqAnswers[s.id];
                        return (
                          <Card key={s.id} className={`border-2 transition-colors dark:bg-zinc-900 ${answered ? 'border-zinc-400 dark:border-zinc-600' : 'border-zinc-200 dark:border-zinc-800'}`}>
                            <CardContent className="p-5">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                                <div className="flex-1 min-w-0">
                                  <Badge variant="outline" className="text-[10px] font-black text-zinc-400 border-zinc-200 dark:border-zinc-700 mb-2">Scenario {idx + 1}</Badge>
                                  <p className="text-sm font-medium leading-relaxed">{s.text}</p>
                                </div>
                                <div className="shrink-0">
                                  <Select value={emqAnswers[s.id] || ''} onValueChange={val => setEmqAnswers(p => ({ ...p, [s.id]: val }))}>
                                    <SelectTrigger className={`w-44 font-bold text-sm border-2 dark:bg-zinc-800 dark:border-zinc-700 transition-colors ${answered ? 'border-zinc-800 dark:border-zinc-500' : ''}`}>
                                      <SelectValue placeholder="Choose..." />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-zinc-900 dark:border-zinc-700">
                                      {emqOptions.map(o => (
                                        <SelectItem key={o.id} value={o.id} className="font-semibold dark:hover:bg-zinc-800">
                                          <span className="font-black text-red-600 mr-2">{o.id}:</span>{o.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex flex-col items-center gap-3 pt-4">
                    {!canSubmit && <p className="text-sm text-zinc-400 font-medium">{10 - totalAnswered} question{10 - totalAnswered !== 1 ? 's' : ''} remaining</p>}
                    <button onClick={calculateResults} disabled={!canSubmit}
                      className={`relative overflow-hidden px-12 py-4 rounded-full font-black tracking-widest uppercase text-sm transition-all duration-300
                        ${canSubmit ? 'bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-500/30 hover:scale-105 active:scale-95' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'}`}>
                      {canSubmit && <span className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(90deg,transparent,white,transparent)', animation: 'shimmer 2s infinite' }} />}
                      Submit Assessment
                    </button>
                  </div>
                </>
              )}

              {/* ── Results: inline review + final assessment ── */}
              {quizScore !== null && (
                <div className="space-y-6">
                  {/* MCQ review */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-full border-0">Part I</Badge>
                      <h3 className="font-black text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-widest">MCQ Review</h3>
                    </div>
                    <div className="space-y-4">
                      {shuffledMcqs.map((q, idx) => {
                        const isCorrect = selectedAnswers[q.id] === q.correct;
                        return (
                          <Card key={q.id} className={`border-2 transition-colors dark:bg-zinc-900 ${isCorrect ? 'border-emerald-200 dark:border-emerald-800' : 'border-red-200 dark:border-red-900'}`}>
                            <CardContent className="p-6">
                              <p className="font-bold mb-4 leading-relaxed text-sm">
                                <span className="text-red-500 font-black mr-2">Q{idx + 1}.</span>{q.question}
                              </p>
                              <div className="grid sm:grid-cols-2 gap-2.5 mb-4">
                                {q.options.map((opt, oIdx) => {
                                  const isSel = selectedAnswers[q.id] === oIdx;
                                  const isRight = oIdx === q.correct;
                                  const isWrongSel = isSel && !isRight;
                                  return (
                                    <div key={oIdx}
                                      className={`p-4 rounded-lg border-2 text-sm font-semibold flex items-center gap-3 cursor-default
                                        ${isRight ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200'
                                        : isWrongSel ? 'bg-red-50 dark:bg-red-950/50 border-red-400 dark:border-red-700 text-red-800 dark:text-red-200'
                                        : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400'}`}>
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${isRight ? 'bg-emerald-500 text-white' : isWrongSel ? 'bg-red-500 text-white' : 'bg-zinc-200 dark:bg-zinc-600 text-zinc-500'}`}>
                                        {String.fromCharCode(65 + oIdx)}
                                      </div>
                                      {opt}
                                    </div>
                                  );
                                })}
                              </div>
                              <Alert className={`border transition-colors ${isCorrect ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30' : 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30'}`}>
                                <Info size={14} className={`shrink-0 ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
                                <AlertDescription className={`text-xs leading-relaxed ml-1 ${isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
                                  <strong>{isCorrect ? '✓ Correct. ' : '✗ Incorrect. '}</strong>{q.insight}
                                </AlertDescription>
                              </Alert>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {/* EMQ review */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-indigo-600 text-white text-[11px] font-black px-3 py-1 rounded-full border-0">Part II</Badge>
                      <h3 className="font-black text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-widest">EMQ Review</h3>
                    </div>
                    <div className="space-y-3">
                      {shuffledEmqs.map((s, idx) => {
                        const answered = emqAnswers[s.id];
                        const isCorrect = answered === s.answer;
                        return (
                          <Card key={s.id} className={`border-2 transition-colors dark:bg-zinc-900 ${isCorrect ? 'border-emerald-200 dark:border-emerald-800' : 'border-red-200 dark:border-red-900'}`}>
                            <CardContent className="p-5">
                              <div className="flex items-start gap-3">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                  <span className="text-white text-xs font-black">{isCorrect ? '✓' : '✗'}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase mb-1">Scenario {idx + 1}</p>
                                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed mb-2">{s.text}</p>
                                  <div className="flex flex-wrap gap-2 text-xs">
                                    <span className={`px-2.5 py-1 rounded-full font-bold ${isCorrect ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 line-through'}`}>
                                      Your answer: {emqOptions.find(o => o.id === answered)?.label || 'Not answered'}
                                    </span>
                                    {!isCorrect && (
                                      <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                                        Correct: {emqOptions.find(o => o.id === s.answer)?.label}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Final Assessment ── */}
                  <div className="pt-4 border-t-2 border-dashed border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                      <span className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-3">Final Assessment</span>
                      <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                    </div>
                    <FinalAssessment
                      quizScore={quizScore}
                      shuffledMcqs={shuffledMcqs}
                      shuffledEmqs={shuffledEmqs}
                      selectedAnswers={selectedAnswers}
                      emqAnswers={emqAnswers}
                      onReset={handleReset}
                      onTabChange={setActiveTab}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* ─── Footer ─── */}
        <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 mt-12 py-6 px-4 sm:px-8 transition-colors duration-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-md">
                <Droplet size={14} className="text-white fill-white" />
              </div>
              <div>
                <p className="font-black text-sm"><span className="text-red-600">Blood</span><span className="text-red-500 mx-0.5">🩸</span>Doctor</p>
                <p className="text-xs text-red-600 dark:text-red-400 font-bold">Dr Abdul Mannan FRCPath FCPS · Consultant Haematologist</p>
              </div>
            </div>
            <div className="flex items-center gap-5 text-xs text-zinc-400 font-semibold flex-wrap justify-center">
              <div className="flex items-center gap-1.5"><User size={12} className="text-red-500" />blooddoctor.co@gmail.com</div>
              <div className="flex items-center gap-1.5"><Activity size={12} className="text-red-500" />Director, Bangor Haemophilia Centre · BCUHB</div>
            </div>
            <Badge variant="outline" className="text-[10px] font-black text-zinc-400 border-zinc-200 dark:border-zinc-700 uppercase tracking-widest">Postgraduate Education</Badge>
          </div>
        </footer>
      </div>
    </>
  );
}
