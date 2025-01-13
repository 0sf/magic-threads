import "./App.css";
import About from "./pages/About";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppBarComponent from "./components/AppBar.js";
import BodyContent from "./BodyContent";
import Footer from "./components/Footer.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={
          <div className="App">
            <AppBarComponent />
            <BodyContent />
            {/* <Footer /> */}
          </div>
        } />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
