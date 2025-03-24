import React, { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdDelete, MdMoreVert } from "react-icons/md";

const GetUsers = () => {
  const [users, setUsers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
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

  useEffect(() => {

    const handleMenuOpen = (event) => {
      if(!event.target.closest(".menu-container")) {
        setMenuOpen(null);
      }
    }
    document.addEventListener("click", handleMenuOpen)
    return () => document.removeEventListener("click", handleMenuOpen);
  }, [])

  const deleteUser = async (id) => {
    try {
      const response = await api.delete(`/delete-user/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200)
        toast.success("User deleted successfully!", { autoClose: 3000 });
      const updatedUsers = await api.get("/get-all-users", {
        withCredentials: true,
      });
      setUsers(updatedUsers.data.userInfo);
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 409) navigate("/Login");
      else if (error.response?.status === 403)
        toast.error("Permission denied", { autoClose: 3000 });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 rounded-xl bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl shadow-3xl border border-white/30">
      <div className="relative flex items-center justify-center mb-10 ">
        <h2 className="py-3 px-3 bg-gradient-to-r bg-clip-text text-transparent from-orange-500 to-red-700 text-4xl font-extrabold ">
          User List
        </h2>
        <button
          className="px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 absolute left-0 bg-gradient-to-r bg-clip-text text-transparent from-pink-300 to-violet-600 text-1xl font-extrabold"
          onClick={() => navigate(`/PostUser`)}
        >
          Create New User
        </button>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-7 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.userId}
            className="bg-white/30 dark:bg-gray-800/10 p-4 rounded-xl shadow-lg flex flex-col items-center relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 menu-container"
              onClick={() =>
                setMenuOpen(menuOpen === user.userId ? null : user.userId)
              }
            >
              <MdMoreVert size={24} />
            </button>

            {menuOpen === user.userId && (
              <div className="absolute top-10 right-2 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-2">
                <button
                  className="flex items-center gap-2 text-sm text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded-md w-full"
                  onClick={() => navigate(`/UpdateUser/${user.userId}`)}
                >
                  <MdEdit className="text-lg" /> Edit
                </button>
                <button
                  className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-600 px-3 py-1 rounded-md w-full"
                  onClick={() => deleteUser(user.userId)}
                >
                  <MdDelete className="text-lg" /> Delete
                </button>
              </div>
            )}

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.firstName}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Gender: {user.gender}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Birth Date: {user.birthDate.split("T")[0]}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Location: {user.location}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-sky-500 to-purple-400 text-white px-3 py-1 rounded-full text-xs shadow-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetUsers;
