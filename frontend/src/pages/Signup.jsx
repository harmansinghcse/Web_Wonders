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
      const response = await fetch("http://localhost:5000/api/users/register", {
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
        className="flex min-h-screen justify-center overflow-y-auto bg-cover bg-center bg-no-repeat px-4 py-10"
        style={{
          backgroundImage: "url('/login-bg.jpg')",
        }}
      >
        <div className="my-6 flex w-full max-w-xl flex-col items-center rounded-4xl bg-[#14221c]/60 pt-4 pb-8 lg:my-10 lg:max-w-4xl lg:pb-12">
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
            <form
              className="flex w-full flex-col gap-4 lg:w-1/2"
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
                className="h-12 w-full rounded-2xl border border-white/20 bg-[#6b7368]/20 px-4 font-bold text-white backdrop-blur-md transition outline-none placeholder:text-gray-300 focus:border-[#c4c09a] focus:ring-2 focus:ring-[#c4c09a]/40"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Email"
                className="h-12 w-full rounded-2xl border border-white/20 bg-[#6b7368]/20 px-4 font-bold text-white backdrop-blur-md transition outline-none placeholder:text-gray-300 focus:border-[#c4c09a] focus:ring-2 focus:ring-[#c4c09a]/40"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Password"
                className="h-12 w-full rounded-2xl border border-white/20 bg-[#6b7368]/20 px-4 font-bold text-white backdrop-blur-md transition outline-none placeholder:text-gray-300 focus:border-[#c4c09a] focus:ring-2 focus:ring-[#c4c09a]/40"
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                placeholder="Confirm Password"
                className="h-12 w-full rounded-2xl border border-white/20 bg-[#6b7368]/20 px-4 font-bold text-white backdrop-blur-md transition outline-none placeholder:text-gray-300 focus:border-[#c4c09a] focus:ring-2 focus:ring-[#c4c09a]/40"
              />
            </form>

            {/* Right Side - Buttons */}
            <div className="flex w-full flex-col items-center justify-center gap-6 lg:w-1/2">
              <button
                type="submit"
                form="signup-form"
                className="h-12 w-full rounded-2xl bg-[#6c9d43] text-xl font-bold text-[#ece098] lg:w-60"
              >
                SIGN UP
              </button>

              <div className="my-4 flex w-full max-w-xs items-center">
                <div className="h-px flex-1 bg-gray-400"></div>

                <span className="px-4 font-bold text-white">OR</span>

                <div className="h-px flex-1 bg-gray-400"></div>
              </div>

              <button className="h-12 w-full rounded-2xl bg-[#6b7368]/50 text-lg font-bold text-[#e4e4e4] lg:w-60">
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
