import { StrictMode } from 'react';
import ReactDom from 'react-dom';
import { RouterProvider } from "react-router-dom";
import router from './router';

ReactDom.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
  document.getElementById('root')
)