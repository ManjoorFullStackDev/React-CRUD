import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import { toast } from "react-toastify";
import CityStateSearch from "../CommonComponents/CityStateSearch";
import MultiSelectDropdown from "../CommonComponents/MultiSelectDropdown";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser = (id) => {
  const navigate = useNavigate();
  const params = useParams();
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    gender: "",
    birthDate: "",
    location: "",
    skills: [],
  });
  const [locationData, setLocationData] = useState(user.location);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    setUser((prevUser) => ({ ...prevUser, location: locationData }));
  }, [locationData]);

  const initialUserRef = useRef(null);

  const onChangeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    const initialUserData = {
      firstName: user.firstName,
      gender: user.gender,
      birthDate: user.birthDate,
    };
    console.log("userData:user", initialUserData);
    setIsFormChanged(
      JSON.stringify(initialUserRef.current) !== JSON.stringify(initialUserData)
    );
  };

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      try {
        const response = await api.get("/get-skills", {
          withCredentials: true,
          signal: controller.signal,    
        });
        setSkills(response.data.skillsInfo);
      } catch (error) {
        if (error.response.status === 409) {
          toast.error("Please Login first!", { autoClose: 2000 });
          navigate("/Login");
        }
      }
    }
    fetchData();
  }, [id, navigate  ]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await api.get(`/get-user-by-id/${params.userId}`, {
          withCredentials: true,
        });

        const userData = response.data.userInfo;
        const initialUserData = {
          firstName: userData.firstName,
          gender: userData.gender,
          birthDate: userData.birthDate,
        };

        const formattedSkills = userData.skills.map((skill) => ({
          label: skill,
          value: skill,
        }));
        setUser({ ...userData, skills: formattedSkills });
        initialUserRef.current = initialUserData;
        console.log("userData:fetchUserData", initialUserRef.current);
      } catch (error) {
        console.error("Error:", error); 
      }
    }
    fetchUserData();
  }, [params.userId]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.put("/update-user", user, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      toast.success("User updated successfully!", { autoClose: 3000 });
      navigate("/GetUsers");
    } catch (error) {
      console.error("Error:", error);
      if (error.response.status === 409) {
        toast.error("Please Login first!", { autoClose: 3000 });
        navigate("/Login");
      } else if(error.response.status ===403){
        toast.error("Permission denied", { autoClose: 3000 });
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 mt-10 border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white text-center mb-6">
        Update User
      </h2>
      <form onSubmit={onSubmitHandler} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            First Name:
          </label>
          <input
            name="firstName"
            type="text"
            placeholder="Enter First Name"
            value={user.firstName}
            required
            onChange={onChangeHandler}
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Birth Date:
          </label>
          <input
            name="birthDate"
            type="date"
            value={user.birthDate.split("T")[0]}
            required
            onChange={onChangeHandler}
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Gender:
          </label>
          <select
            name="gender"
            value={user.gender}
            onChange={onChangeHandler}
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Search & Select Location
          </label>
          <div className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none">
            <CityStateSearch
              selectLocation={setLocationData}
              initialLocation={user.location}
              setIsFormChanged={setIsFormChanged}
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Select Skills:
          </label>
          <div className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none">
            <MultiSelectDropdown
              options={skills}
              selectedOptions={user.skills}
              setIsFormChanged={setIsFormChanged}
              onChange={(selectedOptions) => {
                setUser((prevUser) => ({
                  ...prevUser,
                  skills: selectedOptions,
                }));
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded-lg font-semibold transition duration-300 shadow-md 
          ${
            isFormChanged
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-400 text-gray-300 cursor-not-allowed"
          }`}
          disabled={!isFormChanged}
        >
          Update User Data
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
