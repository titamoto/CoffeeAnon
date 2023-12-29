import React, { useEffect, useState } from "react";
import CoffeeCard from "./CoffeeCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

function CoffeePage({ searchTerm, showBest, showWorst, showDecaf}) {
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
  if (!showBest && !showDecaf && !showWorst) {
    setCoffeesToRender(coffees);
  }
}, [showBest, showDecaf, showWorst, coffees])

useEffect(() => {
  if (showDecaf) {
      const decafs = coffees.filter((coffee) => coffee.is_decaf === true)
      const uniqueDecafs = [];
      const uniqueIds = new Set();

      decafs.forEach((obj) => {
        if (!uniqueIds.has(obj.id)) {
          uniqueIds.add(obj.id);
          uniqueDecafs.push(obj);
        }
      });
      setCoffeesToRender(uniqueDecafs);
  // } else {
  //   setCoffeesToRender(coffees);
  }
}, [coffees, showDecaf])

  useEffect(() => {
    if (showBest) {
      const reversedSortedCoffeesRates = coffeesRates.sort((a, b) => b.rate - a.rate);
      const uniqueBestCoffees = [];
      const uniqueIds = new Set();
  
      reversedSortedCoffeesRates.forEach((obj) => {
        if (!uniqueIds.has(obj.coffee.id)) {
          uniqueIds.add(obj.coffee.id);
          uniqueBestCoffees.push(obj.coffee);
        }
      });
  
      console.log(uniqueBestCoffees);
      setCoffeesToRender(uniqueBestCoffees);
    // } else {
    //   setCoffeesToRender(coffees);
    }
  }, [coffees, showBest, coffeesRates]);
  

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
