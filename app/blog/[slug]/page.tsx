import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { posts, getPost } from "../posts";

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — RunForge Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

// Minimal markdown-to-HTML renderer (handles ##, **bold**, `code`, tables, lists, links)
function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inTable = false;
  let inCode = false;
  let tableRows: string[][] = [];

  function flushTable() {
    if (!tableRows.length) return;
    const [header, , ...body] = tableRows;
    out.push(`<table class="md-table"><thead><tr>${header.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>`);
    body.forEach((row) => out.push(`<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`));
    out.push("</tbody></table>");
    tableRows = [];
    inTable = false;
  }

  function inline(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="md-link">$1</a>');
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code fences
    if (line.startsWith("```")) {
      if (!inCode) { out.push('<pre class="md-pre"><code>'); inCode = true; }
      else { out.push("</code></pre>"); inCode = false; }
      continue;
    }
    if (inCode) { out.push(line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")); continue; }

    // Tables
    if (line.startsWith("|")) {
      inTable = true;
      tableRows.push(line.split("|").filter((_, i, a) => i > 0 && i < a.length - 1).map((c) => inline(c.trim())));
      continue;
    }
    if (inTable) flushTable();

    // Headings
    if (line.startsWith("## ")) { out.push(`<h2 class="md-h2">${inline(line.slice(3))}</h2>`); continue; }
    if (line.startsWith("# "))  { out.push(`<h1 class="md-h1">${inline(line.slice(2))}</h1>`); continue; }

    // Lists
    if (line.startsWith("- ")) { out.push(`<li class="md-li">${inline(line.slice(2))}</li>`); continue; }

    // Blank line
    if (line.trim() === "") { out.push("<br />"); continue; }

    // Paragraph
    out.push(`<p class="md-p">${inline(line)}</p>`);
  }

  if (inTable) flushTable();
  return out.join("\n");
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <div className="bg-white rounded-xl px-3 py-1.5">
              <Image src="/runforge_logo.png" alt="RunForge" width={120} height={28} className="object-contain" style={{ height: '28px', width: 'auto' }} priority />
            </div>
          </Link>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link
              href="https://forgedrop.runforge.ca"
              className="text-sm px-3 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ background: "var(--accent-dark)" }}
            >
              ForgeDrop
            </Link>
            <Link
              href="https://docforge.runforge.ca"
              className="text-sm px-3 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ background: "var(--accent-dark)" }}
            >
              DocForge
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-500 mb-8">
          <Link href="/blog" className="hover:text-slate-300 transition-colors">Blog</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">{post.title}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
            <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span>·</span>
            <span>{post.readingMins} min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">{post.title}</h1>
          <p className="text-slate-400 text-lg leading-relaxed">{post.description}</p>
        </div>

        {/* CTA banner */}
        <div
          className="rounded-xl px-5 py-4 mb-10 flex items-center justify-between gap-4 flex-wrap border"
          style={{ background: "rgba(79,142,247,0.08)", borderColor: "rgba(79,142,247,0.25)" }}
        >
          <div>
            <div className="text-white font-semibold text-sm">Try ForgeDrop free</div>
            <div className="text-slate-400 text-xs mt-0.5">2 folders, all actions — no credit card needed.</div>
          </div>
          <Link
            href="https://forgedrop.runforge.ca"
            className="text-sm px-4 py-2 rounded-lg text-white font-medium whitespace-nowrap"
            style={{ background: "var(--accent-dark)" }}
          >
            Download Free →
          </Link>
        </div>

        {/* Content */}
        <article
          className="prose-article"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* Footer CTA */}
        <div
          className="mt-16 rounded-2xl p-8 text-center border"
          style={{ background: "var(--muted)", borderColor: "var(--border)" }}
        >
          <div className="text-2xl mb-3">📂</div>
          <h3 className="text-xl font-bold text-white mb-2">Ready to automate your folders?</h3>
          <p className="text-slate-400 text-sm mb-6">ForgeDrop is free to start — no credit card, no time limit.</p>
          <Link
            href="https://forgedrop.runforge.ca"
            className="inline-block px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #4f8ef7, #2563eb)" }}
          >
            Download ForgeDrop Free →
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to all posts
          </Link>
        </div>
      </main>

      <footer className="border-t px-6 py-8 mt-8" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <span>© {new Date().getFullYear()} RunForge</span>
          <Link href="https://forgedrop.runforge.ca" className="hover:text-slate-300 transition-colors">
            ForgeDrop →
          </Link>
        </div>
      </footer>
    </div>
  );
}
