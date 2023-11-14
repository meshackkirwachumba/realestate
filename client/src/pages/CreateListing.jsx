import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });

  const [imageUploadError, setImageUploadError] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);

  console.log(formData);

  const handleImagesUploadToFirebase = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploadingImages(true);
      setImageUploadError("");
      // downloadable urls of uploaded images
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(uploadImageToFirebase(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError("");
          setUploadingImages(false);
        })
        .catch((error) => {
          setImageUploadError("Image upload failed (2mb max per image)");
          setUploadingImages(false);
        });
    } else {
      setImageUploadError("You can only upload up to 6 images per listing");
      setUploadingImages(false);
    }
  };

  const uploadImageToFirebase = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col gap-4 sm:flex-row ">
        {/* 1st wrapper */}
        {/* text inputs */}
        <div className="flex flex-col gap-4 w-full flex-1">
          <input
            id="name"
            type="text"
            placeholder="Name"
            maxLength="62"
            minLength="10"
            required
            autoComplete="off"
            className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-slate-500 w-full"
          />
          <textarea
            id="description"
            type="text"
            placeholder="Description"
            required
            autoComplete="off"
            className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-slate-500 w-full"
          />
          <input
            id="address"
            type="text"
            placeholder="Address"
            required
            autoComplete="off"
            className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-slate-500 w-full"
          />
          {/* checkbox inputs ie true or false */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5 h-5 outline-none"
              />
              <span>Sell</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5 h-5 outline-none"
              />
              <span>Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5 h-5 outline-none"
              />
              <span>parking spot</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5 h-5 outline-none"
              />
              <span>Furnished</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5 h-5 outline-none"
              />
              <span>Offer</span>
            </div>
          </div>
          {/* number inputs */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                id="bedrooms"
                type="number"
                min="1"
                max="10"
                required
                autoComplete="off"
                className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-slate-500 max-w-[60px] w-full"
              />
              <p>Bedrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="bathrooms"
                type="number"
                min="1"
                max="5"
                required
                autoComplete="off"
                className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-slate-500 max-w-[60px] w-full"
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="regularPrice"
                type="number"
                required
                autoComplete="off"
                className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-slate-500 max-w-[60px] w-full"
              />
              <div className="flex flex-col">
                <p>Regular Price</p>
                <span className="text-xs">(ksh / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="discountedPrice"
                type="number"
                required
                autoComplete="off"
                className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-slate-500 max-w-[60px] w-full"
              />
              <div className="flex flex-col">
                <p>Discounted Price</p>
                <span className="text-xs">(ksh / month)</span>
              </div>
            </div>
          </div>
        </div>
        {/* 2nd wrapper */}
        <div className="flex flex-col gap-4 w-full flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              required
              multiple
              className="w-full rounded-lg border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-slate-500"
            />
            <button
              disabled={uploadingImages}
              type="button"
              onClick={handleImagesUploadToFirebase}
              className="
              text-green-600 
              border-2 border-green-600 hover:shadow-lg
              px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImages ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-500 text-xs">
            {imageUploadError && imageUploadError}
          </p>

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={index}
                className="flex items-center gap-3 shadow-lg p-2"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="h-20 w-40 rounded-lg object-cover overflow-hidden"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  type="button"
                  className="text-red-500 font-semibold hover:opacity-95 px-3 py-2 rounded-lg hover:bg-rose-300 bg-rose-200"
                >
                  Remove
                </button>
              </div>
            ))}
          {/* submit button */}
          <button
            className="
             bg-slate-700
             text-white
               p-3
               rounded-lg
               hover:shadow-lg
               hover:opacity-95
               disabled:opacity-75
         "
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
