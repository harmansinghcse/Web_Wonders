import logo from "../../../assets/jurrasic-logo.webp";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
    Menu, 
    Search, 
    X, 
    ChevronDown, 
    ChevronRight, 
    Sparkles, 
    BookOpen, 
    Gamepad2, 
    Globe,
    Home, 
    Compass, 
    Clock3, 
    PlusSquare, 
    CircleHelp, 
    Brain, 
    Map, 
    Users,
    MessageSquare,
    Bell
} from "lucide-react";
import UserMenu from "../UserMenu";
import SearchBar from "../../search/SearchBar";
import NavbarLink from "./NavbarLinks";
import { useProfessor } from "../../../context/ProfessorContext";
import { getUnreadCountsService } from "../../../services/communityService";
import NotificationsModal from "../../community/NotificationsModal";


function Navbar() {
    const { toggleChat, openChat, unreadCount } = useProfessor();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const location = useLocation();
    const [unreadCounts, setUnreadCounts] = useState({ unreadNotifications: 0, unreadMessages: 0, totalCount: 0 });
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await getUnreadCountsService();
                if (res.success) {
                    setUnreadCounts({
                        unreadNotifications: res.unreadNotifications,
                        unreadMessages: res.unreadMessages,
                        totalCount: res.totalCount
                    });
                }
            } catch (err) {
                // Ignore guest errors
            }
        };
        fetchCounts();
        const interval = setInterval(fetchCounts, 5000);
        return () => clearInterval(interval);
    }, [location.pathname]);


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
            to: "/games",
            icon: Gamepad2,
            label: "Games (Memory Match)",
            desc: "Flip cards and match dinosaur pairs",
        },
        {
            to: "/quiz",
            icon: CircleHelp,
            label: "Interactive Quiz",
            desc: "Test your paleontology knowledge",
        },
        {
            to: "/explorer",
            icon: Compass,
            label: "Explore Dinosaurs",
            desc: "Browse all dinosaurs",
        },
        {
            to: "/map",
            icon: Map,
            label: "Explore Map",
            desc: "Locate dinosaur fossils on the world map",
        },
        {
            to: "/timeline",
            icon: Clock3,
            label: "Timeline",
            desc: "Travel through prehistoric eras",
        },
        {
            to: "/create",
            icon: PlusSquare,
            label: "Create Dinosaur",
            desc: "Contribute a new species",
        },
        {
            to: "/community",
            icon: Users,
            label: "Community",
            desc: "Connect, share hybrids and fossil finds",
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
                                    width={180}
                                    height={56}
                                    className="h-12 xl:h-14 w-auto object-contain transition duration-300 hover:scale-105"
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

                        {/* Hamburger & Small AI Button (Mobile) */}
                        <div className="flex items-center gap-2 lg:hidden">
                            {/* Mobile Small AI Button */}
                            <button
                                onClick={toggleChat}
                                title="Ask Professor Ross AI"
                                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#173822] via-[#234E31] to-[#2D5B3A] px-3 py-1.5 text-xs font-semibold text-[#E2F1E5] border border-[#52B788]/45 shadow-[0_4px_14px_rgba(23,56,34,0.3),0_0_12px_rgba(245,158,11,0.18)] active:scale-95 cursor-pointer"
                            >
                                <Brain size={15} className="text-amber-200 animate-pulse" />
                                <span>Ross</span>
                                <span className="text-[8px] font-black uppercase text-amber-200 bg-amber-500/15 px-1 py-0.2 rounded border border-amber-300/30">
                                    AI
                                </span>
                                {unreadCount > 0 && (
                                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-[8px] font-black text-stone-950">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => setIsNotificationsOpen(true)}
                                className="relative rounded-full p-2 transition hover:bg-[#36593D]/10 cursor-pointer text-[#36593D]"
                            >
                                <Bell size={22} />
                                {unreadCounts.unreadNotifications > 0 && (
                                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                                        {unreadCounts.unreadNotifications}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => {
                                    setSearchOpen(true);
                                    setMenuOpen(false);
                                }}
                                className="rounded-full p-2 transition hover:bg-[#36593D]/10 cursor-pointer"
                            >
                                <Search size={22} className="text-[#36593D]" />
                            </button>

                            <button
                                onClick={() => {
                                    setSearchOpen(false);
                                    setMenuOpen(true);
                                }}
                                className="rounded-full p-2 transition hover:bg-[#36593D]/10 cursor-pointer"
                            >
                                <Menu size={26} className="text-[#36593D]" />
                            </button>
                        </div>

                        {/* Mid-Section (Desktop Navbar matching Screenshot) */}
                        <div className="hidden items-center gap-0.5 xl:gap-1 lg:flex">
                            
                            {/* Home Link */}
                            <NavbarLink to="/" icon={Home}>
                                Home
                            </NavbarLink>

                            {/* Explore Dropdown */}
<div className="relative group">
    <button
        className={`flex items-center gap-1 rounded-full border border-transparent px-2 xl:px-3 py-1.5 text-xs font-medium transition-all duration-300 ease-out cursor-pointer ${
            location.pathname === "/explorer" ||
            location.pathname === "/create" ||
            location.pathname === "/map" ||
            location.pathname === "/timeline"
                ? "bg-[#D2E6D2] text-[#234229] border-[#36593D]/40 shadow-[0_4px_20px_rgba(37,74,42,0.35),0_0_12px_rgba(54,89,61,0.3)] font-semibold"
                : "text-[#4A4A4A] hover:bg-[#EAF3EA] hover:text-[#36593D] hover:border-[#36593D]/25 hover:shadow-[0_0_15px_rgba(54,89,61,0.18)] hover:-translate-y-[1px]"
        }`}
    >
        <Compass size={15} />
        <span>Explore</span>
        <ChevronDown
            size={13}
            className="transition-transform duration-200 group-hover:rotate-180 opacity-70"
        />
    </button>

    {/* Dropdown */}
    <div
        className="
            absolute top-full left-0 pt-2 w-60 z-50
            opacity-0 invisible pointer-events-none translate-y-2
            group-hover:opacity-100 group-hover:visible
            group-hover:pointer-events-auto group-hover:translate-y-0
            transition-all duration-200
        "
    >
        <div className="rounded-2xl border border-[#e3d7c2] bg-white p-2 shadow-xl">

            {/* Explore */}
            <Link
                to="/explorer"
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                    location.pathname === "/explorer"
                        ? "bg-[#D2E6D2] text-[#234229]"
                        : "text-stone-700 hover:bg-[#E8F0E8] hover:text-[#36593D]"
                }`}
            >
                <Compass size={16} className="text-[#36593D]" />
                <span>Explore Dinosaurs</span>
            </Link>

            {/* Create */}
            <Link
                to="/create"
                className={`mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                    location.pathname === "/create"
                        ? "bg-[#D2E6D2] text-[#234229]"
                        : "text-stone-700 hover:bg-[#E8F0E8] hover:text-[#36593D]"
                }`}
            >
                <PlusSquare size={16} className="text-[#36593D]" />
                <span>Create Dinosaur</span>
            </Link>

            {/* Map */}
            <Link
                to="/map"
                className={`mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                    location.pathname === "/map"
                        ? "bg-[#D2E6D2] text-[#234229]"
                        : "text-stone-700 hover:bg-[#E8F0E8] hover:text-[#36593D]"
                }`}
            >
                <Map size={16} className="text-[#36593D]" />
                <span>Fossil Map</span>
            </Link>

            {/* Timeline */}
            <Link
                to="/timeline"
                className={`mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                    location.pathname === "/timeline"
                        ? "bg-[#D2E6D2] text-[#234229]"
                        : "text-stone-700 hover:bg-[#E8F0E8] hover:text-[#36593D]"
                }`}
            >
                <Clock3 size={16} className="text-[#36593D]" />
                <span>Timeline View</span>
            </Link>

        </div>
    </div>
</div>

                            {/* Learn Dropdown (Matching Screenshot Exactly) */}
                            <div className="relative group">
                                <button className={`flex items-center gap-1 rounded-full border border-transparent px-2 xl:px-3 py-1.5 text-xs font-medium transition-all duration-300 ease-out cursor-pointer ${
                                    location.pathname === '/quiz' || location.pathname.startsWith('/games')
                                        ? 'bg-[#D2E6D2] text-[#234229] border-[#36593D]/40 shadow-[0_4px_20px_rgba(37,74,42,0.35),0_0_12px_rgba(54,89,61,0.3)] font-semibold'
                                        : 'text-[#4A4A4A] hover:bg-[#EAF3EA] hover:text-[#36593D] hover:border-[#36593D]/25 hover:shadow-[0_0_15px_rgba(54,89,61,0.18)] hover:-translate-y-[1px]'
                                }`}>
                                    <BookOpen size={15} />
                                    <span>Play & Learn</span>
                                    <ChevronDown size={13} className="transition-transform duration-200 group-hover:rotate-180 opacity-70" />
                                </button>

                                {/* Dropdown Menu Panel with Exactly 2 Options: Interactive Quiz & Games */}
                                <div className="absolute top-full left-0 mt-2 w-52 rounded-2xl border border-[#e3d7c2] bg-white p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50">
                                    
                                    {/* Option 1: Interactive Quiz */}
                                    <Link
                                        to="/quiz"
                                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm transition-colors ${
                                            location.pathname === '/quiz'
                                                ? 'bg-[#D2E6D2] text-[#234229] font-semibold'
                                                : 'text-stone-700 hover:bg-[#F4F8F4] hover:text-[#36593D]'
                                        }`}
                                    >
                                        <CircleHelp size={18} className="text-[#36593D] shrink-0" />
                                        <span>Interactive Quiz</span>
                                    </Link>

                                    {/* Option 2: Games (Opens Jurassic Memory Match page) */}
                                    <Link
                                        to="/games"
                                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm transition-colors ${
                                            location.pathname.startsWith('/games')
                                                ? 'bg-[#D2E6D2] text-[#234229] font-semibold'
                                                : 'text-stone-700 hover:bg-[#F4F8F4] hover:text-[#36593D]'
                                        }`}
                                    >
                                        <Gamepad2 size={18} className="text-[#36593D] shrink-0" />
                                        <span>Game Hub</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Community */}
                            <NavbarLink to="/community" icon={Users}>
                                Community
                            </NavbarLink>
                        </div>

                        {/* Right-Section (Desktop) */}
                        <div className="hidden items-center gap-2 xl:gap-3 lg:flex">
                            {/* Ask Prof. Ross AI Button */}
                            <button
                                onClick={toggleChat}
                                title="Ask Professor Ross AI"
                                className="group relative flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#173822] via-[#234E31] to-[#2D5B3A] px-3 py-1.5 xl:px-3.5 xl:py-2 text-xs xl:text-sm font-semibold text-[#E2F1E5] border border-[#52B788]/60 shadow-[0_0_15px_rgba(82,183,136,0.35),0_4px_16px_rgba(23,56,34,0.35)] hover:scale-105 hover:-translate-y-0.5 hover:border-amber-300/80 hover:shadow-[0_0_24px_rgba(245,158,11,0.35),0_6px_24px_rgba(23,56,34,0.45)] hover:from-[#1F482B] hover:to-[#356743] transition-all duration-300 cursor-pointer active:scale-95 shrink-0"
                            >
                                <Brain size={16} className="text-amber-200 group-hover:rotate-12 transition-transform duration-300 shrink-0" />
                                <span className="whitespace-nowrap font-medium">Ross</span>
                                <span className="text-[9px] font-black uppercase tracking-wider text-amber-200 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-300/30 select-none">
                                    AI
                                </span>
                                {unreadCount > 0 && (
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-stone-950 animate-bounce shadow-xs">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* search field */}
                            <SearchBar
                                value={query}
                                onChange={setQuery}
                                placeholder="Search dinosaurs, fossils..."
                                className="w-44 xl:w-72 focus-within:w-60 transition-all duration-300"
                            />

                             {/* Notification Bell */}
                             <button
                                 onClick={() => setIsNotificationsOpen(true)}
                                 className="relative p-2 text-[#4A4A4A] hover:bg-[#EAF3EA] hover:text-[#36593D] rounded-full transition-all duration-300 cursor-pointer shrink-0"
                                 title="Notifications"
                             >
                                 <Bell size={18} />
                                 {unreadCounts.unreadNotifications > 0 && (
                                     <span className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-xs">
                                         {unreadCounts.unreadNotifications}
                                     </span>
                                 )}
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
                                ({ to, icon: Icon, label, desc }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        onClick={() => {
                                            setMenuOpen(false);
                                            if (to === "/professor") {
                                                openChat();
                                            }
                                        }}
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
            {isNotificationsOpen && (
                <NotificationsModal
                    onClose={() => setIsNotificationsOpen(false)}
                />
            )}
        </>
    );
}


export default Navbar;
