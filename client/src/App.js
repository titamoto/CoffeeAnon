import React, { useEffect, useState } from "react";
import CoffeePage from "./components/CoffeePage";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
import SignUp from "./components/SignUp";
import CoffeeProfile from "./components/CoffeeProfile";
import CoffeeReview from "./components/CoffeeReview";
import NewCoffeePage from "./components/NewCoffeePage";
import CoffeeEditReview from "./components/CoffeeEditReview";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.status === 204) {
        setUser(null);
      } else if (r.ok) {
        return r.json().then((user) => {
          setUser(user);
        });
      }
    });
  }, []);

  return (
    <>
      <Header signedUser={user} setSignedUser={setUser} />
      <Routes>
        <Route
          path={"/login"}
          element={<SignIn signedUser={user} setSignedUser={setUser} />}
        />
        <Route
          path={"/signup"}
          element={<SignUp signedUser={user} setSignedUser={setUser} />}
        />
        <Route
          path={"/logout"}
          element={<SignOut signedUser={user} setSignedUser={setUser} />}
        />
        <Route path={"/"} element={<CoffeePage signedUser={user} />} />
        <Route path={"/new"} element={<NewCoffeePage signedUser={user} />} />
        <Route path={"/:id"} element={<CoffeeProfile signedUser={user} />} />
        <Route
          path={"/:id/new-rate"}
          element={<CoffeeReview signedUser={user} />}
        />
        <Route
          path={"/:id/edit-rate"}
          element={<CoffeeEditReview signedUser={user} />}
        />
      </Routes>
    </>
  );
}

export default App;
