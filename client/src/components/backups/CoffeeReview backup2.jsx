import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useFormik } from "formik";
import * as yup from 'yup';

function CoffeeReview({signedUser}) {

  const navigate = useNavigate();
  const params = useParams(); 
  const [values, setValues] = useState({
    rate: 50,
    acidity: 50,
    body: 50,
    aroma: 50
  })

  useEffect(() => {
      if (!signedUser) {
          navigate("/login")
      }
  })

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
  
  const handleSubmit = ((formikValues) => {
      console.log(values)
      console.log(formikValues)
  //     fetch(`/coffees/${params.id}/reviews`, {
  //         method: "POST",
  //         headers: {
  //             "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(values),
  //     })
  //     .then((r) => {if (!r.ok) {
  //         throw new Error('Adding review failed.');
  //     }
  //     return r.json();
  //     //render error
  // })
  //     .then(() => {
  //     navigate("/");
  //     } )
  }
  )

  const formik = useFormik({    
    initialValues: {
      rate: 50,
      price: 0,
      acidity: 50,
      body: 50,
      aroma: 50,
      review_text: "",
      flavor: "",
      tag: ""
    },
    validationSchema: schema,
    onSubmit: handleSubmit
  })
  
  return (
<Container className='position-absolute m-3'>
<p className='fs-4 fw-medium'>Add Review</p>
<p className='fs-4 fw-bold text-uppercase'>Coffee Name</p>
<p className='fs-4 fw-semibold'>Producer</p>
<p className='fs-5 fw-normal text-secondary'>How do you like it?</p>



  <Form onSubmit={formik.handleSubmit}>

  <Row className="mb-3">
            <Form.Group
              as={Col}
              md="4"
              className="position-relative"
            >
              <Form.Label>Overall</Form.Label>
              <Form.Range
                type="range"
                value={values.rate}
                onChange={e => setValues(e.target.value)}/></Form.Group>
            <Form.Group
              as={Col}
              md="4"
              className="position-relative"
            > 
                <Form.Label>Acidity</Form.Label>
              <Form.Range
                type="range"
                value={values.acidity}
                onChange={e => setValues(e.target.value)}/>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group
              as={Col}
              md="4"
              className="position-relative"
            >
              <Form.Label>Body</Form.Label>
              <Form.Range
                type="number"
                value={values.body}
                onChange={e => setValues(e.target.value)}/></Form.Group>
            <Form.Group
              as={Col}
              md="4"
              className="position-relative"
            > 
                <Form.Label>Aroma</Form.Label>
              <Form.Range
                type="number"
                value={values.aroma}
                onChange={e => setValues(e.target.value)}/>
            </Form.Group>
          </Row>
  

          <Row className="mb-3">
            <Form.Group
              as={Col}
              md="4"
              controlId="validationFormikFlavor"
              className="position-relative"
            >
              <Form.Label>Flavor</Form.Label>
              <InputGroup hasValidation>
              <Form.Control
                type="text"
                name="flavor"
                value={formik.values.flavor}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.flavor}
              />
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
                  value={formik.values.tag}
                  onChange={formik.handleChange}
                  isInvalid={!!formik.errors.tag}
                />
              </InputGroup>
            </Form.Group></Row>
          <Button type="submit">Submit review</Button>
        </Form>
</Container>
  )
}

export default CoffeeReview