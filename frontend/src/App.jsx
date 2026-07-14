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
import QuizTopic from "./pages/QuizTopic";
import QuizPlay from "./pages/QuizPlay";
import QuizResult from "./pages/QuizResult";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/profile" element={<Profile />} />

                {/* Dynamic dinosaur page */}
                <Route path="/dinosaur/:slug" element={<DinosaurPage />} />
                <Route path="/create" element={<CreateDinosaur />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/explorer" element={<Explore />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/quiz/:slug" element={<TopicDetails />} />
                <Route path="/quiz/:slug/play" element={<PlayQuiz />} />
                <Route path="/professor" element={<Professor />} />

                <Route path="/quiz/topic/:slug" element={<QuizTopic />}/>
                <Route path="/quiz/play/:slug/:difficulty" element={<QuizPlay />}/>
                <Route path="/quiz/result" element={<QuizResult />}/>
                
            </Routes>
        </BrowserRouter>
    );
}

export default App;
