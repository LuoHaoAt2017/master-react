import { useRequest } from "ahooks";
import { notification } from "antd";
import { useState } from "react";

/**
 * 统一控制数据获取逻辑
 */
function useDataFetcher(service) {
  const [dataSource, setSource] = useState();
  const { loading, error, runAsync } = useRequest(service, {
    manual: true,
    onSuccess(resp) {
      if (resp.code === "SUCCESS") {
        setSource(resp.data);
      } else {
        notification.error(resp.mesgCode);
      }
    },
    onError(err) {
      notification.error(err.message);
    }
  });
  return {
    data: dataSource,
    loading,
    error,
    runAsync
  }
}

export default useDataFetcher;