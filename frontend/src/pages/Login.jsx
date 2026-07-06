import { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                },
            );

            const data = await response.json();

            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            className="fixed inset-0 -z-10 bg-cover bg-center min-h-screen flex items-center justify-center"
            style={{
                backgroundImage: "url('/jurrasic-home-bg.jpeg')",
            }}
        >
            <div className="max-w-5xl w-full rounded-2xl bg-transparent backdrop-blur-md p-8 flex">
                <div className="bg-amber-300 w-2/5 p-10">
                    <h1 className="font-bold text-center text-3xl">
                        ARE YOU NEW?
                    </h1>
                    <p className="text-center font-bold">JOIN THE ADVENTURE</p>
                </div>

                {/* login part */}
                <div className="bg-[#2E4A37] w-3/5 p-10">
                    <h1 className="font-bold text-center text-3xl">LOGIN</h1>
                    <p className="text-center mt-2 text-white font-medium py-2">
                        sign in to continue your adventure
                    </p>
                    <form
                        onSubmit={handleLogin}
                        className="flex flex-col items-center gap-4"
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="bg-white
                            rounded-full
                            py-2
                            px-2
                            w-80
                            h-12"
                        />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                            className="bg-white
                            rounded-full
                            py-2
                            px-2
                            w-80
                            h-12"
                        />

                        <button
                            type="submit"
                            className="bg-black font-bold text-white rounded-full h-12 w-30"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
