import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>

      {/* Nav */}
      <nav className="border-b px-6 py-4" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="bg-white rounded-xl px-3 py-1.5">
            <Image src="/runforge_logo.png" alt="RunForge" width={160} height={32} className="object-contain" style={{ height: '32px', width: 'auto' }} priority />
          </div>
          <div className="flex items-center gap-6">
            <a href="/blog" className="text-sm text-slate-400 hover:text-white transition-colors">Blog</a>
            <a href="mailto:support@runforge.ca" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="gradient-hero flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent)" }}>
          RunForge
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl">
          Software built for automation
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mb-16">
          We build reliable tools for teams that need things to just work.
        </p>

        {/* Products */}
        <div className="w-full max-w-4xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-6">Our Products</p>
          <div className="grid sm:grid-cols-2 gap-6">

            {/* ForgeDrop card */}
            <a
              href="https://forgedrop.runforge.ca"
              className="card-glow group block rounded-2xl p-6 text-left transition-all hover:scale-[1.02]"
              style={{ background: "var(--muted)" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="/forgedrop_logo.png"
                  alt="ForgeDrop"
                  width={48}
                  height={48}
                  className="object-contain rounded-xl"
                />
                <div>
                  <div className="text-white font-bold text-lg">ForgeDrop</div>
                  <div className="text-xs text-slate-500">Folder monitoring & automation</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Watch folders on any server and trigger webhooks, emails, scripts, database writes, and more the moment a file changes. Free to start, no cloud required.
              </p>
              <span
                className="inline-flex items-center gap-1 text-sm font-medium transition-colors"
                style={{ color: "var(--accent)" }}
              >
                Learn more →
              </span>
            </a>

            {/* DocForge card */}
            <a
              href="https://docforge.runforge.ca"
              className="card-glow group block rounded-2xl p-6 text-left transition-all hover:scale-[1.02]"
              style={{ background: "var(--muted)" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="/docforge_icon.png"
                  alt="DocForge"
                  width={48}
                  height={48}
                  className="object-cover rounded-xl"
                />
                <div>
                  <div className="text-white font-bold text-lg">DocForge</div>
                  <div className="text-xs text-slate-500">RPA document generation</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Turn meeting transcripts and process notes into complete PDDs, SDDs, UAT Test Plans, and SOPs in seconds. Bring your own AI model — your data never leaves your machine.
              </p>
              <span
                className="inline-flex items-center gap-1 text-sm font-medium transition-colors"
                style={{ color: "var(--accent)" }}
              >
                Learn more →
              </span>
            </a>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t px-6 py-8" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="bg-white rounded-lg px-2 py-1">
            <Image src="/runforge_logo.png" alt="RunForge" width={100} height={28} className="object-contain" style={{ height: '28px', width: 'auto' }} />
          </div>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} RunForge. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-slate-500">
            <a href="mailto:support@runforge.ca" className="hover:text-slate-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
