import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login/Login";
import Profile from "../pages/profile/Profile";
import Home from "../pages/home/Home";
import Register from "../pages/register/Register";
import RootLayout from "../layouts/RootLayout";
import AboutUs from "../pages/about-us/AboutUs";
import Dashboard from "../pages/dashboard/Dashboard";
import SiteMap from "../pages/site-map/SiteMap";
import Meeting from "../pages/meeting/Meeting";

/**
 * Application routes configuration.
 *
 * The `routes` array defines the route tree used by react-router. The root
 * path renders the RootLayout which contains nested routes:
 * - index -> Home
 * - login, register, profile, about-us, dashboard, site-map, meeting
 *
 * Each route object follows react-router's RouteObject shape. This file
 * exports both `routes` and a `router` created with createBrowserRouter.
 *
 * @type {import('react-router').RouteObject[]}
 */

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
            },
            {
                path: "site-map",
                element: <SiteMap />,
            },
            {
                path: "meeting",
                element: <Meeting/>
            }
            
            
        ]
    }
]

/**
 * Browser router instance created from the route configuration.
 *
 * Use this `router` with <RouterProvider router={router} /> in the app entry.
 *
 * @type {import('react-router-dom').Router}
 */

export const router = createBrowserRouter(routes);
