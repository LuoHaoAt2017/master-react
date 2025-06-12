import React from "react";
import { Spin, Table } from "antd";
import { getDeviceListByOrg } from "@/services";
import withDataFetcher from "@/hocs/withDataFetcher";

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

function About({ data, loading, error }) {
  if (loading) {
    return <Spin />
  }
  if (error) {
    return <div>Error</div>
  }
  return <Table dataSource={data} columns={columns} />
}

const EnhancedComponent = withDataFetcher({
  service: getDeviceListByOrg,
  params: {}
})(About)

export default EnhancedComponent;