import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import CoffeeCard from './CoffeeCard'

function MyReviews({signedUser}) {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([])
    const [coffeeIds, setCoffeeIds] = useState([])
    const [coffees, setCoffees] = useState([])
    
    useEffect(() => {
        if (!signedUser) {
            navigate("/login")
        }
    })

    // useEffect(() => {
    //   fetch('/user-reviews')
    //   .then((r) => r.json())
    //   .then((data) => console.log(data))
    //   .then((reviews) => setReviews(reviews)
    //   .then(reviews.forEach((review) => {
    //         coffeeIds.push(review.coffee_id)
    //         setCoffeeIds(coffeeIds)
    //     }))
    //  )}, []);



  // let filteredCoffees = []

  //   useEffect(() => {
  //     fetch('/coffees')
  //     .then((r) => r.json())
  //     .then((coffees) => {
  //       setCoffees(coffees)
  //     }).then(filteredCoffees = coffees.filter((coffee) => {
  //       coffeeIds.includes(coffee.id)
  //     setCoffees(filteredCoffees)}
  //       ))
      
  //     ;
  //   }, []);


  return (
<Container className='position-absolute m-3'>
<p className='fs-4 fw-medium'>My Reviews</p>
<Row xs={1} md={2} className="g-4 mt-1">
    {coffees.map((coffee) => 
      <CoffeeCard key={coffee.id} coffee={coffee} />
    )
    }
    </Row>
</Container>
  )
}

export default MyReviews