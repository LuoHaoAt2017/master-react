import React from 'react';
import { Button, Spin, Table } from "antd";
import { getDeviceListByOrg } from "@/services";
import useDataFetcher from "@/hooks/useDataFetcher";

const columns = [{
  key: 'deviceName',
  dataIndex: 'deviceName',
  title: 'deviceName'
}, {
  key: 'deviceCode',
  dataIndex: 'deviceCode',
  title: 'deviceCode'
}]

function App() {
  const { data, loading, error, runAsync } = useDataFetcher(getDeviceListByOrg);
  if (loading) {
    return <Spin />
  }
  if (error) {
    return <div>Error</div>
  }
  return <>
    <Table dataSource={data} columns={columns}></Table>
    <Button onClick={runAsync}>Click</Button>
  </>
}

export default App;
