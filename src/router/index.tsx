import { createBrowserRouter } from "react-router-dom";
import Layout from "@/layout";
import Home from "@/pages/home";
import About from "@/pages/about";
import Range from "@/pages/selection-highlighting";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/range",
        element: <Range />,
      },
    ]
  }
]);

export default router;
