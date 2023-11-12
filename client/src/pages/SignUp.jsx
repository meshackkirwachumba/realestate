import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div className="mx-auto p-3 max-w-lg">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input
          autoComplete="off"
          type="text"
          id="username"
          placeholder="Enter your username"
          className="border border-gray-300 p-3 rounded-lg focus:border-gray-500 outline-none focus:border-2 "
        />
        <input
          autoComplete="off"
          type="email"
          id="email"
          placeholder="Enter your email"
          className="border border-gray-300 p-3 rounded-lg focus:border-gray-500 outline-none focus:border-2 transition"
        />
        <input
          autoComplete="off"
          type="password"
          id="password"
          placeholder="Enter your password"
          className="border border-gray-300 p-3 rounded-lg focus:border-gray-500 outline-none focus:border-2"
        />
        <button
          className="
          bg-slate-700 
          text-white p-3 
            rounded-lg 
            hover:opacity-95
            transition
            disabled:opacity-75
            disabled:cursor-not-allowed 
            "
        >
          Sign Up
        </button>
      </form>
      <div className="flex justify-start gap-2 mt-2">
        <p>Already have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-500 hover:underline hover:font-semibold transition">
            Sign In
          </span>
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
