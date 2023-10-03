import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function MyReviews({signedUser}) {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!signedUser) {
            navigate("/login")
        }
    })

  return (
    <>
    
    </>
  )
}

export default MyReviews