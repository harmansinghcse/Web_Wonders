import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";

// Import pages
const Home = lazy(() => import("./pages/Home"));
const Explore = lazy(() => import("./pages/Explore"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const DinosaurPage = lazy(() => import("./pages/Dinosaur-page"));
const CreateDinosaur = lazy(() => import("./pages/createDinosaur"));
const Profile = lazy(() => import("./pages/profile"));
const Timeline = lazy(() => import("./pages/Timeline"));
const Quiz = lazy(() => import("./pages/Quiz"));
const TopicDetails = lazy(() => import("./pages/TopicDetails"));
const PlayQuiz = lazy(() => import("./pages/PlayQuiz"));
const Professor = lazy(() => import("./pages/Professor"));
const QuizTopic = lazy(() => import("./pages/QuizTopic"));
const QuizPlay = lazy(() => import("./pages/QuizPlay"));
const QuizResult = lazy(() => import("./pages/QuizResult"));
const AdminSubmissions = lazy(() => import("./pages/AdminSubmissions"));
const ExploreMap = lazy(() => import("./pages/ExploreMap"));
const Community = lazy(() => import("./pages/Community"));
const Games = lazy(() => import("./pages/Games"));

const LoadingFallback = () => (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#F7F6F1]">
        <div className="flex flex-col items-center gap-4">
            <span className="text-5xl animate-bounce">🦖</span>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-full bg-[#6C8E4E] origin-left animate-pulse" />
            </div>
            <p className="text-sm font-semibold tracking-wider text-[#36593D] animate-pulse">
                Loading Era...
            </p>
        </div>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
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
                    <Route path="/community" element={<Community />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/quiz/:slug" element={<TopicDetails />} />
                    <Route path="/quiz/:slug/play" element={<PlayQuiz />} />
                    <Route path="/professor" element={<Professor />} />

                    <Route path="/quiz/topic/:slug" element={<QuizTopic />}/>
                    <Route path="/quiz/play/:slug/:difficulty" element={<QuizPlay />}/>
                    <Route path="/quiz/result" element={<QuizResult />}/>

                    {/* Games & Jurassic Memory Match Routes */}
                    <Route path="/games" element={<Games />} />
                    <Route path="/games/memory-match" element={<Games />} />
                    <Route path="/games/jurassic-memory-match" element={<Games />} />
                    
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
