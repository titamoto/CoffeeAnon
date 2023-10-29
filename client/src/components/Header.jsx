import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import { NavLink } from "react-router-dom";
import Image from "react-bootstrap/Image";

function Header({ signedUser }) {
  return (
    <>
      <Navbar expand="lg">
      <Container className="ms-3 me-2" fluid>
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
                <Button
                  variant="link"
                  className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                >
                  <NavLink to="/login">Sign In</NavLink>
                </Button>
              ) : (
                <Button
                  variant="link"
                  className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                >
                  <NavLink to="/logout">Sign Out</NavLink>
                </Button>
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
            <Button className="me-3" variant="outline-success">Search</Button>
          </Form>
                <NavLink className="me-3" to="/">All Coffee</NavLink>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                <NavLink className="" to="/new">Add Coffee</NavLink>
                </Navbar.Collapse>
              </Container>
              </Navbar>
    </>
  );
}

export default Header;
