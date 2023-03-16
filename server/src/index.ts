import express from 'express';
import fs from 'fs';
import cors from 'cors';
import Papa from 'papaparse';

const app = express()
const PORT = 3000

app.use(cors());
app.use(express.json());
app.get('/influencers', (req, res) => {
  const results = fs.readFileSync('./instagram_influencers.csv', 'utf8');
  const influencerData = Papa.parse(results, { header: true }).data;
  res.json(influencerData);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`))