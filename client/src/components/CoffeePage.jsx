import React, { useEffect, useState } from "react";
import CoffeeCard from "./CoffeeCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

function CoffeePage({ searchTerm, showBest, showWorst, showDecaf, showAll }) {
  const [coffees, setCoffees] = useState([]);
  const [coffeesToRender, setCoffeesToRender] = useState(coffees)
  const [coffeesRates, setCoffeesRates] = useState([])

  function formCoffeesRates(obj) {
    coffeesRates.push(obj);
    setCoffeesRates(coffeesRates);
  }

  useEffect(() => {
    if (searchTerm !== '') {
    const filteredCoffees = coffees.filter((coffee) => coffee.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setCoffeesToRender(filteredCoffees);
    } else { setCoffeesToRender(coffees) }
}, [coffees, searchTerm])

useEffect(() => {
  if (showDecaf) {
      const uniqueBestDecaf = coffees.filter((coffee) => coffee.is_decaf === true)
      setCoffeesToRender(uniqueBestDecaf);
  } else {
    setCoffeesToRender(coffees);
  }
}, [coffees, showDecaf])

  useEffect(() => {
    if (showBest) {
        setCoffeesToRender([])
      console.log(coffees)
        const reversedSortedCoffeesRates = coffeesRates.toSorted((a, b) => b.rate - a.rate);
        // console.log(reversedSortedCoffeesRates);
        const bestCoffees = reversedSortedCoffeesRates.map((obj) => obj.coffee);
        const uniqueBestCoffees = [...new Set(bestCoffees)];
        console.log(uniqueBestCoffees);
        setCoffeesToRender(uniqueBestCoffees);
    } else {
      setCoffeesToRender(coffees);
    }
  }, [coffees, showBest, coffeesRates])

  useEffect(() => {
  if (showWorst) {
      const sortedCoffeesRates = coffeesRates.toSorted((a, b) => a.rate - b.rate);
      console.log(sortedCoffeesRates);
      const worstCoffees = sortedCoffeesRates.map((obj) => obj.coffee);
      const uniqueWorstCoffees = [...new Set(worstCoffees)]
      setCoffeesToRender(uniqueWorstCoffees);
    } else {
      setCoffeesToRender(coffees);
    }
  }, [coffees, showWorst, coffeesRates])

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
          <CoffeeCard key={coffee.id} coffee={coffee} formCoffeesRates={formCoffeesRates} />
        ))}
      </Row>
    </Container>
  );
}

export default CoffeePage;
