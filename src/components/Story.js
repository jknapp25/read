import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import { useQuery, gql } from "@apollo/client";
import { Button, Container, Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useParams } from "@reach/router";
import { Octokit } from "@octokit/core";
import { enrich, getCurrentPosition } from "../utils";
import User from "./User";
export default View;

const md = require("markdown-it")().use(require("markdown-it-imsize"));

const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_TOKEN });

function View({ updatingScrollPos, setUpdatingScrollPos }) {
  const params = useParams();

  const [updating, setUpdating] = useState(false);
  const [savedPosition, setSavedPosition] = useState(1);
  const [currentUsername, setCurrentUsername] = useState("");
  const [scrolledToView, setScrolledToView] = useState(false);
  const [usersSha, setUsersSha] = useState("");
  const [users, setUsers] = useState({});

  const { title, author } = params;

  const STORY = gql`
    query GetStory {
      repository(name: "${title}", owner: "${author}") {
        object(expression: "master:story.md") {
          ... on Blob {
            text
          }
        }
      }
    }
  `;

  const USERS = gql`
    query GetUsers {
      repository(name: "${title}", owner: "${author}") {
        object(expression: "master:users.json") {
          ... on Blob {
            text
            oid
          }
        }
      }
    }
  `;

  const {
    loading: storyLoading,
    error: storyError,
    data: storyData,
  } = useQuery(STORY);
  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery(USERS);

  useEffect(() => {
    if (currentUsername && updatingScrollPos && !updating) {
      updatePosition();
    }

    async function updatePosition() {
      setUpdating(true);
      const currentPosition = getCurrentPosition();

      if (currentPosition > savedPosition) {
        const updUsers = {
          ...users,
          [currentUsername]: currentPosition,
        };
        let requestData = {
          owner: author,
          repo: title,
          path: "users.json",
          message: "Update position",
          content: window.btoa(JSON.stringify(updUsers)),
          sha: usersSha,
        };
        await octokit
          .request("PUT /repos/{owner}/{repo}/contents/{path}", requestData)
          .then((response) => {
            setUsers(updUsers);
            setUsersSha(response.data.content.sha);
            setSavedPosition(currentPosition);
          });
      }
      setUpdatingScrollPos(false);
      setUpdating(false);
    }
  }, [
    updatingScrollPos,
    author,
    title,
    usersSha,
    currentUsername,
    savedPosition,
    users,
    setUpdatingScrollPos,
    updating,
  ]);

  useEffect(() => {
    if (currentUsername) {
      if (!scrolledToView) {
        const el = document.getElementById("new-content-line");
        if (el) {
          el.scrollIntoView();
          setScrolledToView(true);
        } else {
          console.log("could not scroll to view");
        }
      }
    }
  }, [scrolledToView, currentUsername]);

  if (storyLoading || usersLoading || storyError || usersError) return null;

  if (!Object.keys(users).length)
    setUsers(JSON.parse(usersData.repository.object.text));
  if (!usersSha) setUsersSha(usersData.repository.object.oid);

  let html = md.render(storyData.repository.object.text);
  if (currentUsername) {
    const pastFurthestPosition = JSON.parse(usersData.repository.object.text)[
      currentUsername
    ];
    html = enrich(html, pastFurthestPosition);
  }

  return (
    <Container fluid>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Row>
        <Col xs={12} md={3}>
          <Button
            variant="link"
            className="mt-2 pl-0 text-muted"
            onClick={() => navigate("/")}
          >{`<- Back to Stories`}</Button>
          <User
            users={users}
            setSavedPosition={setSavedPosition}
            author={author}
            title={title}
            octokit={octokit}
            setCurrentUsername={setCurrentUsername}
            currentUsername={currentUsername}
            usersSha={usersSha}
            setUsersSha={setUsersSha}
            setScrolledToView={setScrolledToView}
          />
        </Col>
        <Col xs={12} md={6} className="pt-4">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </Col>
        <Col xs={12} md={3} />
      </Row>
    </Container>
  );
}
