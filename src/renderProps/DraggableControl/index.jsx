import { useDrag } from "react-dnd";

function DraggableControl({ children, dragType }) {

  const [collectedProps, dragRef] = useDrag(() => ({
    item: dragType,
    collect(monitor) {
      return monitor.can
    }
  }));

  return children({
    dragRef,
    collectedProps
  });
}

export default DraggableControl;