import { useRoutes } from "react-router-dom";
import PostUsers from "./PostUsers";
import GetUsers from "./GetUsers";
import About from "./About";
import Home from "./Home";
import UpdateUser from "./UpdateUser";
import Register from "./Register";
import Login from "./Login";

const RouteList = () => {
  return useRoutes([
    { path: "/", element: <Home /> },
    { path: "/GetUsers", element: <GetUsers /> },
    { path: "/About", element: <About /> },
    { path: "/PostUser", element: <PostUsers /> },
    { path: "/UpdateUser/:userId", element: <UpdateUser /> },
    { path: "/Register", element: <Register /> },
    {path: "/Login", element: <Login />}
  ]);
};

export default RouteList;
