import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/login/Login";
import Profile from "../pages/profile/Profile";
import Home from "../pages/home/Home";
import Register from "../pages/register/Register";

export const routes = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/profile",
        element: <Profile />,
    },
    {
        path: "/register",
        element: <Register />,
    }

]

export const router = createBrowserRouter(routes);
