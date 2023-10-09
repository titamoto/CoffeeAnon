import { React, useEffect } from "react";
import { Navigate } from "react-router-dom";

function SignOut({ signedUser, setSignedUser }) {
  useEffect(() => {
    fetch("/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signedUser),
    }).then((r) => {
      if (r.ok) {
        setSignedUser(null);
      } else {
        setSignedUser(null);
      }
    });
  }, [signedUser, setSignedUser]);

  return <Navigate to="/" />;
}

export default SignOut;
