# Triggers documentation audit

Every live page that mentions triggers, scheduling, deployment-driven runs or pull-request testing, including pages that describe the behavior without the word "trigger". Built from `grep -ri` over `trigger`, `schedul`, `deploy`, `pull request`, `PR test` and `webhook` across every `.mdx` outside `z-archive/`, then read page by page.

Model column: **global** (the workspace-level trigger model), **legacy** (the per-environment model and the `deploy_success` reporting path that feeds it), **both**, **ambiguous** (the text does not say which), or **incidental** (the word appears in an unrelated sense).

No navigation entry points into `z-archive/`, so nothing there is reachable from the site; it is out of scope and left untouched.

## Pages that describe trigger behavior

| Page | Navigation location | What it says about triggers | Model | Disposition |
|---|---|---|---|---|
| `Glossary.mdx` | Start | "Schedule" and "Trigger" entries; says a run starts four ways and that deployment and PR triggers need QA Wolf to set them up | legacy | Rewrite for global |
| `why-qa-wolf.mdx` | Start | One line: runs can be on demand, scheduled, or from CI | ambiguous | Leave alone — true in both models |
| `tags.mdx` | Features → Run Orchestration | Tags build custom suites that run "according to Run Rules or schedules" | ambiguous | Rewrite for global — link tags to trigger actions |
| `smart-smoke-suites.mdx` | Features → Run Orchestration | Agent-selected flows on preview deploys; "a single toggle on the trigger" | global | Rewrite for global — point at the generative action |
| `qawolf-mcp.mdx` | Features → Agentic QA | Lists trigger management among MCP capabilities; troubleshooting entries for a scheduled test that did not run and a trigger that ran the wrong suite | global | Rewrite for global — link to the trigger pages |
| `GitHub-GitHub-Actions.mdx` | Integrations → CI/CD → Deployment testing | Connect the GitHub App, then notify QA Wolf with `notify-qawolf-on-deploy-action` | both | Rewrite for global — keep the connection steps, replace the notify step with deployment events |
| `GitLab.mdx` | Integrations → CI/CD → Deployment testing | Connect with a group access token, then `curl` `deploy_success` from `.gitlab-ci.yml` | both | Rewrite for global — same split |
| `ci-sdk-integration.mdx` | Integrations → CI/CD → Deployment testing | `attemptNotifyDeploy` from a Node.js CI step, with `deploymentType` "provided by your QA Wolf representative" | legacy | Move to Legacy |
| `webhook-integration.mdx` | Integrations → CI/CD → Deployment testing | `curl` to `deploy_success` from any CI system | legacy | Move to Legacy |
| `circle-ci.mdx` | Integrations → CI/CD → Deployment testing | CircleCI job calling `attemptNotifyDeploy`; requires "a deployment trigger configured for your environment" | legacy | Move to Legacy |
| `PR-testing-for-GitHub-Integrations.mdx` | Full Service → Integrating Systems → PR Testing | Preview-deploy notification plus merge-queue setup; "ask your QA Wolf team to set up triggers" | legacy | Move to Legacy |
| `PR-testing-for-GitLab-Integrations.mdx` | Full Service → Integrating Systems → PR Testing | Same for merge requests | legacy | Move to Legacy |
| `deploy-success.mdx` | References → REST | Full request and response reference for `POST /api/webhooks/deploy_success`, including the `results` array of matched triggers | legacy | Leave in place, flag as legacy — it is an endpoint reference, and moving it out of the REST group would split that reference set |
| `mobile-build-testing.mdx` | Integrations → CI/CD | Upload a build, then notify QA Wolf; "QA Wolf must enable mobile triggers for your workspace" | legacy | Leave alone — mobile build testing is its own path and the skills do not cover it |
| `libraries/ci-sdk/api-reference.mdx` | References → @qawolf/ci-sdk | `attemptNotifyDeploy` signature; `deploymentType` "required if the target trigger matches on deployment type" | legacy | Leave alone — package reference, accurate for the package |
| `libraries/ci-sdk/troubleshooting.mdx` | References → @qawolf/ci-sdk | "no trigger matched", "contact your QA Wolf representative to confirm trigger configuration" | legacy | Leave alone — same reason |
| `rest-overview.mdx` | References → REST | Endpoint table listing `deploy_success` | legacy | Leave alone — the table describes the endpoints that exist |
| `environment_terminated.mdx` | References → REST | Terminates an environment created by `deploy_success` with `ephemeral_environment: true` | legacy | Leave alone |
| `v0-ci-greenlight.mdx` | References → REST | Links to Notify deploy; supersedes logic for duplicate runs | legacy | Leave alone |
| `Full-Service-FAQs.mdx` | Full Service → Introduction | "every pull request, schedule, or trigger you choose"; PR testing "through our Scheduled Runs" | legacy | Leave alone — service description, not configuration |
| `Manage-maintenance-reports.mdx` | Full Service → Working with Wolves | Flows under an open maintenance report are skipped in scheduled runs | both | Leave alone — true in both models |
| `Test-environments.mdx` | Full Service → Integrating Systems | Advises against deploying while runs are in progress | both | Leave alone |
| `Testmo.mdx` | Integrations → Test Management Systems | Different tags for PR and scheduled runs need custom configuration | ambiguous | Leave alone |
| `Pass-data-between-flows.mdx` | Solutions → Data sharing | Producers and consumers must be in the same scheduled run | both | Leave alone |
| `workspace-setup.mdx` | Not in navigation (redirect target, `noindex`) | Stub: "Connect QA Wolf to your CI/CD pipeline to trigger test runs" | ambiguous | Leave alone — pre-existing orphan, out of scope |

## Incidental matches

These use a matched word in an unrelated sense and need no change: `custom-skills.mdx` (a skill with "no trigger"), `Use-emails-in-tests.mdx` ("the triggering action"), `test-automation.mdx` ("trigger the action yourself"), `libraries/cli/api-reference/index.mdx` and `libraries/cli/api-reference/commands.mdx` ("triggers and manages runs"), `Integrate-with-webhooks.mdx` (bug-tracker webhooks), and the accessibility, audio, camera, sensor and performance solution pages.

## New pages

| Page | Navigation location | Built from |
|---|---|---|
| `triggers/index.mdx` | Features → Triggers | `qawolf-trigger-setup`, the trigger contracts |
| `triggers/set-up-a-trigger.mdx` | Features → Triggers | `qawolf-trigger-setup` |
| `triggers/report-deployments.mdx` | Features → Triggers | `qawolf-trigger-setup/references/deployment-events.md`, `deployment.reportStatus` |
| `triggers/diagnose-a-trigger.mdx` | Features → Triggers | `qawolf-trigger-diagnostics`, `deployment.listTriggerEvaluations` |
| `triggers/migrate-from-legacy-triggers.mdx` | Features → Triggers | `qawolf-trigger-migration` |
| `legacy/legacy-triggers.mdx` | Integrations → Legacy | `qawolf-trigger-migration` |

## Open questions

- **No REST invocation for `deployment.reportStatus`.** The contract package defines the route and its fields, and the QA Wolf MCP exposes it as `deployment_reportStatus`, but nothing public documents an HTTP path, request envelope or example. `triggers/report-deployments.mdx` therefore describes the route's fields and semantics without a `curl` example. A verified path and body would complete that page.
- **No UI walkthrough for the triggers page.** The trigger resource carries a `url` described as "absolute URL of the team's triggers page", but no skill or contract names the page's controls. Every new page describes triggers in terms of their configuration, not clicks. Screenshots and a click path would be a worthwhile follow-up.
- **How generative flow selection reads a pull request.** `qawolf-trigger-setup` says QA Wolf picks flows "from the pull request's changes"; the existing `smart-smoke-suites.mdx` says it reads "the PR title and description". These are different inputs. The new pages say only that QA Wolf selects the flows from the pull request, and `smart-smoke-suites.mdx` keeps its own wording.
- **Whether legacy triggers are visible to customers at all.** The migration skill reads them through a frozen internal endpoint, which is not a public interface. `legacy/legacy-triggers.mdx` therefore tells customers to ask QA Wolf or use a coding agent for the inventory, rather than publishing that endpoint.
- **`investigateFailures` default.** The action schema says it defaults to true, but no skill describes what investigation does to a triggered run. The trigger pages name the field and its default and stop there.
- **`environmentPattern` and `branchPattern` syntax.** The contracts call both "a pattern" and the migration skill calls a legacy branch entry "a glob", but no source states the glob dialect or whether patterns are anchored. The pages use the word "pattern" and show only the wildcard forms the skills themselves use (`pr-*`, `preview/*`, `review/*`).
- **Mobile build testing under the global model.** `mobile-build-testing.mdx` depends on "mobile triggers" being enabled for a workspace, a concept no trigger skill or contract mentions. Left untouched pending confirmation of how it maps.
