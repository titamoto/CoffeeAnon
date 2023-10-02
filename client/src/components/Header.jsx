import React from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { NavLink } from "react-router-dom";

function Header() {
  return (
<>
<Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
      <Navbar.Brand href="/">CoffeeAnon</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll>
            <Nav.Link href="/">All Coffee</Nav.Link>
            <Nav.Link href="/my-reviews" disabled>My Reviews</Nav.Link>
            <Nav.Link href="/login">Sign In</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="🔍"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
</>
  )
}

export default Header