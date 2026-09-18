# QA Wolf docs style guide

Rules for the References tab, derived from a full-text style audit of all ~40 pages (rules 1-10), a later page-by-page ordering pass (rule 11), and a site-wide audit of step-by-step instruction formatting (rule 12, which applies beyond the References tab). Apply these when writing new pages or editing existing ones. Each rule names the actual problem found, not a generic writing-advice bullet.

## 1. Terminology — one word per concept

Pick the canonical term and use it everywhere in prose. Don't rename actual API identifiers (type names, field names) to match — only the surrounding sentences.

| Concept | Use | Not |
|---|---|---|
| A sequence of test steps | **flow** | test, test case, workflow (except where it's a literal field/type name, e.g. `workflowsInRunCount`) |
| The account-level container | **workspace** | team (found in four REST response-code tables: "usually indicates a disabled team") |
| A QA Wolf test environment (staging, prod, etc.) | **environment** | — but when a page is actually about an *ephemeral CI-created* environment, say "ephemeral environment" on first use per page so it's never ambiguous with the standing kind |
| The object returned by `createXClient(...)` | **client** | instance — and always name *which* client in prose ("the testkit client," "the emails client") since three packages each have one |
| How an operation reports failure | **throws** (only if the function literally throws) or **returns a `failed`/`aborted` outcome** (if it's a result-object API) | Don't paper over this with one word — testkit throws, `@qawolf/ci-sdk` doesn't, and the docs should state which applies, not sound consistent at the cost of being wrong |
| The Arrange, Act, Assert pattern | **Arrange-Act-Assert (AAA)** on first reference on a page, then **AAA** or **the AAA framework** as the sentence reads best | Arrange, Act, Assert; Arrange/Act/Assert; a bare **AAA** before the page has spelled it out once |

## 2. Cut the filler — a concrete ban list

These phrases showed up repeatedly and add nothing. Delete them; the sentence usually gets shorter and clearer with no rewrite needed.

- "Current behavior from the implementation:" / "Behavior from the implementation:" / "The implementation accepts..." — just state the fact.
- "Current" / "currently" as a reflexive hedge ("Current `GetInboxOptions`," "the current code exposes this," "there is no top-level helper today"). If something is genuinely unstable, say so specifically (e.g. an `<Info>` callout: "This may change before v1") — don't hedge every heading by default.
- "It's worth noting that...", "This is because...", "Reach for X when..." as a soft substitute for a direct instruction.
- Throat-clearing about the document itself: "This page explains...", "The sections below describe..." — cut it, start with the actual content.
- First-person "we"/"us" where QA Wolf is the product (found in lint-rules.mdx: "ask, and we will look at adding it"). See rule 19 — the product is third person, the service team is not.

## 3. One idea per sentence

Several files chain 2-3 clauses with commas and em-dashes into a single sentence a reader has to parse twice:

> "QA Wolf runs Android flows on ephemeral emulators — a fresh emulator is provisioned for each run and discarded when it finishes, so every run starts from a clean, predictable state with nothing carried over from a previous one."

Split into two: state the fact, then state the consequence.

> "QA Wolf runs Android flows on ephemeral emulators. A fresh one is provisioned for each run and discarded when it finishes, so nothing carries over from a previous run."

Rule of thumb: if a sentence has more than one subordinate clause (a "which," a second "so," a parenthetical *and* an em-dash), split it.

## 4. Active voice by default

Passive shows up most in REST docs and disappears almost entirely in Local execution docs — the same tab shouldn't read like two different authors. Rewrite passive constructions to name the actor, usually "you" or the API name:

- "attachments are base64-encoded before the request is sent" → "QA Wolf base64-encodes attachments before sending the request"
- "the response is returned" → "returns a response"

Passive is fine only when the actor is genuinely irrelevant (e.g., "the file is stored in team storage" — nobody cares who stores it).

## 5. Address the reader directly

Reference pages (API signatures, field tables) can stay impersonal — that's normal for a dictionary entry. But guide-shaped content (troubleshooting, walkthroughs, anything telling someone what to do next) should consistently say "you," not switch between "you" and impersonal fragments mid-file the way `emails/troubleshooting.mdx` and `pom/troubleshooting.mdx` currently do. If a Troubleshooting page's Check bullets are written as impersonal fragments ("the workspace's `register-pages` module is side-effect imported..."), keep that style for the whole file rather than dropping into "you" for one entry and back out for the next.

## 6. `<Note>` / `<Tip>` / `<Warning>` / `<Check>` — one job each

These four are currently used interchangeably for the same *kind* of content across different files. Fixed roles going forward:

- **`<Check>`** — a prerequisite the reader needs *before* starting (an API key, a config value, a prior step). Never used for anything else.
- **`<Warning>`** — something that breaks, silently fails, or causes data loss / a wrong result if ignored. If skipping it just makes the docs less complete, it's not a Warning.
- **`<Note>`** — a non-obvious fact worth knowing that isn't dangerous to miss (a default, an edge case, a scoping clarification).
- **`<Tip>`** — optional best-practice advice; the reader is fine without it.

Concrete fix needed: the "use `@qawolf/ci-sdk` instead of calling this endpoint directly" nudge is a `<Warning>` in three REST files and a `<Tip>` in `rest-overview.mdx` — same message, pick one (it's advice, not a hazard, so `<Tip>`).

## 7. Headings: sentence case, everywhere

API reference pages mostly use Title Case ("Primary Exports," "Target Model") while guide pages use sentence case ("The import statement," "What QA Wolf reads") — and a few reference pages break their own Title Case convention mid-file (`android.mdx`'s "Advanced Appium capabilities" sitting under otherwise-Title-Case siblings). Standardize on **sentence case for every heading, in every file** — it's the simpler rule to remember and the one already dominant in the guide-shaped pages.

Troubleshooting headings are the one place content should stay maximally precise: name the exact symptom, in backticks if it's a literal error message or command (`` `outcome` is `"failed"` or `"aborted"` ``), otherwise a short sentence-case phrase. Don't title-case an error message ("Unknown Page: `<name>` When Calling Create") — quote it exactly as it appears, then describe it in sentence case if paraphrasing.

## 8. Examples: always labeled "Example:"

Some files introduce a code sample with a bare "Example:" line, others just let a sentence run into a code block with no label, and one file invents a one-off label ("Real-world example — jump the device clock..."). Standardize: every standalone code sample gets its own "Example:" line (or "Examples:" for multiple). Skip the label only when the code is the direct continuation of a sentence ending in a colon.

## 9. Field-table descriptions: fragments, not sentences

Keep field/parameter tables terse and parallel — a capitalized fragment ending in a period, not a full sentence with a restated subject:

- Good: "Overrides the environment URL. Available in tests as `process.env.URL`."
- Avoid: "This field overrides the environment URL that is used, and it is available in tests as `process.env.URL`."

Don't mix registers within one table (found in `v0-ci-greenlight.mdx`: some rows terse fragments, others full explanatory sentences).

## 10. Return-value phrasing: lead with "Returns"

State what a function returns as its own clause, not folded into a sentence that restates the function name the heading already gives:

- Avoid: "`launch()` starts Android automation for the active flow and returns:"
- Prefer: "Starts Android automation for the active flow. Returns:"

## 11. Section order — resolve forward references, don't separate a promise from its payoff

A prose-level style pass doesn't catch a page whose *sections* are out of order. A later ordering pass over the Flow conventions group (Anatomy of a flow, Share logic across flows, Upload files, Lint rules, Add skills) found five real cases of a page using a term, example, or reference before the section that explains it, or splitting content that explicitly points at itself. Apply these when structuring a page, not just editing sentences within one:

- **Never reference a concept before the section that defines it.** `anatomy-of-a-qa-wolf-test-mobile-edition.mdx`'s Environment variables section said "you typically use them in the Arrange section" while Arrange/Act/Assert was still three sections away; `lint-rules.mdx`'s "Set a rule's severity" example used the rule id `@qawolf/pom-lint/no-wait-for-timeout-in-poms` before the rules table that defines rule ids. Move the definition earlier, or the reference later — never leave the reference first.
- **Keep an explicitly cross-referenced alternative next to what it responds to.** `sharing-code-across-flows.mdx` told readers "if you find yourself branching on `platform.target` frequently, consider splitting into platform-specific flows instead," but the `platform.target` section sat three sections after "Use platform-specific entry points," the pattern it names.
- **Deliver a promise where you make it.** `lint-rules.mdx`'s "Configure rules" section said enabling the plugin "turns on QA Wolf's page object model rules" and linked straight to that table — but the table itself was three sections later. Put the promised content immediately after the section that promises it.
- **Put foundational constraints before the how-to, never hidden in a collapsed accordion.** `Uploading-manually.mdx` buried supported file types in a collapsed `AccordionGroup` at the bottom of the page; readers need to know what they can upload before or while uploading it, not after. Surface load-bearing content as plain text near the top instead of behind a click.
- **When the page's whole point is a shape or mental model, lead with the shape, not the syntax that implements it.** `anatomy-of-a-qa-wolf-test-mobile-edition.mdx` explained imports, the flow wrapper, launch styles, and callback parameters before ever mentioning the Arrange/Act/Assert pattern every flow follows. Move the concept first; the mechanics that build it follow.
- **Order sections by relevance to the page's own topic, not convenience.** In "Share logic across flows," Pass data between flows (literal flow-to-flow data sharing) is more central to a "share ... across flows" page than Use environment variables (single-flow parameterization) — put the more on-topic section first.
- **A page's title is a promise — make sure some section actually keeps it.** `Uploading-manually.mdx` was titled "Upload files" but only ever showed how to *use* an already-uploaded file; the upload step itself was a single link-out sentence. If the title names an action, show that action somewhere on the page, not just a pointer to where it's shown.

## 12. `<Steps>` vs headings/lists — the reader-action test

Mintlify's `<Steps>`/`<Step>` component renders as a numbered visual sequence, but a `<Step>` gets no heading anchor and never appears in the page's "On this page" table of contents — only `##`/`###` headings do (verified by inspecting rendered output). That fact is what should decide which one a piece of content gets:

- Use `<Steps>` when the reader performs an ordered sequence of actions and doing them out of order breaks the outcome (click X, then Y, then paste Z). A page's `##`/`###` headings still organize its topics as usual — a `<Steps>` block can and should sit nested inside one heading's section for that section's own procedure, e.g. `local-execution/set-up-a-project.mdx`: `## Scaffold a new project` contains a `<Steps>` block.
- Never dress up a real procedure as numbered headings ("## Step 1: ...", "### 1. Generate a signed URL") or a bare numbered markdown list, and never chain it as prose ("Enable X, then install Y") — convert it to `<Steps>` instead. Two sequential REST calls where the second consumes the first's output (generate a signed URL, then `PUT` to it) count as a genuine procedure, not a single-request reference.
- Never wrap `<Steps>` around content that isn't actually ordered: independent checklist items, an either/or choice, or a single item with nothing to sequence. If skipping an item or doing them in a different order doesn't change the outcome, use a plain bulleted list (or prose) instead of `<Steps>`.
- A numbered list describing the system's own precedence/fallback order — not a reader action — stays a plain numbered list (e.g. "resolution order: 1. `app.path`, 2. `app.env`, 3. `app.url`" in `android.mdx`). It is not a `<Steps>` candidate.

A `<Step>` may carry a `title` when a short label helps a skimming reader, or stay bare when its first sentence already carries the action — both exist in the docs today; just stay consistent within one file's `<Steps>` blocks.

## 13. Terminology lists — one format: bulleted, bolded term, em-dash

Any run of "term, then its definition" outside a table uses exactly one shape:

```markdown
- **Term** — definition.
```

A survey of the live nav pages found three competing shapes for the same content: bulleted em-dash (Glossary's run statuses, `lint-rules.mdx`'s rule scopes, `ios-device-pools.mdx`, `pom/api-reference/index.mdx`), non-bulleted em-dash paragraphs separated by blank lines (`Pass-data-between-flows.mdx`'s Notes), and the bolded term used as the sentence's own subject with no separator at all (`**Arrange** sets up state before the interaction.` — one list, one page, found nowhere else). Bulleted em-dash won on both usage and legibility, so it's the only one going forward.

- **Never use the bare-subject form.** `**Arrange** sets up state before the interaction.` reads as prose that happens to be bolded, not as a list entry, and it forces trailing-backslash line breaks to hold the items together. Write `- **Arrange** — sets up state before the interaction.`
- **Don't fall back to blank-line-separated paragraphs for long definitions.** There's no length exception: `ios-device-pools.mdx` carries bulleted items running two full sentences with inline links and they scan fine. If an item is too long to bullet, that's a signal the content wants a table or its own subheading, not a different list format.
- **Keep definitions parallel within one list**, per rule 9 — every item a capitalized-or-lowercase fragment in the same register, not some fragments and some full restated-subject sentences.

This is the prose counterpart to rule 9: field tables get terse parallel fragments, and so do terminology lists.

## 14. Heading levels — the title is the only H1

The frontmatter `title` renders as the page's H1, so a `#` heading in the body creates a second one. Levels run from H2 down, and stop at H4:

- **`##`** — a major section of the page.
- **`###`** — a subsection of one of those.
- **`####`** — the deepest heading. Use it sparingly.
- **Bold body copy** — anything below that. If content feels like it needs an H5, it wants a bold lead-in on a paragraph, not another heading level.

Never open a page at `###`, and never skip a level (an `##` followed by a `####`). A site-wide pass found 18 stray H1s across eight pages, plus two pages whose first heading was an `###` with no `##` above it.

Two consequences worth knowing when choosing a level:

- **Only `##`, `###`, and `####` get an anchor and a "On this page" entry** — `#####` and deeper are rendered but silently excluded, as are `<Step>` and `<Accordion>` titles (verified against rendered output). So a heading level is also a decision about whether readers can link to and navigate to that content.
- **Anchors derive from heading text, not level**, so changing a heading's level never breaks an inbound link. Renaming it does.


## 15. Callouts don't stack

Two callouts in a row read as one undifferentiated box and cost each other the emphasis they exist to provide. Never place a `<Note>`, `<Warning>`, `<Tip>`, `<Check>`, or `<Info>` immediately after another one.

If two facts both feel callout-worthy, one of them isn't. Demote the weaker to plain body copy, or merge them if they're really the same point. `mobile-build-testing.mdx` originally ran a `<Note>` straight into a `<Warning>` after its "How it works" steps, and a `<Note>` into a `<Tip>` after its trigger tabs — in both cases the first was ordinary prose wearing a box, and became ordinary prose.

This is rule 6's companion: rule 6 assigns each callout one job, and this one caps how many can sit together. One per stopping point.

## 16. State the requirement, not the reasoning behind it

Two habits pad instructions without making them more actionable. Both were found on `GitLab.mdx` and fixed there:

- **Don't justify a requirement.** "You'll be asked for a Group Access Token with the **Maintainer** role and **API** scope — Developer tokens can't create pipeline checks on protected branches." The reader needs to pick Maintainer; why Developer fails is trivia. Cut to the requirement.
- **Don't illustrate a condition with a case.** "If your GitLab instance does not allow outbound HTTPS connections (for example, an air-gapped GitLab Enterprise installation)" and "Add any other variables your pipeline uses, such as a deployment URL." A reader whose instance blocks outbound HTTPS already knows it does; the example only makes the sentence longer. State the condition and stop.

This is not a ban on explaining consequences. A `<Warning>` whose whole job is "this fails silently if you skip it" is stating what happens, not justifying an instruction — keep that (see rule 6).

## 17. `keywords` frontmatter — an SEO signal, not a search fix

`keywords` is worth adding, but not for the reason it looks like. Verified against Mintlify's docs and a live QA Wolf page:

- It feeds **schema.org structured data**. `docs.qawolf.com/Jira` emits `"keywords":"bug tracker, issue tracker, defect tracking, two-way sync, Atlassian, Jira Cloud, Jira Software"` inside its JSON-LD `TechArticle`.
- It does **not** emit a `<meta name="keywords">` tag on this deployment, and Mintlify doesn't list `keywords` among its frontmatter fields — it's accepted as custom YAML and consumed by the SEO layer.
- It is **not** documented to affect in-product search ranking.

So `keywords` is an external-SEO aid. It does not make a page findable in the docs site's own search.

**For in-product findability, the levers are different:**

- **Put the term in the page.** In-product search indexes rendered content, so a word in a heading, a table cell or a sentence is what actually matches. When `vpn.mdx` absorbed four pages, `OpenVPN`, `IPSec`, `Tailscale` and `Twingate` stayed findable because the method table and the Client-based VPN section name all four — not because they're in `keywords`.
- **`boost`** — a numeric multiplier on a page's in-product search ranking, set in frontmatter or on a navigation group. Mintlify recommends staying between 0.1 and 10.
- **`searchable: false`** — removes a page from in-product search and the AI assistant while leaving it indexable externally. Distinct from `noindex: true`, which removes it from everything.

**What earns a keyword**, given it's an SEO signal:

- **The category, in every phrasing**, shared across siblings in a group — `bug tracker`, `issue tracker`, `defect tracking` on the issue trackers; `test management`, `test case management`, `TMS` on the test management systems.
- **Product aliases and abbreviations** a reader would search but the copy doesn't use — `ADO` and `AzDO` for Azure DevOps Boards, `Jira Cloud` and `Jira Software` for Jira, `Linear.app` for Linear.
- **Names a catch-all page covers but never mentions** — `Trello`, `Bugzilla` and `ClickUp` on the webhook page.

**Don't repeat the title.** Jira's keywords omit "Jira" — the title already carries it.

**Don't invent aliases to pad the list.** A keyword is a search term rather than a claim, but a wrong alias still misleads. Four entries that match real searches beat ten that guess.

**Don't use keywords to paper over missing content.** If a term matters enough to search for, it usually belongs in the page.


## 18. Write for coding agents as well as people

A coding agent is a real reader of these docs, not a hypothetical one. It arrives through the QA Wolf MCP, the `qawolf-cli` agent skill, or by fetching a page directly, and it acts on what it finds. Write for it explicitly where it is genuinely part of the audience.

**Name the affordances that exist.** Mintlify already serves machine-readable forms, and a page that needs them should say so rather than leaving an agent to guess:

- **Every page as Markdown**, by appending `.md` — `docs.qawolf.com/quick-start.md` returns the page as plain text.
- **`/llms.txt`** — the documentation index.
- **`/llms-full.txt`** — the full text of the site.

Quick start's "For coding agents" section is the model: it names the `qawolf-cli` skill, says where it ships, and states the two conventions an agent needs — pass `--json` for stable output, and terminate interactive runners, which bill while they run.

**Address the agent directly when it is the one acting.** "A coding agent can read this page as plain Markdown at …" and "In CI or an agent sandbox, set `QAWOLF_API_KEY` instead" both tell a specific reader something a human-only phrasing would bury.

**Be exact about anything an agent will copy.** An agent reproduces a command, a flag, an environment variable name or a path verbatim, and it cannot tell that `QAWOLF_API_URL` was meant to be `QAWOLF_HOST_URL`. Rule 1's terminology discipline and this are the same discipline: verify identifiers against the shipped package, not against another page.

**Don't perform it.** Not every page has an agent audience, and a line addressed to one on a page about reading maintenance reports is noise. Add it where an agent would actually be doing the task — CLI and MCP setup, anything an agent automates, anything it would fetch on its own.


## 19. First person — the product is third person, the service team is first

The original ban on "we" was written from a self-service page, where "we" stands in for software. That reading doesn't survive contact with Full Service, where the subject is a team of people doing work for the reader. Which voice a page takes depends on what the sentence is actually about.

- **QA Wolf the product is third person.** Anything the platform does on its own — running flows, resigning an app, storing artifacts — names the product: "QA Wolf resigns your app," "QA Wolf automatically re-runs any test that fails." Never "we resign your app."
- **The QA Wolf team is first person.** On Full Service pages, sentences about people doing work take "we": "we generally start with the most complex flows," "we'll outline specific test steps after you approve." Writing those in third person ("QA Wolf generally starts with...") makes a human relationship sound like a subsystem.

The test is the subject of the sentence, not the tab it sits on. A Full Service page still says "QA Wolf runs your flows in parallel," because that is the platform, and a reference page still avoids "we," because it has no service team in it.

Two things this does not license:

- **"We" as a vague authority.** "We recommend" on a reference page is the old problem in a new costume — it is the product speaking, so state the requirement directly (rule 16) or name the product.
- **First person plural for the reader's team.** "Your team" and "our team" are different groups, and a page that blurs them becomes unreadable at exactly the moment it matters, in a table of who attends which meeting.


---

**Not a rule, but worth knowing while editing:** some "inconsistencies" found in the audit are actually correct, because the underlying behavior really does differ per package (testkit throws; ci-sdk returns outcomes; some config objects are named `Options`, others `Config` because that's the actual exported type name). Don't paper over a real difference to make the prose *sound* more consistent — rule 1 exists precisely to keep that distinction legible instead of hiding it.
