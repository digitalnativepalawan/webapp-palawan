import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { useContent, type BlogPost } from "@/store/content";
import mqLogo from "@/assets/mq-logo.png";

export const Route = createFileRoute("/")({ component: Index });

function MQLogo({ className = "" }: { className?: string }) {
  return <img src={mqLogo} alt="MQ" className={className} />;
}

function Dot({ className = "" }: { className?: string }) {
  return <span className={`inline-block w-1.5 h-1.5 rounded-full bg-accent ${className}`} />;
}

function Header() {
  const { content } = useContent();
  const h = content.header;
  const theme = useContent((s) => s.theme);
  const toggleTheme = useContent((s) => s.toggleTheme);
  return (
    <header className="grid grid-cols-12 gap-3 md:gap-4 px-4 md:px-6 lg:px-10 pt-5 md:pt-6 pb-4 text-[10px] uppercase tracking-[0.14em]">
      <div className="col-span-8 md:col-span-4">
        <a href="/" className="hover:text-accent transition-colors">
          <div className="text-ink">{h.brand}</div>
          <div className="text-ink-mute mt-0.5 text-[9px] md:text-[10px]">{h.tagline}</div>
        </a>
      </div>
      <div className="col-span-4 md:hidden flex justify-end">
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="border border-line p-1.5 text-ink-dim hover:text-accent hover:border-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          </button>
          <MQLogo className="w-9 h-auto" />
        </div>
      </div>
      <div className="hidden md:flex col-span-6 md:col-span-4 items-start justify-center gap-6">
        <span className="text-ink border-b border-ink">HOME</span>
        <a href="/agents" className="text-ink-dim hover:text-accent transition-colors">OPERATORS</a>
        <a href="/workspace" className="text-ink-dim hover:text-accent transition-colors">WORKSPACE</a>
      </div>
      <div className="col-span-6 md:col-span-3 md:text-right">
        <div className="text-ink flex md:justify-end items-center gap-1.5">{h.rightLine1}<Dot /></div>
        <div className="text-ink-mute mt-0.5">{h.rightLine2}</div>
      </div>
      <div className="hidden md:flex col-span-1 justify-end items-start gap-2">
        <button onClick={toggleTheme} aria-label="Toggle theme" className="border border-line p-1.5 text-ink-dim hover:text-accent hover:border-accent transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        </button>
        <MQLogo className="w-12 h-auto" />
      </div>
    </header>
  );
}

function Hero() {
  const { content } = useContent();
  const h = content.hero;
  return (
    <section className="px-4 md:px-6 lg:px-10">
      <div className="corner border border-line relative overflow-hidden">
        <div className="c1" /><div className="c2" />
        <div className="on-dark-media relative aspect-[3/4] sm:aspect-[16/10] md:aspect-[16/8]">
          <img src={h.image} alt="Palawan sunset" className="img-crisp absolute inset-0 w-full h-full object-cover opacity-90" />
          <div className="img-veil-hero absolute inset-0" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <MQLogo className="w-24 sm:w-32 md:w-40 lg:w-48 h-auto mb-4 md:mb-6" />
            <div className="label text-[9px] md:text-[10px] mb-2 md:mb-3">{h.overline}</div>
            <h1 className="hero-title font-serif text-4xl xs:text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-ink leading-[0.95]">{h.title}</h1>
            <div className="mt-4 md:mt-6 text-[9px] md:text-[10px] uppercase tracking-[0.22em] text-ink-dim">
              <div>{h.subtitle1}</div>
              <div>{h.subtitle2}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post, onOpen }: { post: BlogPost; onOpen: (p: BlogPost) => void }) {
  return (
    <button type="button" onClick={() => onOpen(post)} className="group corner border border-line block relative text-left w-full cursor-pointer">
      <div className="c1" /><div className="c2" />
      <div className="on-dark-media relative aspect-[16/10] overflow-hidden">
        <img src={post.image} alt="" className="img-crisp absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        <div className="img-veil-card absolute inset-0" />
        <div className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.14em] text-accent">{post.category}</div>
      </div>
      <div className="p-4 border-t border-line">
        <div className="label mb-2">{post.date}</div>
        <div className="flex justify-between items-end gap-4">
          <h3 className="font-serif text-xl md:text-2xl text-ink leading-snug whitespace-pre-line">{post.title}</h3>
          <ArrowUpRight className="w-4 h-4 text-accent shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </button>
  );
}

function BlogReader({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  const paragraphs = (post.content || post.excerpt || "Full story coming soon.").split(/\n+/).filter(Boolean);
  return (
    <div className="fixed inset-0 z-[120] bg-background/95 backdrop-blur-sm overflow-y-auto" role="dialog" aria-modal="true">
      <article className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-[10px] uppercase tracking-[0.14em] text-ink-dim flex flex-wrap gap-x-4 gap-y-1 mb-4">
          <span className="text-accent">{post.category}</span>
          <span>{post.date}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-[1.05] whitespace-pre-line mb-6">{post.title}</h1>
        <div className="space-y-5 text-ink text-[15px] sm:text-base leading-[1.75] font-light">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="mt-12 pt-6 border-t border-line flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-ink-dim">
          <span>END OF ARTICLE</span>
          <button type="button" onClick={onClose} className="flex items-center gap-2 border border-line px-3 py-1.5 text-ink hover:border-accent hover:text-accent"><X className="h-3.5 w-3.5" /> Back</button>
        </div>
      </article>
    </div>
  );
}

function Blog() {
  const { content } = useContent();
  const [active, setActive] = useState<BlogPost | null>(null);
  return (
    <section className="px-6 lg:px-10 pt-12 md:pt-16">
      <div className="flex items-end justify-between mb-4 border-t border-line pt-4">
        <div>
          <div className="label">/ BLOG</div>
          <h2 className="font-serif text-2xl md:text-3xl text-ink mt-1">{content.blogTitle}</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {content.blog.map((p) => <BlogCard key={p.id} post={p} onOpen={setActive} />)}
      </div>
      {active && <BlogReader post={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function Footer() {
  const { content } = useContent();
  return (
    <footer className="px-6 lg:px-10 pt-12 pb-6 mt-12 border-t border-line">
      <div className="grid grid-cols-12 gap-4 items-center text-[10px] uppercase tracking-[0.14em]">
        <div className="col-span-12 md:col-span-3">
          <div className="text-ink">{content.footer.brand}</div>
          <div className="text-ink-mute mt-0.5">{content.footer.tagline}</div>
        </div>
        <div className="col-span-12 md:col-span-3 md:text-right">
          <div className="text-ink">{content.footer.copyright}</div>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-background text-ink">
      <Header />
      <Hero />
      <Blog />
      <Footer />
    </main>
  );
}
