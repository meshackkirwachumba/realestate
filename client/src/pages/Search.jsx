import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listings, setListings] = useState([]);

  console.log(listings);

  const handleChange = (e) => {
    // set searchTerm
    if (e.target.id === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value,
      });
    }

    // set either all, rent or sale as type
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({
        ...sidebarData,
        type: e.target.id,
      });
    }

    //true or false
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    // sort
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();

      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);

    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-start flex-col gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border-2 border-slate-300 focus:border-slate-500 rounded-lg p-3 w-full outline-none bg-transparent "
              onChange={handleChange}
              value={sidebarData.searchTerm}
            />
          </div>
          <div className="flex justify-start items-center md:items-start md:flex-col gap-2 flex-wrap">
            <label className="font-semibold">Type:</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="all"
                className="h-4 w-5"
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rent"
                className="h-4 w-5"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sale"
                className="h-4 w-5"
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="offer"
                className="h-4 w-5"
                onChange={handleChange}
                checked={sidebarData.offer === true}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex items-center justify-start md:items-start md:flex-col gap-2 flex-wrap">
            <label className="font-semibold">Amenities:</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="parking"
                className="h-4 w-5"
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span>parking</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="h-4 w-5"
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span>furnished</span>
            </div>
          </div>

          <div className="flex items-center justify-start gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              className="border-2 border-slate-300 focus:border-slate-500 rounded-lg p-2 w-full outline-none bg-transparent "
            >
              <option value="createdAt_desc">Latest</option>
              <option value="regularPrice_asc">Price: Low to High</option>
              <option value="regularPrice_desc">Price: High to Low</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      {/* data */}
      <div className="flex-[4] p-7">
        <h1 className="text-3xl font-semibold border-b  text-slate-700 my-3">
          Listing Results
        </h1>
        <div className="flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-center text-slate-700">
              No listings found!
            </p>
          )}
          {loading && (
            <p className="text-xl text-center text-slate-700">Loading...</p>
          )}

          {!loading &&
            listings.length > 0 &&
            listings.map((listing) => (
              <ListingItem key={listing.id} listing={listing} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
