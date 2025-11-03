import gql from "graphql-tag";

const typeDefs = gql`
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
    # preview: String
  }

  type ImageResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    images: [Image!]!
    reverseGeocode(latitude: Float!, longitude: Float!): String
    artists: [String]!
  }

  type Mutation {
    addImages(images: [ImageMetaInput!]!): ImageResponse!
    deleteImage(id: ID!): ImageResponse!
    updateImage(id: ID!, updatedData: partialImageInput!): ImageResponse!
  }
`;

export default typeDefs;
