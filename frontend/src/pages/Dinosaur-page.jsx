import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/home_components/hero/navbar";
import DinoIntro from "../components/info-components/dinoIntro";
import Fossil from "../components/info-components/fossil";
import PhysicalFeatures from "../components/info-components/physicalFeatures";
import TimelineStrat from "../components/info-components/TimlineStrat";
import DietFact from "../components/info-components/DietFact";
import QuickFacts from "../components/info-components/QuickFacts";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const DinoPage = () => {
    const [dinosaur, setDinosaur] = useState(null);
    const [loading, setLoading] = useState(true);
    const { slug } = useParams();

    useEffect(() => {
        const fetchDinosaur = async () => {
            try {
                const res = await fetch(`${API_URL}/api/dinosaur/${slug}`);
                const data = await res.json();
                setDinosaur(data.data);
                console.log(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDinosaur();
    }, [slug]);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <Navbar />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-black font-sans pt-36">
                    {/* Background Image with Overlays */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={dinosaur.images.heroBackground}
                            alt={dinosaur.name}
                            className="h-full w-full object-cover opacity-70"
                        />
                        {/* Gradients to darken edges for text readability */}
                        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-transparent to-transparent"></div>
                    </div>

                    {/* Main Content Area */}
                    <DinoIntro hero={dinosaur.hero} />
                    <QuickFacts stats={dinosaur.stats} />
                </div>

                {/* fossil section */}
                <Fossil about={dinosaur.about} fossil={dinosaur.fossil} />

                <hr className="border-[#c6a87c]" />

                {/* physical feature */}
                <PhysicalFeatures
                    physicalFeatures={dinosaur.physicalFeatures}
                />

                {/*Time line and hunting startegy  */}
                <TimelineStrat
                    timeline={dinosaur.timeline}
                    hunting={dinosaur.hunting}
                />

                {/* Diet and Facts */}
                <DietFact diet={dinosaur.diet} />
            </motion.div>
        </>
    );
};

export default DinoPage;
