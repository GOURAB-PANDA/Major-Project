const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string } = require("joi");

const listingSchema = new Schema({
   title: {
    type: String,
    required: true,
   },
  description: String,
  image: {
    type: String,
    default:
      "https://unsplash.com/photos/a-man-holding-a-small-white-object-in-his-hands-vsZAIJqQqdo",
    set: (v) =>
       v === ""
        ? "https://unsplash.com/photos/a-man-holding-a-small-white-object-in-his-hands-vsZAIJqQqdo" 
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await   Review.deleteMany({_id: {$in: listing.reviews} });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;