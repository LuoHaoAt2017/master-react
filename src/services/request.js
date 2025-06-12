import axios from "axios";

const instance = axios.create({
  timeout: 3000, // 请求超时时间
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (resp) => {
    return resp.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
