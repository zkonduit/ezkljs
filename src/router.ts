import request from './utils/request';

const URL = 'http://127.0.0.1:5000/graphql';

type Artifact = {
  name: string;
  description: string;
  id: string;
};

async function artifacts() {
  const response = await request<{ artifacts: Artifact[] }>(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          artifacts {
            name
            description
            id
          }
        }
      `,
    }),
  });

  console.log(response);
}

void artifacts();

export default { artifacts };
