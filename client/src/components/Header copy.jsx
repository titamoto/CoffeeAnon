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
      <Container className="ms-3 me-3" fluid>
          <Navbar.Brand className="ms-0" href="/">
            <Image
              width="70px"
              height="70px"
              src="images/frog-coffee.jpg"
              roundedCircle
            />
          </Navbar.Brand>
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
    </>
  );
}

export default Header;
