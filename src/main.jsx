import { StrictMode } from 'react';
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from './router';

ReactDOM.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
  document.getElementById('root')
)