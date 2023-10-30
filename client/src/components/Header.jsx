import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Image from "react-bootstrap/Image";
import { LinkContainer } from 'react-router-bootstrap'

function Header({ signedUser }) {
  return (
    <>
      <Navbar expand="lg">
      <Container className="ms-3 me-3" fluid>
          <Navbar.Brand style={{ fontFamily: 'Pacifico', fontSize: '2.5em' }} href="/">
            <Image className="me-3"
              width="70px"
              height="70px"
              src="images/frog-coffee.jpg"
              roundedCircle
            />ratte
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
              {!signedUser ? (
                <LinkContainer to="/login">
                <Button size="lg"
                  variant="light"
                >Sign In</Button>
                </LinkContainer>
              ) : (
                <LinkContainer to="/logout">
                <Button variant="outline-secondary">Sign Out</Button>
                </LinkContainer>
              )}
              </Navbar.Collapse>
                    </Container>
      </Navbar>
      <Navbar expand="lg">
      <Container className="ms-3 me-3" fluid>
      <Navbar.Collapse>
      <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button className="me-4" variant="outline-light">Search</Button>
          </Form>
          <LinkContainer to="/"><Button variant="outline-light" className="me-2">Show All</Button></LinkContainer>
                <LinkContainer to=""><Button variant="outline-light" className="me-2" disabled>Best 🔥</Button></LinkContainer>
                <LinkContainer to=""><Button variant="outline-light" className="me-2"disabled>Worst 🤮</Button></LinkContainer>
                <LinkContainer to=""><Button variant="outline-light" className="me-2"disabled>Best Decaf 🌚</Button></LinkContainer>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                <LinkContainer to="/new">
                  <Button size="lg" variant="outline-warning">Add Coffee + </Button></LinkContainer>
                </Navbar.Collapse>
              </Container>
              </Navbar>
    </>
  );
}

export default Header;
