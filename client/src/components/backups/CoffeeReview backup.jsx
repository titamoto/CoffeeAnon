import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import * as formik from 'formik';
import * as yup from 'yup';

function CoffeeReview({signedUser}) {

  const navigate = useNavigate();
  const params = useParams(); 

  useEffect(() => {
      if (!signedUser) {
          navigate("/login")
      }
  })

  const { Formik } = formik;

  const schema = yup.object().shape({
    rate: yup.number().positive(),
    price: yup.number().positive(),
    acidity: yup.number().positive(),
    body: yup.number().positive(),
    aroma: yup.number().positive(),
    review_text: yup.string().max(1000),
    flavor: yup.string().max(50),
    tag: yup.string().max(50)
  });
  
  const handleSubmit = ((values) => {
      console.log(values)
      fetch(`/coffees/${params.id}/reviews`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
      })
      .then((r) => {if (!r.ok) {
          throw new Error('Adding review failed.');
      }
      return r.json();
      //render error
  })
      .then(() => {
      navigate("/");
      } )
  }
  )

  return (
<Container className='position-absolute m-3'>
<p className='fs-4 fw-medium'>Add Review</p>
<p className='fs-4 fw-bold text-uppercase'>Coffee Name</p>
<p className='fs-4 fw-semibold'>Producer</p>
<p className='fs-5 fw-normal text-secondary'>How do you like it?</p>

<Formik
      validationSchema={schema}
      onSubmit={handleSubmit}
      initialValues={{
        rate: 0,
        price: 0,
        acidity: 0,
        body: 0,
        aroma: 0,
        review_text: "",
        flavor: "",
        tag: ""
      }}
    >
      {({ handleSubmit, handleChange, values, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group
              as={Col}
              md="4"
              controlId="validationFormikRate"
              className="position-relative"
            >
              <Form.Label>Overall</Form.Label>
              <Form.Range
                type="number"
                value={values.rate}
                onChange={handleChange}/></Form.Group>
            <Form.Group
              as={Col}
              md="4"
              controlId="validationFormikAcidity"
              className="position-relative"
            > 
                <Form.Label>Acidity</Form.Label>
              <Form.Range
                type="number"
                value={values.acidity}
                onChange={handleChange}/>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group
              as={Col}
              md="4"
              controlId="validationFormikBody"
              className="position-relative"
            >
              <Form.Label>Body</Form.Label>
              <Form.Range
                type="number"
                value={values.body}
                onChange={handleChange}/></Form.Group>
            <Form.Group
              as={Col}
              md="4"
              controlId="validationFormikAroma"
              className="position-relative"
            > 
                <Form.Label>Aroma</Form.Label>
              <Form.Range
                type="number"
                value={values.aroma}
                onChange={handleChange}/>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group
              as={Col}
              md="4"
              controlId="validationFormikCountry"
              className="position-relative"
            >
              <Form.Label>Flavor</Form.Label>
              <InputGroup hasValidation>
              <Form.Control
                type="text"
                name="flavor"
                value={values.flavor}
                onChange={handleChange}
                isInvalid={!!errors.flavor}
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {errors.flavor}
              </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          <Row className="mb-3">
          <Form.Group 
          as={Col} md="4" controlId="validationFormikTag">
              <Form.Label>Tag</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  name="tag"
                  value={values.tag}
                  onChange={handleChange}
                  isInvalid={!!errors.tag}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.tag}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group></Row>
          <Button type="submit">Submit review</Button>
        </Form>
      )}
    </Formik>
</Container>
  )
}

export default CoffeeReview