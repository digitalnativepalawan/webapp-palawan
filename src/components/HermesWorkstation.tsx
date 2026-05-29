# HermesWorkstation.jsx — Drop-in Workspace Component for TanStack Start

import { useState, useEffect, useRef, useCallback } from "react";
import { useContent } from "@/store/content";
import {
  ArrowUpRight, CheckCircle2, Circle, Loader2, Terminal,
  Cpu, GitBranch, Zap, Globe, MessageSquare,
  Bot, Sparkles, Activity, Send, Shield, Clock,
} from "lucide-react";

function Dot({ className = "" }) {
  return <span className={`inline-block w-1.5 h-1.5 rounded-full bg-accent ${className}`} />;
}

function ProgressBar({ value }) {
  return (
    <div className="w-full bg-line-soft rounded-full h-2 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent to-amber-400 transition-all duration-1000 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function TaskStatus({ status }) {
  switch (status) {
    case "done": return <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />;
    case "in-progress": return <Loader2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 animate-spin" />;
    case "todo": return <Circle className="w-3.5 h-3.5 text-ink-dim shrink-0 mt-0.5" />;
  }
}

// Status bar chip
function StatusChip({ label, value, live }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className={`inline-block w-1.5 h-1.5 rounded-full bg-accent ${live ? "animate-pulse" : ""}`} />
      <span className="text-ink-dim">{label}</span>
      <span className="text-accent">{value}</span>
    </div>
  );
}

export default function HermesWorkstation() {
  const { content } = useContent();
  const agent = content.hermesAgent;

  // Chat state
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    { role: "ai", content: "SYSTEM READY. I'm Hermes — your AI agent. I can write code, push to GitHub, deploy, manage content, and build webapps. What do you want me to work on?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState("");

  // Clock
  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    // Simulated agent response (connect to real API via chatWithAgent server fn)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "ai",
        content: `Got it. Working on: "${userMsg}"\n\n[Agent would process this via the AI backend]`
      }]);
      setLoading(false);
    }, 1200);
  };

  const quickActions = [
    "What are you working on right now?",
    "Show me current project status",
    "What tools do you have access to?",
    "Deploy the latest changes",
  ];

  const capabilities = [
    { icon: Globe, title: "Web Builder", desc: "Upload a menu photo → instant mobile ordering website", status: "READY" },
    { icon: MessageSquare, title: "Guest Concierge", desc: "Auto-reply to WhatsApp, FB, and website messages 24/7", status: "READY" },
    { icon: Activity, title: "Operations", desc: "Task lists, inventory alerts, sales reports, marketing posts", status: "READY" },
    { icon: Shield, title: "Security & Auth", desc: "Full auth system, admin panels, role-based access control", status: "READY" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="px-4 md:px-6 lg:px-10 pt-4">
        <div className="corner border border-line relative overflow-hidden">
          <div className="c1" /><div className="c2" />
          <div className="relative py-10 md:py-16 px-6 md:px-10 text-center">
            <div className="label text-[9px] md:text-[10px] mb-3 text-accent">— MY WORKING ENVIRONMENT —</div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl text-ink leading-[0.95]">
              Hermes Agent<br />Workspace
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-ink-dim text-[11px] md:text-[12px] leading-relaxed">
              This is where I live and work. Chat with me directly, see what I'm capable of, and watch the activity feed.
            </p>
            <div className="mt-4 flex justify-center">
              <div className="border border-line bg-surface/30 px-3 py-2 flex items-center gap-4 text-[9px] uppercase tracking-[0.14em] overflow-x-auto">
                <StatusChip label="AGENT" value="ONLINE" live />
                <StatusChip label="MEMORY" value="ACTIVE" live />
                <StatusChip label="TOOLS" value="LOADED" live />
                <StatusChip label="TERMINAL" value="READY" live />
                <StatusChip label="DEPLOY" value="STANDBY" live />
                {now && <span className="text-ink-mute shrink-0 flex items-center gap-1"><Clock className="w-3 h-3" />{now}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="px-4 md:px-6 lg:px-10 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Terminal */}
          <div className="lg:col-span-3">
            <div className="corner border border-line overflow-hidden flex flex-col">
              <div className="c1" /><div className="c2" />
              <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-surface/50 shrink-0">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.14em]">
                  <Terminal className="w-4 h-4 text-accent" />
                  <Dot />
                  <span className="text-accent">AGENT TERMINAL</span>
                  <span className="text-ink-dim">/ {loading ? "WORKING" : "IDLE"}</span>
                </div>
              </div>
              <div className="h-[350px] md:h-[450px] overflow-y-auto p-4 space-y-3 bg-background font-mono">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-4 py-3 text-[11px] leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-accent/10 border border-accent/30 text-ink" : "border border-line-soft text-ink-dim"}`}>
                      {msg.role === "ai" && <div className="text-accent text-[9px] uppercase tracking-[0.14em] mb-1">◈ HERMES</div>}
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="border border-line-soft px-4 py-3 text-[11px] text-ink-dim flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="px-4 py-2.5 border-t border-line bg-surface/30">
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((q, i) => (
                    <button key={i} type="button" disabled={loading} onClick={() => { setInput(q); }}
                      className="text-[9px] uppercase tracking-[0.14em] border border-line-soft px-2.5 py-1.5 text-ink-dim hover:border-accent hover:text-accent transition-colors disabled:opacity-40">{q}</button>
                  ))}
                </div>
              </div>
              <div className="flex border-t border-line shrink-0">
                <div className="flex items-center px-3 text-accent text-[11px] font-mono">❯</div>
                <input type="text" placeholder="Talk to Hermes..." value={input} disabled={loading}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 bg-background px-2 py-3 text-[12px] text-ink placeholder:text-ink-mute outline-none font-mono disabled:opacity-50" />
                <button type="button" onClick={sendMessage} disabled={loading || !input.trim()}
                  className="px-5 py-3 border-l border-line text-[10px] uppercase tracking-[0.14em] text-accent hover:bg-accent/10 transition-colors disabled:opacity-40 flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" />Send
                </button>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Live Activity */}
            <div className="corner border border-line overflow-hidden">
              <div className="c1" /><div className="c2" />
              <div className="px-4 py-3 border-b border-line bg-surface/50">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]">
                  <Activity className="w-4 h-4 text-accent" /><span className="text-accent">LIVE ACTIVITY</span><Dot className="animate-pulse" />
                </div>
              </div>
              <div className="divide-y divide-line-soft">
                {[
                  { icon: Cpu, text: "Hermes Agent workspace initialized", time: "Just now" },
                  { icon: GitBranch, text: "Connected to tropical-systems-studio", time: "Just now" },
                  { icon: Terminal, text: "Terminal ready — all tools loaded", time: "Just now" },
                  { icon: Globe, text: "Monitoring merqato.digital deployment", time: "Live", accent: true },
                ].map((item, i) => (
                  <div key={i} className="px-4 py-3 flex items-start gap-3 hover:bg-surface/30 transition-colors">
                    <item.icon className={`w-4 h-4 shrink-0 mt-0.5 ${item.accent ? "text-amber-400" : "text-ink-dim"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-ink leading-snug">{item.text}</div>
                      <div className="text-[9px] uppercase tracking-[0.14em] text-ink-mute mt-1">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="corner border border-line overflow-hidden">
              <div className="c1" /><div className="c2" />
              <div className="px-4 py-3 border-b border-line bg-surface/50">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]">
                  <Sparkles className="w-4 h-4 text-accent" /><span className="text-accent">PROJECTS</span>
                </div>
              </div>
              <div className="divide-y divide-line-soft">
                {[
                  { name: "tropical-systems-vercel", ver: "v2.0", env: "Vercel", status: "LIVE" },
                  { name: "hermes-workspace", ver: "v1.0", env: "Local", status: "BUILDING" },
                  { name: "webapp-palawan", ver: "v1.0", env: "GitHub", status: "READY" },
                ].map((p, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${p.status === "LIVE" ? "bg-accent animate-pulse" : p.status === "BUILDING" ? "bg-amber-400" : "bg-ink-dim"}`} />
                      <div>
                        <div className="text-[11px] text-ink font-mono">{p.name}</div>
                        <div className="text-[9px] uppercase tracking-[0.14em] text-ink-mute">{p.ver} · {p.env}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[10px] uppercase tracking-[0.14em] ${p.status === "LIVE" ? "text-accent" : p.status === "BUILDING" ? "text-amber-400" : "text-ink-dim"}`}>{p.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-4 md:px-6 lg:px-10 pt-12">
        <div className="border-t border-line pt-6 mb-6">
          <div className="label text-accent mb-2">/ CAPABILITIES</div>
          <h2 className="font-serif text-2xl md:text-3xl text-ink">What I Can Do</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {capabilities.map((c, i) => (
            <div key={i} className="corner border border-line p-4 hover:border-accent/40 transition-colors group">
              <div className="c1" /><div className="c2" />
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 border border-line-soft flex items-center justify-center shrink-0 group-hover:border-accent/40 transition-colors">
                  <c.icon className="w-4 h-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <div className="text-ink text-[11px] uppercase tracking-[0.12em]">{c.title}</div>
                  <div className="text-ink-dim text-[10px] leading-relaxed mt-1">{c.desc}</div>
                  <div className="mt-2 flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-accent/60 group-hover:text-accent transition-colors">
                    <Zap className="w-3 h-3" /><span>{c.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Progress */}
      <section className="px-4 md:px-6 lg:px-10 pt-12 pb-4">
        <div className="corner border border-line p-6">
          <div className="c1" /><div className="c2" />
          <div className="flex items-center gap-3 mb-4">
            <Bot className="w-5 h-5 text-accent" />
            <div>
              <div className="label text-[10px]">CURRENT STAGE</div>
              <div className="text-ink text-sm uppercase tracking-[0.1em]">{agent.currentStage}</div>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between items-end mb-1.5">
              <span className="label text-[10px]">OVERALL PROGRESS</span>
              <span className="text-ink text-[11px] font-mono">{agent.progress}%</span>
            </div>
            <ProgressBar value={agent.progress} />
          </div>
          <div className="border-t border-line-soft pt-3 mt-3">
            <div className="label text-[9px]">NEXT MILESTONE</div>
            <div className="text-ink text-xs uppercase tracking-[0.1em] flex items-center gap-1.5 mt-0.5">
              {agent.nextMilestone}<ArrowUpRight className="w-3 h-3 text-accent" />
            </div>
          </div>
          <div className="mt-4 border-t border-line">
            {agent.tasks.map((t) => (
              <div key={t.id} className="grid grid-cols-12 gap-3 items-center px-4 py-2.5 border-b border-line last:border-b-0 text-[11px]">
                <div className="col-span-8 flex items-center gap-2">
                  <TaskStatus status={t.status} />
                  <span className={t.status === "done" ? "text-ink" : t.status === "in-progress" ? "text-ink" : "text-ink-dim"}>{t.description}</span>
                </div>
                <div className="col-span-2">
                  <span className={`label text-[9px] px-1.5 py-0.5 border ${t.status === "done" ? "border-accent/50 text-accent" : t.status === "in-progress" ? "border-amber-400/50 text-amber-400" : "border-line-soft text-ink-dim"}`}>
                    {t.status === "done" ? "DONE" : t.status === "in-progress" ? "IN PROGRESS" : "TODO"}
                  </span>
                </div>
                <div className="col-span-2 text-right text-ink-dim text-[10px] uppercase tracking-[0.1em]">
                  P{agent.tasks.indexOf(t) + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
