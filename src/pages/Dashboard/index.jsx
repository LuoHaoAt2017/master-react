import { Button, Table } from "antd";
import withLoading from "@/hocs/withLoading";
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

function Dashboard() {
  const { data, loading, runAsync } = useDataFetcher(getDeviceListByOrg);
  return <div>
    <HocTable loading={loading} dataSource={data} columns={columns} />
    <Button onClick={runAsync} loading={loading}>Loading</Button>
  </div>
}

export default Dashboard;