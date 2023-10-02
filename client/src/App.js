import React  from 'react'
// import './App.css';
import CoffeePage from './components/CoffeePage';
import Header from './components/Header';
// import Welcome from './components/Welcome';
import { Route } from "react-router-dom";
import SignIn from './components/SignIn';

function App() {
  return (
    <div className="App">
      <Header/>
      {/* <Welcome/> */}
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
