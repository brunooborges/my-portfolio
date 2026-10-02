import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { DynamoVisitorStore } from './dynamoStore';
import { createHandler } from './handler';

const tableName = process.env.TABLE_NAME;
if (tableName === undefined || tableName === '') {
  throw new Error('TABLE_NAME environment variable is required');
}

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = createHandler(new DynamoVisitorStore(client, tableName));
