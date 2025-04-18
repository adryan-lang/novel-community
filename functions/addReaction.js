const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

exports.handler = async (event) => {
  const { chapter, reaction } = JSON.parse(event.body);
  try {
    const ref = q.Select("ref", q.Get(q.Match(q.Index("reactions_by_chapter"), chapter)));
    const updated = await client.query(
      q.Update(ref, {
        data: {
          [reaction]: q.Add(
            q.Select(["data", reaction], q.Get(ref)),
            1
          )
        }
      })
    );
    return { statusCode: 200, body: JSON.stringify(updated.data) };
  } catch {
    const newData = {
      chapter,
      like: 0,
      love: 0,
      haha: 0,
      sad: 0,
      angry: 0,
      [reaction]: 1
    };
    const created = await client.query(
      q.Create(q.Collection("Reactions"), { data: newData })
    );
    return { statusCode: 200, body: JSON.stringify(created.data) };
  }
};
