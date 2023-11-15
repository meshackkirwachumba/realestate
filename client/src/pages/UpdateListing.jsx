import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();

  useEffect(() => {
    const fetchListingById = async () => {
      try {
        const listingId = params.id;
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();

        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setFormData(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchListingById();
  }, []);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    //set value for type ie rent or sale
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    //set value for offer, parking and furnished ie true or false
    if (
      e.target.id === "offer" ||
      e.target.id === "parking" ||
      e.target.id === "furnished"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length === 0) {
        setError("Please upload at least one image");
        return;
      }
      if (+formData.regularPrice < +formData.discountedPrice) {
        setError("Discounted price cannot be greater than regular price");
        return;
      }
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      } else {
        setLoading(false);
        toast.success("Listing updated successfully");
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 sm:flex-row "
      >
        {/* 1st wrapper */}
        {/* text inputs */}
        <div className="flex flex-col gap-4 w-full flex-1">
          <input
            id="name"
            type="text"
            onChange={handleChange}
            value={formData.name}
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
            onChange={handleChange}
            value={formData.description}
            placeholder="Description"
            required
            autoComplete="off"
            className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-slate-500 w-full"
          />
          <input
            id="address"
            type="text"
            onChange={handleChange}
            value={formData.address}
            placeholder="Address"
            required
            className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-slate-500 w-full"
          />
          {/* checkbox inputs ie true or false */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
                className="w-5 h-5 outline-none"
              />
              <span>Sell</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
                className="w-5 h-5 outline-none"
              />
              <span>Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
                className="w-5 h-5 outline-none"
              />
              <span>parking spot</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
                className="w-5 h-5 outline-none"
              />
              <span>Furnished</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
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
                onChange={handleChange}
                value={formData.bedrooms}
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
                onChange={handleChange}
                value={formData.bathrooms}
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
                onChange={handleChange}
                value={formData.regularPrice}
                required
                autoComplete="off"
                className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-slate-500 max-w-[150px] w-full"
              />
              <div className="flex flex-col">
                <p>Regular Price</p>
                <span className="text-xs">(ksh / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  id="discountedPrice"
                  type="number"
                  onChange={handleChange}
                  value={formData.discountedPrice}
                  required
                  autoComplete="off"
                  className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-slate-500 max-w-[150px] w-full"
                />
                <div className="flex flex-col">
                  <p>Discounted Price</p>
                  <span className="text-xs">(ksh / month)</span>
                </div>
              </div>
            )}
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
            disabled={loading || uploadingImages}
            className="
               bg-slate-700
               text-white
                 p-3
                 rounded-lg
                 hover:shadow-lg
                 hover:opacity-95
                 disabled:opacity-75
                 disabled:cursor-not-allowed
           "
          >
            {loading ? "Updating..." : "Update listing"}
          </button>
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
