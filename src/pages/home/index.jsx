import React from 'react';
import { Button, Spin, Table } from "antd";
import { getDeviceListByOrg } from "@/services";
import useDataFetcher from "@/hooks/useDataFetcher";
import MousePosProvider from "@/renderProps/MousePosProvider";

const columns = [{
  key: 'deviceName',
  dataIndex: 'deviceName',
  title: 'deviceName'
}, {
  key: 'deviceCode',
  dataIndex: 'deviceCode',
  title: 'deviceCode'
}]

function Home() {
  const { data, loading, error, runAsync } = useDataFetcher(getDeviceListByOrg);
  if (loading) {
    return <Spin />
  }
  if (error) {
    return <div>Error</div>
  }
  return <MousePosProvider render={({ clientX, clientY }) => {
    return <div>
      <Table dataSource={data} columns={columns}></Table>
      <Button onClick={runAsync}>Click</Button>
      <div style={{ position: 'fixed', left: clientX + 32, top: clientY }}>
        ({clientX}, {clientY})
      </div>
    </div>
  }}>
  </MousePosProvider>
}

export default Home;
