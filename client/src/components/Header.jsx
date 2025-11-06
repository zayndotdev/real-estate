import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center gap-5 max-w-7xl mx-auto p-3 md:p-4">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <h1 className="font-bold text-xl md:text-2xl text-slate-700 hover:text-slate-800 transition-colors">
            Real
            <span className="text-slate-500 hover:text-slate-600">Estate</span>
          </h1>
        </Link>

        {/* Search bar */}
        <form className="flex items-center bg-white rounded-full shadow-sm px-3 py-2 w-full max-w-60 sm:max-w-80 focus-within:ring-2 focus-within:ring-slate-400 focus-within:shadow-md transition-all duration-200">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 outline-none bg-transparent text-sm md:text-base text-slate-700 placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="hover:scale-105 transition-transform duration-200"
          >
            <FaSearch className="text-slate-500 hover:text-slate-700 text-sm md:text-base cursor-pointer transition-colors" />
          </button>
        </form>

        {/* Navigation Links */}
        <nav className="shrink-0">
          <ul className="flex items-center gap-4 md:gap-6">
            <li className="hidden sm:inline-block">
              <Link
                to="/"
                className="text-slate-600 font-medium hover:text-slate-800 text-sm md:text-base transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li className="hidden sm:inline-block">
              <Link
                to="/about"
                className="text-slate-600 font-medium hover:text-slate-800 text-sm md:text-base transition-colors duration-200"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/sign-in"
                className="text-slate-600 font-medium hover:text-slate-800 text-sm md:text-base transition-colors duration-200"
              >
                Sign In
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
