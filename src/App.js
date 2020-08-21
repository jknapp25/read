import React, { useState } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Router } from "@reach/router";
import View from "./components/View";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
export default App;

const TOKEN = "7a1f9a7102a3ac2ed77bb53e58868a2e238027ae";

const GITHUB_BASE_URL = "https://api.github.com/graphql";

const client = new ApolloClient({
  uri: GITHUB_BASE_URL,
  cache: new InMemoryCache(),
  headers: { authorization: `Bearer ${TOKEN}` },
});

function App() {
  const [updatingScrollPos, setUpdatingScrollPos] = useState(false);

  return (
    <ApolloProvider client={client}>
      <div
        className="App overflow-auto"
        onScroll={() => {
          setUpdatingScrollPos(true);
        }}
      >
        <Router>
          <View
            path="/:author/:title"
            updatingScrollPos={updatingScrollPos}
            setUpdatingScrollPos={setUpdatingScrollPos}
          />
        </Router>
      </div>
    </ApolloProvider>
  );
}
