const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

exports.handler = async (event) => {
  const { chapter } = event.queryStringParameters;
  try {
    const doc = await client.query(
      q.Get(q.Match(q.Index('reactions_by_chapter'), chapter))
    );
    return {
      statusCode: 200,
      body: JSON.stringify(doc.data),
    };
  } catch {
    return {
      statusCode: 200,
      body: JSON.stringify({
        like: 0,
        love: 0,
        haha: 0,
        sad: 0,
        angry: 0,
      }),
    };
  }
};
