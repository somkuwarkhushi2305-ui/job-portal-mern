import React from "react";
import Browse from "./components/components_lite/Browse";
import Jobs from "./components/components_lite/Jobs";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./components/components_lite/Home";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import Profile from "./components/components_lite/Profile";

import Companies from "./components/admincomponent/Companies";
import CompanyCreate from "./components/admincomponent/CompanyCreate";
import CompanySetup from "./components/admincomponent/CompanySetup";
import AdminJobs from "./components/admincomponent/AdminJobs";
import PostJob from "./components/admincomponent/PostJob";
import Applicants from "./components/admincomponent/Applicants";
import Description from "./components/components_lite/Description";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },

  {
    path: "/browse",
    element: <Browse />
},


{
  path: "/jobs",
  element: <Jobs />,
},
{
  path: "/description/:id",
  element: <Description />,
},

{
  path: "/admin/companies",
  element: <Companies />,
},
{
  path: "/admin/companies/create",
  element: <CompanyCreate />,
},
{
  path: "/admin/companies/:id",
  element: <CompanySetup />,
},
{
  path: "/admin/jobs",
  element: <AdminJobs />,
},
{
  path: "/admin/jobs/create",
  element: <PostJob />,
},
{
  path: "/admin/jobs/create/:id",
  element: <PostJob />,
},
{
  path: "/admin/jobs/:id/applicants",
  element: <Applicants />,
},

]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;