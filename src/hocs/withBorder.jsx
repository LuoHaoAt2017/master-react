import React from "react";

function withBorder(WrappedComponent) {
  return React.forwardRef((props, ref) => <div style={{ border: '1px solid #00FF00' }}>
    <WrappedComponent {...props} ref={ref} />
  </div>);
}

export default withBorder;