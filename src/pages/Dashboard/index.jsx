import React, { useEffect, useRef } from "react";
import { Button, Table, Input } from "antd";
import withLoading from "@/hocs/withLoading";
import withBorder from "@/hocs/withBorder";
import { getDeviceListByOrg } from "@/services";
import useDataFetcher from "@/hooks/useDataFetcher";

const HocTable = withLoading(Table);

const columns = [
  {
    key: 'deviceName',
    dataIndex: 'deviceName',
    title: 'DeviceName'
  },
  {
    key: 'deviceCode',
    dataIndex: 'deviceCode',
    title: 'DeviceCode'
  }
]

const OriginInput = React.forwardRef((props, ref) => <Input ref={ref} {...props} />);

const BorderInput = withBorder(OriginInput);

function Dashboard() {
  const inputRef = useRef();
  const { data, loading, runAsync } = useDataFetcher(getDeviceListByOrg);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    }, 250);
  }, []);

  return <div>
    <HocTable loading={loading} dataSource={data} columns={columns} />
    <Button onClick={runAsync} loading={loading}>Loading</Button>
    <BorderInput ref={inputRef} value={"Hello World"} />
  </div>
}

export default Dashboard;