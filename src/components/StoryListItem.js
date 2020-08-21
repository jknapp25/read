import React from "react";
import { navigate } from "@reach/router";
import { Card, Col, Row } from "react-bootstrap";
export default StoryListItem;

function StoryListItem({ author, title }) {
  return (
    <Card
      className="mb-3 story-list-item"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/${author}/${title}`)}
    >
      <Card.Body>
        <Row>
          <Col xs={3}>
            <img
              style={{ width: "100%", height: "auto" }}
              src={`https://cdn.jsdelivr.net/gh/${author}/${title}/images/cover-1.jpg`}
              alt={`${title}`}
            />
          </Col>
          <Col xs={9}>
            <h4>{title}</h4>
            <p>{author}</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
