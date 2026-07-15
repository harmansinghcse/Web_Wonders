import logo from "../../../assets/jurrasic-logo.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, Search, X, Bell } from "lucide-react";
import UserMenu from "../UserMenu";
import SearchBar from "../../search/SearchBar";
import { Home, Compass, Clock3, PlusSquare, CircleHelp, GraduationCap} from "lucide-react";
import NavbarLink from "./NavbarLinks";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");

    // implement mobile menu with overlay
    useEffect(() => {
        if (menuOpen || searchOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen, searchOpen]);

    const mobileLinks = [
        {
            to: "/explorer",
            icon: Compass,
            label: "Explore",
            desc: "Browse all dinosaurs",
        },
        {
            to: "/timeline",
            icon: Clock3,
            label: "Timeline",
            desc: "Travel through prehistoric eras",
        },
        {
            to: "/quiz",
            icon: CircleHelp,
            label: "Quiz",
            desc: "Test your knowledge",
        },
        {
            to: "/create",
            icon: PlusSquare,
            label: "Create Dinosaur",
            desc: "Contribute a new species",
        },

        {
            to: "/professor",
            icon: GraduationCap,
            label: "Meet Professor Ross",
            desc: "Learn from the expert",
        }
    ];

    return (
        <>    
            {/*optimized navbar component structure*/}
            <div className={menuOpen ? "hidden lg:block" : "block"}>

                <header className="absolute top-4 left-1/2 z-50 w-full -translate-x-1/2 px-6">
                    <nav className="mx-auto flex h-18 w-[97%] max-w-400 items-center justify-between rounded-[28px] border border-[#e3d7c2] bg-[#ffffff]/95 px-8 shadow-[0_12px_35px_rgba(0,0,0,0.08)] backdrop-blur-md transition-all duration-300">
                        <div className="flex items-center">
                            <Link to="/">
                                <img
                                    src={logo}
                                    alt="Jurassic Explorer"
                                    className="h-12 w-auto object-contain transition duration-300 hover:scale-105"
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
                                            <X
                                                size={22}
                                                className="text-white"
                                            />
                                        </button>
                                    </div>

                                    <SearchBar
                                        value={query}
                                        onChange={setQuery}
                                        placeholder="Search dinosaurs, fossils..."
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
                                className="rounded-full p-2 transition hover:bg-[#36593D]/10"
                            >
                                <Search size={24} className="text-[#36593D]" />
                            </button>

                            <button
                                onClick={() => {
                                    setSearchOpen(false);
                                    setMenuOpen(true);
                                }}
                                className="rounded-full p-2 transition hover:bg-[#36593D]/10"
                            >
                                <Menu size={28} className="text-[#36593D]" />
                            </button>
                        </div>

                        {/* Mid-Section (Desktop) */}
                        <div className="hidden items-center gap-2 xl:gap-3 lg:flex">
                            <NavbarLink to="/" icon={Home}>
                                Home
                            </NavbarLink>

                            <NavbarLink to="/explorer" icon={Compass}>
                                Explore
                            </NavbarLink>

                            <NavbarLink to="/timeline" icon={Clock3}>
                                Timeline
                            </NavbarLink>

                            <NavbarLink to="/create" icon={PlusSquare}>
                                Create
                            </NavbarLink>

                            <NavbarLink to="/quiz" icon={CircleHelp}>
                                Quiz
                            </NavbarLink>

                            <NavbarLink to="/professor" icon={GraduationCap}>
                                Meet Professor Ross
                            </NavbarLink>
                        </div>

                        {/*integrate dinosaur search functionality*/}
                        {/* Right-Section (Desktop) */}
                        <div className="hidden items-center gap-3 lg:flex">
                            {/* search field */}
                            <SearchBar
                                value={query}
                                onChange={setQuery}
                                placeholder="Search dinosaurs, fossils..."
                                className="w-64 xl:w-72"
                            />
                            {/* Bell icon */}
                            <button
                                className="relative rounded-full p-2.5 text-[#36593D] transition hover:bg-[#36593D]/10"
                                aria-label="Notifications"
                            >
                                <Bell size={20} />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#B5462F]" />
                            </button>

                            <UserMenu />
                        </div>
                    </nav>
                </header>
            </div>

            {/* FullScreen Mobile Menu Overlay */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-[#0E1A11] lg:hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1E3326_0%,transparent_60%)]" />
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

                                    <p className="text-xs text-[#B7C4B9]">
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
                        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-8 sm:px-8">
                            {mobileLinks.map(
                                ({ to, icon: Icon, label, desc }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        onClick={() => setMenuOpen(false)}
                                        className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 px-5 py-4 transition hover:border-[#36593D]/40 hover:bg-[#36593D]/15"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#36593D]/20 text-[#8FBA97] transition group-hover:bg-[#36593D] group-hover:text-white">
                                            <Icon size={20} />
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-lg font-semibold text-white">
                                                {label}
                                            </p>
                                            <p className="mt-0.5 text-sm font-normal text-[#B7C4B9]">
                                                {desc}
                                            </p>
                                        </div>

                                        <span className="text-xl text-[#8FBA97] transition group-hover:translate-x-1">
                                            ›
                                        </span>
                                    </Link>
                                ),
                            )}

                            <div className="my-4 border-t border-white/10" />
                            {/* Login / logout */}
                            <div className="rounded-3xl border border-white/10 bg-linear-to-br from-[#36593D]/20 to-black/20 p-5 backdrop-blur-md">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">
                                        Account
                                    </h3>

                                    <div className="ml-4 h-px flex-1 bg-white/10" />
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
