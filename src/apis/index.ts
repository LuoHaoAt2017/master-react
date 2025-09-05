import http from './request';

export const getPosts = () => {
  return http.get(`/api/posts`);
};