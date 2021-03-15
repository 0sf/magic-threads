import "./App.css";
import About from "./pages/About";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AppBarComponent from "./components/AppBar.js";
import BodyContent from "./BodyContent";
import Footer from "./components/Footer.js";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <div className="App">
            <AppBarComponent />
            <BodyContent />
            <Footer />
          </div>
        </Route>
        <Route path="/about">
          <About />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
