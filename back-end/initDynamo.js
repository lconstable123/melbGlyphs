// setupTables.js
import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

// Import your existing dynamo client or create a new one
import { dynamo } from "./utils/dynamo.js";

async function createTables() {
  try {
    // Create Images table
    await dynamo.send(
      new CreateTableCommand({
        TableName: "Images",
        AttributeDefinitions: [
          { AttributeName: "PK", AttributeType: "S" },
          { AttributeName: "SK", AttributeType: "S" },
        ],
        KeySchema: [
          { AttributeName: "PK", KeyType: "HASH" },
          { AttributeName: "SK", KeyType: "RANGE" },
        ],
        BillingMode: "PAY_PER_REQUEST",
      })
    );
    console.log("Images table created!");

    // Create Artists table
    await dynamo.send(
      new CreateTableCommand({
        TableName: "Artists",
        AttributeDefinitions: [
          { AttributeName: "PK", AttributeType: "S" },
          { AttributeName: "SK", AttributeType: "S" }, // add this
          { AttributeName: "artist", AttributeType: "S" }, // needed for GSI
        ],
        KeySchema: [
          { AttributeName: "PK", KeyType: "HASH" },
          { AttributeName: "SK", KeyType: "RANGE" },
        ],
        BillingMode: "PAY_PER_REQUEST",
        GlobalSecondaryIndexes: [
          {
            IndexName: "artist-index",
            KeySchema: [
              { AttributeName: "artist", KeyType: "HASH" }, // partition key for GSI
            ],
            Projection: {
              ProjectionType: "ALL", // includes all attributes in query results
            },
          },
        ],
      })
    );
    console.log("Artists table created!");
  } catch (err) {
    if (err.name === "ResourceInUseException") {
      console.log("Tables already exist, skipping creation.");
    } else {
      console.error("Error creating tables:", err);
    }
  }
}

createTables();
