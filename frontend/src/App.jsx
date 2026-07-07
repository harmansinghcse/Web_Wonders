import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// import pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import InterestingFact from "./pages/interesting_fact";
import DinosaurPage from "./pages/Dinosaur-page";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/login" element={<Login />} />
                <Route path="/fact" element={<InterestingFact />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dinosaur-info" element={<DinosaurPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
