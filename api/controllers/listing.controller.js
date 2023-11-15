import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const existingListing = await Listing.findById(req.params.id);

  if (!existingListing) {
    return next(errorHandler(404, "Listing not found"));
  }

  if (existingListing.userRef !== req.user.id) {
    return next(errorHandler(403, "You can delete only your listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing deleted successfully!");
  } catch (error) {
    next(error);
  }
};
