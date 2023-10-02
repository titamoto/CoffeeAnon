import React, { useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import CoffeePage from './CoffeePage';
// import { Route } from 'react-router-dom';

function SignUp({signedUser, setSignedUser}) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const signUpObject = {username, email, password}
    const history = useHistory();

    function handleSubmit(e) {
        e.preventDefault();
        fetch('http://localhost:5555/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signUpObject),
        })
        .then((r) => {if (!r.ok) {
            throw new Error('Signing up failed.');
        }
        return r.json();
        //render error
    })
        .then((userData) => {
        setSignedUser(userData);
        history.push('/');
        } )
    }
if (!signedUser) {
  return (
    <Container className='w-25 position-absolute m-3'>
        <h4>Sign Up</h4>
        <Form onSubmit={handleSubmit}>
        <Form.Label className='fw-medium mt-2' htmlFor="inputLogin">
            Login
        </Form.Label>
      <Form.Control
        type="login"
        id="inputLogin"
        onChange={(e) => setUsername(e.target.value)}
         />
        <Form.Label className='fw-medium mt-2' htmlFor="inputEmail">
            Email
        </Form.Label>
      <Form.Control
        type="email"
        id="inputEmail"
        onChange={(e) => setEmail(e.target.value)}
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
    </Container>
  )} else {
    return <>
      <CoffeePage/>
    </>
  }
}

export default SignUp