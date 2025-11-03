import { graphql, buildSchema } from "graphql";
import resolvers from "./schema/resolvers.js"; // your resolvers file

// Define GraphQL schema as SDL
const schema = buildSchema(`
    type LocationData {
    latitude: Float!
    longitude: Float!
  }

  type Image {
    id: ID!
    artist: String
    locationData: LocationData!
    suburb: String
    uploadedAt: String!
    capped: String
    path: String!
    isOnServer: Boolean!
    # preview: String
  }
  input LocationInput {
    latitude: Float!
    longitude: Float!
  }

  input ImageInput {
    id: ID!
    artist: String
    locationData: LocationInput!
    suburb: String
    uploadedAt: String!
    capped: String
    path: String!
    isOnServer: Boolean!
    # preview: String
  }

  input partialImageInput {
    artist: String
    suburb: String
    locationData: LocationInput
    capped: String
  }

  input ImageMetaInput {
    id: ID!
    artist: String
    suburb: String
    locationData: LocationInput!
    uploadedAt: String
    capped: String
    path: String!
    isOnServer: Boolean!
  }

  type ImageResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    hello: String
    images: [Image!]
    reverseGeocode(latitude: Float!, longitude: Float!): String
    artists: [String]!
  }

  type Mutation {
    addImages(images: [ImageMetaInput!]!): ImageResponse!
    deleteImage(id: ID!): ImageResponse!
    updateImage(id: ID!, updatedData: partialImageInput!): ImageResponse!
  }
`);

export const handler = async (event) => {
  // Handle OPTIONS for CORS preflight
  if (event.requestContext.http.method === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: null,
    };
  }

  console.log("Received event:", JSON.stringify(event, null, 2));
  // Parse the incoming GraphQL request
  if (!event.body) {
    console.error("Missing body in request");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing body in request" }),
    };
  }

  let body;
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch (err) {
    console.error("Error parsing JSON body:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }
  const { query, variables } = body;
  const rootValue = {
    ...resolvers.Query,
    ...resolvers.Mutation,
  };
  try {
    const result = await graphql({
      schema,
      source: query,
      rootValue,
      variableValues: variables,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error("GraphQL execution error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
