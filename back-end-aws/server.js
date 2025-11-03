import { ApolloServer } from "@apollo/server";
import { startServerAndCreateLambdaHandler } from "@as-integrations/aws-lambda";
// import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
// import typeDefs from "./schema/type-defs.js";
// import resolvers from "./schema/resolvers.js";
// import { typeDefs, resolvers } from "./schema/test.js";

const typeDefs = `#graphql
type Query {
  hello: String
}`;

const resolvers = {
  Query: {
    hello: () => "Hello world",
  },
};

const server = new ApolloServer({
  typeDefs: `type Query { hello: String }`,
  resolvers: { Query: { hello: () => "Hello world" } },
  introspection: true,
});
export const handle = startServerAndCreateLambdaHandler(server);
