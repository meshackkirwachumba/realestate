import React from "react";

const Search = () => {
  return (
    <div
      className="
        flex
        flex-col
        md:flex-row
      "
    >
      {/* filters */}
      <div className=" flex-[1] p-7 border-b-2 md:border-r-2 md:h-screen">
        <form className="flex flex-col gap-4">
          <div className="flex items-start flex-col gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border-2 border-slate-300 focus:border-slate-500 rounded-lg p-3 w-full outline-none bg-transparent "
            />
          </div>
          <div className="flex justify-start items-center md:items-start md:flex-col gap-2 flex-wrap">
            <label className="font-semibold">Type:</label>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="all" className="h-4 w-5" />
              <span>Rent & Sale</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rent" className="h-4 w-5" />
              <span>Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="sale" className="h-4 w-5" />
              <span>Sale</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="offer" className="h-4 w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex items-center justify-start md:items-start md:flex-col gap-2 flex-wrap">
            <label className="font-semibold">Amenities:</label>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="parking" className="h-4 w-5" />
              <span>parking</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="furnished" className="h-4 w-5" />
              <span>furnished</span>
            </div>
          </div>

          <div className="flex items-center justify-start gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              className="border-2 border-slate-300 focus:border-slate-500 rounded-lg p-2 w-full outline-none bg-transparent "
            >
              <option value="">Latest</option>
              <option value="">Price: Low to High</option>
              <option value="">Price: High to Low</option>
              <option value="">Oldest</option>
            </select>
          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      {/* data */}
      <div className=" flex-[4]">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-3">
          Listing Results
        </h1>
      </div>
    </div>
  );
};

export default Search;
