import React, {useEffect, useState} from 'react'
import {Route, Switch} from "react-router-dom"
import CoffeeCard from './CoffeeCard'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function CoffeePage() {
  const [coffees, setCoffees] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:5555/coffees')
    .then((r) => r.json())
    .then((coffees) => console.log(coffees.map((coffee)=> coffee.image)))
    // .then((coffees) => setCoffees(coffees));
  }, []);

  return (
    <Container>
    <Switch>
    <Route exact path="/">
    <h4>All Coffee</h4>
    {coffees.map((coffee) => 
      <CoffeeCard key={coffee.id} coffee={coffee} />
    )
    }
    </Route>
    </Switch>
    </Container>

  )
}

export default CoffeePage