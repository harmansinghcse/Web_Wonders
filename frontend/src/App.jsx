import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Import pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import InterestingFact from "./pages/interesting_fact";
import DinosaurPage from "./pages/Dinosaur-page";
import CreateDinosaur from "./pages/createDinosaur";
import Profile from "./pages/profile";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/login" element={<Login />} />
                <Route path="/fact" element={<InterestingFact />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/profile" element={<Profile />} />

                {/* Dynamic dinosaur page */}
                <Route path="/dinosaur/:slug" element={<DinosaurPage />} />
                <Route path="/create" element={<CreateDinosaur />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
