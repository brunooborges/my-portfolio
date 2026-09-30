# IAM for the visitor counter

`sam deploy` creates only the **Lambda function** and the **DynamoDB table** (plus the CloudFormation stack and SAM's artifact bucket that any SAM deploy needs). It never creates an IAM role or a log group. Everything else is a separate, one-time step with its own policy.

The policy files use `<ACCOUNT_ID>` as a placeholder: replace it with your 12-digit AWS account id before creating a policy from a file (keep the real id out of anything you commit). They target region `sa-east-1`, function `portfolio-visitor-counter`, table `portfolio-visitor-counter-visitors`, role `portfolio-visitor-counter-lambda`.

## Which file goes where

| File                                     | Attach to     | When                  | What it allows                                                                             |
| ---------------------------------------- | ------------- | --------------------- | ------------------------------------------------------------------------------------------ |
| `deploy-policy-1-stack-storage.json`     | your IAM user | permanent             | CloudFormation (this stack + SAM's managed stack), SAM artifact bucket, the DynamoDB table |
| `deploy-policy-2-lambda.json`            | your IAM user | permanent             | The one Lambda function and its Function URL, plus `iam:PassRole` for the one role         |
| `setup-policy-1-execution-role.json`     | your IAM user | **temporary**, step 1 | Create/manage that single execution role (and attach only `AWSLambdaBasicExecutionRole`)   |
| `setup-policy-2-log-retention.json`      | your IAM user | **temporary**, step 3 | Create the function's log group, set its retention, read its logs                          |
| `lambda-execution-role-trust.json`       | the **role**  | used in step 1        | Trust policy: only the Lambda service can assume the role                                  |
| `lambda-execution-role-permissions.json` | the **role**  | used in step 1        | What the running function may do: read/write the one table                                 |

The last two are not attached to your user: they define the role the Lambda runs as.

## Order of steps

**1. Create the execution role (once).** Attach `setup-policy-1-execution-role.json` to your IAM user, then run from this folder:

```bash
aws iam create-role --role-name portfolio-visitor-counter-lambda --assume-role-policy-document file://lambda-execution-role-trust.json
aws iam attach-role-policy --role-name portfolio-visitor-counter-lambda --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam put-role-policy --role-name portfolio-visitor-counter-lambda --policy-name counter-table-access --policy-document file://lambda-execution-role-permissions.json
```

**2. Deploy.** With `deploy-policy-1` and `deploy-policy-2` attached (see `../README.md`): `yarn bundle`, then `sam deploy --guided --template-file template.yaml --stack-name portfolio-visitor-counter --region sa-east-1`. This creates the function and the table.

**3. Create the log group and bound its retention (once, optional).** Attach `setup-policy-2-log-retention.json`, then, before the first visit, so Lambda uses this group and logs don't live forever:

```bash
aws logs create-log-group --log-group-name /aws/lambda/portfolio-visitor-counter --region sa-east-1
aws logs put-retention-policy --log-group-name /aws/lambda/portfolio-visitor-counter --retention-in-days 14 --region sa-east-1
```

Skipping this is fine: Lambda creates the group itself on the first call, with retention set to "never expire".

**4. Detach both `setup-policy-*` policies from your user.** Keep only the two deploy policies for future deploys.

## Why the setup policies are temporary

Whoever can shape the execution role's permissions and also update the function's code and pass that role can make the function do anything the role allows. The role here is narrow, but the setup policy could widen it. Keeping `setup-policy-*` attached only while you do the one-time setup removes that path.

## If you already created policies from earlier versions

`PortfolioCounterDeploy1` and `PortfolioCounterDeploy2` in your account may hold older, broader content (log group and role permissions, wildcard function name). Replace their JSON with the files here (console: policy, Edit, JSON, Save; or `aws iam create-policy-version --set-as-default`).

## Not covered

Cleaning up the old API Gateway and Lambda, and `sam delete`. Use the console or an admin identity for those.
