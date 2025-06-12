import { useState, useEffect } from "react";

function MousePosProvider({ render }) {

  const [mousePos, setMousePos] = useState({ clientX: -1, clientY: -1 });

  useEffect(() => {
    const handleMouseMove = (evt) => {
      const clientX = evt.clientX;
      const clientY = evt.clientY;
      setMousePos({ clientX, clientY });
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return render({
    clientX: mousePos.clientX,
    clientY: mousePos.clientY,
  });
}

export default MousePosProvider;