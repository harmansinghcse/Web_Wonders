import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// import pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
