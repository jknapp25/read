import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Router } from "@reach/router";
import View from "./components/View";
export default App;

const TOKEN = "5255b63afe2ccb0931f0763ed6169f35597cc4ec";

const GITHUB_BASE_URL = "https://api.github.com/graphql";

const client = new ApolloClient({
  uri: GITHUB_BASE_URL,
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${TOKEN}`
  }
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App overflow-auto">
        <Router>
          <View path="/:writer/:title" />
        </Router>
      </div>
    </ApolloProvider>
  );
}
