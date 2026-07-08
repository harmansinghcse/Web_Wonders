import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (isLoading) return;

        setIsLoading(true);

        if (!email || !password) {
            toast.error("Please fill all fields.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/users/login`,
                {
                    method: "POST",
                    credentials: "include",
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

            if (!response.ok) {
                toast.error(data.message || "Login failed");
                return;
            }
            toast.success("Login successful! 🦕");

            await checkAuth();

            setTimeout(() => {
                navigate("/", { replace: true });
            }, 1000);
        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center min-h-screen flex items-center justify-center"
                style={{
                    backgroundImage: "url('/login-bg.jpg')",
                }}
            >
                {/* Rest of your page */}

                <div className="bg-[#14221c]/60 w-120 rounded-4xl items-center flex flex-col pt-4 pb-16">
                    <Link to="/">
                        <img
                            src="jurassic-explorer-logo.png"
                            alt="logo"
                            className="w-30"
                        />
                    </Link>
                    <h2 className="text-center mb-10 text-3xl font-bold text-[#c4c09a] leading-tight">
                        Login to begin your
                        <br />
                        Expedition!
                    </h2>
                    <form
                        onSubmit={handleLogin}
                        className="flex flex-col items-center gap-4"
                    >
                        <input
                            type="email"
                            disabled={isLoading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email or Username"
                            className="
                            w-80
                            h-12
                            rounded-2xl
                            bg-[#6b7368]/20
                            backdrop-blur-md
                            font-bold
                            border
                            border-white/20
                            disabled:opacity-50 
                            disabled:cursor-not-allowed
                            px-4
                            text-white
                            placeholder:text-gray-300
                            outline-none
                            focus:border-[#c4c09a]
                            focus:ring-2
                            focus:ring-[#c4c09a]/40
                            transition
                            "
                        />

                        <input
                            type="password"
                            disabled={isLoading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                            className="w-80
                            h-12
                            rounded-2xl
                            bg-[#6b7368]/20
                            backdrop-blur-md
                            font-bold
                            border
                            border-white/20 
                            disabled:opacity-50 
                            disabled:cursor-not-allowed
                            px-4
                            text-white
                            placeholder:text-gray-300
                            outline-none
                            focus:border-[#c4c09a]
                            focus:ring-2
                            focus:ring-[#c4c09a]/40
                            transition"
                        />

                        <div className="flex justify-between w-80">
                            <div>
                                <Link to="" className="font-bold text-white">
                                    Remember me
                                </Link>
                            </div>
                            <div>
                                <Link
                                    to=""
                                    className="font-bold text-[#83a215]"
                                >
                                    Forgot Password ?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#6c9d43] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-[#ece098] text-xl rounded-2xl h-12 w-80"
                        >
                            LOGIN
                        </button>

                        <div className="flex items-center w-80 my-4">
                            <div className="flex-1 h-px bg-gray-400"></div>

                            <span className="px-4 text-white font-bold text-2xl">
                                OR
                            </span>

                            <div className="flex-1 h-px bg-gray-400"></div>
                        </div>

                        <button
                            type="button"
                            className=" bg-[#6b7368]/50 font-bold text-[#e4e4e4] text-xl rounded-2xl h-12 w-80"
                        >
                            Continue with Google
                        </button>

                        <div>
                            <Link to="/signup" className="text-white font-bold">
                                Don't have an account ? Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
