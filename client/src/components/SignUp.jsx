import React from 'react'
import { useFormik } from "formik";
import * as yup from "yup";
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function SignUp({signedUser, setSignedUser}) {
  
    const navigate = useNavigate();

    const formSchema = yup.object().shape({
      username: yup.string().min(2, 'Too Short').required("Required"),
      email: yup.string().email('Invalid email').required('Required'),
      password: yup.string().min(4, 'Too Short!').required("Required"),
    })

    const formik = useFormik({
      initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      console.log(values)
        fetch('/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values, null, 2),
        })
        .then((r) => {if (r.ok) {
          r.json().then((userData) => {
            setSignedUser(userData);
            navigate("/");
          }) 
        } else {
            alert('Username or email has already been used');
        }})}})

if (!signedUser) {
  return (
    <Container className='w-25 position-absolute m-3'>
        <p className='fs-4 fw-medium'>Sign Up</p>
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
         /><p style={{ color: "red" }}> {formik.errors.username}</p>
        <Form.Label className='fw-medium mt-2' htmlFor="inputEmail">
            Email
        </Form.Label>
      <Form.Control
      type='email'
        name="email"
        id="inputEmail"
        onChange={formik.handleChange}
        value={formik.values.email}
         /><p style={{ color: "red" }}> {formik.errors.email}</p>
        <Form.Label className='fw-medium mt-2' htmlFor="inputPassword">
            Password
        </Form.Label>
      <Form.Control
        type='password'
        name="password"
        id="inputPassword" 
        onChange={formik.handleChange}
        value={formik.values.password}/>
        <p style={{ color: "red" }}> {formik.errors.password}</p>
        <Button className='mt-2' as="input" type="submit" value="Submit" />
        </Form>
    </Container>
  )} else navigate("/")
}

export default SignUp