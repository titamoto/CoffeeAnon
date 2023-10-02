import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

function SignIn() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const signInObject = {username, password}

    function handleSubmit(e) {
        e.preventDefault();
        fetch('http://localhost:5555/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signInObject),
        })
        .then((r) => r.json()
        .then((data) => console.log(data))
        )
    }

  return (
    <Container className='w-25 position-absolute m-3'>
        <h4>Sign In</h4>
        <Form onSubmit={handleSubmit}>
        <Form.Label className='fw-medium mt-2' htmlFor="inputLogin">
            Login
        </Form.Label>
      <Form.Control
        type="login"
        id="inputLogin"
        onChange={(e) => setUsername(e.target.value)}
         />
        <Form.Label className='fw-medium mt-2' htmlFor="inputPassword">
            Password
        </Form.Label>
      <Form.Control
        type="password"
        id="inputPassword" 
        onChange={(e) => setPassword(e.target.value)}/>
        <Button className='mt-2' as="input" type="submit" value="Submit" />
        </Form>
        <p className='mt-2 fs-6'>Not registered? <a href='/signup'>Sign up</a></p>
    </Container>
  )
}

export default SignIn