import { useState } from "react";

import hero from "../components/explore_complonents/hero";
import dinosaurList from "../components/explore_complonents/dinosaurList";


function Explore() { 
    const [search, setSearch] = useState("");
    const [diet, setDiet] = useState("");
    const [period, setPeriod] = useState("");   
    return ( 
    <>
        <hero
            search={search}
            setSearch={setSearch}
            diet={diet}
            setDiet={setDiet}
            period={period}
            setPeriod={setPeriod}
        />
        <dinosaurList
            search={search}
            diet={diet}
            period={period}
        />
    </>
        
    ); 
}

export default Explore;