import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/BaseURL";
import { useEffect, useState } from "react";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // ✅ Handle OAuth login via Google
  const handleGoogleLogin = () => {
    setIsLoading(true);
    const popup = window.open(
      `${BASE_URL}/api/login`, // Adjust to match your backend OAuth route
      "googleAuth",
      "width=500,height=600"
    );

    const checkPopupClosed = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopupClosed);
        setIsLoading(false);
      }
    }, 500);
  };

  // ✅ Listen for authentication success message from backend
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== BASE_URL) return; // ✅ Ensure messages come from backend

      if (event.data.type === "LOGIN_SUCCESS") {
        console.log("Login Success:", event.data.user);
        setIsLoading(false);
        navigate("/pages/Book/List"); // ✅ Redirect user on success
      } else if (event.data.type === "LOGIN_FAILED") {
        console.log("Login Failed: Redirecting to Register");
        navigate("/pages/Register/Oauth"); // ✅ Redirect to register page
      }
    };
    console.log("BASE URL : ", BASE_URL);
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [navigate]);

  return (
    <section className="min-h-[87vh] flex justify-center items-center">
      <div className="w-full max-w-[450px] h-[450px] border border-black bg-white rounded-[10px] p-4">
        <h1 className="font-bold text-2xl text-center">Login To BookStore</h1>
        <form className="flex flex-col justify-center mt-2">
          <div className="gap-2 flex flex-col mb-2">
            <label className="font-semibold">Email</label>
            <input
              className="border border-black p-2 rounded-md"
              type="email"
              placeholder="example@yourmail.com"
            />
          </div>
          <div className="gap-2 flex flex-col mb-2">
            <label className="font-semibold">Password</label>
            <input
              className="border border-black p-2 rounded-md"
              type="password"
              placeholder="Enter Your Password"
            />
          </div>
          <div className="flex gap-2">
            <input type="checkbox" />
            <label className="font-semibold">Remember Me</label>
          </div>
          <button
            type="submit"
            className="p-3 rounded-[8px] mt-5 bg-sky-600 font-bold text-white hover:bg-slate-200 hover:text-sky-600 transition-all"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="flex justify-center items-center gap-3 w-full p-3 rounded-[8px] mt-5 bg-white border border-sky-600 font-bold text-sky-600 hover:bg-slate-200 hover:text-sky-600 transition-all"
        >
          <FcGoogle size={20} />{" "}
          {isLoading ? "Loading..." : "Login With Google"}
        </button>
        <div className="flex justify-center items-center">
          <Link
            to={"/pages/Register/Oauth"}
            className="text-slate-500 font-semibold mt-2"
          >
            Don't have an account?{" "}
            <span className="text-sky-600 font-bold">Sign Up Now</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
