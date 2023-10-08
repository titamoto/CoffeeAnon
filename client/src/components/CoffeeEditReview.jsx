import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function CoffeeEditReview({ signedUser }) {
  const navigate = useNavigate();

  const params = useParams();
  const [rate, setRate] = useState(0);
  const [acidity, setAcidity] = useState(0);
  const [body, setBody] = useState(0);
  const [aroma, setAroma] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [reviewId, setReviewId] = useState(null);

  const values = {
    rate: rate,
    acidity: acidity,
    body: body,
    aroma: aroma,
  };

  useEffect(() => {
    if (!signedUser) {
      navigate("/login");
    }
  }, [signedUser, navigate]);

  useEffect(() => {
    if (signedUser) {
      fetch(`/coffees/${params.id}/reviews`)
        .then((r) => r.json())
        .then((reviews) => {
          const review = reviews.find(
            (review) => review.user_id === signedUser.id
          );
          setRate(review.review.rate);
          setAcidity(review.review.acidity);
          setAroma(review.review.aroma);
          setBody(review.review.body);
          setReviewId(review.review_id);
        });
    }
  }, [signedUser, params.id]);

  function handleDelete() {
    fetch(`/reviews/${reviewId}`, {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        setSuccess(true);
        navigate(`/${params.id}`);
      } else {
        setError(true);
      }
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch(`/reviews/${reviewId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((r) => {
      if (r.ok) {
        setSuccess(true);
        navigate(`/${params.id}`);
      } else {
        setError(true);
      }
    });
  }

  return (
    <Container className="position-absolute m-3">
      <p className="fs-4 fw-medium">Edit Review</p>
      <p className="fs-4 fw-bold text-uppercase">Coffee Name</p>
      <p className="fs-4 fw-semibold">Producer</p>
      <p className="fs-5 fw-normal text-secondary">How do you like it?</p>

      <Alert show={success} variant="success">
        <Alert.Heading>Success</Alert.Heading>
        <p>Changes saved.</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setSuccess(false)} variant="outline-success">
            Close me
          </Button>
        </div>
      </Alert>

      <Alert show={error} variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>Something wrong!</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setError(false)} variant="outline-danger">
            Close me
          </Button>
        </div>
      </Alert>

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" className="position-relative">
            <Form.Label>Overall</Form.Label>
            <Form.Range
              type="range"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" className="position-relative">
            <Form.Label>Acidity</Form.Label>
            <Form.Range
              type="range"
              value={acidity}
              onChange={(e) => setAcidity(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" className="position-relative">
            <Form.Label>Body</Form.Label>
            <Form.Range
              type="number"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" className="position-relative">
            <Form.Label>Aroma</Form.Label>
            <Form.Range
              type="number"
              value={aroma}
              onChange={(e) => setAroma(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row>
          <Col>
            <Button className="" type="submit">
              Save changes
            </Button>
          </Col>
          <Col>
            <Button
              onClick={handleDelete}
              className=""
              variant="outline-warning"
              type="button"
            >
              Delete review
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default CoffeeEditReview;
