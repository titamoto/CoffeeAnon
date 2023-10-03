import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';


function CoffeeProfile({signedUser, setSignedUser}) {

const [coffee, setCoffee] = useState([]);
const params = useParams();

useEffect(() => {
    fetch(`/coffees/${params.id}`)
    .then((r) => r.json())
    .then((coffee) => setCoffee(coffee));
    }, []);

  return (
<>
<h4>Coffee Profile </h4>
<p>{coffee.name}</p>
</>
  )
}

export default CoffeeProfile