"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apolloClient = void 0;
const client_1 = require("@apollo/client");
const context_1 = require("@apollo/client/link/context");
const httpLink = (0, client_1.createHttpLink)({
    uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:3000/graphql',
});
const authLink = (0, context_1.setContext)((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    };
});
exports.apolloClient = new client_1.ApolloClient({
    link: authLink.concat(httpLink),
    cache: new client_1.InMemoryCache(),
});
//# sourceMappingURL=apollo.js.map