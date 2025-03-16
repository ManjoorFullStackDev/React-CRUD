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
        if(error.response.status === 409)
          navigate("/Login");
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
    <div className="max-w-4xl mx-auto p-6 rounded-xl bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl shadow-2xl border border-white/30 flex flex-col h-[80vh]">
      <div className="flex items-center mb-5 relative ">
        <button
          className="bg-gradient-to-r dark:text-white px-3 py-3 rounded-full text-xs shadow-md border border-black/30"
          onClick={() => navigate(`/PostUser`)}
        >
          Create New User
        </button>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white absolute left-1/2 transform -translate-x-1/2">
          User List
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto rounded-lg relative max-h-[calc(100%-4rem)]">
        <table className="w-full border-collapse backdrop-blur-xl bg-white/10 dark:bg-gray-800/10 shadow-lg rounded-2xl overflow-hidden">
          <thead className="bg-white/20 dark:bg-gray-900/20 sticky top-0 z-20">
            <tr className="text-gray-800 dark:text-gray-200">
              <th className="py-3 px-4 text-left font-medium">Name</th>
              <th className="py-3 px-4 text-left font-medium">Gender</th>
              <th className="py-3 px-4 text-left font-medium">Birth Date</th>
              <th className="py-3 px-4 text-left font-medium">Location</th>
              <th className="py-3 px-4 text-left font-medium">Skills</th>
              <th className="py-3 px-4 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`${
                  index % 2 === 0
                    ? "bg-white/10 dark:bg-gray-800/10"
                    : "bg-white/5 dark:bg-gray-700/5"
                } transition-all hover:scale-[1.01] hover:shadow-lg`}
              >
                <td className="py-3 px-4 text-gray-900 dark:text-gray-200">
                  {user.firstName}
                </td>
                <td className="py-3 px-4 text-gray-900 dark:text-gray-200">
                  {user.gender}
                </td>
                <td className="py-3 px-4 text-gray-900 dark:text-gray-200">
                  {user.birthDate.split("T")[0]}
                </td>
                <td className="py-3 px-4 text-gray-900 dark:text-gray-200">
                  {user.location}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-3 py-1 rounded-full text-xs shadow-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 flex space-x-2">
                  <button
                    onClick={() => navigate(`/UpdateUser/${user.userId}`)}
                    className="bg-green-500/80 hover:bg-green-600 text-white font-semibold py-1.5 px-3 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 inline-flex items-center gap-2"
                  >
                    <MdEdit /> Edit
                  </button>
                  <button
                    onClick={() => buttonOnclick(user.userId)}
                    className="bg-red-500/80 hover:bg-red-600 text-white font-semibold py-1.5 px-3 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 inline-flex items-center gap-2"
                  >
                    <MdDelete /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetUsers;
