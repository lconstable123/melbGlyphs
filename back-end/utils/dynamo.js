// dynamo.js
import dotenv from "dotenv";
dotenv.config();
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const isLocal = !!process.env.DYNAMODB_ENDPOINT;
export const dynamo = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  // ...(isLocal && { endpoint: process.env.DYNAMODB_ENDPOINT }),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "dummy",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "dummy",
  },
});
