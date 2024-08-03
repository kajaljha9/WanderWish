const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const filterList = [
        { icon: "fa-solid fa-fire", text: "Trending" },
        { icon: "fa-solid fa-bed", text: "Rooms" },
        { icon: "fa-solid fa-mountain-city", text: "Iconic Cities" },
        { icon: "fa-solid fa-mountain", text: "Mountains" },
        { icon: "fa-brands fa-fort-awesome", text: "Castles" },
        { icon: "fa-solid fa-umbrella-beach", text: "Beach" },
        { icon: "fa-solid fa-campground", text: "Camping" },
        { icon: "fa-solid fa-cow", text: "Farms" },
        { icon: "fa-solid fa-igloo", text: "Arctic" },
        { icon: "fa-solid fa-person-swimming", text: "Amazing Pools" },
        { icon: "fa-solid fa-temperature-full", text: "Deserts" },
    ];
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings, filterList });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", }, }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing doesn't exists");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {


    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    let savedListing = await newListing.save();

    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing doesn't exists");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    };
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}