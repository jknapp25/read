import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import stories from "../stories.json";
import StoryListItem from "./StoryListItem";
export default StoryList;

function StoryList() {
  return (
    <Container fluid>
      <Helmet>
        <title>Stories</title>
      </Helmet>
      <Row>
        <Col xs={12} md={3} />
        <Col xs={12} md={6} className="pt-4">
          <h1 className="mb-5 mt-4">Stories</h1>
          {stories.map(({ author, title }) => (
            <StoryListItem key={title} author={author} title={title} />
          ))}
        </Col>
        <Col xs={12} md={3} />
      </Row>
    </Container>
  );
}
