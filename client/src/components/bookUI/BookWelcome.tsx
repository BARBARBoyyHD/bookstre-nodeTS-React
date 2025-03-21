import { useNavigate } from "react-router-dom";

export default function BookWelcome() {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/pages/login/Oauth");
  };
  return (
    <section className="min-h-[85vh] flex flex-wrap flex-row justify-center items-center">
      <div className="w-full max-w-[650px] h-auto flex flex-col items-center  p-6 bg-opacity-80 rounded-lg">
        <h1 className="text-white text-3xl font-bold">
          Welcome To Our Book Store
        </h1>
        <p className="text-white text-lg mt-3 max-w-[400px]">
          Discover a world of knowledge with our vast collection of books. From
          fiction to self-improvement, we have something for every reader.
        </p>
        <button
          onClick={handleNavigate}
          className="px-6 py-3 mt-4 rounded-md bg-slate-50 text-black font-bold hover:bg-sky-600 hover:text-white transition-all"
        >
          Sign Up
        </button>
      </div>
      <div className="w-[650px] h-[500px] hidden md:flex justify-center items-center">
        <img
          src="https://www.svgrepo.com/show/492788/book-and-person-winter.svg"
          className="w-[500px] h-[500px]"
        />
      </div>
    </section>
  );
}
