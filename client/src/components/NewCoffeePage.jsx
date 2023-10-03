import { useEffect } from 'react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

function NewCoffeePage({signedUser}) {
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

export default NewCoffeePage