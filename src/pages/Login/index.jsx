import React, { useCallback } from "react";
import { Spin, Table } from "antd";
import { getDeviceListByOrg } from "@/services";
import DataFetchProvider from "@/renderProps/DataFetchProvider";

const columns = [
  {
    key: 'deviceName',
    dataIndex: 'deviceName',
    title: 'deviceName'
  },
  {
    key: 'deviceCode',
    dataIndex: 'deviceCode',
    title: 'deviceCode'
  }
]

function Login() {
  const config = {
    service: getDeviceListByOrg,
    params: {}
  }

  const Content = useCallback(({ data, loading, error }) => {
    if (loading) {
      return <Spin />
    }
    if (error) {
      return <div>Error</div>
    }
    return <Table dataSource={data} columns={columns} />
  }, []);
  return <DataFetchProvider config={config}>
    {
      ({ data, loading, error }) => <Content data={data} loading={loading} error={error} />
    }
  </DataFetchProvider>
}


export default Login;