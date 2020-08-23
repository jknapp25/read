import React, { useState } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Router } from "@reach/router";
import Story from "./components/Story";
import StoryList from "./components/StoryList";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
export default App;

const GITHUB_BASE_URL = "https://api.github.com/graphql";

const client = new ApolloClient({
  uri: GITHUB_BASE_URL,
  cache: new InMemoryCache(),
  headers: { authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}` },
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
          <StoryList path="/" default />
          <Story
            path="/:author/:title"
            updatingScrollPos={updatingScrollPos}
            setUpdatingScrollPos={setUpdatingScrollPos}
          />
        </Router>
      </div>
    </ApolloProvider>
  );
}
