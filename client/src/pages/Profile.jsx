import { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  const fileRef = useRef(null);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const [formData, setFormData] = useState({});

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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
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
