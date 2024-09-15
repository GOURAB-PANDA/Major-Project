const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressEror = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl =req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner =async (req, res, next) => {
  let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error", "You dont have permission to edit");
     return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
      throw new ExpressEror(400, result.error);
    }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if ( error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressEror(400, errMsg);
  }else{
    next();
  }
};
module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    let { id, reviewid } = req.params;
    let review = await Review.findById(reviewid);
    if (!review) {
      req.flash("error", "Review not found");
      return res.redirect(`/listings/${id}`);
    }
    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (e) {
    next(e);
  }
};
