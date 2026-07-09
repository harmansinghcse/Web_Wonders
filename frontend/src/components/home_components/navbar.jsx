import logo from "../../assets/jurrasic-logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import UserMenu from "./UserMenu";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <div className={menuOpen ? "hidden lg:block" : "block"}>
                <nav className="relative mx-auto flex h-20 max-w-400 items-center justify-between rounded-full bg-[#2E4A37]/80 px-4 py-4 text-white md:px-10">
                    {/* Left Section (Logo) */}
                    <div>
                        <Link to="/">
                            <img
                                src={logo}
                                alt="logo"
                                className="h-12 w-auto object-contain md:h-20"
                            />
                        </Link>
                    </div>

                    {/* Hamburger Button */}
                    <button
                        className="p-2 text-3xl lg:hidden"
                        onClick={() => setMenuOpen(true)}
                    >
                        <Menu size={32} />
                    </button>

                    {/* Mid-Section (Desktop) */}
                    <div className="hidden justify-between gap-2 lg:flex">
                        <Link
                            to="/dinosaur-info"
                            className="rounded-full px-4 py-2 transition hover:bg-white/20"
                        >
                            Explore
                        </Link>
                        <Link
                            to="/quiz"
                            className="rounded-full px-4 py-2 transition hover:bg-white/20"
                        >
                            Quiz
                        </Link>
                        <Link
                            to="/create"
                            className="rounded-full px-4 py-2 transition hover:bg-white/20"
                        >
                            Create Dino
                        </Link>
                    </div>

                    {/* Right-Section (Desktop) */}
                    <div className="hidden items-center gap-4 lg:flex">
                        <div className="flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur transition-all focus-within:border-[#516858] focus-within:ring-2 focus-within:ring-[#516858]/40">
                            <span className="mr-2">🔍</span>
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-32 bg-transparent text-white outline-none placeholder:text-white/60 xl:w-auto"
                            />
                        </div>
                        <UserMenu />
                    </div>
                </nav>
            </div>

            {/* Full-Screen Mobile Menu Overlay */}
            {menuOpen && (
                <div className="fixed inset-0 z-100 flex h-screen w-screen flex-col overflow-hidden bg-[#2E4A37]/20 bg-[url('/mobile-home-page.png')] lg:hidden">
                    {/* Mobile Menu Header */}
                    <div className="flex h-20 items-center justify-between border-b border-white/10 px-4">
                        <Link to="/" onClick={() => setMenuOpen(false)}>
                            <img
                                src={logo}
                                alt="logo"
                                className="max-w-200px h-12 w-auto object-contain"
                            />
                        </Link>

                        {/* Mobile Menu Close Button */}
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-center rounded-full p-2 text-white transition hover:bg-red-600"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Mobile Menu Links */}
                    <div className="flex flex-col gap-8 overflow-y-auto px-8 py-10 text-2xl font-semibold text-white mix-blend-normal">
                        <Link to="/explore" onClick={() => setMenuOpen(false)}>
                            Explore
                        </Link>
                        <Link to="/quiz" onClick={() => setMenuOpen(false)}>
                            Quiz
                        </Link>
                        <Link to="/create" onClick={() => setMenuOpen(false)}>
                            Create Dino
                        </Link>
                        <Link to="/login" onClick={() => setMenuOpen(false)}>
                            Login
                        </Link>
                        <Link to="/signup" onClick={() => setMenuOpen(false)}>
                            Signup
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
