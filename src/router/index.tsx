import { createBrowserRouter } from "react-router-dom";
import Layout from "@/layout";
import Home from "@/pages/home";
import About from "@/pages/about";

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
    ]
  }
]);

export default router;
