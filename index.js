const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');
const validationLogin = require('./middleware/loginvalidation');
const { tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  dateAndRateValidation } = require('./middleware/talkervalidation');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// Função para leitura do arquivo talker.json
const readTalkersFile = async () => {
  const rawFile = await fs.readFile('./talker.json', 'utf8');
  return JSON.parse(rawFile);
};

// Função para escrever no arquivo talker.json
const writeOnFile = async (rawContent) => {
 await fs.writeFile('./talker.json', JSON.stringify(rawContent, null, 2), 'utf8');
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

app.get('/talker/search', tokenValidation, async (req, res) => {
  const { q } = req.query;
  const talkersFile = await readTalkersFile();

  const result = talkersFile.filter(({ name }) => name.includes(q));
  res.status(HTTP_OK_STATUS).json(result);
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
- Incrementado com middleware de validação
*/
const generateRandomToken = () => crypto.randomBytes(8).toString('hex');

app.post('/login', validationLogin, (_req, res) => 
  res.status(200).json({ token: generateRandomToken() }));

// Endpoint POST /talker
/* O endpoint é capaz de adicionar uma nova pessoa palestrante ao arquivo talker.json */
app.post('/talker',
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  dateAndRateValidation,
  async (req, res) => {
    const { name, age, talk: { rate, watchedAt } } = req.body;
    const talkersFile = await readTalkersFile();

    const objNewTalker = {
      id: (talkersFile[talkersFile.length - 1].id) + 1,
      name,
      age,
      talk: {
        watchedAt,
        rate,
      },
    };

    await writeOnFile([...talkersFile, objNewTalker]);

    return res.status(201).json(objNewTalker);
});

// Endpoint PUT /talker/:id
/* O endpoint é capaz de editar uma pessoa palestrante com base no id da rota, sem alterar o id registrado. */
app.put('/talker/:id',
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  dateAndRateValidation,
  async (req, res) => {
    const { id } = req.params;
    const { name, age, talk: { rate, watchedAt } } = req.body;
    const talkersFile = await readTalkersFile();

    const indexOfId = talkersFile.findIndex((speaker) => speaker.id === +id);
    talkersFile[indexOfId] = {
      id: +id,
      name,
      age,
      talk: {
        watchedAt,
        rate,
      },
    };
    await writeOnFile(talkersFile);

    return res.status(200).json(talkersFile[indexOfId]);
});

// Endpoint DELETE /talker/:id
/* O endpoint deleta uma pessoa palestrante com base no id da rota. Retorna o status 204, sem conteúdo na resposta. */
// Delete x Splice : https://stackoverflow.com/questions/500606/deleting-array-elements-in-javascript-delete-vs-splice
app.delete('/talker/:id',
  tokenValidation,
  async (req, res) => {
    const { id } = req.params;
    const talkersFile = await readTalkersFile();

    const indexOfId = talkersFile.findIndex((speaker) => speaker.id === +id);
    talkersFile.splice(indexOfId, 1);
    await writeOnFile(talkersFile);

    return res.status(204).end();
});
