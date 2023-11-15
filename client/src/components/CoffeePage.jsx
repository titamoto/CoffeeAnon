import React, { useEffect, useState } from "react";
import CoffeeCard from "./CoffeeCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

function CoffeePage({ searchTerm }) {
  const [coffees, setCoffees] = useState([]);
  const [coffeesToRender, setCoffeesToRender] = useState([])

  console.log(`rendering: ${searchTerm}`);
  useEffect(() => {
    if (searchTerm !== '') {
    const filteredCoffees = coffees.filter((coffee) => coffee.name.toLowerCase().includes(searchTerm.toLowerCase()));
    console.log(`filtered: ${filteredCoffees}`);
    // console.log(`coffees: ${coffees}`);
    setCoffeesToRender(filteredCoffees);
    } else { setCoffeesToRender(coffees) }
}, [searchTerm])

  useEffect(() => {
    fetch("/coffees")
      .then((r) => r.json())
      .then((coffees) => setCoffees(coffees))
      .catch((error) => alert("Error fetching data:", error));
  }, []);

  return (
    <Container className="position-absolute m-3">
      <p className="fs-4 fw-medium">All Coffee</p>
      <Row xs={2} md={4} lg={6} className="g-4 mt-1">
        {coffeesToRender.map((coffee) => (
          <CoffeeCard key={coffee.id} coffee={coffee} />
        ))}
      </Row>
    </Container>
  );
}

export default CoffeePage;
