import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="shadow-md bg-slate-200">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Mobet</span>
            <span className="text-slate-700">RealEstate</span>
          </h1>
        </Link>

        <form className="bg-slate-100 rounded-lg p-3 flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none focus:outline-none w-24 sm:w-64"
          />
          <FaSearch />
        </form>

        <ul className="flex gap-3 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:bg-slate-300 p-1 rounded font-semibold">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:bg-slate-300 p-1 rounded font-semibold">
              About
            </li>
          </Link>
          <div className="relative">
            {currentUser ? (
              <Link to="/profile">
                <img
                  src={currentUser.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </Link>
            ) : (
              <Link to="sign-in">
                <li className="text-slate-700 bg-slate-300 px-2 py-1 hover:opacity-80 transition rounded font-semibold">
                  Sign In
                </li>
              </Link>
            )}
          </div>
        </ul>
      </div>
    </header>
  );
}

export default Header;
