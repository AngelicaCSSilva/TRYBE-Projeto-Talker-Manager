const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');

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
/* A requisição deve retornar status 200 e um array com os dados dos palestrantes. Caso não haja ninguém cadastrado, deve retornar um array vazio e status 200. */
app.get('/talker', async (_req, res) => {
  const talkersFile = await readTalkersFile();
  return res.status(HTTP_OK_STATUS).json(talkersFile);
});

// Endpoint GET /talker/:id
/* A requisição retorna o status 200 e uma pessoa palestrante com base no id da rota. Caso não haja ninguém com esse id, deve retornar o status 404 com a mensagem 'Pessoa palestrante não encontrada'. */
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkersFile = await readTalkersFile();
  const foundSpeaker = talkersFile.find((speaker) => speaker.id === +id);
  if (foundSpeaker) {
    return res.status(HTTP_OK_STATUS).json(foundSpeaker);
  }
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

// Endpoint POST /login
/* O endpoint recebe no corpo da requisição os campos email e password e retornar um token aleatório de 16 caracteres. Foi utilizado o crypto-js para gerar os tokens. */
// Ref.: https://nodejs.org/api/crypto.html#cryptorandombytessize-callback
/* 
- Utilizado toString('hex') para transformar binário em hex
- 16 caractéres em hex -> 8 bytes
*/
const generateRandomToken = () => crypto.randomBytes(8).toString('hex');

app.post('/login', (_req, res) => res.status(200).json({ token: generateRandomToken() }));