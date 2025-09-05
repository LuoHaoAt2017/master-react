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

interface IRequest {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete',
  response: any,
}

const mocks: IRequest[] = [
  {
    url: '/api/posts',
    method: 'get',
    response: () => {
      console.log('--------------------------------------');
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
    }
  }
];

export default mocks;