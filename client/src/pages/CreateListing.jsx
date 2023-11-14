import React from "react";

const CreateListing = () => {
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
              type="file"
              id="images"
              accept="image/*"
              required
              multiple
              className="w-full rounded-lg border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-slate-500"
            />
            <button
              className="
              text-green-600 
              border-2 border-green-600 hover:shadow-lg
              px-4 py-2 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Upload
            </button>
          </div>
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
