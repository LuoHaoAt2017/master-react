import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
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

const OriginInput = forwardRef((props, ref) => <Input ref={ref} {...props} />);

const BorderInput = withBorder(OriginInput);

const VideoPlayer = forwardRef((props, ref) => {
  const videoRef = useRef();
  const [playing, setPlaying] = useState(false);

  useImperativeHandle(ref, () => ({
    play() {
      videoRef.current.play();
      setPlaying(true);
    },
    pause() {
      videoRef.current.pause();
      setPlaying(false);
    },
    isPlaying: playing
  }));

  return <div>
    <video ref={videoRef} src={props.src}></video>
  </div>
})

function Dashboard() {
  const inputRef = useRef();
  const playerRef = useRef();
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
    <VideoPlayer ref={playerRef} src="movie.mp4" />
    <Button onClick={() => playerRef.current.play()}>播放</Button>
    <Button onClick={() => playerRef.current.pause()}>暂停</Button>
  </div>
}

export default Dashboard;