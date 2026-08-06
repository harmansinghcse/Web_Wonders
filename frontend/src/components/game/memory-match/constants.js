// Synthesized Web Audio API sound generator for card flips, matches, and victory
export const playSound = (type, enabled = true) => {
    if (!enabled) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === "flip") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === "match") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.09); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.18); // G5
            gain.gain.setValueAtTime(0.22, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
        } else if (type === "mismatch") {
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.setValueAtTime(175, now + 0.1);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === "win") {
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((freq, idx) => {
                const noteOsc = ctx.createOscillator();
                const noteGain = ctx.createGain();
                noteOsc.connect(noteGain);
                noteOsc.connect(ctx.destination);
                noteOsc.type = "triangle";
                noteOsc.frequency.setValueAtTime(freq, now + idx * 0.12);
                noteGain.gain.setValueAtTime(0.22, now + idx * 0.12);
                noteGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.3);
                noteOsc.start(now + idx * 0.12);
                noteOsc.stop(now + idx * 0.12 + 0.3);
            });
        }
    } catch (e) {
        // Fallback silently if web audio is restricted
    }
};

// Distinct Dinosaurs Deck (10 unique dinosaurs with real public picture assets + custom vector illustrations)
export const DINOSAURS_DATA = [
    {
        id: "velociraptor",
        name: "VELOCIRAPTOR",
        tagline: "Swift Hunter",
        era: "Late Cretaceous",
        fact: "Velociraptors possessed a 3-inch curved sickle claw used for precise hunting strikes!",
        image: "/trex1.jpg",
        badgeEmoji: "🦖",
        badgeLabel: "Swift Claw",
        accentColor: "from-amber-950 via-stone-900 to-amber-900",
        borderColor: "border-amber-500/80",
    },
    {
        id: "trex",
        name: "T-REX",
        tagline: "Apex Predator",
        era: "Late Cretaceous",
        fact: "T-Rex had a jaw bite force of 12,000 lbs—powerful enough to crush solid bone!",
        image: "/trex-dino.png",
        badgeEmoji: "👑",
        badgeLabel: "Apex King",
        accentColor: "from-red-950 via-stone-900 to-amber-950",
        borderColor: "border-red-500/80",
    },
    {
        id: "triceratops",
        name: "TRICERATOPS",
        tagline: "Shielded Giant",
        era: "Late Cretaceous",
        fact: "Triceratops possessed up to 800 teeth continuously replacing themselves as they ate!",
        image: "/trissiac-dino.png",
        badgeEmoji: "🛡️",
        badgeLabel: "3-Horn Shield",
        accentColor: "from-emerald-950 via-stone-900 to-emerald-900",
        borderColor: "border-emerald-500/80",
    },
    {
        id: "stegosaurus",
        name: "STEGOSAURUS",
        tagline: "Plated Defender",
        era: "Late Jurassic",
        fact: "Stegosaurus had large dorsal bony plates that helped regulate body temperature!",
        image: "/tyrastego_hybrid.jpg",
        badgeEmoji: "⚔️",
        badgeLabel: "Plated Tail",
        accentColor: "from-stone-900 via-amber-950 to-stone-900",
        borderColor: "border-amber-500/80",
    },
    {
        id: "brachiosaurus",
        name: "BRACHIOSAURUS",
        tagline: "Canopy Feeder",
        era: "Late Jurassic",
        fact: "Brachiosaurus stood over 40 feet tall, allowing it to reach tree leaves untouched by others!",
        image: "/jurassic-dino.png",
        badgeEmoji: "🦕",
        badgeLabel: "High Canopy",
        accentColor: "from-teal-950 via-stone-900 to-teal-900",
        borderColor: "border-teal-400/80",
    },
    {
        id: "spinosaurus",
        name: "SPINOSAURUS",
        tagline: "River Monster",
        era: "Cretaceous",
        fact: "Spinosaurus was the largest known carnivorous dinosaur—even longer than T-Rex!",
        image: "/spinosaurus_skull.jpg",
        badgeEmoji: "🐊",
        badgeLabel: "Sail Fin",
        accentColor: "from-purple-950 via-stone-900 to-slate-900",
        borderColor: "border-purple-500/80",
    },
    {
        id: "pterodactyl",
        name: "PTERODACTYL",
        tagline: "Sky Ruler",
        era: "Jurassic",
        fact: "Pterodactyls had hollow light bones and wings made of skin stretched over elongated fingers!",
        image: "/Trex-skull.jpg",
        badgeEmoji: "🦅",
        badgeLabel: "Sky Wing",
        accentColor: "from-sky-950 via-stone-900 to-slate-900",
        borderColor: "border-sky-400/80",
    },
    {
        id: "ankylosaurus",
        name: "ANKYLOSAURUS",
        tagline: "Living Tank",
        era: "Late Cretaceous",
        fact: "Ankylosaurus was covered in thick armored plates and possessed a heavy bone club tail!",
        image: "/triassic-dino.webp",
        badgeEmoji: "🧱",
        badgeLabel: "Armor Club",
        accentColor: "from-yellow-950 via-stone-900 to-stone-950",
        borderColor: "border-yellow-600/80",
    },
    {
        id: "ammonite",
        name: "AMMONITE",
        tagline: "Prehistoric Shell",
        era: "Mesozoic Era",
        fact: "Ammonites are extinct marine mollusks with distinctive spiral fossil shells!",
        image: "/Trex-teeth.webp",
        badgeEmoji: "🐚",
        badgeLabel: "Spiral Shell",
        accentColor: "from-cyan-950 via-stone-900 to-blue-950",
        borderColor: "border-cyan-400/80",
    },
    {
        id: "parasaurolophus",
        name: "PARASAUR",
        tagline: "Crested Vocalist",
        era: "Late Cretaceous",
        fact: "Parasaurolophus had a long hollow crest on its head used to resonate deep sound calls!",
        image: "/trex2.png",
        badgeEmoji: "🎺",
        badgeLabel: "Hollow Crest",
        accentColor: "from-orange-950 via-stone-900 to-stone-900",
        borderColor: "border-orange-500/80",
    },
];