import React, { useState, useEffect } from "react";
import { Country, State } from "country-state-city";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";

const FormPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStates, setSelectedStates] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    // Fetch list of users
    axios
      .get("http://localhost:5000/user")
      .then((response) => {
        setUsers(response.data.product);
        console.log(response.data.product);
      })
      .catch((error) => {
        console.error("Error retrieving users:", error);
      });
  }, []);

  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedStates(State.getStatesOfCountry(country));
  };

  const onSubmit = (data) => {
    if (selectedUserId) {
      // Update user
      axios
        .put(`http://localhost:5000/user/${selectedUserId}`, data)
        .then(() => {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === selectedUserId
                ? { _id: selectedUserId, ...data }
                : user
            )
          );
          setSelectedUserId(null);
          clearForm();
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
    } else {
      // Create user
      axios
        .post("http://localhost:5000/user", data)
        .then((response) => {
          setUsers((prevUsers) => [...prevUsers, response.data]);
          clearForm();
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        });
    }
  };

  const deleteUser = (userId) => {
    axios
      .delete(`http://localhost:5000/user/${userId}`)
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const editUser = (user) => {
    console.log(user.mobile);
    setSelectedUserId(user._id);
    setValue("firstName", user.firstName);
    setValue("lastName", user.lastName);
    setValue("email", user.email);
    setValue("mobile", user.mobile);
    setValue("address1", user.address1);
    setValue("address2", user.address2);
    setValue("country", user.country);
    setValue("state", user.state);
    setValue("zipCode", user.zipCode);
  };

  const clearForm = () => {
    setValue("firstName", "");
    setValue("lastName", "");
    setValue("email", "");
    setValue("mobile", "");
    setValue("address1", "");
    setValue("address2", "");
    setValue("country", "");
    setValue("state", "");
    setValue("zipCode", "");
  };

  return (
    <div className="container mx-auto">
      <p className="mx-6 py-4 bg-blue-600 flex justify-center text-xl font-semibold text-white">
        Form
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="firstName" className="block mb-1">
            First Name:
          </label>
          <input
            type="text"
            id="firstName"
            {...register("firstName", { required: true, minLength: 5 })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.firstName && (
            <p className="text-red-500">
              First Name is required and must be at least 5 characters long.
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block mb-1">
            Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            {...register("lastName", { required: true, minLength: 5 })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.lastName && (
            <p className="text-red-500">
              Last Name is required and must be at least 5 characters long.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">
            Email Id:
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.email && <p className="text-red-500">Invalid Email Id.</p>}
        </div>

        {/* <div className="mb-4">
          <label htmlFor="mobile" className="block mb-1 font-bold">
            Mobile:
          </label>
          <PhoneInput
            country="in"
            type="tel"
            name="mobile"
            value={phoneNumber}
            onChange={setPhoneNumber}
            inputProps={{
              id: "mobile",
              ...register("mobile", {
                required: true,
                pattern: /^\+[1-9]\d{1,14}$|^[0-9]{10,14}$/,
              }),
              className: "w-full px-4 py-2 rounded border border-gray-300",
            }}
          />
          {errors.mobile && (
            <p className="text-red-500">Please enter a valid mobile number.</p>
          )}
        </div> */}

        <div className="mb-4">
          <label htmlFor="mobile" className="block mb-1">
            Mobile No:
          </label>
          <input
            type="tel"
            id="mobile"
            {...register("mobile", {
              required: true,
              pattern: /^\d{10}$/,
            })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.mobile && <p className="text-red-500">Invalid Mobile No.</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="address1" className="block mb-1">
            Address 1:
          </label>
          <input
            type="text"
            id="address1"
            {...register("address1", { required: true })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.address1 && (
            <p className="text-red-500">Address 1 is required.</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="address2" className="block mb-1">
            Address 2:
          </label>
          <input
            type="text"
            id="address2"
            {...register("address2")}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="country" className="block mb-1">
            Country:
          </label>
          <select
            id="country"
            {...register("country", { required: true })}
            onChange={handleCountryChange}
            value={selectedCountry}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Country</option>
            {Country.getAllCountries().map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-red-500">Country is required.</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="state" className="block mb-1">
            State:
          </label>
          <select
            id="state"
            {...register("state", { required: true })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select State</option>
            {selectedStates.map((state) => (
              <option key={state.isoCode} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state && <p className="text-red-500">State is required.</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="zipCode" className="block mb-1">
            Zip Code:
          </label>
          <input
            type="number"
            id="zipCode"
            {...register("zipCode", { required: true })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.zipCode && <p className="text-red-500">Invalid Zip Code.</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          {selectedUserId ? "Update User" : "Create User"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl mb-4">List of Users</h2>
        {users.length > 0 ? (
          <ul className="grid grid-cols-6 gap-6">
            <li className="text-center font-semibold bg-stone-800 text-white">
              First Name
            </li>
            <li className="text-center font-semibold bg-stone-800 text-white">
              Last Name
            </li>
            <li className="text-center font-semibold bg-stone-800 text-white">
              Email
            </li>
            <li className="text-center font-semibold bg-stone-800 text-white">
              Country
            </li>
            <li className="text-center font-semibold bg-stone-800 text-white">
              State
            </li>
            <li className="text-center font-semibold bg-stone-800 text-white">
              Actions
            </li>
            {users.map((user) => (
              <React.Fragment key={user._id}>
                <li className="text-center">{user.firstName}</li>
                <li className="text-center">{user.lastName}</li>
                <li className="text-center">{user.email}</li>
                <li className="text-center">{user.country}</li>
                <li className="text-center">{user.state}</li>
                <li className="text-center">
                  <button
                    type="button"
                    className="bg-blue-500 text-white py-1 px-2 rounded ml-2"
                    onClick={() => editUser(user)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 text-white py-1 px-2 rounded ml-2"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </li>
              </React.Fragment>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default FormPage;
