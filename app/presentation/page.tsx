"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  ShieldCheck,
  ShoppingBag,
  Scale,
  Mic,
  Globe,
  Layers,
  TrendingUp,
  Clock,
  CheckCircle2,
  Package,
  Award,
  Maximize2,
} from "lucide-react";
import Link from "next/link";

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    // SLIDE 1: Title
    {
      id: 1,
      tag: "Agent Challenge 2026 — Finalist Showcase",
      title: "Kavi (කවි) — AI Shopping Assistant",
      subtitle: "Transforming Sri Lankan E-Commerce with Culturally-Authentic Conversational Commerce",
      content: (
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto py-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-400 via-purple-600 to-purple-900 p-1 shadow-[0_0_40px_rgba(255,199,0,0.4)] flex items-center justify-center">
              <div className="w-full h-full bg-[#1E0B33] rounded-[22px] flex items-center justify-center">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                  K
                </span>
              </div>
            </div>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 text-2xl"
            >
              ✨
            </motion.span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Kapruka Conversational Agent
            </h2>
            <p className="text-purple-200 text-lg">
              From product discovery to 1-tap paid checkout in <strong className="text-yellow-400">under 90 seconds</strong>.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full pt-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-yellow-400 font-black text-xl">Phase 2</div>
              <div className="text-xs text-purple-200 mt-1">Deep Customer Memory</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-yellow-400 font-black text-xl">Trilingual</div>
              <div className="text-xs text-purple-200 mt-1">Sinhala · English · Tanglish</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-yellow-400 font-black text-xl">100% Grounded</div>
              <div className="text-xs text-purple-200 mt-1">Live Kapruka MCP Tools</div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 2: The Problem
    {
      id: 2,
      tag: "Market Opportunity",
      title: "The Problem with Traditional E-Commerce",
      subtitle: "Why standard search bars and generic chatbots fail modern shoppers",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
              <span>⚠️ The Traditional Experience</span>
            </div>
            <ul className="space-y-3 text-sm text-purple-200/90 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>High Cart Abandonment:</strong> 6+ minutes spent typing street addresses, phone numbers, and delivery dates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Impersonal & Robotic:</strong> Generic bots regurgitate canned FAQs with zero context or customer recognition.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Diaspora Friction:</strong> Overseas Sri Lankans struggle with currency conversion and delivery cutoff uncertainty.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
              <span>✨ The Kavi Transformation</span>
            </div>
            <ul className="space-y-3 text-sm text-purple-200/90 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>1-Tap Frictionless Checkout:</strong> Leverages saved address books to create live pay links instantly.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Phase 2 Customer Memory:</strong> Greets customers by name, tracks past orders, and offers repeat purchase reorders.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Multi-Currency Diaspora Ready:</strong> Real-time conversion across USD, GBP, AUD, EUR, CAD, and LKR.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },

    // SLIDE 3: Phase 2 Personalization
    {
      id: 3,
      tag: "Phase 2 Private Tools",
      title: "Deep Customer Recognition & Memory",
      subtitle: "Turning one-off shoppers into lifelong loyal Kapruka customers",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          <div className="p-5 rounded-3xl bg-white/5 border border-purple-400/20 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-yellow-400/20 text-yellow-300 flex items-center justify-center font-bold text-lg">
                👤
              </div>
              <h4 className="text-base font-bold text-white">Customer Profile</h4>
              <p className="text-xs text-purple-200 leading-relaxed">
                Calls <code className="text-yellow-300">kapruka_customer_details</code> to mount the personalized Welcome Banner and greet with authentic Sri Lankan warmth.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-950/60 text-[11px] font-mono text-purple-300 border border-purple-800/40">
              "Hari, onna! Sandaru 👋"
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-purple-400/20 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-yellow-400/20 text-yellow-300 flex items-center justify-center font-bold text-lg">
                📍
              </div>
              <h4 className="text-base font-bold text-white">1-Tap Address Book</h4>
              <p className="text-xs text-purple-200 leading-relaxed">
                Calls <code className="text-yellow-300">kapruka_customer_addresses</code> to offer saved addresses in 1 click, bypassing repetitive form filling.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-950/60 text-[11px] font-mono text-purple-300 border border-purple-800/40">
              [ 🏠 4, Church Road, Hatton ]
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-purple-400/20 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-yellow-400/20 text-yellow-300 flex items-center justify-center font-bold text-lg">
                🔁
              </div>
              <h4 className="text-base font-bold text-white">Smart Reorder Engine</h4>
              <p className="text-xs text-purple-200 leading-relaxed">
                Calls <code className="text-yellow-300">kapruka_order_history</code> to detect consumables (cakes, coffee, groceries) and offer instant repeat orders.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-950/60 text-[11px] font-mono text-purple-300 border border-purple-800/40">
              [ 🔁 Order Message in a Bottle Again ]
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 4: UI & UX Innovations
    {
      id: 4,
      tag: "Design Aesthetics & UX",
      title: "Rich In-Chat Conversational Commerce",
      subtitle: "Visual components that do the heavy lifting beyond plain text bubbles",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <Scale size={20} className="text-yellow-400" />
            <h5 className="font-bold text-sm text-white">Side-by-Side Compare</h5>
            <p className="text-xs text-purple-200/80">Interactive spec sheet comparing prices, weight, ratings, and cutoff times.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <ShoppingBag size={20} className="text-yellow-400" />
            <h5 className="font-bold text-sm text-white">Sticky Floating Cart</h5>
            <p className="text-xs text-purple-200/80">Pinned bottom pill showing live totals and instant 1-tap checkout action.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <Package size={20} className="text-yellow-400" />
            <h5 className="font-bold text-sm text-white">Live Status Timeline</h5>
            <p className="text-xs text-purple-200/80">Pulsing radar ring milestones tracking active in-flight orders without leaving chat.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <Sparkles size={20} className="text-yellow-400" />
            <h5 className="font-bold text-sm text-white">Confetti Celebration</h5>
            <p className="text-xs text-purple-200/80">Canvas particle burst in Kapruka brand colors when the pay link is generated.</p>
          </div>
        </div>
      ),
    },

    // SLIDE 5: Cultural & Multilingual Fluency
    {
      id: 5,
      tag: "Sensory & Localization",
      title: "Trilingual Voice & Cultural Fluency",
      subtitle: "Built to feel like chatting with a knowledgeable friend in Colombo",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-white/5 border border-purple-400/20 space-y-4">
            <div className="flex items-center gap-2 text-yellow-400 font-bold text-base">
              <Globe size={18} />
              <span>Full Trilingual Capability</span>
            </div>
            <div className="space-y-3 text-xs text-purple-200">
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
                <span className="font-bold text-white">සිංහල (Sinhala Unicode):</span>
                <p className="italic text-yellow-300 mt-0.5">"ඔබට අවශ්‍ය උපන්දින කේක් වර්ග මෙන්න! Hatton වලට හෙට delivery කරන්න පුළුවන්."</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
                <span className="font-bold text-white">Tanglish / Singlish:</span>
                <p className="italic text-yellow-300 mt-0.5">"Aiyo, don't worry machan! Delivery to Colombo 03 is guaranteed for tomorrow."</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-purple-400/20 space-y-4">
            <div className="flex items-center gap-2 text-yellow-400 font-bold text-base">
              <Mic size={18} />
              <span>Audio Visualizer & Speech Control</span>
            </div>
            <ul className="space-y-3 text-xs text-purple-200 leading-relaxed">
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">⚡</span>
                <span><strong>Live In-Input Equalizer:</strong> Multi-bar waveform dances inside the input bar during voice recording.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">⚡</span>
                <span><strong>Playback Speed Toggle:</strong> Instant switch between <code className="text-yellow-300">1x</code>, <code className="text-yellow-300">1.25x</code>, and <code className="text-yellow-300">1.5x</code> speeds.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">⚡</span>
                <span><strong>Mute Preferences:</strong> One-tap mute button in the header with persistent state.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },

    // SLIDE 6: Architecture & Security
    {
      id: 6,
      tag: "Technical Depth",
      title: "Robust Agentic Architecture & Security",
      subtitle: "Zero hallucinations, resilient fallbacks, and bulletproof security",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
              <Layers size={16} />
              <span>LLM Core & Streaming Pipeline</span>
            </div>
            <p className="text-xs text-purple-200/90 leading-relaxed">
              Powered by <strong>Gemini 3.1 Flash Lite</strong> with seamless <strong>Claude Sonnet</strong> fallback. Server-Sent Events (SSE) provide sub-2-second token streaming with dynamic tool status toasts.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-purple-300 font-mono">
              <span>Next.js 14 App Router · TypeScript · MCP SDK</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck size={16} />
              <span>Security & Resilience Guards</span>
            </div>
            <ul className="space-y-2 text-xs text-purple-200/90 leading-relaxed">
              <li><strong>Zero Email Guessing:</strong> <code className="text-yellow-300">assertEmailFromConversation</code> protects against account enumeration.</li>
              <li><strong>ASCII Transliteration:</strong> Sanitizes non-ASCII customer inputs to prevent database corruption.</li>
              <li><strong>Hub Fallback Engine:</strong> Suggests nearest logistics hubs (Colombo, Kandy, Galle) when remote towns are unlisted.</li>
            </ul>
          </div>
        </div>
      ),
    },

    // SLIDE 7: Business Impact
    {
      id: 7,
      tag: "Business Impact",
      title: "Quantifiable Impact on Kapruka Commerce",
      subtitle: "Driving measurable revenue growth and frictionless customer experiences",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          <div className="p-6 rounded-3xl bg-white/5 border border-yellow-400/30 text-center space-y-2">
            <Clock size={28} className="mx-auto text-yellow-400" />
            <div className="text-3xl font-black text-white">&lt; 90 sec</div>
            <div className="text-xs text-purple-200">End-to-End Checkout Time (70% reduction vs traditional flow)</div>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-yellow-400/30 text-center space-y-2">
            <TrendingUp size={28} className="mx-auto text-yellow-400" />
            <div className="text-3xl font-black text-white">+35%</div>
            <div className="text-xs text-purple-200">Repeat Purchase Conversion via Proactive Reorder Nudges</div>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-yellow-400/30 text-center space-y-2">
            <Award size={28} className="mx-auto text-yellow-400" />
            <div className="text-3xl font-black text-white">107 Tests</div>
            <div className="text-xs text-purple-200">100% Automated Unit & Integration Test Coverage</div>
          </div>
        </div>
      ),
    },

    // SLIDE 8: Live Demo & Q&A
    {
      id: 8,
      tag: "Live Demonstration",
      title: "Experience Kavi Live in Action",
      subtitle: "Ready for live multi-turn shopping and judges' questions",
      content: (
        <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto py-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/60 to-purple-800/60 border border-yellow-400/40 backdrop-blur-xl shadow-2xl space-y-4">
            <h4 className="text-xl font-bold text-white">
              🎬 Ready for the Live Agent Walkthrough
            </h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              We will demonstrate customer recognition (<code className="text-yellow-300">sandaru.perera@gmail.com</code>), side-by-side product comparison, and 1-tap checkout.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-extrabold text-sm shadow-lg transition-all transform hover:scale-105"
              >
                <span>Launch Kavi Live Demo →</span>
              </Link>
            </div>
          </div>

          <div className="text-purple-300 text-xs font-semibold">
            Thank you, Judges & Kapruka Team! We are ready for your questions.
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen w-full bg-[#120624] text-white flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden relative font-sans">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP BAR */}
      <header className="flex items-center justify-between z-10 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-700 flex items-center justify-center font-bold text-yellow-300 text-sm shadow-md">
            K
          </div>
          <span className="font-bold text-sm tracking-wide text-white">
            Kavi Presentation Deck
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-purple-300">
          <span className="font-mono">
            Slide {currentSlide + 1} / {slides.length}
          </span>
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors text-xs"
          >
            Go to App ↗
          </Link>
        </div>
      </header>

      {/* MAIN SLIDE AREA */}
      <main className="flex-1 flex items-center justify-center py-6 z-10">
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {/* Tag & Title Header */}
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-yellow-300 text-xs font-extrabold uppercase tracking-wider">
                  {slide.tag}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-base text-purple-200/90 font-medium">
                  {slide.subtitle}
                </p>
              </div>

              {/* Slide Content Body */}
              <div className="pt-2">{slide.content}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* BOTTOM CONTROLS & TIMELINE */}
      <footer className="flex items-center justify-between z-10 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? "w-8 bg-yellow-400 shadow-[0_0_10px_rgba(255,199,0,0.5)]"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed shadow-md transition-all cursor-pointer"
            aria-label="Next Slide"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>
    </div>
  );
}
