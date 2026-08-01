import { useLocation } from "react-router-dom";
import { GameHub, MemoryMatchGame, FossilHunterGame, DinoPuzzleTilesGame } from "../components/game";

export default function Games() {
    const location = useLocation();
    const path = location.pathname;

    if (path.includes("memory-match") || path.includes("jurassic-memory-match")) {
        return <MemoryMatchGame />;
    }

    if (path.includes("fossil-hunter")) {
        return <FossilHunterGame />;
    }

    if (path.includes("dino-puzzle-tiles") || path.includes("puzzle")) {
        return <DinoPuzzleTilesGame />;
    }

    return <GameHub />;
}
