import { FaBath, FaBed } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

const ListingItem = ({ listing }) => {
  return (
    <div className="w-full sm:w-[300px] shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg bg-white">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing"
          className="h-[300px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center justify-start gap-1">
            <MdLocationOn className="text-green-700 h-4 w-4" />
            <p className="text-sm text-gray-600 truncate font-medium">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold">
            {listing.offer
              ? listing.discountedPrice.toLocaleString("en-US", {
                  style: "currency",
                  currency: "KES",
                })
              : listing.regularPrice.toLocaleString("en-US", {
                  style: "currency",
                  currency: "KES",
                })}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex items-center justify-between gap-2 text-slate-700">
            <div className="flex items-center justify-start gap-1 font-bold text-xs">
              <FaBed className="text-green-700 text-sm" />
              <span>
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Bedrooms`
                  : "1 Bedroom"}
              </span>
            </div>
            <div className="flex items-center justify-start gap-1 font-bold text-xs">
              <FaBath className="text-green-700 text-sm" />
              <span>
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Bathrooms`
                  : "1 Bathroom"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
