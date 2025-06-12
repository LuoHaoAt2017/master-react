import React from "react";
import { Outlet } from "react-router-dom";

function App({ children }) {
  return <div>
    <Outlet>
      {children}
    </Outlet>
  </div>
}

export default App;