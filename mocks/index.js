import pkg from 'mockjs';
const { Random, mock } = pkg;

Random.extend({
  uuid() {
    return Random.guid();
  },
  title() {
    return Random.csentence(20, 50);
  },
  content() {
    return Random.csentence(100, 300);
  },
});

export default {
  'GET /api/posts': (body) => {
    console.log('request is comming', body);
    return {
      code: 200,
      message: 'success',
      data: mock({
        'list|3': [
          {
            id: '@uuid',
            title: '@title',
            content: '@content',
          },
        ],
      }).list,
    }
  },
};
