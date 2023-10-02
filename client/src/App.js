import React, {useEffect, useState}  from 'react'
import CoffeePage from './components/CoffeePage';
import Header from './components/Header';
import { Route, Switch } from "react-router-dom";
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import SignUp from './components/SignUp';

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
      <Header signedUser={user} setSignedUser={setUser}/>
      <Switch>
      <Route path="/login">
        <SignIn signedUser={user} setSignedUser={setUser}/>
      </Route>
      <Route path="/signup">
        <SignUp signedUser={user} setSignedUser={setUser}/>
      </Route>
      <Route path="/logout">
        <SignOut signedUser={user} setSignedUser={setUser}/>
      </Route>
      <Route exact path="/">
      <CoffeePage/>
      </Route>
      </Switch>
    </div>
  );
}

export default App;
