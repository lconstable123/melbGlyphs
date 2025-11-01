declare module "apollo-upload-client" {
  import { ApolloLink } from "@apollo/client/core";

  export interface UploadOptions {
    uri?: string;
    fetch?: GlobalFetch["fetch"];
    fetchOptions?: Record<string, any>;
    credentials?: string;
    headers?: Record<string, string>;
  }

  export function createUploadLink(options?: UploadOptions): ApolloLink;
}
