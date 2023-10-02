import React, {useEffect, useState}  from 'react'
import CoffeePage from './components/CoffeePage';
import Header from './components/Header';
import { Route } from "react-router-dom";
import SignIn from './components/SignIn';

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
    <div className="App">
      <Header/>
      <Route path="/login">
        <SignIn/>
      </Route>
      <Route path="/">
      <CoffeePage/>
      </Route>
    </div>
  );
}

export default App;
