import React from "react";
import { Ruler, Weight, Leaf, CalendarDays, Globe, Gauge } from "lucide-react";

const TRexPage = () => {
    // Stats array - Update values here to fix the repeating "12-15 m" in the original design
    const stats = [
        {
            icon: <Ruler size={32} strokeWidth={1.5} />,
            title: "LENGTH",
            value: "12-15 m",
        },
        {
            icon: <Weight size={32} strokeWidth={1.5} />,
            title: "WEIGHT",
            value: "8 Tons",
        },
        {
            icon: <Leaf size={32} strokeWidth={1.5} />,
            title: "DIET",
            value: "Carnivor",
        },
        {
            icon: <CalendarDays size={32} strokeWidth={1.5} />,
            title: "PERIOD",
            value: "Late Cretaceous",
        },
        {
            icon: <Globe size={32} strokeWidth={1.5} />,
            title: "HABITAT",
            value: "North America",
        },
        {
            icon: <Gauge size={32} strokeWidth={1.5} />,
            title: "SPEED",
            value: "28 Km/h",
        },
    ];

    return (
        <>

            <div className="relative min-h-screen bg-black flex flex-col justify-end font-sans overflow-hidden">
                {/* Background Image with Overlays */}
                <div className="absolute inset-0 z-0">
                    <img
                        // Replace this URL with your actual T-Rex image path
                        src="trex1.jpg"
                        alt="T-Rex Background"
                        className="w-full h-full object-cover opacity-70"
                    />
                    {/* Gradients to darken edges for text readability */}
                    <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-linear-to-r from-black/80 via-transparent to-transparent"></div>
                </div>

                {/* Main Content Area */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 grow flex flex-col justify-center mt-24">
                    <div className="max-w-2xl">
                        <h2 className="text-[#c6a87c] text-sm md:text-sm font-semibold tracking-[0.25em] uppercase mb-4">
                            The King of Dinosaurs
                        </h2>
                        <h1 className="text-5xl md:text-[5.5rem] font-bold text-white mb-2 leading-[1.1] tracking-tight">
                            TYRANNOSAURUS
                            <br />
                            <span className="text-[#c6a87c]">T-REX</span>
                        </h1>
                        <p className="text-gray-200 text-base md:text-lg mt-8 leading-relaxed max-w-xl pr-4">
                            The Tyrannosaurus rex, or T. rex, was a massive
                            carnivorous dinosaur from the late Cretaceous period.
                            Standing up to 12 meters long, it had powerful jaws with
                            60 sharp teeth, strong hind legs, and tiny arms. Known
                            as the "king of dinosaurs," it was a fierce apex
                            predator.
                        </p>
                    </div>
                </div>

                {/* Quick Facts Bottom Bar */}
                <div className="relative z-10 w-full bg-[#201f19]/95 border-t border-[#36342e] mt-12">
                    <div className="flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto">
                        {/* Quick Facts Header Block */}
                        <div className="flex items-center justify-center p-8 lg:w-56 lg:border-r border-[#36342e] shrink-0 border-b lg:border-b-0">
                            <h3 className="text-white text-xl font-bold leading-tight text-center lg:text-left tracking-wide">
                                QUICK <br className="hidden lg:block" />
                                FACTS
                            </h3>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 grow">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col items-center justify-center p-8 border-[#36342e] ${index !== stats.length - 1
                                        ? "lg:border-r"
                                        : ""
                                        } border-b md:border-b-0 md:border-r`}>
                                    <div className="text-[#c6a87c] mb-4">
                                        {stat.icon}
                                    </div>
                                    <span className="text-white text-sm font-bold tracking-wider mb-1">
                                        {stat.title}
                                    </span>
                                    <span className="text-gray-400 text-sm">
                                        {stat.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2  gap-12 items-center">
                        {/** Discription */}
                        <div>
                            <h2 class="text-2xl lg:text-4xl font-extrabold uppercase text-[#1B1B1B] mb-8">
                                About Tyrannosaurus Rex
                            </h2>
                            <p class="text-lg leading-9 text-gray-700 mb-8">
                                Tyrannosaurus Rex, often shortened to T. Rex, was a massive theropod dinosaur that lived approximately 68 to 66 million years ago.
                            </p>
                            <p class="text-lg leading-9 text-gray-700 mb-8">
                                Its massive skull, powerful jaws, and sharp teeth made it one of the most fearsome predators in history.
                            </p>
                            <p class="text-lg leading-9 text-gray-700">
                                Fossils have been discovered in locations across western North America, providing valuable insights into its life.
                            </p>
                        </div>
                        {/**Fossile record */}
                        <div>
                            <div class="relative overflow-hidden rounded-[30px] shadow-2xl">
                                <img src="/trex.jpg" alt="Tyrannosaurus Rex" class="h-130 w-full object-cover" />
                                <div
                                    class="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent">
                                </div>
                                <div
                                    class="absolute bottom-8 left-8 flex items-center gap-4">
                                    <div
                                        class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#C79A4A] bg-black/50 text-3xl text-[#C79A4A]">
                                        🦴
                                    </div>
                                    <div>
                                        <h3
                                            class="text-3xl font-bold uppercase tracking-wide text-white">
                                            Fossil Record
                                        </h3>
                                        <p class="text-sm text-gray-300">
                                            Discoveries across North America
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-[#c6a87c]" />

            <div class="bg-white py-20">
                <div class="max-w-7xl mx-auto px-6">

                    <h2 class="text-5xl font-bold uppercase tracking-wide text-[#222] mb-14">
                        Physical Features
                    </h2>
                    <div class="grid md:grid-cols-4 gap-10 border-y border-[#d8d3c4] py-12">
                        <div class="text-center">
                            <img src="/Trex-skull.jpg"
                                class="h-36 mx-auto object-contain" />

                            <h3 class="mt-6 text-2xl font-bold uppercase">
                                Massive Skull
                            </h3>
                            <p class="text-gray-600 mt-3 leading-7">
                                Up to 1.5 meters long skull built for crushing and tearing.
                            </p>
                        </div>
                        <div class="text-center">
                            <img src="/Trex-teeth.webp"
                                class="h-36 mx-auto object-contain" />
                            <h3 class="mt-6 text-2xl font-bold uppercase">
                                Sharp Teeth
                            </h3>
                            <p class="text-gray-600 mt-3 leading-7">
                                More than 60 serrated teeth capable of tearing flesh and bone.
                            </p>
                        </div>
                        <div class="text-center">
                            <img src="/Trex-legs.webp"
                                class="h-36 mx-auto object-contain" />
                            <h3 class="mt-6 text-2xl font-bold uppercase">
                                Powerful Legs
                            </h3>
                            <p class="text-gray-600 mt-3 leading-7">
                                Strong muscular legs built for speed and enormous strength.
                            </p>
                        </div>
                        <div class="text-center">
                            <img src="/Trex-arms.webp"
                                class="h-36 mx-auto object-contain" />
                            <h3 class="mt-6 text-2xl font-bold uppercase">
                                Tiny Arms
                            </h3>
                            <p class="text-gray-600 mt-3 leading-7">
                                Short but muscular arms with two powerful claws.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section class="px-14 py-12 grid grid-cols-1 md:grid-cols-2 border-t border-[#D8D2C5] bg-white">
                <div class="p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#D8D2C5]">
                    <h2 class="text-4xl font-bold uppercase tracking-wide text-[#2B241C]">
                        Cretaceous Timeline
                    </h2>
                    <div class="relative mt-12 flex items-center justify-between">
                        <div class="absolute left-12 right-12 top-6 h-[2px] bg-[#B8B2A7]"></div>
                        <div class="relative z-10 flex flex-col items-center">
                            <div
                                class="w-12 h-12 rounded-full border-2 border-gray-400 bg-[#F7F4EC] flex items-center justify-center">
                                ✈️
                            </div>
                            <h3 class="mt-4 font-semibold uppercase">Triassic</h3>
                            <p class="text-sm text-gray-600">252–201</p>
                            <p class="text-sm text-gray-600">Million years ago</p>
                        </div>
                        <div class="relative z-10 flex flex-col items-center">
                            <div
                                class="w-16 h-16 rounded-full border-2 border-[#B88A3B] bg-[#EED6A2] flex items-center justify-center shadow">🦖
                            </div>

                            <h3 class="mt-4 font-semibold uppercase">Cretaceous</h3>
                            <p class="text-sm text-gray-600">145–66</p>
                            <p class="text-sm text-gray-600">Million years ago</p>
                        </div>
                        <div class="relative z-10 flex flex-col items-center">
                            <div
                                class="w-12 h-12 rounded-full border-2 border-gray-400 bg-[#F7F4EC] flex items-center justify-center">🦕
                            </div>
                            <h3 class="mt-4 font-semibold uppercase">Jurassic</h3>
                            <p class="text-sm text-gray-600">201–145</p>
                            <p class="text-sm text-gray-600">Million years ago</p>
                        </div>
                    </div>
                    <p class="mt-10 italic text-gray-500 text-sm">
                        All information is based on fossil discoveries and scientific
                        research.
                    </p>
                </div>
                <div class="p-8 md:p-12">
                    <h2 class="text-4xl font-bold uppercase tracking-wide text-[#2B241C]">
                        Hunting Strategy
                    </h2>
                    <p class="mt-5 text-gray-700 leading-8">
                        Tyrannosaurus Rex dominated the Late Cretaceous as an apex predator.
                        It relied on powerful senses, immense bite force, and explosive
                        bursts of speed to ambush and overpower large herbivorous dinosaurs.
                    </p>
                    <div class="grid grid-cols-2 gap-6 mt-10">
                        <div class="flex gap-4">
                            <div
                                class="w-14 h-14 rounded-full bg-[#EED6A2] flex items-center justify-center text-2xl">
                                👁️
                            </div>
                            <div>
                                <h3 class="font-semibold uppercase text-[#2B241C]">
                                    Excellent Vision
                                </h3>
                                <p class="text-sm text-gray-600 mt-1">
                                    Forward-facing eyes provided depth perception for
                                    accurate attacks.
                                </p>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div
                                class="w-14 h-14 rounded-full bg-[#EED6A2] flex items-center justify-center text-2xl">
                                👃
                            </div>

                            <div>
                                <h3 class="font-semibold uppercase text-[#2B241C]">
                                    Keen Smell
                                </h3>

                                <p class="text-sm text-gray-600 mt-1">
                                    One of the strongest senses of smell among dinosaurs.
                                </p>
                            </div>
                        </div>

                        <div class="flex gap-4">
                            <div
                                class="w-14 h-14 rounded-full bg-[#EED6A2] flex items-center justify-center text-2xl">
                                🦷
                            </div>

                            <div>
                                <h3 class="font-semibold uppercase text-[#2B241C]">
                                    Powerful Bite
                                </h3>

                                <p class="text-sm text-gray-600 mt-1">
                                    Estimated bite force exceeded 35,000 newtons, capable
                                    of crushing bone.
                                </p>
                            </div>
                        </div>

                        <div class="flex gap-4">
                            <div
                                class="w-14 h-14 rounded-full bg-[#EED6A2] flex items-center justify-center text-2xl">
                                ⚡
                            </div>

                            <div>
                                <h3 class="font-semibold uppercase text-[#2B241C]">
                                    Ambush Hunter
                                </h3>

                                <p class="text-sm text-gray-600 mt-1">
                                    Used short bursts of speed to surprise prey rather than
                                    chasing over long distances.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="px-14 py-12 grid grid-cols-1 md:grid-cols-2 border-t border-[#D8D2C5] bg-white">
                <div class="p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#D8D2C5]">
                    <h2 class="text-4xl font-bold uppercase tracking-wide text-[#2B241C]">
                        Diet
                    </h2>
                    <p class="mt-6 text-lg leading-8 text-[#4B4B4B]">
                        <span class="font-semibold text-[#B88A3B]">Tyrannosaurus Rex</span>
                        was an apex carnivore that primarily hunted large herbivorous dinosaurs.
                        Its massive jaws, serrated teeth, and exceptional bite force enabled it
                        to crush bone and tear through flesh with ease.
                    </p>
                    <div class="mt-8">
                        <h3 class="text-xl font-semibold text-[#2B241C] mb-4">
                            Common Prey
                        </h3>
                        <ul class="space-y-3 text-gray-700">
                            <li class="flex items-center gap-3">
                                <span class="w-2 h-2 rounded-full bg-[#B88A3B]"></span>
                                Triceratops
                            </li>
                            <li class="flex items-center gap-3">
                                <span class="w-2 h-2 rounded-full bg-[#B88A3B]"></span>
                                Edmontosaurus
                            </li>
                            <li class="flex items-center gap-3">
                                <span class="w-2 h-2 rounded-full bg-[#B88A3B]"></span>
                                Ankylosaurus
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="p-8 md:p-12">
                    <div class="grid grid-cols-2 gap-6">
                        <div class="rounded-xl border border-[#D8D2C5] bg-[#F7F5EF] p-6">
                            <h4 class="text-[#B88A3B] text-sm uppercase tracking-widest">
                                Hunting Style
                            </h4>
                            <p class="mt-3 text-gray-700">
                                Ambush predator using powerful legs and keen senses.
                            </p>
                        </div>
                        <div class="rounded-xl border border-[#D8D2C5] bg-[#F7F5EF] p-6">
                            <h4 class="text-[#B88A3B] text-sm uppercase tracking-widest">
                                Diet Type
                            </h4>
                            <p class="mt-3 text-gray-700">
                                Strict Carnivore
                            </p>
                        </div>
                        <div class="rounded-xl border border-[#D8D2C5] bg-[#F7F5EF] p-6">
                            <h4 class="text-[#B88A3B] text-sm uppercase tracking-widest">
                                Bite Force
                            </h4>
                            <p class="mt-3 text-gray-700">
                                Among the strongest of any known land animal.
                            </p>
                        </div>
                        <div class="rounded-xl border border-[#D8D2C5] bg-[#F7F5EF] p-6">
                            <h4 class="text-[#B88A3B] text-sm uppercase tracking-widest">
                                Feeding Behavior
                            </h4>
                            <p class="mt-3 text-gray-700">
                                Consumed meat, bones, and soft tissue with powerful crushing jaws.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TRexPage;
