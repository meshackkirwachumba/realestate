import { useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutStart,
  signOutSuccess,
} from "../redux/user/userSlice";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [deleteError, setDeleteError] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    const uploaseTask = uploadBytesResumable(storageRef, file);

    uploaseTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadErr(true);
      },
      () => {
        getDownloadURL(uploaseTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, avatar: downloadURL }));
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      toast.success("Profile updated successfully");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      } else {
        dispatch(deleteUserSuccess(data));
        toast.success("Account deleted successfully");
        navigate("/signin");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }

      dispatch(signOutSuccess());

      toast.success("Logout Successful");
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      setDeleteLoading(true);
      setDeleteError(false);
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        setDeleteLoading(false);
        setDeleteError(true);
        toast.error(data.message);
        console.log(data.message);
        return;
      }

      setDeleteLoading(false);
      setDeleteError(false);
      setUserListings((prev) => prev.filter((listing) => listing._id !== id));
      toast.success("Listing Deleted Successfully");
    } catch (error) {
      setDeleteLoading(false);
      setDeleteError(true);
      toast.error(error.message);
      console.log(error);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <span className="text-rose-700 text-center">{error ? error : ""}</span>
        <input
          hidden
          type="file"
          ref={fileRef}
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          src={formData?.avatar || currentUser?.avatar}
          alt="avatar"
          className="w-24 h-24 rounded-full self-center object-cover cursor-pointer"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-center text-sm">
          {fileUploadErr ? (
            <span className="text-rose-700">
              File upload error(image must be less than 2mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-800">{`Uploading ${filePerc}`}%</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          id="username"
          type="text"
          placeholder="username"
          className="border border-gray-300 rounded-lg p-3 outline-none"
          defaultValue={currentUser?.username}
          onChange={handleChange}
        />
        <input
          id="email"
          type="email"
          placeholder="email"
          className="border border-gray-300 rounded-lg p-3 outline-none"
          defaultValue={currentUser?.email}
          onChange={handleChange}
        />
        <input
          id="password"
          type="password"
          placeholder="password"
          className="border border-gray-300 rounded-lg p-3 outline-none"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="
        bg-slate-700 text-white rounded-lg p-3 font-semibold hover:opacity-95 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update"}
        </button>

        <Link
          to="/create-listing"
          className="
         bg-green-700 text-white rounded-lg p-3 font-semibold hover:opacity-95 text-center"
        >
          Create listing
        </Link>
      </form>

      <div className="flex justify-between mt-3 font-semibold">
        <span
          onClick={handleDeleteUser}
          className="text-rose-700 cursor-pointer hover:bg-slate-300 p-1 rounded-lg"
        >
          Delete account
        </span>
        <span
          onClick={handleLogout}
          className="text-rose-700 cursor-pointer hover:bg-slate-300 p-1 rounded-lg"
        >
          Logout
        </span>
      </div>

      {/* show user listings */}
      <button
        onClick={handleShowListings}
        className="text-green-700 w-full font-semibold hover:underline"
      >
        Show My listings
      </button>
      <p className="text-rose-700 mt-4">
        {showListingsError && "Error occurred while fetching listings"}
      </p>

      {/* show user listings */}
      {userListings && userListings.length > 0 && (
        <div className="mt-3 shadow-lg p-3 ">
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex items-center justify-between"
            >
              <Link
                to={`/listing/${listing._id}`}
                className="flex items-center gap-3 flex-1"
              >
                <img
                  src={listing.imageUrls[0]}
                  alt="listing image"
                  className="w-16 h-16 rounded-lg object-contain"
                />
                <p className="text-slate-700 font-semibold flex-1 truncate hover:underline">
                  {listing.name}
                </p>
              </Link>
              <div className="flex flex-col items-end">
                <button className="text-green-700 text-normal hover:underline">
                  Edit
                </button>
                <button
                  disabled={deleteLoading}
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-rose-700 text-normal hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
