require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

let db;

async function startServer()
{
  try
  {
    await client.connect();
    db = client.db(process.env.DB_NAME || 'COP4331Cards');

    app.post('/api/login', async (req, res) =>
    {
      let error = '';

      try
      {
        const { login, password } = req.body;

        const results = await db.collection('Users')
          .find({ Login: login, Password: password })
          .toArray();

        let id = -1;
        let fn = '';
        let ln = '';

        if (results.length > 0)
        {
          id = results[0].UserID;
          fn = results[0].FirstName;
          ln = results[0].LastName;
        }
        else
        {
          error = 'Invalid user name/password';
        }

        const ret = { id: id, firstName: fn, lastName: ln, error: error };
        res.status(200).json(ret);
      }
      catch (e)
      {
        res.status(500).json({
          id: -1,
          firstName: '',
          lastName: '',
          error: e.toString()
        });
      }
    });

    app.post('/api/addcard', async (req, res) =>
    {
      const { userId, card } = req.body;
      let error = '';

      try
      {
        const newCard = {
          Card: card,
          UserId: Number(userId)
        };

        await db.collection('Cards').insertOne(newCard);
      }
      catch (e)
      {
        error = e.toString();
      }

      const ret = { error: error };
      res.status(200).json(ret);
    });

    app.post('/api/searchcards', async (req, res) =>
    {
      let error = '';

      try
      {
        const { userId, search } = req.body;
        const _search = search.trim();

        const results = await db.collection('Cards')
          .find({
            UserId: Number(userId),
            Card: { $regex: _search + '.*', $options: 'i' }
          })
          .toArray();

        const _ret = [];
        for (let i = 0; i < results.length; i++)
        {
          _ret.push(results[i].Card);
        }

        const ret = { results: _ret, error: error };
        res.status(200).json(ret);
      }
      catch (e)
      {
        res.status(500).json({
          results: [],
          error: e.toString()
        });
      }
    });

    app.listen(5001, () =>
    {
      console.log('Server started on port 5001');
    });
  }
  catch (err)
  {
    console.error('Failed to connect to MongoDB:', err);
  }
}

startServer();