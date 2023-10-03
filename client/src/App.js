import React, {useEffect, useState}  from 'react'
import CoffeePage from './components/CoffeePage';
import Header from './components/Header';
import { Route, Routes } from "react-router-dom";
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import SignUp from './components/SignUp';
import CoffeeProfile from './components/CoffeeProfile'
import CoffeeReview from './components/CoffeeReview';
import NewCoffeePage from './components/NewCoffeePage';
import MyReviews from './components/MyReviews';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5555/check_session")
    .then((r) => {
      if (r.status === 204) {
        setUser(null) }
      else if (r.ok) {
        return r.json()
        .then((user) => setUser(user));
      }
    });
  }, []);
  
    // if (!user) console.log(user)

  return (
    <>
      <Header signedUser={user} setSignedUser={setUser}/>
      <Routes>
      <Route path={"/login"} element={<SignIn signedUser={user} setSignedUser={setUser}/>}/>
      <Route path={"/signup"} element={<SignUp signedUser={user} setSignedUser={setUser}/>} />
      <Route path={"/logout"} element={<SignOut signedUser={user} setSignedUser={setUser}/>} />
      <Route path={"/"} element={<CoffeePage/>} />
      <Route path={"/my-reviews"} element={<MyReviews signedUser={user}/>} />
      <Route path={"/new"} element={<NewCoffeePage signedUser={user}/>} />
      <Route path={"/:id"} element={<CoffeeProfile/>} />
      <Route path={"/:id/rate"} element={<CoffeeReview signedUser={user}/>} />
      </Routes>
    </>
  );
}

export default App;
