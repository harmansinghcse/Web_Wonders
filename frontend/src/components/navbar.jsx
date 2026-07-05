import logo from "../assets/jurrasic-logo.png";

function Navbar() {
    return (
        <nav className="flex justify-between items-center h-20 px-10 bg-[#2E4A37]/80 rounded-full backdrop:blur-md text-white">
            {/* left-section */}
            <div>
                <img src={logo} alt="logo" className="h-20" />
            </div>

            {/* Mid-Section */}
            <div className="flex justify-between">
                <button className="px-4 py-2 rounded-full hover:bg-white/20 transition">
                    Explore
                </button>
                <button className="px-4 py-2 rounded-full hover:bg-white/20 transition">
                    Quiz
                </button>
                <button className="px-4 py-2 rounded-full hover:bg-white/20 transition">
                    Games
                </button>
            </div>

            {/* Right-Section */}
            <div className="flex items-center gap-4">
                <div
                    className="flex 
                    items-center 
                    bg-white/10 border 
                    border-white/20 
                    px-4 
                    py-2 
                    backdrop-blur
                    focus-within:border-[#516858]
                    focus-within:ring-2
                    focus-within:ring-[#516858]/40
                    transition-all
                    rounded-full
                    "
                >
                    <span className="mr-2">🔍</span>
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent
                        outline-none
                        text-white
                        placeholder:text-white/60 
                        "
                    />
                </div>
                <div className="px-5 py-2 rounded-full hover:bg-white hover:text-[#516858] transition-all duration-300 border bg-[#516858]">
                    <button>Login</button>
                </div>
                <div className="px-5 py-2 rounded-full hover:bg-white hover:text-[#516858] transition duration-300 border bg-[#516858]">
                    <button>Sign-Up</button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
