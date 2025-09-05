import axios from 'axios';
import { message } from 'antd';

const http = axios.create({
  timeout: 30000
});

http.interceptors.response.use(function(resp) {
  return resp.data as any;
}, function(error) {
  message.error(error);
});

export default http;