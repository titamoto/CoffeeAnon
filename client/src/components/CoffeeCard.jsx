import React, {useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';

function CoffeeCard({coffee}) {
  const [averageRate, setAverageRate] = useState(0)

  useEffect(() => {
    fetch(`/coffees/${coffee.id}/reviews/average`)
      .then((r) => r.json())
      .then((data) => setAverageRate(data.average_rate));
  }, [])

  return (
    <Card className='m-2' style={{ width: '20rem' }}>
      <Card.Img className="img-fluid" alt='Coffee Image' variant="top" src={coffee.image} />
      <Card.Body>
        <Card.Title>{coffee.name}<Badge pill bg="warning" className='ms-2 mt-1 fw-medium fs-6 text-primary-emphasis'>{parseInt(averageRate)/10}/10
      </Badge></Card.Title>
        <Card.Text>{coffee.producer}</Card.Text>
      <Button className='m-1'variant="primary"><Link className='link-light link-underline-opacity-0' to={`/${coffee.id}`} >More Info</Link></Button>
      <Button className='m-1' variant="primary"><Link className='link-light link-underline-opacity-0' to={`/${coffee.id}/new-rate`}>Rate Coffee</Link></Button>
      </Card.Body>
    </Card>
  )
}

export default CoffeeCard