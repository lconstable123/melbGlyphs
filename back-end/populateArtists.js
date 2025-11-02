import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

import dotenv from "dotenv";
dotenv.config();

const isLocal = !!process.env.DYNAMODB_ENDPOINT;
export const dynamo = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  // ...(isLocal && { endpoint: process.env.DYNAMODB_ENDPOINT }),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "dummy",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "dummy",
  },
});

const ARTISTS_TABLE = "Artists";

const Artists = [
  "Astral Nadir",
  "Dskreet",
  "Sinch",
  "PAM",
  "Shida",
  "Fikaris",
  "Makatron",
  "Tom Civil",
  "FELLA",
  "FB Jaba",
  "Rone",
  "Meggs",
  "Adnate",
  "Lushsux",
  "Hense",
  "Sofles",
  "Fintan Magee",
  "Roa",
  "Pixel Pancho",
  "Beastman",
  "Hyuro",
  "Everfresh",
  "DabsMyla",
  "Miso",
  "TwoOne",
  "Vexta",
  "Phibs",
  "Lucy Lucy",
  "E.L.K",
  "Holly Wilson",
  "Kaffeine",
  "Tessa Moran",
  "Bailon",
  "Jazmin Berakha",
];

(async () => {
  for (const artist of Artists) {
    try {
      await dynamo.send(
        new PutItemCommand({
          TableName: ARTISTS_TABLE,
          Item: {
            PK: { S: `ARTIST#${artist}` },
            SK: { S: `META` },
            createdAt: { S: new Date().toISOString() },
          },
          ConditionExpression: "attribute_not_exists(PK)", // skip if exists
        })
      );
      console.log("Added artist:", artist);
    } catch (err) {
      console.error("Error adding artist:", artist, err.message);
    }
  }
})();
