import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function CoffeeCard({coffee, signedUser}) {

  return (
    <Card className='m-2' style={{ width: '18rem' }}>
      <Card.Img variant="top" src={coffee.image} />
      <Card.Body>
        <Card.Title>{coffee.name}</Card.Title>
        <Card.Text>{coffee.producer}</Card.Text>
      <Button className='m-1'variant="outline-primary"><Link to={`/${coffee.id}`} >More Info</Link></Button>
     { signedUser ? <Button className='m-1' variant="outline-primary"><Link to={`/${coffee.id}/new-rate`}>Rate Coffee</Link></Button> :
     <Button className='m-1' disabled variant="outline-primary">Rate Coffee</Button> }
      </Card.Body>
    </Card>
  )
}

export default CoffeeCard