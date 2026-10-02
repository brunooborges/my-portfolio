# Visitor counter backend

A tiny serverless backend that counts **unique visitors** for the portfolio: one Lambda (behind a Function URL) and one DynamoDB table. It lives in this repo so the frontend and its API version together.

```
browser ──POST /visit {visitorId}──▶ Lambda Function URL ──▶ DynamoDB (1 table)
        ◀──────── {count, counted} ─┘
```

## How it counts

- The site generates a random UUID on the first visit and keeps it in `localStorage` (`visitorId`). It is not derived from the person or device.
- `POST /visit` with `{ "visitorId": "<uuid v4>" }` registers the visitor. A first-time id is stored and the counter goes up by one, in a **single DynamoDB transaction** (conditional put of the visitor + counter increment), so the counter cannot drift from the stored visitors. A known id changes nothing.
- `GET /count` returns the current total without counting the caller. The site uses it when the browser cannot keep an id (storage blocked), so nobody is counted twice.
- Responses: `POST /visit` → `{ "count": 1234, "counted": true|false }`, `GET /count` → `{ "count": 1234 }`.

What it can and cannot tell you: it counts **browsers**, not people. Clearing storage, private mode or a second device counts again. Bots that send random UUIDs are counted too (see "Abuse" below).

## Layout

| File                  | Purpose                                                            |
| --------------------- | ------------------------------------------------------------------ |
| `src/handler.ts`      | Routing, validation, responses (pure, takes a `VisitorStore`)      |
| `src/dynamoStore.ts`  | DynamoDB implementation of the store (transaction + consistent read) |
| `src/store.ts`        | The `VisitorStore` contract                                        |
| `src/index.ts`        | Lambda entry point: wires the DynamoDB client from `TABLE_NAME`    |
| `template.yaml`       | AWS SAM: table, function, Function URL with CORS (no IAM role, no log group) |

## Develop

```bash
cd backend
yarn install
yarn test:coverage   # unit tests (no AWS needed), 80% coverage gate
yarn typecheck
```

## Deploy

Not deployed yet. Requires the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) and AWS credentials.

```bash
cd backend
yarn install
yarn bundle    # esbuild -> dist/index.mjs (the code SAM uploads)
sam deploy --guided --template-file template.yaml --stack-name portfolio-visitor-counter --region sa-east-1
```

There is no `sam build` step: `yarn bundle` produces the artifact itself, because SAM's built-in esbuild builder failed to find esbuild on Windows. `--template-file template.yaml` makes SAM package `dist/` directly. If an old `.aws-sam/` folder exists from a failed `sam build`, delete it so it can't be picked up instead.

Keep the stack name and region exactly as above: the IAM policies in `iam/` are scoped to them.

`sam deploy` creates only the Lambda function and the DynamoDB table (plus the CloudFormation stack and SAM's artifact bucket). It never creates an IAM role or a log group. The IAM policies you attach to your user, the one-time execution role and the optional log retention are all described, in order, in [`iam/README.md`](./iam/README.md). These policies were written from how SAM deploys and have not been tested against a live account: if a deploy fails with `AccessDenied`, CloudFormation's event log names the missing action.

Then:

1. Copy the `CounterUrl` output (no trailing slash).
2. In Netlify, set the environment variable `VITE_VISITOR_API_URL` to that URL and redeploy the site. Without it the footer simply hides the counter.
3. If your site lives on a different origin, deploy with `--parameter-overrides AllowedOrigin=https://your-site`.

Template parameters: `AllowedOrigin` (CORS origin), `ExecutionRoleName` (the pre-created role) and `ReservedConcurrency` (optional cap on simultaneous executions, default `0` = none). Leave `ReservedConcurrency` at `0` on accounts whose total Lambda concurrency quota is 10: a reservation there is rejected and the deploy fails.
4. Once the new counter works, delete the old API Gateway and its Lambda so they stop costing money.

## Staying inside the AWS free tier

Check your own account's Billing console: free-tier terms depend on when the account was created.

- **Lambda** is in the Always Free allowance (1M requests and 400,000 GB-seconds per month). The function is 128 MB on arm64.
- **DynamoDB** is provisioned at 1 RCU / 1 WCU, inside the Always Free 25/25 units and 25 GB. **Do not switch it to on-demand**, which is not covered.
- **Function URL** replaces API Gateway, whose free allowance expires after 12 months on older accounts.
- **Logs:** Lambda creates the log group itself and keeps logs forever by default. Volume is tiny (inside the 5 GB free ingestion), but set a 14-day retention once by hand (command in `iam/README.md`).
- Set a **billing alert** (for example at US$1) so a surprise is caught early.

## Abuse and privacy

- Anyone can call a public endpoint. `ReservedConcurrentExecutions: 10` caps parallel executions (and so cost), and the handler rejects malformed ids and bodies over 1 KB, but it cannot stop someone from inflating the count with random UUIDs. For a portfolio counter this is an accepted trade-off. If it matters, add AWS WAF rate limiting (paid) or put the function behind CloudFront.
- Stored per visitor: a random UUID and a first-seen timestamp. No IP address, user agent or cookie is stored by this code. Lambda execution logs are kept by AWS until you set a retention period. Consider mentioning the counter in a privacy note.
- CORS only allows the site origin (`AllowedOrigin`). CORS is a browser rule, not authentication.
