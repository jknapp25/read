import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Container, Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useParams } from "@reach/router";
export default View;
var md = require("markdown-it")();

function View() {
  const params = useParams();
  const { title, writer } = params;

  const STORY = gql`
    query GetStory {
      repository(name: "${title}", owner: "${writer}") {
        object(expression: "master:story.md") {
          id
          ... on Blob {
            id
            text
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(STORY);
  if (loading || error) return null;

  const markdown = md.render(data.repository.object.text);
  return (
    <Container fluid>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Row>
        <Col />
        <Col xs={6}>
          <div dangerouslySetInnerHTML={{ __html: markdown }} />
        </Col>
        <Col />
      </Row>
    </Container>
  );
}
