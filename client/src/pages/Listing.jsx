import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const fetchListingById = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listing/get/${params.id}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListingById();
  }, [params.id]);
  return (
    <main>
      {loading && <p className="text-center my-5 text-2xl">Loading...</p>}
      {error && (
        <p className="text-red-500 text-xs text-center">
          Error fetching this listing...
        </p>
      )}

      {listing && !loading && !error && (
        <>
          <Swiper navigation>
            {listing.imageUrls &&
              listing.imageUrls.map((imageUrl) => (
                <SwiperSlide key={imageUrl}>
                  <div
                    style={{
                      background: `url(${imageUrl}) center no-repeat`,
                      backgroundSize: "cover",
                      height: "500px",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
          </Swiper>

          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}

          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ksh {""}
              {listing.offer ? listing.discountedPrice : listing.regularPrice}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-center text-white p-1 rounded-md">
                {listing.type === "rent" ? "Rent" : "Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-center text-white p-1 rounded-md">
                  ksh {+listing.regularPrice - +listing.discountedPrice}{" "}
                  discount
                </p>
              )}
            </div>

            <p className="text-slate-800">
              <span className="font-semibold text-black">Description-</span>
              {listing.description}{" "}
            </p>

            <ul className="text-green-700 font-semibold text-sm whitespace-nowrap flex items-center gap-4 flex-wrap sm:gap-6">
              <li className="flex items-center gap-1 ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Bedrooms`
                  : "Bedroom"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} bathrooms `
                  : `${listing.bathrooms} bathroom `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;
