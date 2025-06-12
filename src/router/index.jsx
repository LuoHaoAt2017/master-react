import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/layout";
import Home from '@/pages/Home';
import About from '@/pages/About';
import Login from '@/pages/Login';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;