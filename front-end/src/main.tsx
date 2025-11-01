import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
// import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { LocationProvider } from "../src/lib/providers/location-provider.tsx";

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:5000/graphql" }),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <ApolloProvider client={client}>
      <LocationProvider>
        <App />
      </LocationProvider>
    </ApolloProvider>
  </StrictMode>
);
