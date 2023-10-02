import React from 'react'
import CoffeePage from './CoffeePage'

function SignOut({signedUser, setSignedUser}) {
    fetch('http://localhost:5555/logout', {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },    body: JSON.stringify(signedUser)
    }).then((r) => {
        if(r.ok) {
            setSignedUser(null)
        }
    })

  return (
    <>
    <CoffeePage/>
</>

  )
}

export default SignOut