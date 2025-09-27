const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const Transporter = require("../models/Indivisuals_Trasnporter");
const { generateToken } = require("../config/jwt");

const registerIndivisualTransporter = async (req, res) => {
  let user = null;
  let transporterProfile = null;

  const {
    name,
    contact,
    location,
    password,
    vehicle_number,
    license_number,
    vehicle_type,
    capacity_tons,
    available,
  } = req.body;

  try {
    if (
      !name ||
      !contact ||
      !location ||
      !password ||
      !vehicle_number ||
      !license_number ||
      !vehicle_type ||
      !capacity_tons
    ) {
      return res.status(400).json({ msg: "Missing required fields." });
    }

    //validations
    if (name.length < 2 || name.length > 50) {
      return res
        .status(400)
        .json({ msg: "Name must be between 2 and 50 characters." });
    }
    if (!/^\d{10}$/.test(contact)) {
      return res
        .status(400)
        .json({ msg: "Contact number must contain only digits." });
    }
    if (!/^[a-zA-Z0-9\s-]{6,15}$/.test(vehicle_number)) {
      return res.status(400).json({
        msg: "Vehicle number is invalid. Use letters, numbers, spaces, or hyphens only (6-15 characters).",
      });
    }
    if (!/^[a-zA-Z0-9\s]{8,20}$/.test(license_number)) {
      return res.status(400).json({
        msg: "License number is invalid. Use letters, numbers, or spaces only (8-20 characters).",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({
        msg: "Password is required and must be at least 6 characters.",
      });
    }
    if (capacity_tons <= 0) {
      return res
        .status(400)
        .json({ msg: "Capacity must be a positive number." });
    }

    // Pre-check for existing user
    let existingUser = await User.findOne({ contact });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "Contact number already registered." });
    }
    let existingVehicle = await Transporter.findOne({ vehicle_number });
    if (existingVehicle) {
      return res
        .status(400)
        .json({ msg: "Vehicle number already registered." });
    }
    let existingLicense = await Transporter.findOne({ license_number });
    if (existingLicense) {
      return res
        .status(400)
        .json({ msg: "License number already registered." });
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
      role: "indivisual_transporter",
    });

    transporterProfile = await Transporter.create({
      user_id: user._id,
      vehicle_number,
      license_number,
      vehicle_type,
      capacity_tons,
      available: available !== undefined ? available : true,
    });

    const token = generateToken(user);
    return res.status(201).json({
      msg: "Transporter registered successfully.",
      token,
    });
  } catch (err) {
    if (user) {
      await User.findByIdAndDelete(user._id);
      console.log("Deleted user due to error during transporter registration.");
    }
    if (transporterProfile && transporterProfile._id) {
      await Transporter.findByIdAndDelete(transporterProfile._id);
      console.log(
        "Deleted transporter profile due to error during registration."
      );
    }
    console.error(err);
    return res.status(500).json({ msg: "Server error." });
  }
};

const loginIndivisualTransporter = async (req, res) => {
  try {
    const { contact, password } = req.body;
    if (!contact || !password) {
      return res.status(400).json({ msg: "Missing contact or password." });
    }

    const user = await User.findOne({
      contact,
      role: "indivisual_transporter",
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

const getIndivisualTransporterProfile = async (req, res) => {
  try {
    let userId = req.userId;
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }
    const user = await User.findById({ _id: userId });
    const transporter = await Transporter.findOne({
      user_id: userId,
    });
    if (!user || !transporter) {
      return res.status(404).json({ msg: "Transporter profile not found" });
    }
    res.json({
      name: user.name,
      contact: user.contact,
      location: user.location,
      vehicle_number: transporter.vehicle_number,
      license_number: transporter.license_number,
      vehicle_type: transporter.vehicle_type,
      capacity_tons: transporter.capacity_tons,
      available: transporter.available,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error while fetching profile.");
  }
};

const updateIndivisualTransporterProfile = async (req, res) => {
  let originalUser = null;
  let originalTransporter = null;
  let userId = req.userId;
  try {
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const {
      name,
      contact,
      location,
      vehicle_number,
      license_number,
      vehicle_type,
      capacity_tons,
      available,
    } = req.body;

    // Update fields if provided

    const userUpdate = {};
    const transporterUpdate = {};

    if (name) userUpdate.name = name;
    if (contact) {
      if (!/^\d{10}$/.test(contact)) {
        return res
          .status(400)
          .json({ msg: "Contact number must contain only digits." });
      }
      if (contact.length !== 10) {
        return res
          .status(400)
          .json({ msg: "Contact number must be 10 digits." });
      }
      let contactCheck = await User.findOne({ contact });
      if (contactCheck && contactCheck._id.toString() !== userId) {
        return res
          .status(400)
          .json({ msg: "Contact number already registered by another user." });
      }
      userUpdate.contact = contact;
    }
    if (location) userUpdate.location = location;

    if (vehicle_number) {
      let vechileCheck = await Transporter.findOne({ vehicle_type });
      if (vechileCheck && vechileCheck.user_id.toString() !== userId) {
        return res
          .status(400)
          .json({ msg: "Vehicle number already registered by another user." });
      }
      transporterUpdate.vehicle_number = vehicle_number;
    }
    if (license_number) {
      let licenseCheck = await Transporter.findOne({ license_number });
      if (licenseCheck && licenseCheck.user_id.toString() !== userId) {
        return res
          .status(400)
          .json({ msg: "License number already registered by another user." });
      }
      transporterUpdate.license_number = license_number;
    }
    if (vehicle_type) {
      transporterUpdate.vehicle_type = vehicle_type;
    }
    if (capacity_tons) {
      if (capacity_tons <= 0) {
        return res
          .status(400)
          .json({ msg: "Capacity must be a positive number." });
      }
      transporterUpdate.capacity_tons = capacity_tons;
    }
    if (available !== undefined) transporterUpdate.available = available;

    // already created user and indivisual transporter
    originalUser = await User.findById({
      _id: userId,
      role: "indivisual_transporter",
    });
    originalTransporter = await Transporter.findOne({
      user_id: userId,
    });

    if (!originalUser || !originalTransporter) {
      return res.status(404).json({ msg: "Transporter profile not found" });
    }

    // update User and indivisual transporter fields
    const user = await User.findByIdAndUpdate(userId, userUpdate, {
      new: true,
      runValidators: true,
    });

    const transporter = await Transporter.findOneAndUpdate(
      { user_id: userId },
      transporterUpdate,
      { new: true, runValidators: true }
    );

    if (!user || !transporter) {
      // rollback
      throw new Error("Update operation failed or profile became missing.");
    }

    res.json({ msg: "Transporter profile updated successfully." });
  } catch (err) {
    // rollback in case of error
    if (originalUser && userId) {
      await User.findByIdAndUpdate(userId, originalUser, {
        new: false,
        runValidators: true,
      });
    }
    if (originalTransporter && userId) {
      await Transporter.findOneAndUpdate(
        { user_id: userId },
        originalTransporter,
        { new: false, runValidators: true }
      );
    }
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      let msg = `The provided value is already in use.`;

      if (field === "contact") msg = "Contact number already registered.";
      if (field === "vehicle_number")
        msg = "Vehicle number already registered.";

      return res.status(400).json({ msg });
    }
    console.error(err.message);
    res.status(500).send("Server Error while updating profile.");
  }
};

module.exports = {
  registerIndivisualTransporter,
  loginIndivisualTransporter,
  getIndivisualTransporterProfile,
  updateIndivisualTransporterProfile,
};
