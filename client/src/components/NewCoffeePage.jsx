import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import * as formik from 'formik';
import * as yup from 'yup';

function NewCoffeePage({signedUser}) {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!signedUser) {
            navigate("/login")
        }
    })

    const { Formik } = formik;

    const schema = yup.object().shape({
      name: yup.string().required("Required").min(3),
      producer: yup.string().required("Required").min(3),
      image: yup.string().url().min(5),
      roast: yup.number().required("Roast must a number from 0 to 100").integer().min(0).max(100),
      country: yup.string().min(2),
      region: yup.string().min(2),
    });
    
    const handleSubmit = ((values) => {
        fetch('/coffees', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
        .then((r) => {if (r.ok) {
          r.json().then(() => {
            navigate("/");
          }) 
        } else {
            alert('Coffee not added');
        }})})


    return (
<Container className='position-absolute m-3'>
<p className='fs-4 fw-medium'>New Coffee</p>
<Formik
      validationSchema={schema}
      onSubmit={handleSubmit}
      initialValues={{
        name: "",
        producer: "",
        product_type: "",
        weight: 340,
        is_decaf: 0,
        image: "",
        roast: 50,
        country: "",
        region: "",
        farm: "",
        continent :"",
        altitude : "",
        process : "",
        is_specialty : 0,
        variety : ""
      }}
    >
      {({ handleSubmit, handleChange, values, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group
              as={Col}
              md="4"
              controlId="validationFormikName"
              className="position-relative"
            >
              <Form.Label>Coffee name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="4"
              controlId="validationFormikProducer"
              className="position-relative"
            >
              <Form.Label>Producer</Form.Label>
              <Form.Control
                type="text"
                name="producer"
                value={values.producer}
                onChange={handleChange}
                isInvalid={!!errors.producer}
              />

              <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
            </Form.Group></Row>
            <Row className="mb-3"> 
            <Form.Group
              as={Col}
              md="4"
              controlId="validationFormikImage"
              className="position-relative"
            >
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                name="image"
                placeholder=""
                value={values.image}
                onChange={handleChange}
                isInvalid={!!errors.image}
              />
                <Form.Control.Feedback type="invalid" tooltip>
                {errors.image}
              </Form.Control.Feedback>
            </Form.Group>
        </Row>
          <Row className="mb-3">
            <Form.Group
              as={Col}
              md="6"
              controlId="validationFormikCountry"
              className="position-relative"
            >
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Country"
                name="country"
                value={values.country}
                onChange={handleChange}
                isInvalid={!!errors.country}
              />

              <Form.Control.Feedback type="invalid" tooltip>
                {errors.country}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="3"
              controlId="validationFormikRegion"
              className="position-relative"
            >
              <Form.Label>Region</Form.Label>
              <Form.Control
                type="text"
                placeholder="Region"
                name="region"
                value={values.region}
                onChange={handleChange}
                isInvalid={!!errors.region}
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {errors.region}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationFormikRoast">
              <Form.Label>Roast</Form.Label>
              {/* <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  aria-describedby="inputGroupPrepend"
                  name="roast"
                  value={values.roast}
                  onChange={handleChange}
                  isInvalid={!!errors.roast}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.roast}
                </Form.Control.Feedback>
      </InputGroup> */}
                    <Form.Range
                type="number"
                value={values.rate}
                onChange={handleChange}/>
             </Form.Group></Row>
          <Button type="submit">Save coffee</Button>
        </Form>
      )}
    </Formik>

</Container>

  )
}

export default NewCoffeePage