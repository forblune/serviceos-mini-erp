# ServiceOS benchmark notes

This public portfolio project was shaped after reviewing established service-business CRM, project, and invoicing products. The goal was to learn from their information architecture and workflow clarity without copying copy, layouts, screenshots, or assets.

## Reference products

- [HoneyBook](https://www.honeybook.com/) — presents the client journey as one continuous lead-to-payment flow, then supports it with visible product screens and role-specific use cases.
- [Dubsado](https://www.dubsado.com/) — explains operations as a lifecycle from the first inquiry through onboarding, delivery, payment, and closeout.
- [Zoho Books project accounting](https://www.zoho.com/us/books/accounting-software/manage-projects/) — connects projects, billing methods, quotes, invoices, time, expenses, and profitability.
- [Odoo Invoicing](https://www.odoo.com/app/invoicing) — makes invoice status, payment follow-up, recurring billing, and reporting visible in one product story.

## Patterns adopted

1. **One operating narrative** — the overview shows quote, approval, delivery, QA, and collection as one pipeline rather than unrelated modules.
2. **Status before decoration** — overdue invoices, urgent defects, and QA deadlines are visible before secondary detail.
3. **Role-aware navigation** — owner, operations, and finance demo roles expose different views without implying production-grade authorization.
4. **Closeout is part of delivery** — revision, defect, change-request, and clarification states are included instead of stopping at project completion.
5. **Traceability** — audit history shows who changed a stage, payment state, or classification.
6. **Honest public boundary** — all customers, figures, projects, and transactions are fictional, and quote drafts remain on the device.

## Deliberate differences

- ServiceOS is a self-initiated front-end portfolio demo, not a production accounting system.
- It favors a narrow service-business workflow over a large suite of loosely connected modules.
- The public version demonstrates interaction and information architecture without real authentication, payment processing, or customer data.

## Reusable portfolio gate

Future Forblune portfolio projects should pass this sequence before publication:

1. Confirm live demand from current freelance postings.
2. Review at least three strong products or sites in the same category.
3. Record common patterns, user risks, and a clear point of difference.
4. Build with original copy, UI, data, and assets.
5. Verify desktop, tablet, and mobile layouts plus keyboard and reduced-motion behavior.
6. Publish only measured outcomes and clearly label fictional or unverified claims.
