import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

function Signup() {
    const [name, setname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            toast.error("Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/users/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }

            toast.success("Account created successfully! Please log in.");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            console.error(error);
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

                <div className="bg-[#14221c]/60 rounded-4xl items-center pt-4 pb-16 flex flex-col">
                    <Link to="/">
                        <img
                            src="jurassic-explorer-logo.png"
                            alt="logo"
                            className="w-30"
                        />
                    </Link>
                    <h2 className="text-center mb-10 text-3xl font-bold text-[#c4c09a] leading-tight">
                        Create Account
                        <br />
                        Be an Adventurer
                    </h2>
                    <div className="flex justify-center gap-12 px-10">
                        {/* Left Side - Inputs */}
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={handleSignup}
                            id="signup-form"
                        >
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setname(e.target.value);
                                }}
                                placeholder="Username"
                                className="w-80 h-12 rounded-2xl bg-[#6b7368]/20 backdrop-blur-md font-bold border border-white/20 px-4 text-white placeholder:text-gray-300 outline-none focus:border-[#c4c09a] focus:ring-2 focus:ring-[#c4c09a]/40 transition"
                            />

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                placeholder="Email"
                                className="w-80 h-12 rounded-2xl bg-[#6b7368]/20 backdrop-blur-md font-bold border border-white/20 px-4 text-white placeholder:text-gray-300 outline-none focus:border-[#c4c09a] focus:ring-2 focus:ring-[#c4c09a]/40 transition"
                            />

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                placeholder="Password"
                                className="w-80 h-12 rounded-2xl bg-[#6b7368]/20 backdrop-blur-md font-bold border border-white/20 px-4 text-white placeholder:text-gray-300 outline-none focus:border-[#c4c09a] focus:ring-2 focus:ring-[#c4c09a]/40 transition"
                            />

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                }}
                                placeholder="Confirm Password"
                                className="w-80 h-12 rounded-2xl bg-[#6b7368]/20 backdrop-blur-md font-bold border border-white/20 px-4 text-white placeholder:text-gray-300 outline-none focus:border-[#c4c09a] focus:ring-2 focus:ring-[#c4c09a]/40 transition"
                            />
                        </form>

                        {/* Right Side - Buttons */}
                        <div className="flex flex-col justify-between">
                            <button
                                type="submit"
                                form="signup-form"
                                className="bg-[#6c9d43] font-bold text-[#ece098] text-xl rounded-2xl h-12 w-60"
                            >
                                SIGN UP
                            </button>

                            <div className="flex items-center w-60 my-4">
                                <div className="flex-1 h-px bg-gray-400"></div>

                                <span className="px-4 text-white font-bold">
                                    OR
                                </span>

                                <div className="flex-1 h-px bg-gray-400"></div>
                            </div>

                            <button className="bg-[#6b7368]/50 font-bold text-[#e4e4e4] text-lg rounded-2xl h-12 w-60">
                                Continue with Google
                            </button>

                            <Link
                                to="/login"
                                className="text-white font-bold text-center mt-4"
                            >
                                Already have an account?
                                <span className="text-[#a7cd1c]"> Login</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Signup;
