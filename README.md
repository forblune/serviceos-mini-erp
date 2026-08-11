# ServiceOS Mini ERP

A bilingual, responsive portfolio demo for small service businesses. It connects the operating loop from quote to project delivery, billing, revision triage, and audit history.

- Live demo: https://forblune-serviceos.rjsgml13486.chatgpt.site
- GitHub Pages: https://forblune.github.io/serviceos-mini-erp/
- Korean / English UI
- Owner, operations, and finance role views
- Projects, invoices, collections, revisions, and audit history
- Responsive layouts verified at 1440px, 768px, and 390px
- CSV export and local-only quote draft interaction

All names, figures, customers, and transactions in this public demo are fictional. No real client, contract, or payment data is included.

## Product benchmark

The workflow and presentation were informed by a read-only review of established service-business CRM, project, and invoicing products. See [benchmark notes](docs/benchmark-notes.md) for the references, adopted patterns, deliberate differences, and the reusable portfolio quality gate.

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run build
npm run build:pages
```
