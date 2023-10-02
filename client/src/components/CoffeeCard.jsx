import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function CoffeeCard({coffee}) {


  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={coffee.image} />
      <Card.Body>
        <Card.Title>{coffee.name}</Card.Title>
        <Card.Text>{coffee.producer}</Card.Text>
        <Button className='m-1'variant="outline-primary">More Info</Button>
        <Button className='m-1' variant="outline-primary">Rate Coffee</Button>
      </Card.Body>
    </Card>
  )
}

export default CoffeeCard