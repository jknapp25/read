import React, { useState } from "react";
import { Dropdown, Form, InputGroup } from "react-bootstrap";
export default User;

function User({
  users,
  setSavedPosition,
  author,
  title,
  octokit,
  setCurrentUsername,
  currentUsername,
  usersSha,
  setUsersSha,
  setScrolledToView,
}) {
  const [UN, setUN] = useState("");
  const [showAddUserInput, setShowAddUSerInput] = useState(false);

  async function addUser() {
    const hasUsers = Object.keys(users).length;

    let updUsers = {
      ...users,
      [UN]: 1,
    };

    let requestData = {
      owner: author,
      repo: title,
      path: "users.json",
      message: "Add new user",
      content: window.btoa(JSON.stringify(updUsers)),
    };
    if (hasUsers) requestData.sha = usersSha;
    await octokit
      .request("PUT /repos/{owner}/{repo}/contents/{path}", requestData)
      .then((response) => {
        setUsersSha(response.data.content.sha);
        setCurrentUsername(UN);
        setSavedPosition(1);
      });
    setUN("");
    setShowAddUSerInput(false);
  }

  return (
    <>
      <Dropdown className="mt-4">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {currentUsername || "Who are you?"}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {Object.keys(users).map((key) => (
            <Dropdown.Item
              key={key}
              onClick={() => {
                setScrolledToView(false);
                setCurrentUsername(key);
              }}
            >
              {key}
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={() => {
              setShowAddUSerInput(true);
            }}
          >
            I'm the new guy
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {showAddUserInput && (
        <>
          <label className="mt-4">What doesth thou call oneself?</label>
          <br />
          <InputGroup className="w-75">
            <Form.Control
              type="text"
              onChange={(e) => setUN(e.target.value)}
              value={UN}
            />
            <InputGroup.Append style={{ cursor: "pointer" }}>
              <InputGroup.Text onClick={addUser}>Add</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </>
      )}
    </>
  );
}
