// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/leetcode', async (req, res) => {
  try {
    const response = await axios.post('https://leetcode.com/graphql', req.body, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(4000, () => console.log('Proxy server running on port 4000'));
