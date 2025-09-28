const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const Retailer = require("../models/Retailer");
const { generateToken } = require("../config/jwt");

const registerRetailer = async (req, res) => {
  let user = null;
  let retailerProfile = null;

  const {
    name,
    contact,
    location,
    password,
    shop_name,
    shop_address,
    gst_number,
    license_number,
    aadhar_number,
  } = req.body;

  try {
    if (
      !name ||
      !contact ||
      !location ||
      !password ||
      !shop_name ||
      !license_number ||
      !shop_address ||
      !gst_number ||
      !aadhar_number
    ) {
      return res.status(400).json({ msg: "Missing required fields." });
    }

    // Pre-check for existing user
    let existingUser = await User.findOne({ contact });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "Contact number already registered." });
    }
    let existingGstNumber = await Retailer.findOne({ gst_number });
    if (existingGstNumber) {
      return res.status(400).json({ msg: "Gst number already registered." });
    }
    let existingLicense = await Retailer.findOne({ license_number });
    if (existingLicense) {
      return res
        .status(400)
        .json({ msg: "License number already registered." });
    }
    let existingAadhar = await Retailer.findOne({ aadhar_number });
    if (existingAadhar) {
      return res.status(400).json({ msg: "Aadhar number already registered." });
    }

    // Hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user and transporter profile
    user = await User.create({
      name,
      password: hashedPassword,
      contact,
      location,
      role: "retailer",
    });

    retailerProfile = await Retailer.create({
      user_id: user._id,
      shop_name,
      shop_address,
      gst_number,
      license_number,
      aadhar_number,
    });

    const token = generateToken(user);
    return res.status(201).json({
      msg: "Retailer registered successfully.",
      token,
    });
  } catch (err) {
    if (user) {
      await User.findByIdAndDelete(user._id);
      console.log("Deleted user due to error during Retailer registration.");
    }
    if (retailerProfile && retailerProfile._id) {
      await Retailer.findByIdAndDelete(retailerProfile._id);
      console.log("Deleted Retailer profile due to error during registration.");
    }
    console.error(err);
    return res.status(500).json({ msg: "Server error." });
  }
};

const loginRetailer = async (req, res) => {
  try {
    const { contact, password } = req.body;
    if (!contact || !password) {
      return res.status(400).json({ msg: "Missing contact or password." });
    }

    const user = await User.findOne({
      contact,
      role: "retailer",
    });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    const token = generateToken(user);
    return res.status(200).json({ msg: "Login successful.", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error." });
  }
};

const getRetailerProfile = async (req, res) => {
  try {
    let userId = req.userId;
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }
    const user = await User.findById({ _id: userId });
    const retailer = await Retailer.findOne({
      user_id: userId,
    });
    if (!user || !retailer) {
      return res.status(404).json({ msg: "Retailer profile not found" });
    }
    res.json({
      user,
      details: retailer,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error while fetching profile.");
  }
};

const updateRetailerProfile = async (req, res) => {
  let originalUser = null;
  let originalRetailer = null;
  let userId = req.userId;
  try {
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const {
      name,
      contact,
      location,
      shop_name,
      shop_address,
      gst_number,
      license_number,
      aadhar_number,
    } = req.body;

    // Update fields if provided

    const userUpdate = {};
    const retailerUpdate = {};

    if (name) userUpdate.name = name;
    if (contact) {
      let contactCheck = await User.findOne({ contact });
      if (contactCheck && contactCheck._id.toString() !== userId) {
        return res
          .status(400)
          .json({ msg: "Contact number already registered by another user." });
      }
      userUpdate.contact = contact;
    }
    if (location) userUpdate.location = location;

    if (shop_name) retailerUpdate.shop_name = shop_name;
    if (shop_address) retailerUpdate.shop_address = shop_address;
    if (gst_number) {
      let gstCheck = await Retailer.findOne({ gst_number });
      if (gstCheck && gstCheck.user_id.toString() !== userId) {
        return res
          .status(400)
          .json({ msg: "Gst number already registered by another user." });
      }
      retailerUpdate.gst_number = gst_number;
    }
    if (aadhar_number) {
      let aadharCheck = await Retailer.findOne({ aadhar_number });
      if (aadharCheck && aadharCheck.user_id.toString() !== userId) {
        return res
          .status(400)
          .json({ msg: "Aadhar number already registered by another user." });
      }
      retailerUpdate.aadhar_number = aadhar_number;
    }
    if (license_number) {
      let licenseCheck = await Retailer.findOne({ license_number });
      if (licenseCheck && licenseCheck.user_id.toString() !== userId) {
        return res
          .status(400)
          .json({ msg: "License number already registered by another user." });
      }
      retailerUpdate.license_number = license_number;
    }
    // already created user and indivisual transporter
    originalUser = await User.findById({
      _id: userId,
      role: "retailer",
    });
    originalRetailer = await Retailer.findOne({
      user_id: userId,
    });

    if (!originalUser || !originalRetailer) {
      return res.status(404).json({ msg: "Retailer profile not found" });
    }

    // update User and indivisual transporter fields
    const user = await User.findByIdAndUpdate(userId, userUpdate, {
      new: true,
      runValidators: true,
    });

    const retailer = await Retailer.findOneAndUpdate(
      { user_id: userId },
      retailerUpdate,
      { new: true, runValidators: true }
    );

    if (!user || !retailer) {
      // rollback
      throw new Error("Update operation failed or profile became missing.");
    }

    res.json({
      msg: "Retailer profile updated successfully.",
      data: { user, details: retailer },
    });
  } catch (err) {
    // rollback in case of error
    if (originalUser && userId) {
      await User.findByIdAndUpdate(userId, originalUser, {
        new: false,
        runValidators: true,
      });
    }
    if (originalRetailer && userId) {
      await Retailer.findOneAndUpdate({ user_id: userId }, originalRetailer, {
        new: false,
        runValidators: true,
      });
    }
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      let msg = `The provided value is already in use.`;

      if (field === "contact") msg = "Contact number already registered.";
      if (field === "gst_number") msg = "Gst number already registered.";
      if (field === "aadhar_number") msg = "Aadhar number already registered.";
      if (field === "license_number")msg = "License number already registered.";

      return res.status(400).json({ msg });
    }
    console.error(err.message);
    res.status(500).send("Server Error while updating profile.");
  }
};

module.exports = {
  registerRetailer,
  loginRetailer,
  getRetailerProfile,
  updateRetailerProfile,
};
