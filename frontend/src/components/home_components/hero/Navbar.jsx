import logo from "../../../assets/jurrasic-logo.png";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, Search, X, Bell, ChevronDown, ChevronRight, Sparkles, BookOpen, Gamepad2, Globe } from "lucide-react";
import UserMenu from "../UserMenu";
import SearchBar from "../../search/SearchBar";
import { 
    Home, 
    Compass, 
    Clock3, 
    PlusSquare, 
    CircleHelp, 
    Brain, 
    Map, 
    Users, 
    Gamepad2, 
    GraduationCap, 
    Sparkles 
} from "lucide-react";
import NavbarLink from "./NavbarLinks";
import NavDropdown from "./NavDropdown";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const location = useLocation();

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

    const exploreDropdownItems = [
        {
            to: "/explorer",
            label: "Explore Dinosaurs",
            icon: Compass,
            desc: "Browse full prehistoric database",
        },
        {
            to: "/map",
            label: "Fossil Map",
            icon: Map,
            desc: "Locate dinosaur fossils globally",
        },
    ];

    const createDropdownItems = [
        {
            to: "/create",
            label: "Create Dinosaur",
            icon: PlusSquare,
            desc: "Design and submit your species",
        },
        {
            to: "/community",
            label: "Community Hybrids",
            icon: Users,
            desc: "View community creations & finds",
        },
    ];

    const learnDropdownItems = [
        {
            to: "/quiz",
            label: "Interactive Quiz",
            icon: CircleHelp,
        },
        {
            to: "/games",
            label: "Games",
            icon: Gamepad2,
        },
    ];

    const mobileLinks = [
        {
            to: "/games",
            icon: Gamepad2,
            label: "Games (Memory Match)",
            desc: "Flip cards and match dinosaur pairs",
            badge: "NEW",
        },
        {
            to: "/explorer",
            icon: Compass,
            label: "Dinosaur Encyclopedia",
            desc: "Browse all dinosaurs",
        },
        {
            to: "/map",
            icon: Map,
            label: "Map View",
            desc: "Locate dinosaur fossils on the world map",
        },
        {
            to: "/timeline",
            icon: Clock3,
            label: "Timeline View",
            desc: "Travel through prehistoric eras",
        },
        {
            to: "/create",
            icon: PlusSquare,
            label: "Create Your Dinosaur",
            desc: "Contribute a new species",
        },
<<<<<<< HEAD
=======
        {
            to: "/quiz",
            icon: CircleHelp,
            label: "Interactive Quiz & Games",
            desc: "Test your paleontology knowledge",
        },
        {
            to: "/community",
            icon: Users,
            label: "Community Page",
            desc: "Connect, share hybrids and fossil finds",
        },
>>>>>>> 327963855d7b81f258d458e499c15b428bead804
        {
            to: "/professor",
            icon: Brain,
            label: "Ask Professor Ross",
            desc: "Learn from the expert",
        }
    ];

    return (
        <>    
            {/*optimized navbar component structure*/}
            <div className={menuOpen ? "hidden lg:block" : "block"}>

                <header className="absolute top-4 left-1/2 z-50 w-full -translate-x-1/2 px-6">
                    <nav className="mx-auto flex h-18 w-[97%] max-w-420 items-center justify-between rounded-[28px] border border-[#e3d7c2] bg-[#ffffff]/95 px-4 xl:px-8 shadow-[0_12px_35px_rgba(0,0,0,0.08)] backdrop-blur-md transition-all duration-300">
                        <div className="flex items-center">
                            <Link to="/">
                                <img
                                    src={logo}
                                    alt="Jurassic Explorer"
                                    className="h-10 xl:h-12 w-auto object-contain transition duration-300 hover:scale-105"
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

                        {/* Mid-Section (Desktop Structured Dropdowns) */}
                        <div className="hidden items-center gap-1.5 xl:gap-2.5 lg:flex">
                            
                            {/* Home */}
                            <NavbarLink to="/" icon={Home}>
                                Home
                            </NavbarLink>

<<<<<<< HEAD
                            <NavDropdown
                                label="Explore"
                                icon={Compass}
                                items={exploreDropdownItems}
                            />

                            <NavDropdown
                                label="Create"
                                icon={PlusSquare}
                                items={createDropdownItems}
                            />

                            <NavDropdown
                                label="Learn"
                                icon={GraduationCap}
                                items={learnDropdownItems}
                            />
=======
                            {/* Explore Dropdown */}
                            <div className="relative group">
                                <button className={`flex items-center gap-1.5 rounded-full border border-transparent px-3 xl:px-4 py-1.5 xl:py-2 text-xs xl:text-sm font-medium transition-all duration-200 cursor-pointer ${
                                    location.pathname.startsWith('/explore') || location.pathname === '/map' || location.pathname === '/timeline'
                                        ? 'bg-[#E8F0E8] text-[#36593D] border-[#36593D]/20 shadow-[0_4px_12px_rgba(54,89,61,0.15)]'
                                        : 'text-[#4A4A4A] hover:bg-[#F8F5EF] hover:text-[#36593D] hover:border-[#36593D]/15'
                                }`}>
                                    <Compass size={16} />
                                    <span>Explore</span>
                                    <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180 opacity-70" />
                                </button>

                                {/* Dropdown Menu Panel */}
                                <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl border border-[#e3d7c2] bg-white p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50">
                                    
                                    {/* Dinosaur Encyclopedia */}
                                    <Link
                                        to="/explorer"
                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-700 hover:bg-[#E8F0E8] hover:text-[#36593D] transition-colors"
                                    >
                                        <Compass size={16} className="text-[#36593D]" />
                                        <span>Dinosaur Encyclopedia</span>
                                    </Link>

                                    {/* Explore Eras (Flyout Submenu) */}
                                    <div className="relative group/sub">
                                        <div className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-700 hover:bg-[#E8F0E8] hover:text-[#36593D] cursor-pointer transition-colors">
                                            <div className="flex items-center gap-2.5">
                                                <Globe size={16} className="text-[#36593D]" />
                                                <span>Explore Eras</span>
                                            </div>
                                            <ChevronRight size={14} className="text-stone-400 group-hover/sub:text-[#36593D] group-hover/sub:translate-x-0.5 transition-all" />
                                        </div>

                                        {/* Submenu Panel */}
                                        <div className="absolute top-0 left-full ml-1.5 w-52 rounded-2xl border border-[#e3d7c2] bg-white p-2 shadow-xl opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 z-50">
                                            <Link
                                                to="/map"
                                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-[#E8F0E8] hover:text-[#36593D] transition-colors"
                                            >
                                                <Map size={15} className="text-[#36593D]" />
                                                <span>Map View</span>
                                            </Link>
                                            <Link
                                                to="/timeline"
                                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-[#E8F0E8] hover:text-[#36593D] transition-colors"
                                            >
                                                <Clock3 size={15} className="text-[#36593D]" />
                                                <span>Timeline View</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Create Dropdown */}
                            <div className="relative group">
                                <button className={`flex items-center gap-1.5 rounded-full border border-transparent px-3 xl:px-4 py-1.5 xl:py-2 text-xs xl:text-sm font-medium transition-all duration-200 cursor-pointer ${
                                    location.pathname === '/create'
                                        ? 'bg-[#E8F0E8] text-[#36593D] border-[#36593D]/20 shadow-[0_4px_12px_rgba(54,89,61,0.15)]'
                                        : 'text-[#4A4A4A] hover:bg-[#F8F5EF] hover:text-[#36593D] hover:border-[#36593D]/15'
                                }`}>
                                    <Sparkles size={16} />
                                    <span>Create</span>
                                    <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180 opacity-70" />
                                </button>
>>>>>>> 327963855d7b81f258d458e499c15b428bead804

                                <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl border border-[#e3d7c2] bg-white p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50">
                                    <Link
                                        to="/create"
                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-700 hover:bg-[#E8F0E8] hover:text-[#36593D] transition-colors"
                                    >
                                        <PlusSquare size={16} className="text-[#36593D]" />
                                        <span>Create Your Dinosaur</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Learn Dropdown */}
                            <div className="relative group">
                                <button className={`flex items-center gap-1.5 rounded-full border border-transparent px-3 xl:px-4 py-1.5 xl:py-2 text-xs xl:text-sm font-medium transition-all duration-200 cursor-pointer ${
                                    location.pathname.startsWith('/quiz')
                                        ? 'bg-[#E8F0E8] text-[#36593D] border-[#36593D]/20 shadow-[0_4px_12px_rgba(54,89,61,0.15)]'
                                        : 'text-[#4A4A4A] hover:bg-[#F8F5EF] hover:text-[#36593D] hover:border-[#36593D]/15'
                                }`}>
                                    <BookOpen size={16} />
                                    <span>Learn</span>
                                    <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180 opacity-70" />
                                </button>

                                <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl border border-[#e3d7c2] bg-white p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50">
                                    <Link
                                        to="/quiz"
                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-[#E8F0E8] hover:text-[#36593D] transition-colors"
                                    >
                                        <CircleHelp size={16} className="text-[#36593D]" />
                                        <span>Interactive Quiz</span>
                                    </Link>
                                    <Link
                                        to="/quiz"
                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-[#E8F0E8] hover:text-[#36593D] transition-colors"
                                    >
                                        <Gamepad2 size={16} className="text-[#36593D]" />
                                        <span>Games</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Community */}
                            <NavbarLink to="/community" icon={Users}>
                                Community
                            </NavbarLink>

                            {/* Ask Professor Ross AI */}
                            <Link
                                to="/professor"
                                className="
                                    group flex items-center gap-1.5 xl:gap-2
                                    rounded-full
                                    px-3 xl:px-4 py-1.5 xl:py-2
                                    bg-gradient-to-r
                                    from-[#184D30]
                                    via-[#1F5C38]
                                    to-[#2F7D4D]
                                    bg-[length:200%_200%]
                                    text-white
                                    shadow-[0_0_18px_rgba(34,197,94,0.18)]
                                    transition-all duration-300
                                    hover:scale-105
                                    hover:shadow-[0_0_30px_rgba(34,197,94,0.35)]
                                    text-xs xl:text-sm
                                    whitespace-nowrap
                                    shrink-0
                                "
                            >
                                <span className="relative flex h-2 w-2 xl:h-2.5 xl:w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 xl:h-2.5 xl:w-2.5 rounded-full bg-green-200"></span>
                                </span>

                                <Brain size={16} className="xl:h-4.5 xl:w-4.5 transition-transform duration-300 group-hover:rotate-6" />

                                <span className="font-medium">
                                    Ask Prof. Ross
                                </span>

                                <span
                                    className="
                                        rounded-full
                                        bg-white/15
                                        border border-white/20
                                        px-1.5 xl:px-2 py-0.5
                                        text-[9px] xl:text-[10px]
                                        font-bold
                                        tracking-wider
                                    "
                                >
                                    AI
                                </span>
                            </Link>
                        </div>

                        {/*integrate dinosaur search functionality*/}
                        {/* Right-Section (Desktop) */}
                        <div className="hidden items-center gap-2 lg:flex">
                            {/* search field */}
                            <SearchBar
                                value={query}
                                onChange={setQuery}
                                placeholder="Search dinosaurs, fossils..."
                                className="w-44 xl:w-72 focus-within:w-60 transition-all duration-300"
                            />
                            {/* Bell icon */}
                            <button
                                className="relative rounded-full p-2 text-[#36593D] transition hover:bg-[#36593D]/10 shrink-0"
                                aria-label="Notifications"
                            >
                                <Bell size={18} />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#B5462F]" />
                            </button>

                            <div className="shrink-0">
                                <UserMenu />
                            </div>
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
                                ({ to, icon: Icon, label, desc, badge }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        onClick={() => setMenuOpen(false)}
                                        className={`group flex items-center gap-4 rounded-2xl px-5 py-4 transition
                                        ${
                                            label.includes("Games")
                                                ? "border border-[#52B788]/40 bg-[#1F5C38]/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                                                : label === "Ask Professor Ross"
                                                ? "border border-[#52B788]/30 bg-gradient-to-r from-[#1F5C38]/40 to-[#2F7D4D]/20 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                                                : "border border-white/5 bg-white/5 hover:border-[#36593D]/40 hover:bg-[#36593D]/15"
                                        }`}
                                    >
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition
                                            ${
                                                label.includes("Games") || label === "Ask Professor Ross"
                                                    ? "bg-[#36593D] text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                                                    : "bg-[#36593D]/20 text-[#8FBA97] group-hover:bg-[#36593D] group-hover:text-white"
                                            }`}
                                        >
                                            <Icon size={20} />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-lg font-semibold text-white">
                                                    {label}
                                                </p>

                                                {badge && (
                                                    <span className="rounded-full bg-[#52B788] px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-950 uppercase">
                                                        {badge}
                                                    </span>
                                                )}

                                                {label === "Ask Professor Ross" && (
                                                    <span className="rounded-full bg-green-400/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-green-300">
                                                        AI
                                                    </span>
                                                )}
                                            </div>

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
