import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // convert the response to json from server
      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      } else {
        setLoading(false);
        setError(null);
        // After sign-up, send user to the sign-in page.
        toast.success("Sign-up successful");
        navigate("/sign-in");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="mx-auto p-3 max-w-lg">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          autoComplete="off"
          required
          type="text"
          id="username"
          placeholder="Enter your username"
          className="border border-gray-300 p-3 rounded-lg focus:border-gray-500 outline-none focus:border-2 "
          onChange={handleChange}
        />
        <input
          autoComplete="off"
          required
          type="email"
          id="email"
          placeholder="Enter your email"
          className="border border-gray-300 p-3 rounded-lg focus:border-gray-500 outline-none focus:border-2 transition"
          onChange={handleChange}
        />
        <input
          autoComplete="off"
          required
          type="password"
          id="password"
          placeholder="Enter your password"
          className="border border-gray-300 p-3 rounded-lg focus:border-gray-500 outline-none focus:border-2"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          type="submit"
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
          {loading ? "Loading..." : "Sign Up"}
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
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default SignUp;
