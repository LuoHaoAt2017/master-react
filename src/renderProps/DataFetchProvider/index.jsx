import { useEffect, useState } from "react";
import { notification } from "antd";

function DataFetchProvider({ config, children }) {
  const { service, params } = config;
  const [source, setSource] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    setLoading(true);
    service(params).then((resp) => {
      if (resp.code === "SUCCESS") {
        setSource(resp.data);
      } else {
        notification.error(resp.mesgCode);
      }
    }).catch((err) => {
      setError(err);
    }).finally(() => {
      setLoading(false);
    });
  }, [service, params]);
  return children({
    data: source,
    error: error,
    loading,
  });
}

export default DataFetchProvider;