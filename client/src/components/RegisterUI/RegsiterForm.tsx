import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/BaseURL";
import { useEffect, useState } from "react";

export default function RegsiterForm() {
  const [isLoading, setIsloading] = useState<boolean>(false);
  const navigate = useNavigate();
  const registhandler = (url: string) => {
    setIsloading(true);
    const popUpOpen = window.open(
      url,
      "_blank",
      "width=500,height=600 left=0 top=0"
    );

    const checkPopupClosed = setInterval(() => {
      if (!popUpOpen || popUpOpen.closed) {
        clearInterval(checkPopupClosed);
        setIsloading(false);
      }
    }, 3000);
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== BASE_URL) return;

      if (e.data.type === "REGISTER_SUCCESS") {
        console.log("Registration Success:", e.data.user);
        setIsloading(false);
        navigate("/pages/login/Oauth");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <section className="min-h-[87vh] flex justify-center items-center">
      <div className="w-full max-w-[450px] h-[450px] border border-black bg-white rounded-[10px] p-4">
        <h1 className="font-bold text-2xl text-center">
          Register To BookStore
        </h1>
        <form className="flex flex-col  justify-center mt-2">
          <div className="gap-2 flex flex-col mb-2">
            <label className="font-semibold">Email</label>
            <input
              className="border border-black p-2 rounded-md"
              type="email"
              placeholder="example@yourmail.com"
            />
          </div>
          <div className="gap-2 flex flex-col mb-2">
            <label className="font-semibold">password</label>
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
          <button className="p-3 rounded-[8px] mt-5 bg-sky-600 font-bold text-white hover:bg-slate-200 hover:text-sky-600 transition-all">
            Login
          </button>
        </form>
        <button
          onClick={() => registhandler(`${BASE_URL}/api/register`)}
          className="flex justify-center items-center gap-3 w-full p-3 rounded-[8px] mt-5 bg-white border border-sky-600 font-bold text-sky-600 hover:bg-slate-200 hover:text-sky-600 transition-all"
        >
          {isLoading ? "Loading..." : "Register With Google"}
          <FcGoogle size={20} className="" />
        </button>
        <div className="flex justify-center items-center">
          <Link
            to={"/pages/Register/Oauth"}
            className="text-slate-500 font-semibold"
          >
            Don't have an account ?{" "}
            <span className="text-sky-600 font-bold">Sign Up Now</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
