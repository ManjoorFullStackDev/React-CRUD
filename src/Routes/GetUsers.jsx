import React, { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";

const GetUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/get-all-users`, {
          withCredentials: true,
        });
        setUsers(response.data.userInfo);
      } catch (error) {
        console.error("Error:", error);
        if (error.response?.status === 409) {
          toast.error("Please Login first!", { autoClose: 2000 });
          navigate("/Login");
        }
      }
    };
    fetchData();
  }, []);

  const buttonOnclick = async (id) => {
    try {
      const response = await api.delete(`/delete-user/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200)
        toast.success("User deleted successfully!", { autoClose: 3000 });
      const updatedUserd = await api.get("/get-all-users",{
        withCredentials: true,
      });
      setUsers(updatedUserd.data.userInfo);
    } catch (error) {
      console.error("Error:", error);
      if(error.response.status === 409)
        navigate("/Login")
      else if(error.response.status ===403)
       toast.error("Permission denied", { autoClose: 3000 });
    }
  };

  return (
      <div className="max-w-6xl mx-auto p-6 rounded-xl bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl shadow-2xl border border-white/30">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">User List</h2>
          <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
              onClick={() => navigate(`/PostUser`)}
          >
            Create New User
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
              <div
                  key={user.userId}
                  className="bg-white/20 dark:bg-gray-800/10 p-4 rounded-xl shadow-lg flex flex-col items-center"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.firstName}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">Gender: {user.gender}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Birth Date: {user.birthDate.split("T")[0]}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Location: {user.location}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {user.skills.map((skill, index) => (
                      <span
                          key={index}
                          className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-3 py-1 rounded-full text-xs shadow-md"
                      >
                  {skill}
                </span>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                      onClick={() => navigate(`/UpdateUser/${user.userId}`)}
                      className="flex items-center gap-2 text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md shadow-md transition-all"
                  >
                    <MdEdit className="text-lg"/> Edit
                  </button>
                  <button
                      onClick={() => buttonOnclick(user.userId)}
                      className="flex items-center gap-2 text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md shadow-md transition-all"
                  >
                    <MdDelete className="text-lg"/> Delete
                  </button>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default GetUsers;