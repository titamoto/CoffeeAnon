import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import { LinkContainer } from 'react-router-bootstrap'

function CoffeeCard({ coffee, formCoffeesRates }) {
  const [averageRate, setAverageRate] = useState(0);

  useEffect(() => {
    fetch(`/coffees/${coffee.id}/reviews/average`)
      .then((r) => r.json())
      .then((data) => {
        setAverageRate(data.average_rate);
        const coffeeRateObj = {coffee : coffee, rate : data.average_rate}
        formCoffeesRates(coffeeRateObj)
      });
  }, [coffee.id]);

  return (
    <Card className="m-2" style={{ width: "19.5rem" }}>
      <Card.Img
        className="img-fluid"
        alt="Coffee Image"
        variant="top"
        src={coffee.image}
      />
      <Card.Body>
        <Card.Title>
          {coffee.name}
          <Badge
            pill
            text="dark"
            bg="warning"
            className="ms-2 mt-1 fs-6"
          >
            {parseInt(averageRate) / 10}/10
          </Badge>
        </Card.Title>
        <Card.Text>{coffee.producer}</Card.Text>
        <LinkContainer to={`/${coffee.id}`}>
        <Button className="me-1 ms-1" variant="secondary">
            More Info
        </Button></LinkContainer>
        <LinkContainer to={`/${coffee.id}/new-rate`}>
        <Button className="me-1 ms-1" variant="primary">
            Rate Coffee</Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
}

export default CoffeeCard;
