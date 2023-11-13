import { useSelector } from "react-redux";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser?.avatar}
          alt="avatar"
          className="w-24 h-24 rounded-full self-center object-cover cursor-pointer"
        />
        <input
          id="username"
          type="text"
          placeholder="username"
          className="border border-gray-300 rounded-lg p-3 outline-none"
        />
        <input
          id="email"
          type="email"
          placeholder="email"
          className="border border-gray-300 rounded-lg p-3 outline-none"
        />
        <input
          id="password"
          type="password"
          placeholder="password"
          className="border border-gray-300 rounded-lg p-3 outline-none"
        />

        <button
          className="
        bg-slate-700 text-white rounded-lg p-3 font-semibold hover:opacity-95 disabled:opacity-50"
        >
          update
        </button>
      </form>

      <div className="flex justify-between mt-3 font-semibold">
        <span className="text-rose-700 cursor-pointer hover:bg-slate-300 p-1 rounded-lg">
          Delete account
        </span>
        <span className="text-rose-700 cursor-pointer hover:bg-slate-300 p-1 rounded-lg">
          Logout
        </span>
      </div>
    </div>
  );
}

export default Profile;
