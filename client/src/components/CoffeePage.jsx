import React, {useEffect, useState} from 'react'
import CoffeeCard from './CoffeeCard'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';


function CoffeePage({signedUser}) {
  const [coffees, setCoffees] = useState([])

  useEffect(() => {
    fetch('/coffees')
    .then((r) => r.json())
    // .then((coffees) => console.log(coffees.map((coffee)=> coffee.image)))
    .then((coffees) => setCoffees(coffees));
  }, []);

  return (
    <Container className='position-absolute m-3'>
    <p className='fs-4 fw-medium'>All Coffee</p>
    <Row xs={1} md={2} className="g-4 mt-1">
    {coffees.map((coffee) => 
      <CoffeeCard key={coffee.id} coffee={coffee}/>
    )
    }
    </Row>
    </Container>

  )
}

export default CoffeePage