const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 5,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 5,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^\+[1-9]\d{1,14}$|^[0-9]{10,14}$/.test(value);
      },
      message: "Invalid Mobile No.",
    },
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    validate: {
      validator: function (value) {
        return /^\d+$/.test(value);
      },
      message: "Invalid Zip Code.",
    },
  },
});

module.exports = mongoose.model("User", userSchema);

// module.exports = User;
