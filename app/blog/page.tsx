import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { posts } from "./posts";

export const metadata: Metadata = {
  title: "Blog — RunForge",
  description: "Guides and tutorials on Windows folder monitoring, file automation, and event-driven workflows.",
};

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
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
            <Link href="/blog" className="text-white font-medium">Blog</Link>
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

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-3">Blog</h1>
        <p className="text-slate-400 mb-12 text-lg">
          Guides on Windows automation, folder monitoring, and event-driven workflows.
        </p>

        <div className="space-y-6">
          {sorted.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl p-7 border transition-all hover:-translate-y-0.5"
              style={{ background: "var(--muted)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                <span>·</span>
                <span>{post.readingMins} min read</span>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2 leading-snug">{post.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{post.description}</p>
              <span className="inline-block mt-4 text-sm font-medium" style={{ color: "var(--accent)" }}>
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t px-6 py-8 mt-16" style={{ borderColor: "var(--border)" }}>
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
