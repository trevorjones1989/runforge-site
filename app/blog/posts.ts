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
]

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}
