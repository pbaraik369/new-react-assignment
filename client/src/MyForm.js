import React, { useState, useEffect } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./MyForm.css";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";

const MyForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address1: "",
    address2: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(-1);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    fetchCountries();
    fetchUsers();
  }, []);

  const handleMobileChange = (value) => {
    setMobile(value);
    setFormData((prevData) => ({
      ...prevData,
      mobile: value,
    }));
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user");
      console.log(response.data.product);
      setUsers(response.data.product);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/data");
      console.log(response.data);
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (countryId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/data/${countryId}`
      );
      setStates(response.data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "country") {
      setFormData((prevData) => ({
        ...prevData,
        state: "",
      }));
      fetchStates(value);
    }
  };

  // Rest of the code...
  const validateForm = () => {
    const newErrors = {};

    if (formData.firstName.trim() === "") {
      newErrors.firstName = "First Name is required";
    } else if (formData.firstName.trim().length < 5) {
      newErrors.firstName = "First Name should be at least 5 characters long";
    }

    if (formData.lastName.trim() === "") {
      newErrors.lastName = "Last Name is required";
    } else if (formData.lastName.trim().length < 5) {
      newErrors.lastName = "Last Name should be at least 5 characters long";
    }

    if (formData.email.trim() === "") {
      newErrors.email = "Email Id is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email Id is not valid";
    }

    if (formData.mobile.trim() === "") {
      newErrors.mobile = "Mobile No is required";
    } else if (!isValidMobile(formData.mobile)) {
      newErrors.mobile = "Mobile No is not valid";
    }

    if (formData.address1.trim() === "") {
      newErrors.address1 = "Address 1 is required";
    }

    if (formData.country.trim() === "") {
      newErrors.country = "Country is required";
    }

    if (formData.zipCode.trim() === "") {
      newErrors.zipCode = "Zip Code is required";
    } else if (!isValidZipCode(formData.zipCode)) {
      newErrors.zipCode = "Zip Code should be a valid number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const isValidEmail = (email) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidMobile = (mobile) => {
    // Mobile number validation
    // You can replace this with your own validation logic based on country codes
    const mobileRegex = /^\+[1-9]\d{1,14}$|^[0-9]{10,14}$/;
    return mobileRegex.test(mobile);
  };

  const isValidZipCode = (zipCode) => {
    // Zip code validation
    const zipCodeRegex = /^\d+$/;
    return zipCodeRegex.test(zipCode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      //   if (editingIndex === -1) {
      //     const newUser = { ...formData };
      //     setUsers((prevUsers) => [...prevUsers, newUser]);
      //   } else {
      //     setUsers((prevUsers) => {
      //       const updatedUsers = [...prevUsers];
      //       updatedUsers[editingIndex] = formData;
      //       return updatedUsers;
      //     });
      //     setEditingIndex(-1);
      //   }

      let isValid = true;
      const newErrors = {};
      // Mobile validation
      if (!mobile) {
        newErrors.mobile = "Mobile number is required";
        isValid = false;
      } else if (!/^\+[1-9]\d{1,14}$/.test(mobile)) {
        newErrors.mobile = "Invalid mobile number";
        isValid = false;
      }

      try {
        if (editingIndex === -1) {
          // Create new user
          await axios.post("http://localhost:5000/user", formData);
        } else {
          // Update existing user
          await axios.put(
            `http://localhost:5000/user/${users[editingIndex]._id}`,
            formData
          );
        }

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobile: "",
          address1: "",
          address2: "",
          state: "",
          country: "",
          zipCode: "",
        });
        setErrors({});
        setEditingIndex(-1);

        // Fetch the updated user list
        fetchUsers();
      } catch (error) {
        console.error("Error saving data:", error);
      }
      return isValid;
    }
  };

  const handleEdit = (index) => {
    const userToEdit = users[index];
    setFormData(userToEdit);
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`http://localhost:5000/user/${users[index]._id}`);

      // Fetch the updated user list
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers.splice(index, 1);
      return updatedUsers;
    });

    if (editingIndex === index) {
      setEditingIndex(-1);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        address1: "",
        address2: "",
        state: "",
        country: "",
        zipCode: "",
      });
      setErrors({});
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <TextField
          className="inputBox firstname"
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          className="inputBox"
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
        <TextField
          className="inputBox"
          name="email"
          label="Email Id"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        {/* <TextField
          className="inputBox"
          name="mobile"
          label="Mobile No"
          value={formData.mobile}
          onChange={handleChange}
          error={!!errors.mobile}
          helperText={errors.mobile}
        /> */}
        <FormControl error={errors.mobile} fullWidth>
          <PhoneInput
            country={"in"}
            value={formData.mobile}
            onChange={handleMobileChange}
            inputProps={{
              name: "mobile",
              id: "mobile",
              required: true,
              placeholder: "Enter mobile number",
            }}
          />
          {errors.mobile && <FormHelperText>{errors.mobile}</FormHelperText>}
        </FormControl>
        <TextField
          className="inputBox"
          name="address1"
          label="Address 1"
          value={formData.address1}
          onChange={handleChange}
          error={!!errors.address1}
          helperText={errors.address1}
        />
        <TextField
          className="inputBox"
          name="address2"
          label="Address 2"
          value={formData.address2}
          onChange={handleChange}
        />

        {/* Rest of the form fields */}

        <FormControl error={!!errors.country} style={{ minWidth: 120 }}>
          <InputLabel>Country</InputLabel>
          <Select
            className="inputBox"
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <MenuItem value="">Select Country</MenuItem>
            {countries.map((country) => (
              <MenuItem key={country.country_id} value={country.country_id}>
                {country.country_name}
              </MenuItem>
            ))}
          </Select>
          {!!errors.country && (
            <FormHelperText>{errors.country}</FormHelperText>
          )}
        </FormControl>
        <FormControl error={!!errors.state} style={{ minWidth: 120 }}>
          <InputLabel>State</InputLabel>
          <Select
            className="inputBox"
            name="state"
            value={formData.state}
            onChange={handleChange}
          >
            <MenuItem value="">Select State</MenuItem>
            {states.map((state) => (
              <MenuItem key={state.state_id} value={state.state_id}>
                {state.state_name}
              </MenuItem>
            ))}
          </Select>
          {!!errors.state && <FormHelperText>{errors.state}</FormHelperText>}
        </FormControl>
        <TextField
          className="inputBox"
          name="zipCode"
          label="Zip Code"
          value={formData.zipCode}
          onChange={handleChange}
          error={!!errors.zipCode}
          helperText={errors.zipCode}
        />
        <Button type="submit" variant="contained" color="success">
          {editingIndex === -1 ? "Submit" : "Update"}
        </Button>

        {/* Rest of the form fields */}
      </form>
      {/* Rest of the code */}
      <div>
        {users.length > 0 && (
          <div className="list">
            <Typography variant="h4">User List:</Typography>
            <List>
              {users.map((user, index) => (
                <ListItem key={user._id}>
                  <ListItemText
                    className="list_data"
                    primary={`${user.firstName} ${user.lastName}`}
                    secondary={`Email: ${user.email}, Mobile: ${user.mobile}`}
                  />
                  <Button
                    className="btn_edit"
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="btn_del"
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </Button>
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyForm;
