import React, { useState, useEffect } from "react";
import { useParams, navigate, useLocation } from "@reach/router";
import { useQuery, gql } from "@apollo/client";
import { Button, Container, Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Octokit } from "@octokit/core";
import { enrich, getCurrentPosition } from "../utils";
import User from "./User";
export default View;

const md = require("markdown-it")().use(require("markdown-it-imsize"));

const octokit = new Octokit({ auth: process.env.REACT_APP_GITHUB_TOKEN });

const useParamsQuery = (queryParam) => {
  const search = new URLSearchParams(useLocation().search);
  return search.get(queryParam);
};

function updateClipboard(clip) {
  navigator.clipboard.writeText(clip);
}

function View({ updatingScrollPos, setUpdatingScrollPos }) {
  const params = useParams();

  const [updating, setUpdating] = useState(false);
  const [savedPosition, setSavedPosition] = useState(1);
  const [currentUsername, setCurrentUsername] = useState("");
  const [scrolledToView, setScrolledToView] = useState(false);
  const [usersSha, setUsersSha] = useState("");
  const [users, setUsers] = useState({});

  const position = parseInt(useParamsQuery("pos"), 10);

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

  useEffect(() => {
    if (position) {
      const el = document.getElementById("linked-position");
      if (el) {
        el.scrollIntoView();
      } else {
        console.log("could not scroll to view");
      }
    }
  });

  useEffect(() => {
    window.addEventListener(
      "click",
      (e) => {
        const clickedElIsContentAnchor =
          e.target.className && e.target.className.includes("content-anchor");
        if (clickedElIsContentAnchor) {
          const linkPosition = parseInt(e.target.dataset.pos, 10);
          const currentUrl = window.location.href;
          let cleanedUrl = currentUrl;
          if (currentUrl.indexOf("?") !== -1) {
            cleanedUrl = currentUrl.substring(0, currentUrl.indexOf("?"));
          }
          const link = cleanedUrl + `?pos=${linkPosition}`;

          navigator.permissions
            .query({ name: "clipboard-write" })
            .then((result) => {
              if (result.state === "granted" || result.state === "prompt") {
                updateClipboard(link);
              }
            });
        }

        return false;
      },
      false
    );

    return () => {
      window.addEventListener(
        "click",
        (e) => {
          return false;
        },
        false
      );
    };
  }, []);

  if (storyLoading || usersLoading || storyError || usersError) return null;

  if (!Object.keys(users).length)
    setUsers(JSON.parse(usersData.repository.object.text));
  if (!usersSha) setUsersSha(usersData.repository.object.oid);

  let html = md.render(storyData.repository.object.text);

  const enrichProps = {
    furthestPosition: currentUsername
      ? JSON.parse(usersData.repository.object.text)[currentUsername]
      : undefined,
    linkedPosition: position || undefined,
  };

  html = enrich(html, enrichProps);

  return (
    <Container fluid>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Row>
        <Col xs={{ span: 12, order: 1 }} md={{ span: 3, order: 1 }}>
          <Button
            variant="link"
            className="mt-2 pl-0 text-muted"
            onClick={() => navigate("/")}
          >{`<- Back to Stories`}</Button>
        </Col>
        <Col
          xs={{ span: 12, order: 3 }}
          md={{ span: 6, order: 2 }}
          className="pt-4"
        >
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </Col>
        <Col xs={{ span: 12, order: 2 }} md={{ span: 3, order: 3 }}>
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
      </Row>
    </Container>
  );
}
