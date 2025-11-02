import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
export const ADD_IMAGES = gql`
  mutation AddImages($images: [ImageMetaInput!]!) {
    addImages(images: $images) {
      success
      message
    }
  }
`;

export const GET_IMAGES = gql`
  query getImages {
    images {
      id
      artist
      locationData {
        longitude
        latitude
      }
      suburb
      uploadedAt
      capped
      path
      isOnServer
    }
  }
`;

export const UPDATE_IMAGE = gql`
  mutation UpdateImage($id: ID!, $updatedData: partialImageInput!) {
    updateImage(id: $id, updatedData: $updatedData) {
      success
      message
    }
  }
`;

export const DELETE_IMAGE = gql`
  mutation DeleteImage($id: ID!) {
    deleteImage(id: $id) {
      success
      message
    }
  }
`;

export const REVERSE_GEOCODE = gql`
  query reverseGeocode($latitude: Float!, $longitude: Float!) {
    reverseGeocode(latitude: $latitude, longitude: $longitude)
  }
`;

export const GET_ARTISTS = gql`
  query getArtists {
    artists
  }
`;
