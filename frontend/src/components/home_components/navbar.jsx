import logo from "../../assets/jurrasic-logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import UserMenu from "./UserMenu";
import SearchBar from "../search/SearchBar";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");

    return (
        <>
            <div className={menuOpen ? "hidden lg:block" : "block"}>
                <nav className="relative mx-auto flex h-16 w-full max-w-400 items-center justify-between rounded-full bg-[#2E4A37]/80 px-4 text-white sm:h-18 md:h-20 md:px-6 lg:px-8">
                    {/* Left Section (Logo) */}
                    <div>
                        <Link to="/">
                            <img
                                src={logo}
                                alt="logo"
                                className="h-10 w-auto object-contain sm:h-12 md:h-14 lg:h-18"
                            />
                        </Link>
                    </div>

                    {searchOpen && (
                        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden">
                            <div className="mx-4 mt-6 rounded-3xl border border-white/10 bg-[#1E3326] p-5 shadow-2xl">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-white">
                                        Search Dinosaurs
                                    </h2>

                                    <button
                                        onClick={() => setSearchOpen(false)}
                                        className="rounded-full p-2 hover:bg-white/10"
                                    >
                                        <X size={22} className="text-white" />
                                    </button>
                                </div>

                                <SearchBar
                                    value={query}
                                    onChange={setQuery}
                                    placeholder="Search dinosaurs..."
                                    className="w-full"
                                />
                            </div>
                        </div>
                    )}

                    {/* Hamburger Button */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button
                            onClick={() => {
                                setSearchOpen(true);
                                setMenuOpen(false);
                            }}
                            className="rounded-full p-2 transition hover:bg-white/10"
                        >
                            <Search size={24} />
                        </button>

                        <button
                            onClick={() => {
                                setSearchOpen(false);
                                setMenuOpen(true);
                            }}
                            className="rounded-full p-2 transition hover:bg-white/10"
                        >
                            <Menu size={28} />
                        </button>
                    </div>

                    {/* Mid-Section (Desktop) */}
                    <div className="hidden items-center gap-2 xl:gap-3 lg:flex">
                        <Link
                            to="/explorer"
                            className="rounded-full px-3 py-2 xl:px-4 transition hover:bg-white/20"
                        >
                            Explore
                        </Link>
                        <Link
                            to="/quiz"
                            className="rounded-full px-3 py-2 xl:px-4 transition hover:bg-white/20"
                        >
                            Quiz
                        </Link>
                        <Link
                            to="/create"
                            className="rounded-full px-3 py-2 xl:px-4 transition hover:bg-white/20"
                        >
                            Create Dino
                        </Link>
                    </div>

                    {/* Right-Section (Desktop) */}
                    <div className="hidden min-w-0 items-center gap-3 xl:gap-4 lg:flex">
                        <SearchBar
                            value={query}
                            onChange={setQuery}
                            placeholder="Search dinosaurs..."
                            className="w-60 xl:w-72"
                        />
                        <UserMenu />
                    </div>
                </nav>
            </div>

            {/* Full-Screen Mobile Menu Overlay */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-[#1E3326] bg-[url('/mobile-home-page.png')] bg-cover bg-center lg:hidden">
                    <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
                    <div className="relative z-10 flex h-full flex-col">
                        {/* Header */}
                        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5 sm:h-20 sm:px-6">
                            <div className="flex items-center gap-3">
                                <Link to="/" onClick={() => setMenuOpen(false)}>
                                    <img
                                        src={logo}
                                        alt="logo"
                                        className="h-10 w-auto object-contain"
                                    />
                                </Link>

                                <div>
                                    <h2 className="font-serif text-lg text-white">
                                        Jurassic Explorer
                                    </h2>

                                    <p className="text-xs text-gray-300">
                                        Explore Earth's Lost Giants
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setMenuOpen(false)}
                                className="rounded-full p-2 text-white transition hover:bg-white/10"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Navigation */}
                        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-8 text-xl font-semibold text-white sm:px-8">
                            <Link
                                to="/explorer"
                                onClick={() => setMenuOpen(false)}
                                className="group flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-5 py-4 transition hover:bg-white/10"
                            >
                                <div>
                                    <p className="font-semibold">🦖 Explore</p>
                                    <p className="mt-1 text-sm font-normal text-gray-400">
                                        Browse all dinosaurs
                                    </p>
                                </div>

                                <span className="text-2xl transition group-hover:translate-x-1">
                                    ›
                                </span>
                            </Link>

                            <Link
                                to="/quiz"
                                onClick={() => setMenuOpen(false)}
                                className="group flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-5 py-4 transition hover:bg-white/10"
                            >
                                <div>
                                    <p className="font-semibold">📝 Quiz</p>
                                    <p className="mt-1 text-sm font-normal text-gray-400">
                                        Test your knowledge
                                    </p>
                                </div>

                                <span className="text-2xl transition group-hover:translate-x-1">
                                    ›
                                </span>
                            </Link>

                            <Link
                                to="/create"
                                onClick={() => setMenuOpen(false)}
                                className="group flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-5 py-4 transition hover:bg-white/10"
                            >
                                <div>
                                    <p className="font-semibold">
                                        ➕ Create Dinosaur
                                    </p>
                                    <p className="mt-1 text-sm font-normal text-gray-400">
                                        Contribute a new species
                                    </p>
                                </div>

                                <span className="text-2xl transition group-hover:translate-x-1">
                                    ›
                                </span>
                            </Link>

                            <div className="my-5 border-t border-white/10" />

                            <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-black/30 to-black/10 p-5 backdrop-blur-md">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">
                                        Account
                                    </h3>

                                    <div className="h-px flex-1 bg-white/10 ml-4" />
                                </div>

                                <UserMenu
                                    mobile
                                    onClose={() => setMenuOpen(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
