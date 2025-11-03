import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const isLocal = !!process.env.DYNAMODB_ENDPOINT;
export const dynamo = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-southeast-2",
});
