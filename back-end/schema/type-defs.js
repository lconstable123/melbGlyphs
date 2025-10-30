import gql from "graphql-tag";

const typeDefs = gql`
  scalar Upload

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
    filePath: String!
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
    filePath: String!
  }

  input partialImageInput {
    artist: String
    locationData: LocationInput
    suburb: String
    capped: String
  }

  input ImageMetaInput {
    key: ID!
    artist: String
    suburb: String
    locationData: LocationInput!
    uploadedAt: String
    capped: String
  }

  type ImageResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    images: [Image!]!
  }

  type Mutation {
    addImages(images: [ImageMetaInput!]!, files: [Upload!]!): ImageResponse!
    deleteImage(id: ID!): ImageResponse!
    updateImage(id: ID!, updatedData: partialImageInput!): ImageResponse!
  }
`;

export default typeDefs;
