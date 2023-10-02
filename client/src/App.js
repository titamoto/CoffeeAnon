import React  from 'react'
// import './App.css';
import CoffeePage from './components/CoffeePage';
import Header from './components/Header';
import Welcome from './components/Welcome';
import { Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Header/>
      <Welcome/>
      <Route path="/">
      <CoffeePage/>
      </Route>
    </div>
  );
}

export default App;
