import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { NavLink } from "react-router-dom";
import Image from "react-bootstrap/Image";

function Header({ signedUser }) {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container className="ms-2" fluid>
          <Navbar.Brand>
            <Image
              width="70px"
              height="70px"
              src="images/frog-coffee.jpg"
              roundedCircle
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Button
                variant="link"
                className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
              >
                <NavLink to="/">All Coffee</NavLink>
              </Button>
              <Button
                variant="link"
                className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
              >
                <NavLink to="/new">Add Coffee</NavLink>
              </Button>
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
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
