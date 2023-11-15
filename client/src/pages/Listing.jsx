import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
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
        </>
      )}
    </main>
  );
};

export default Listing;
