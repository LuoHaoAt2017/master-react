import { ConfigProvider, theme } from "antd";
import { Outlet } from "react-router-dom";

export default function Layout() {

  return (
    <ConfigProvider
      componentSize="large"
      theme={{
        algorithm: theme.compactAlgorithm,
        token: {
          borderRadius: 2,
        },
      }}
    >
      <Outlet />
    </ConfigProvider>
  );
}
