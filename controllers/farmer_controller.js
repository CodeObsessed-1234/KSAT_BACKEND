const User = require("../models/Users");
const Farmer = require("../models/Farmer");
const { generateToken } = require("../config/jwt");
const bcrypt = require("bcryptjs");

const registerFarmer = async (req, res) => {
  let user = null;

  const {
    name,
    password,
    contact,
    location, // Base User field
    landSize, // Farmer Profile field
    farming_exp,
    prefered_crop_type,
    aadhar_number,
    certifications,
  } = req.body;

  if (!name || !contact || !location || !landSize) {
    return res.status(400).json({ msg: "Missing required fields." });
  }
  if (aadhar_number.length !== 12) {
    return res.status(400).json({ msg: "Aadhar number must be 12 digits." });
  }
  if (!/^\d{12}$/.test(aadhar_number)) {
    return res
      .status(400)
      .json({ msg: "Aadhar number must contain only digits." });
  }
  if (!/^\d{10}$/.test(contact)) {
    return res
      .status(400)
      .json({ msg: "Contact number must contain only digits." });
  }
  if (landSize <= 0) {
    return res
      .status(400)
      .json({ msg: "Land size must be a positive number." });
  }
  if (farming_exp < 0) {
    return res
      .status(400)
      .json({ msg: "Farming experience cannot be negative." });
  }
  if (contact.length !== 10) {
    return res.status(400).json({ msg: "Contact number must be 10 digits." });
  }
  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password is required and must be at least 6 characters." });
  }

  try {
    //pre check for existing user
    let existingUser = await User.findOne({ contact });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "Contact number already registered." });
    }
    let existingAadhar = await Farmer.findOne({ aadhar_number });
    if (existingAadhar) {
      return res.status(400).json({ msg: "Aadhar number already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      password: hashedPassword,
      contact,
      location,
      role: "farmer",
    });

    let farmer = await Farmer.create({
      user_id: user._id, // Link to the new user
      landSize,
      farming_exp,
      prefered_crop_type,
      certifications,
      aadhar_number,
    });

    const token = generateToken(user); // Generate JWT token

    console.log("Added farmer successfully!");
    res.status(201).json({
      msg: "Registration successful",
      userId: user._id,
      farmerProfileId: farmer._id,
      token,
    });
  } catch (err) {
    if (user && user._id) {
      await User.findByIdAndDelete(user._id);
      console.log(
        `Rollback executed: Deleted incomplete User with ID: ${user._id}`
      );
    }
    console.error(err.message);
    res.status(500).send("Server Error during registration.");
  }
};

const getFarmerProfile = async (req, res) => {
  try {
    let userId = req.userId;
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }
    const user = await User.findById(userId);
    const farmer = await Farmer.findOne({ user_id: userId });
    if (!user || !farmer) {
      return res.status(404).json({ msg: "Farmer profile not found" });
    }
    res.json({
      name: user.name,
      contact: user.contact,
      location: user.location,
      landSize: farmer.landSize,
      farming_exp: farmer.farming_exp,
      prefered_crop_type: farmer.prefered_crop_type,
      certifications: farmer.certifications,
      aadhar_number: farmer.aadhar_number,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const updateFarmerProfile = async (req, res) => {
  let originalUser = null;
  let originalFarmer = null;
  try {
    let userId = req.userId;
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const {
      name,
      contact,
      location, // Base User field
      landSize, // Farmer Profile field
      farming_exp,
      prefered_crop_type,
      certifications,
      aadhar_number,
    } = req.body;

    if (contact && contact.length !== 10) {
      return res.status(400).json({ msg: "Contact number must be 10 digits." });
    }

    if (contact) {
      if (!/^\d{10}$/.test(contact)) {
        return res
          .status(400)
          .json({ msg: "Contact number must contain only digits." });
      }
      const contactCheck = await User.findOne({ contact });
      if (contactCheck && contactCheck._id.toString() !== userId) {
        return res.status(400).json({
          msg: "This contact number is already registered by another user.",
        });
      }
    }
    if (aadhar_number) {
      if (aadhar_number.length !== 12) {
        return res
          .status(400)
          .json({ msg: "Aadhar number must be 12 digits." });
      }
      if (!/^\d{12}$/.test(aadhar_number)) {
        return res
          .status(400)
          .json({ msg: "Aadhar number must contain only digits." });
      }
      const aadharCheck = await Farmer.findOne({ aadhar_number });
      if (aadharCheck && aadharCheck.user_id.toString() !== userId) {
        return res.status(400).json({
          msg: "This Aadhar number is already registered by another user.",
        });
      }
    }

    if (landSize !== undefined && landSize <= 0) {
      return res
        .status(400)
        .json({ msg: "Land size must be a positive number." });
    }
    if (farming_exp !== undefined && farming_exp < 0) {
      return res
        .status(400)
        .json({ msg: "Farming experience cannot be negative." });
    }

    const userUpdate = {};
    if (name !== undefined) userUpdate.name = name;
    if (contact !== undefined) userUpdate.contact = contact;
    if (location !== undefined) userUpdate.location = location;

    const farmerUpdate = {};
    if (landSize !== undefined) farmerUpdate.landSize = landSize;
    if (farming_exp !== undefined) farmerUpdate.farming_exp = farming_exp;
    if (prefered_crop_type !== undefined)
      farmerUpdate.prefered_crop_type = prefered_crop_type;
    if (certifications !== undefined)
      farmerUpdate.certifications = certifications;
    if (aadhar_number !== undefined) farmerUpdate.aadhar_number = aadhar_number;

    // already cretated user and farmer
    originalUser = await User.findById({ _id: userId, role: "farmer" });
    originalFarmer = await Farmer.findOne({ user_id: userId });

    if (!originalUser || !originalFarmer) {
      return res.status(404).json({ msg: "Farmer profile not found" });
    }

    // Update User fields
    const user = await User.findByIdAndUpdate(userId, userUpdate, {
      new: true,
      runValidators: true,
    });

    // Update Farmer fields
    const farmer = await Farmer.findOneAndUpdate(
      { user_id: userId },
      farmerUpdate,
      { new: true, runValidators: true }
    );

    if (!user || !farmer) {
      return res
        .status(404)
        .json({ msg: "Farmer profile not found after update" });
    }

    res.json({
      msg: "Profile updated successfully",
      Farmer: {
        name: user.name,
        contact: user.contact,
        location: user.location,
        landSize: farmer.landSize,
        farming_exp: farmer.farming_exp,
        prefered_crop_type: farmer.prefered_crop_type,
        certifications: farmer.certifications,
        aadhar_number: farmer.aadhar_number,
      },
    });
  } catch (err) {
    if (originalUser) {
      await User.findByIdAndUpdate(originalUser._id, originalUser, {
        new: false,
      });
      console.log(
        `Rollback executed: Restored User with ID: ${originalUser._id}`
      );
    }
    if (originalFarmer) {
      await Farmer.findByIdAndUpdate(originalFarmer._id, originalFarmer, {
        new: false,
      });
      console.log(
        `Rollback executed: Restored Farmer with ID: ${originalFarmer._id}`
      );
    }
    if (err.code === 11000) {
      let msg = "Field value already exists.";
      const field = Object.keys(err.keyPattern || {})[0];
      if (field === "aadhar_number") {
        msg = "Aadhar number already registered.";
      }
      if (field === "contact") {
        msg = "Contact number already registered.";
      }
      return res.status(400).json({ msg });
    }
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const loginFarmer = async (req, res) => {
  const { contact, password } = req.body;
  if (!contact || !password) {
    return res.status(400).json({ msg: "Please provide contact and password" });
  }
  try {
    const user = await User.findOne({ contact, role: "farmer" });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = generateToken(user);
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  registerFarmer,
  getFarmerProfile,
  updateFarmerProfile,
  loginFarmer,
};
