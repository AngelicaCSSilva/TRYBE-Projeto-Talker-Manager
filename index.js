const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// Função para leitura do arquivo talker.json
const readTalkersFile = async () => {
  const rawFile = await fs.readFile('./talker.json', 'utf8');
  return JSON.parse(rawFile);
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

// Endpoint GET /talker
/* A requisição deve retornar tatus 200 e um array com os dados dos palestrantes. Caso não haja ninguém cadastrado, dee retornar um array vazio e status 200. */
app.get('/talker', async (_req, res) => {
  const talkersFile = await readTalkersFile();
  return res.status(200).json(talkersFile);
});
