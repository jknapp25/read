import React from "react";
import { navigate } from "@reach/router";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import stories from "../stories.json";
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
          {/* <img
            style={{ width: "100px", height: "100px" }}
            src="https://cdn.jsdelivr.net/gh/jknapp25/exogenesis/images/cover-1.jpg"
          /> */}
          <h1 className="mb-5 mt-4">Stories</h1>
          {stories.map(({ author, title }) => {
            return (
              <Card
                className="mb-3"
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
          })}
        </Col>
        <Col xs={12} md={3} />
      </Row>
    </Container>
  );
}
