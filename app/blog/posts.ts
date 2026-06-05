export type Post = {
  slug: string
  title: string
  description: string
  date: string
  readingMins: number
  content: string
}

export const posts: Post[] = [
  {
    slug: 'windows-folder-monitoring-automation',
    title: 'How to Monitor a Windows Folder and Trigger Automation Automatically',
    description: 'Learn how to watch a Windows folder for new files and automatically trigger actions like emails, webhooks, and file transfers — without writing scripts.',
    date: '2026-05-20',
    readingMins: 6,
    content: `
## The Problem: Files Arrive, Nothing Happens

In most Windows environments, files land in folders — incoming invoices, EDI files, scanned documents, reports from machines — and someone has to manually check for them, process them, and move them along. Even when that job is automated, it usually means a PowerShell script running on a timer, polling every few minutes, burning CPU and missing files that arrive between runs.

There's a better way.

## How Windows Folder Monitoring Works

Windows exposes a native API called the **FileSystemWatcher** that fires events the instant a file is created, modified, deleted, or renamed inside a directory. Unlike polling, it's event-driven: zero CPU when nothing is happening, and near-instant response — typically under 50ms — when something does.

The challenge is building reliable automation on top of it. A raw FileSystemWatcher fires duplicate events, misses files that are still being written, and gives no built-in way to call a webhook, send an email, or transfer a file.

## What You Can Do When a File Arrives

Once you have reliable folder monitoring in place, you can trigger almost any downstream action:

- **Send an email** to an operations team when a new invoice arrives
- **Fire a webhook** to kick off a workflow in Zapier, Make, or your own API
- **Transfer the file via SFTP** to a vendor or partner server automatically
- **Run a PowerShell or batch script** to process or transform the file
- **Post a Slack or Teams message** so the right people are notified instantly
- **Upload to S3 or Azure Blob** for cloud archival or further processing
- **Write a record to a SQL database** for audit or downstream querying

All of this can happen within milliseconds of the file landing — no polling, no cron jobs, no manual checks.

## Setting Up Folder Monitoring Without Writing Code

[ForgeDrop](https://forgedrop.runforge.ca) is a Windows desktop application built on the native FileSystemWatcher API. You configure folders and rules through a GUI — no scripting required for most workflows.

Here's the basic setup:

**1. Add a folder to watch**

Point ForgeDrop at any local or network-mounted directory. It registers a native OS watcher immediately. For UNC paths (\\\\server\\share) it automatically switches to polling mode to handle network latency.

**2. Define a rule**

Choose which event fires the rule: file added, file changed, or file deleted. Filter by file name pattern — *.pdf, report-*.xlsx, invoice_* — so only the right files trigger the rule.

**3. Add an action**

Pick what happens: send an email, fire a webhook, run a script, transfer via SFTP, post to Slack. You can chain multiple actions on a single rule, and add conditions so the rule only fires on files above a certain size or within a certain age.

## Advanced: File Stabilisation

One common problem with folder watching is that large files trigger events while they're still being written. ForgeDrop has a **settle time** setting that debounces the event — it waits until the file hasn't changed for a configurable number of milliseconds before firing the rule. This prevents partial-file processing on slow network shares or large uploads.

## Monitoring Subfolders

ForgeDrop supports recursive subfolder monitoring with a configurable depth limit. Watch an entire directory tree, or limit to immediate subdirectories only. It will warn you if two folders overlap so you don't process files twice.

## Running as a Windows Service

For production environments, ForgeDrop's server component can be installed as a Windows Service using NSSM. It starts automatically at boot, logs to rotating log files, and runs headlessly — no user session required.

## Try It Free

ForgeDrop is free to start — two folders, three rules per folder, all action types included. No credit card required.

[Download ForgeDrop free →](https://forgedrop.runforge.ca)
    `.trim(),
  },

  {
    slug: 'trigger-webhook-file-created-windows',
    title: 'Trigger a Webhook When a File is Created in Windows — No Code Required',
    description: 'How to fire an HTTP webhook automatically when a file lands in a Windows folder. Works with Zapier, Make, n8n, and any custom API endpoint.',
    date: '2026-05-22',
    readingMins: 5,
    content: `
## The Use Case

You have a Windows folder — maybe a shared network drive, a scan-to-folder output, or a drop zone from a vendor — and you need something to happen in another system the moment a file arrives. You want to call a URL. No polling. No manual triggers. Just: file lands → webhook fires.

This is exactly what event-driven file monitoring is for.

## Why Not Just Use Task Scheduler?

Task Scheduler runs on a fixed interval — every minute, every 5 minutes. Between runs, files pile up silently. You also get no file context passed to the script: no filename, no path, no event type. You have to write the polling logic yourself, track which files you've already seen, and handle edge cases like files that arrive mid-scan.

A native FileSystemWatcher approach fires once per event, passes full file context, and has no minimum latency floor.

## What a Webhook Trigger Looks Like

When a file lands, you want to POST something like this to your endpoint:

\`\`\`json
{
  "event": "add",
  "fileName": "invoice_2026_0482.pdf",
  "filePath": "C:\\\\Incoming\\\\Invoices\\\\invoice_2026_0482.pdf",
  "folder": "Invoices",
  "rule": "New Invoice",
  "ts": 1748000000000
}
\`\`\`

Your receiving system — whether it's a Zapier webhook, an n8n trigger, a Make scenario, or your own Express/Flask API — can then parse that payload and do whatever comes next.

## Setting It Up With ForgeDrop

[ForgeDrop](https://forgedrop.runforge.ca) makes this a 2-minute setup:

**Step 1:** Add the folder you want to watch.

**Step 2:** Add a rule — set the trigger event to "File added", set a file pattern like \`*.pdf\` or \`*\` for any file.

**Step 3:** Add a Webhook action. Enter your endpoint URL, choose POST, and optionally customise the body using template variables:

\`\`\`
{
  "file": "{{fileName}}",
  "path": "{{filePath}}",
  "event": "{{eventType}}",
  "time": "{{ts}}"
}
\`\`\`

Leave the body blank and ForgeDrop will send all event fields automatically.

**Step 4:** Hit Start. That's it.

## Template Variables Available

ForgeDrop supports these variables in webhook URLs, bodies, and headers:

| Variable | Value |
|---|---|
| \`{{fileName}}\` | The file's name, e.g. \`report.pdf\` |
| \`{{filePath}}\` | Full path to the file |
| \`{{folderPath}}\` | The watched folder path |
| \`{{eventType}}\` | \`add\`, \`change\`, or \`remove\` |
| \`{{ts}}\` | Unix timestamp in milliseconds |
| \`{{rule}}\` | The name of the rule that fired |

## Authentication Support

If your endpoint requires authentication, ForgeDrop handles:

- **Bearer token** — static token in the Authorization header
- **Pre-fetch token** — call a login endpoint first, extract the token, then call your webhook
- **OAuth2 Client Credentials** — full client ID / secret grant flow

## Works With

- **Zapier** — use a Webhook by Zapier trigger
- **Make (Integromat)** — use a Custom Webhook trigger
- **n8n** — use a Webhook node
- **Power Automate** — use an HTTP request trigger
- **Your own API** — any endpoint that accepts POST requests

## Try It Free

ForgeDrop's free tier includes webhooks and all action types on up to two folders.

[Download ForgeDrop free →](https://forgedrop.runforge.ca)
    `.trim(),
  },

  {
    slug: 'auto-email-notification-file-drop-folder',
    title: 'Auto-Send an Email When a File Lands in a Folder — No Scripts, No Polling',
    description: 'Set up automatic email notifications when files arrive in a Windows folder. Works for shared drives, scan-to-folder, and network drop zones.',
    date: '2026-05-24',
    readingMins: 5,
    content: `
## A Common Problem in Every Office

Files land in shared folders all day — scanned documents, completed reports, EDI files from suppliers, exports from accounting software. Someone needs to know about them. Right now, that probably means checking the folder manually, setting up a clunky alert in Windows, or asking IT to write a PowerShell script that runs on a timer.

There's a simpler way.

## What We're Building

A setup where: **file lands in folder → email is sent automatically** — with the filename, folder name, and timestamp in the message. No manual checking. No polling scripts. No delays.

## The Tool: ForgeDrop

[ForgeDrop](https://forgedrop.runforge.ca) is a Windows desktop app that watches folders using the native Windows FileSystemWatcher API and fires actions the instant something happens. One of those actions is sending an email.

Here's how to set it up in under 5 minutes.

## Step 1: Configure Your SMTP Settings

Go to ForgeDrop's **Settings** tab and enter your outgoing mail server details:

- **Host**: your SMTP server (e.g. \`smtp.gmail.com\`, \`smtp.office365.com\`)
- **Port**: 587 for STARTTLS (recommended), 465 for SSL
- **Username**: your email address
- **Password**: your account password or app-specific password

For Gmail and Outlook with 2FA enabled, you'll need to generate an **app password** in your account security settings.

## Step 2: Add the Folder to Watch

Click **+ Add Folder**, give it a name, and browse to the directory you want to monitor. For network shares (\\\\server\\sharename), ForgeDrop automatically switches to polling mode.

## Step 3: Add a Rule

Click **+ Add Rule** on the folder card:

- **Rule name**: e.g. "New File Alert"
- **File pattern**: \`*\` for any file, or \`*.pdf\` for PDFs only, or \`invoice_*\` for files starting with "invoice"
- **Trigger event**: File added

## Step 4: Add an Email Action

Choose **Email** as the action type and fill in:

- **To**: the recipient's address (or multiple, comma-separated)
- **Subject**: e.g. \`New file received: {{fileName}}\`
- **Body**: e.g. \`A new file arrived in {{folderPath}} at {{ts}}.\`

ForgeDrop supports template variables so you can include file details directly in the message.

## Example Email

> **Subject:** New file received: invoice_2026_0482.pdf
>
> A new file arrived in C:\\Incoming\\Invoices at 1748021600000.
> File: invoice_2026_0482.pdf

## Optional: Conditions and Time Windows

You can add **file conditions** so the rule only fires on files above a certain size (useful for ignoring zero-byte placeholder files) or within a maximum age (useful for avoiding alerts on stale files restored from backup).

You can also restrict rules to a **time window** — for example, only send alerts during business hours (Mon–Fri, 09:00–17:00). Files arriving outside the window are silently ignored.

## Works for Any Drop Zone

This setup works for:

- **Scan-to-folder** — alert staff when a document has been scanned
- **EDI file drops** — notify ops when a supplier drops a transaction file
- **Automated report exports** — email the team when overnight reports are ready
- **FTP/SFTP incoming directories** — get notified when a partner delivers files
- **Any shared network drive** — no infrastructure changes needed

## Running Overnight, Unattended

ForgeDrop can be installed as a **Windows Service** so it runs at boot without anyone logged in. IT staff can manage it remotely via the built-in web interface.

## Try It Free

Two folders, three rules, all action types — free forever.

[Download ForgeDrop free →](https://forgedrop.runforge.ca)
    `.trim(),
  },
  {
    slug: 'rpa-documentation-ai-generated',
    title: 'How to Generate RPA Documentation Automatically with AI',
    description: 'Writing PDDs, SDDs, and UAT Test Plans for RPA projects takes days. Here\'s how AI generation from meeting transcripts cuts that to minutes — without losing quality.',
    date: '2026-06-01',
    readingMins: 6,
    content: `
## The Documentation Bottleneck in RPA Projects

Every UiPath or Power Automate project needs the same set of documents before go-live: a Process Definition Document, a Solution Design Document, a UAT Test Plan, and a Standard Operating Procedure. Collectively, they can take a senior Business Analyst three to five days to write — and that's assuming the process is already well-understood.

Most of that time is not thinking time. It's formatting time: laying out tables, filling in boilerplate sections, cross-referencing field names between documents, reformatting notes from the process walkthrough into the correct structure.

AI generation changes that equation completely.

## What AI-Generated RPA Docs Actually Look Like

A well-structured prompt, given the right context, can produce a complete PDD in the correct format in under a minute. The output includes:

- **Executive summary** with process scope, in-scope/out-of-scope items, and business case
- **As-Is process walkthrough** with steps, decision points, and exception paths
- **To-Be process design** with the automation overlay mapped to each step
- **Business rules and exception handling** table
- **KPIs and success metrics** section
- **Appendix** with data fields, system access requirements, and assumptions

When the input is a meeting transcript or a set of process notes, the model extracts the relevant information and maps it to the document structure — you don't need to do that mapping manually.

## The Input: What You Give It

The source material can be:

- A meeting transcript from a process walkthrough session
- Bullet-point notes from a discovery call
- An existing (poorly formatted) Word document
- A mix of all three

You don't need to pre-format the input or structure it in any particular way. The model is instructed to extract intent, not rely on structure.

## The Output: Ready to Export

[DocForge](https://docforge.runforge.ca) generates the document directly from your input and exports it to DOCX — either with the built-in template or your organisation's branded Word template. The exported file is ready to hand to a client or upload to SharePoint. No post-processing required.

## Bring Your Own Model

DocForge connects to any OpenAI-compatible endpoint. That means:

- **OpenAI** (GPT-4o, GPT-4.1)
- **Azure OpenAI** — use your organisation's existing agreement, keeping data inside your tenant
- **Anthropic** (Claude)
- **Groq** (fast, cheap inference)
- **Ollama or LM Studio** — fully local, no internet, no data leaves your machine

No DocForge subscription involves any AI costs. You pay for your own model usage directly — typically less than $0.10 per document with GPT-4o-mini.

## The Four Documents DocForge Generates

| Document | What it covers |
|---|---|
| **PDD** | Scope, as-is/to-be process, business rules, exceptions, KPIs |
| **SDD** | REFramework architecture, Orchestrator assets, package design, component breakdown |
| **UAT Test Plan** | Happy path, business exception, application exception, and retry test cases |
| **SOP** | Setup, daily monitoring, exception handling guide for operations staff |

## Who It's For

DocForge is built specifically for RPA consultants, Business Analysts, and delivery leads who produce this documentation regularly. It's not a generic AI writing tool — the prompts are written by practitioners who know what a PDD actually needs to contain.

## Try It Free

DocForge is free to start — two projects, five generations, PDD included. No account required, no credit card.

[Download DocForge free →](https://docforge.runforge.ca)
    `.trim(),
  },

  {
    slug: 'pdd-template-uipath-what-to-include',
    title: 'What to Include in a UiPath PDD (Process Definition Document)',
    description: 'A practical guide to every section of a UiPath PDD — what goes in it, why it matters, and how to fill it out without starting from a blank page.',
    date: '2026-06-03',
    readingMins: 7,
    content: `
## What Is a PDD?

A Process Definition Document (PDD) is the foundational document for any RPA project. It defines the process being automated in enough detail that a developer can build a solution without needing to re-interview the business — and enough clarity that a client can sign off on what's in and out of scope before a single line of code is written.

A PDD written well prevents scope creep, misaligned expectations, and UAT failures. A PDD written badly (or skipped entirely) is usually why RPA projects go over budget.

## The Standard Sections

### 1. Document Control

Version number, author, date, review status. Straightforward, but important for audit trails. Always include a change log table.

### 2. Executive Summary

A one-page overview that a non-technical stakeholder can read and understand. Cover:

- **What the process does** in plain English
- **Why it's being automated** (business case, time saving, error reduction)
- **What's in scope** and — just as important — **what's out of scope**
- **Target go-live date** and delivery approach

Keep it to half a page if possible.

### 3. Process Overview

- **Process name** and business unit owner
- **Frequency** — how often does this process run? (daily, on-demand, event-triggered?)
- **Volume** — how many transactions per run? Per month?
- **SLA** — how quickly does the output need to be available?
- **Current effort** — how many FTEs, how many hours per week?
- **Systems involved** — list every application the bot will interact with

### 4. As-Is Process Walkthrough

A step-by-step description of how a human performs the process today. Be specific. Vague steps like "the analyst processes the file" are not useful. Write it at the level of: "The analyst opens [Application X], navigates to [Screen Y], enters [Field Z] from the spreadsheet, clicks Submit."

Include:
- Decision points (if/else branches)
- Exception paths (what happens when the data is missing, the system is down, the file is malformed)
- Manual checks the human performs that the bot will need to replicate

### 5. To-Be Process Design

The same walkthrough, but with the automation overlay applied. Highlight where the bot takes over, where humans remain in the loop, and how exceptions will be handled in code (system exception vs. business exception split).

### 6. Business Rules

A dedicated table for every rule the process must follow. Examples:

| Rule | Description |
|---|---|
| BR-001 | Only process invoices where Amount > $0 |
| BR-002 | Skip records where Status = "Cancelled" |
| BR-003 | Flag for human review if vendor code not found in master list |

Business rules belong here, not buried in the process walkthrough.

### 7. Exception Handling

Split into:
- **Business exceptions** — data issues, records that don't meet rules. The bot flags these and moves on.
- **Application exceptions** — system errors, timeouts, unexpected UI states. The bot retries and escalates.

For each exception type, document: what triggers it, what the bot does, who gets notified.

### 8. Data Fields

A table of every input field the bot reads, and every output field it writes. Include source system, field name, data type, and whether it's mandatory.

### 9. Assumptions and Dependencies

Everything the delivery team is assuming to be true — and what dependencies must be in place for go-live. Examples: "We assume the test environment is stable," "The vendor API key will be provided by [date]," "The process will not change during development."

### 10. KPIs and Success Metrics

How will you measure whether the automation succeeded? At minimum:
- **Processing time per transaction** (before vs. after)
- **Error rate** (before vs. after)
- **FTE hours saved per month**

### 11. Appendix

Any reference material that doesn't fit above: example screenshots, data sample, glossary of business terms.

## How Long Should a PDD Be?

For a simple, single-exception process: 8–12 pages. For a complex multi-path process: 15–25 pages. Anything shorter is probably missing the exception handling. Anything longer is probably duplicating itself.

## Generating a PDD with DocForge

[DocForge](https://docforge.runforge.ca) produces all of the above sections from a meeting transcript or process notes. The output follows the structure described here — formatted, ready to review, and exportable to DOCX in your own Word template.

[Download DocForge free →](https://docforge.runforge.ca)
    `.trim(),
  },

  {
    slug: 'byom-rpa-documentation-data-privacy',
    title: 'Why "Bring Your Own Model" Matters for RPA Documentation',
    description: 'When your RPA documents contain sensitive process data, you need to control where that data goes. Here\'s why BYOM AI tools are the right choice for enterprise automation teams.',
    date: '2026-06-05',
    readingMins: 5,
    content: `
## The Data Privacy Problem with AI Writing Tools

Most AI-assisted writing tools work the same way: you paste your content in, it goes to a cloud server, the model generates a response, and you get the output back. Simple. But for enterprise RPA teams, that model has a serious problem.

Your PDDs, SDDs, and process notes contain:

- Internal system names and architecture details
- Business process logic that may be commercially sensitive
- Employee names and roles
- Customer-facing processes with compliance implications
- Sometimes: data samples and field values from production systems

Pasting any of this into a consumer AI tool likely violates your organisation's data handling policies, your client's NDA, or both.

## The Bring Your Own Model Approach

BYOM (Bring Your Own Model) means the AI tool connects to a model endpoint that you control — rather than a shared cloud service. The tool handles the document structure, the prompts, and the output formatting. You supply the model.

In practice, this means:

**Azure OpenAI** — if your organisation already has an Azure OpenAI agreement, data stays within your Azure tenant. The same Microsoft enterprise data protection you already have applies. No data leaves your existing boundary.

**Ollama or LM Studio** — run a model entirely on your own machine. The data never leaves your network at all, even in transit. GPT-4 level quality is available locally on modern hardware (Llama 3.3, Mistral, Phi-4).

**Your own OpenAI or Anthropic key** — data goes to OpenAI or Anthropic under your API agreement, not through a third-party SaaS vendor's shared account.

## Why This Matters More Than You Think

When you use a SaaS AI writing tool, you are trusting:

1. That the SaaS vendor doesn't log your prompts
2. That the SaaS vendor doesn't use your data for model training
3. That the SaaS vendor's security posture is adequate
4. That their data processing agreement covers your use case

With BYOM, you remove that dependency entirely. Your data goes where you already decided it's allowed to go.

## What DocForge Does

[DocForge](https://docforge.runforge.ca) is a desktop application — it runs on your machine, not in a browser tab backed by a cloud server. You configure your own AI endpoint in Settings:

- Your own OpenAI API key → data goes to OpenAI under your agreement
- Azure OpenAI endpoint + key → data stays in your tenant
- Ollama running locally → data never leaves your machine
- Any OpenAI-compatible endpoint → works out of the box

DocForge itself never sees your content. It connects directly from your machine to the model endpoint you specify.

## The Cost Advantage

As a side effect, BYOM is also significantly cheaper than SaaS AI tools. GPT-4o-mini costs roughly $0.15 per million input tokens. A full PDD generation — even with a detailed transcript — typically uses 2,000–4,000 tokens. That's less than $0.001 per document.

Compare that to AI writing tool subscriptions at $20–$50/month, and the economics are clear — especially if you're generating dozens of documents per month across a delivery team.

## Enterprise-Ready From Day One

DocForge was built for RPA consultants who work with enterprise clients. Data privacy isn't an afterthought — it's the architecture. BYOM means you can use DocForge with confidence in any environment, from a regulated financial services client to a healthcare provider with strict data residency requirements.

[Download DocForge free →](https://docforge.runforge.ca)
    `.trim(),
  },
]

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}
