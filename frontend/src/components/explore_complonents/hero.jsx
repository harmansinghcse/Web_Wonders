function hero() {
    return (
        <section 
            className="relative h-screen bg-cover bg-center" 
            style={{ backgroundImage: "url('frontend\public\explore bg 1.jpeg')" }}>
                <div className="absolute inset-0 bg-black/20"></div>

                <div className="relative z-10 flex h-full flex-col items-center justify-center">
                    <h1 className="text-center text-6xl font-bold text-white">
                        EXPLORE THE PREHISTORIC WORLD
                    </h1>

                    <p className="mt-4 text-xl text-white">
                        Search, discover and learn about dinosaurs
                    </p>

                </div>
        </section>
    );
}

export default hero;