import React, {useState, useEffect} from 'react'
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import ProgressBar from 'react-bootstrap/ProgressBar';


function CoffeeProfile({signedUser, setSignedUser}) {

const [coffee, setCoffee] = useState({});
const [coffeeProfile, setCoffeeProfile] = useState({})
const params = useParams();

useEffect(() => {
    fetch(`/coffees/${params.id}`)
    .then((r) => r.json())
    .then((coffee) => {
        if (coffee.coffee_profile && coffee.coffee_profile.length > 0) {
            setCoffeeProfile(coffee.coffee_profile[0]);
          }
          console.log(coffee)
        setCoffee(coffee)
    }
        );
    }, []);

  return (
<Container className='position-absolute m-3'>
<p className='fs-4 fw-medium'>Coffee Profile</p>
<Row>
<Col><Image src={coffee.image} rounded fluid/></Col> 
<Col>
<p className='fs-4 fw-bold text-uppercase'>{coffee.name}</p>
<p className='fs-4 fw-normal'>{coffee.producer}</p>
<Row>
<Col>
<p className='fs-5 fw-normal'>Country:</p>
<p className='fs-5 fw-normal'>Region:</p>
</Col>
<Col xs={6}>
<p className='fs-5 fw-semibold'>{ coffeeProfile.country }</p>
<p className='fs-5 fw-semibold'>{ coffeeProfile.region }</p>
</Col>
<Col></Col>
</Row>
<p className='fs-6 fw-normal'>Roast:</p>
<ProgressBar variant="warning" now={coffee.roast} />


</Col>
</Row>
</Container>
  )
}

export default CoffeeProfile