import React from "react";
import { GiSteeringWheel } from "react-icons/gi";
const NavbarPito = () => {
  return (
    <header>
      {/*desktop navigation section */}
      <nav className="flex justify-between items-center ">
        <div className="flex items-center gap-2">
          <GiSteeringWheel size={35} className="text-primary" />
          <a href="/" className="font-bold text-2xl">
            MY SERVICE
          </a>
        </div>
        <a
          href="/"
          className="hover:text-primary transition duration-200 ease-linear"
        >
          HOME
        </a>
        <a
          href="/"
          className="hover:text-primary transition duration-200 ease-linear"
        >
          BENGKEL TERDEKAT
        </a>
        <a
          href="/"
          className="hover:text-primary transition duration-200 ease-linear"
        >
          TUTORIAL
        </a>

        <button>Sign In</button>
      </nav>
    </header>
  );
};

export default NavbarPito;