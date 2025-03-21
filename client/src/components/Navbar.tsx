import { Link } from "react-router-dom";
import "boxicons";
import "boxicons/css/boxicons.min.css"; // Import the CSS for boxicons
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleMobileScreen = () => {
    setIsMobile(window.innerWidth < 1128);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    window.addEventListener("resize", handleMobileScreen);
    handleMobileScreen(); // Call once on mount to set initial state
    return () => {
      window.removeEventListener("resize", handleMobileScreen);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center text-black py-4 px-2 md:px-32 bg-white drop-shadow-md">
      <Link to={""} className="flex items-center gap-3">
        <img
          src="https://www.svgrepo.com/show/492788/book-and-person-winter.svg"
          className="w-12 h-12 "
          alt=""
        />
        <h1 className="font-semibold">BookStore</h1>
      </Link>
      <ul className="hidden xl:flex items-center gap-12 font-semibold text-base">
        <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer">
          Home
        </li>

        <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer">
          Book
        </li>
        <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer">
          Explore
        </li>
        <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer">
          Contact
        </li>
      </ul>
      <div className="relative hidden md:flex items-center justify-center gap-3">
        <i className="bx bx-search-alt bx-tada absolute text-2xl left-3 text-gray-500"></i>{" "}
        {/* Correct usage */}
        <input
          type="text"
          placeholder="Search..."
          className="py-2 pl-10 rounded-xl border-2 border-blue-500 focus:bg-slate-100 focus:outline-sky-500"
        />
      </div>
      {isMobile && (
        <i
          className="bx bx-menu text-3xl cursor-pointer"
          onClick={handleOpen}
        ></i>
      )}
      <div
        className={`absolute xl:hidden top-20 left-0 w-full bg-white flex flex-col items-center gap-2 font-semibold transform transition-transform ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
        }`}
        style={{ transition: "transform 0.3s ease, opacity 0.3s ease" }}
      >
        <li className="list-none w-full text-center p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer">
          Home
        </li>
        <li className="list-none w-full text-center p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer">
          Book
        </li>

        <li className="list-none w-full text-center p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer">
          Explore
        </li>

        <li className="list-none w-full text-center p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer">
          Contact
        </li>
      </div>
    </header>
  );
}
