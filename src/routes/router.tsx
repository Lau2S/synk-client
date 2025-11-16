import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login/Login";
import Profile from "../pages/profile/Profile";
import Home from "../pages/home/Home";
import Register from "../pages/register/Register";
import RootLayout from "../layouts/RootLayout";
import AboutUs from "../pages/about-us/AboutUs";
import Dashboard from "../pages/dashboard/Dashboard";


export const routes = [
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "about-us",
                element: <AboutUs />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "profile",
                element: <Profile />,
            }
            
        ]
    }
]

export const router = createBrowserRouter(routes);
