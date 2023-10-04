import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function CoffeeReview({signedUser}) {

  const navigate = useNavigate();
  const params = useParams(); 
  const [rate, setRate] = useState(65)
  const [acidity, setAcidity] = useState(40)
  const [body, setBody] = useState(50)
  const [aroma, setAroma] = useState(35)

  const values = {
    rate: rate,
    acidity: acidity,
    body: body,
    aroma: aroma,
    price: 0,
    review_text: "",
    flavor: "",
    tag: "",
    is_public : 1
    }

  useEffect(() => {
      if (!signedUser) {
          navigate("/login")
      }
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
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
  
  return (
<Container className='position-absolute m-3'>
<p className='fs-4 fw-medium'>Add Review</p>
<p className='fs-4 fw-bold text-uppercase'>Coffee Name</p>
<p className='fs-4 fw-semibold'>Producer</p>
<p className='fs-5 fw-normal text-secondary'>How do you like it?</p>

  <Form onSubmit={handleSubmit}>
  <Row className="mb-3">
            <Form.Group
              as={Col}
              md="4"
              className="position-relative"
            >
              <Form.Label>Overall</Form.Label>
              <Form.Range
                type="range"
                value={rate}
                onChange={e => setRate(e.target.value)}/></Form.Group>
            <Form.Group
              as={Col}
              md="4"
              className="position-relative"
            > 
                <Form.Label>Acidity</Form.Label>
              <Form.Range
                type="range"
                value={acidity}
                onChange={e => setAcidity(e.target.value)}/>
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
                value={body}
                onChange={e => setBody(e.target.value)}/></Form.Group>
            <Form.Group
              as={Col}
              md="4"
              className="position-relative"
            > 
                <Form.Label>Aroma</Form.Label>
              <Form.Range
                type="number"
                value={aroma}
                onChange={e => setAroma(e.target.value)}/>
            </Form.Group>
          </Row>
          <Button type="submit">Submit review</Button>
        </Form>
</Container>
  )
}

export default CoffeeReview