import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Import pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import DinosaurPage from "./pages/Dinosaur-page";
import CreateDinosaur from "./pages/createDinosaur";
import Profile from "./pages/profile";
import Timeline from "./pages/Timeline";
import Quiz from "./pages/Quiz";
import TopicDetails from "./pages/TopicDetails";
import PlayQuiz from "./pages/PlayQuiz";
import Professor from "./pages/Professor";
import AdminSubmissions from "./pages/AdminSubmissions";
import ExploreMap from "./pages/ExploreMap";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/map" element={<ExploreMap />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/profile" element={<Profile />} />
                <Route path="/admin/submissions" element={<AdminSubmissions />} />

                {/* Dynamic dinosaur page */}
                <Route path="/dinosaur/:slug" element={<DinosaurPage />} />
                <Route path="/create" element={<CreateDinosaur />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/explorer" element={<Explore />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/quiz/:slug" element={<TopicDetails />} />
                <Route path="/quiz/:slug/play" element={<PlayQuiz />} />
                <Route path="/professor" element={<Professor />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
