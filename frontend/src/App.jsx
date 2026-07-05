import "./App.css";
import Navbar from "./components/Navbar";

function App() {
    return (
        <>
            <div
                className="
                    fixed
                    inset-0
                    -z-10
                    bg-cover
                    bg-center
                "
                style={{ backgroundImage: "url('/jurrasic-home-bg.jpeg')" }}
            ></div>
            <div className="px-2 py-4">
                <Navbar />
            </div>
        </>
    );
}

export default App;
