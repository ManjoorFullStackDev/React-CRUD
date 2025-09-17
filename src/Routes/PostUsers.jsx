import React, { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";
import CityStateSearch from "../CommonComponents/CityStateSearch";
import MultiSelectDropdown from "../CommonComponents/MultiSelectDropdown";
import { useNavigate } from "react-router-dom";

const PostUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    gender: "",
    birthDate: "",
    location: "",
    skills: [],
  });
  const [locationData, setLocationData] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    setUser((prevUser) => ({ ...prevUser, location: locationData }));
  }, [locationData]);
console.log('locationData',locationData);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/get-skills", { withCredentials: true });
        setSkills(response.data.skillsInfo);
      } catch (error) {
        toast.error("Please Login first!", { autoClose: 2000 });
        if (error.response?.status === 409) navigate("/Login");
      }
    }
    fetchData();
  }, []);

  const onChangeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post("/post-user", user, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      toast.success("User added successfully!", { autoClose: 3000 });

      setUser({
        firstName: "",
        gender: "",
        birthDate: "",
        location: "",
        skills: [],
      });
      setLocationData(null);
      navigate("/GetUsers");
    } catch (error) {
      toast.error("Failed to add user. Try again!", { autoClose: 3000 });
      if (error.response?.status === 409) {
        toast.error("Please Login first!", { autoClose: 2000 });
        navigate("/Login");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f5f5f1] p-6">
      <div className="w-full max-w-lg bg-[#fcfcfb] shadow-lg rounded-xl p-6 border border-[#e0e0dc]">
        <h2 className="text-2xl font-semibold text-[#6b705c] text-center mb-5">
          Add New User
        </h2>
        <form onSubmit={onSubmitHandler} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-[#6b705c] font-medium mb-1" >First Name:</label>
            <input
              name="firstName"
              type="text"
              minLength="3"
              maxLength="40"
              autoFocus={true}
              placeholder="Enter First Name"
              value={user.firstName}
              required
              onChange={onChangeHandler}
              className="w-full px-4 py-2 border rounded-lg bg-[#edf1e1] text-gray-900 border-[#d0d4c0] focus:ring-2 focus:ring-[#b5c99a] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#6b705c] font-medium mb-1">Birth Date:</label>
            <input
              name="birthDate"
              type="date"
              value={user.birthDate}
              required
              onChange={onChangeHandler}
              className="w-full px-4 py-2 border rounded-lg bg-[#edf1e1] text-gray-900 border-[#d0d4c0] focus:ring-2 focus:ring-[#b5c99a] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#6b705c] font-medium mb-1">Gender:</label>
            <select
              name="gender"
              value={user.gender}
              onChange={onChangeHandler}
              className="w-full px-4 py-2 border rounded-lg bg-[#edf1e1] text-gray-900 border-[#d0d4c0] focus:ring-2 focus:ring-[#b5c99a] focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-[#6b705c] font-medium mb-1">Search & Select Location</label>
            <div className="w-full px-4 py-2 border rounded-lg bg-[#edf1e1] text-gray-900 border-[#d0d4c0]">
              <CityStateSearch selectLocation={setLocationData} initialLocation={user.location} />
            </div>
          </div>

          <div>
            <label className="block text-[#6b705c] font-medium mb-1">Select Skills:</label>
            <div className="w-full px-4 py-2 border rounded-lg bg-[#edf1e1] text-gray-900 border-[#d0d4c0]">
              <MultiSelectDropdown
                options={skills}
                selectedOptions={user.skills}
                onChange={(selectedOptions) => setUser((prevUser) => ({ ...prevUser, skills: selectedOptions }))}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#b5c99a] hover:bg-[#a3b68f] text-white font-semibold py-2 rounded-lg transition duration-300 shadow-md"
          >
            Submit User Data
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostUser;
