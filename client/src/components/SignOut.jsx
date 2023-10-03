import React from 'react'
import { Navigate } from 'react-router-dom'

function SignOut({signedUser, setSignedUser}) {
    fetch('/logout', {
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
    <Navigate to="/"/>
  )
}

export default SignOut