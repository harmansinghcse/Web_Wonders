import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_BACKEND_URL;

// make the signup animations better later

function Signup() {
    const [name, setname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [otp, setOtp] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerifyOtp = async (e) => {
        if (isVerifying) return;
        e.preventDefault();

        if (!otp) {
            toast.error("Please enter the OTP.");
            return;
        }

        try {
            setIsVerifying(true);
            const response = await fetch(`${API_URL}/api/users/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otp,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }

            toast.success("Account verified successfully!");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSignup = async (e) => {
        if (isSigningUp) return;
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
            setIsSigningUp(true);
            const response = await fetch(`${API_URL}/api/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }

            toast.success("OTP sent to your email.");
            setShowOtpForm(true);
        } catch (error) {
            console.error(error);
            toast.error("Unable to connect to the server.");
        } finally {
            setIsSigningUp(false);
        }
    };

    return (
        <>
            <div
                className="flex min-h-screen justify-center overflow-y-auto bg-cover bg-center bg-no-repeat px-4 py-10"
                style={{
                    backgroundImage: "url('/login-bg.jpg')",
                }}
            >
                <div className="my-6 flex w-full max-w-xl flex-col items-center rounded-4xl bg-[#14221c]/60 pt-4 pb-8 lg:my-10 lg:max-w-2xl lg:pb-12">
                    <Link to="/">
                        <img
                            src="jurassic-explorer-logo.png"
                            alt="logo"
                            className="w-24 sm:w-28 lg:w-32"
                        />
                    </Link>
                    <h2 className="mb-8 text-center text-2xl leading-tight font-bold text-[#c4c09a] sm:text-3xl lg:text-4xl">
                        Create Account
                        <br />
                        Be an Adventurer
                    </h2>
                    <div className="flex w-full flex-col items-center justify-center gap-10 px-6 lg:flex-row lg:gap-16 lg:px-10">
                        {/* Left Side - Inputs */}
                        {!showOtpForm ? (
                            <form
                                className="flex w-full flex-col gap-4 lg:w-1/2"
                                onSubmit={handleSignup}
                                id="signup-form"
                            >
                                {/* Username */}
                                <input
                                    disabled={isSigningUp}
                                    type="text"
                                    value={name}
                                    onChange={(e) => setname(e.target.value)}
                                    placeholder="Username"
                                    className="h-12 w-full rounded-2xl border border-white/20 bg-[#6b7368]/20 px-4 font-bold text-white backdrop-blur-md outline-none"
                                />

                                {/* Email */}
                                <input
                                    disabled={isSigningUp}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    className="h-12 w-full rounded-2xl border border-white/20 bg-[#6b7368]/20 px-4 font-bold text-white backdrop-blur-md outline-none"
                                />

                                {/* Password */}
                                <input
                                    disabled={isSigningUp}
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Password"
                                    className="h-12 w-full rounded-2xl border border-white/20 bg-[#6b7368]/20 px-4 font-bold text-white backdrop-blur-md outline-none"
                                />

                                {/* Confirm Password */}
                                <input
                                    disabled={isSigningUp}
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="Confirm Password"
                                    className="h-12 w-full rounded-2xl border border-white/20 bg-[#6b7368]/20 px-4 font-bold text-white backdrop-blur-md outline-none"
                                />
                            </form>
                        ) : (
                            <form
                                className="flex w-full flex-col gap-4 lg:w-1/2"
                                id="otp-form"
                                onSubmit={handleVerifyOtp}
                            >
                                <h3 className="text-center text-2xl font-bold text-[#c4c09a]">
                                    Verify OTP
                                </h3>

                                <p className="text-center text-sm text-gray-300">
                                    Enter the OTP sent to
                                    <br />
                                    <span className="font-bold">{email}</span>
                                </p>

                                <input
                                    disabled={isVerifying}
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP"
                                    className="h-12 w-full rounded-2xl border border-white/20 bg-[#6b7368]/20 px-4 text-center text-xl tracking-[10px] font-bold text-white backdrop-blur-md outline-none"
                                />
                            </form>
                        )}

                        {/* Right Side - Buttons */}
                        <div className="flex w-full flex-col items-center justify-center gap-6 lg:w-1/2">
                            <button
                                type="submit"
                                disabled={isSigningUp || isVerifying}
                                form={showOtpForm ? "otp-form" : "signup-form"}
                                className="h-12 w-full rounded-2xl bg-[#6c9d43] transition-all
                                duration-300 disabled:cursor-not-allowed
                                disabled:opacity-60 text-xl font-bold text-[#ece098] lg:w-60 "
                            >
                                {showOtpForm
                                    ? isVerifying
                                        ? "VERIFYING..."
                                        : "VERIFY OTP"
                                    : isSigningUp
                                      ? "CREATING ACCOUNT..."
                                      : "SIGN UP"}
                            </button>

                            <div className="my-4 flex w-full max-w-xs items-center">
                                <div className="h-px flex-1 bg-gray-400"></div>

                                <span className="px-4 font-bold text-white">
                                    OR
                                </span>

                                <div className="h-px flex-1 bg-gray-400"></div>
                            </div>

                            <button
                                disabled={isSigningUp || isVerifying}
                                className="h-12 w-full rounded-2xl bg-[#6b7368]/50 disabled:opacity-60 disabled:cursor-not-allowed text-lg font-bold text-[#e4e4e4] lg:w-60"
                            >
                                Continue with Google
                            </button>

                            <Link
                                to="/login"
                                className="mt-2 text-center text-sm font-bold text-white lg:text-base"
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
