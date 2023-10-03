import React from 'react'
import { Container, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import CoffeePage from './CoffeePage';
import { useFormik } from "formik";
import * as yup from "yup";

function SignIn({signedUser, setSignedUser}) {

    const history = useHistory();

    const formSchema = yup.object().shape({
        username: yup.string().min(2, 'Too Short').required("Required"),
        password: yup.string().min(4, 'Too Short!').required("Required"),
      })

      const formik = useFormik({
        initialValues: {
        username: "",
        password: "",
      },
      validationSchema: formSchema,
      onSubmit: (values) => {
        console.log(values)
        fetch('http://localhost:5555/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values, null, 2),
        })
        .then((r) => {if (!r.ok) {
            throw new Error('Incorrect username or password');
        }
        return r.json();
        //render error
    })
        .then((userData) => {
        setSignedUser(userData);
        history.push('/');
        } )
    }})

if (!signedUser) {
  return (
    <Container className='w-25 position-absolute m-3'>
        <h4>Sign In</h4>
        <Form onSubmit={formik.handleSubmit}>
        <Form.Label className='fw-medium mt-2' htmlFor="inputLogin">
            Login
        </Form.Label>
      <Form.Control
        type='username'
        name="username"
        id="inputUsername"
        onChange={formik.handleChange}
        value={formik.values.username}
         /><p style={{ color: "#8B0000" }}> {formik.errors. username}</p>
        <Form.Label className='fw-medium mt-2' htmlFor="inputPassword">
            Password
        </Form.Label>
      <Form.Control
        type='password'
        name="password"
        id="inputPassword" 
        onChange={formik.handleChange}
        value={formik.values.password}/>
        <p style={{ color: "#8B0000" }}> {formik.errors.password}</p>
        <Button className='mt-2' as="input" type="submit" value="Submit" />
        </Form>
        <p className='mt-2 fs-6'>Not registered? <a href='/signup'>Sign up</a></p>
    </Container>
  )} else {
    return <>
      <CoffeePage/>
    </>
  }
}

export default SignIn