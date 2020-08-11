import React, { useEffect, useState } from "react";
import "./App.css";
import { Container, Row, Col } from "react-bootstrap";
import lorip from "./lorem-ipsum.md";
import "bootstrap/dist/css/bootstrap.min.css";
export default App;
var md = require("markdown-it")();

function App() {
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(lorip)
      .then(response => response.text())
      .then(text => {
        setText(text);
      });
  }, []);

  const markdown = md.render(text);
  return (
    <div className="App overflow-auto">
      <Container fluid>
        <Row>
          <Col />
          <Col xs={6}>
            <div dangerouslySetInnerHTML={{ __html: markdown }} />
          </Col>
          <Col />
        </Row>
      </Container>
    </div>
  );
}
