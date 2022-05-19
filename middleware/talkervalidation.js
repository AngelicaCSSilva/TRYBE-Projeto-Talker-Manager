const tokenValidation = (req, res, next) => {
  const { authorization } = req.headers;
  
  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });
  if (authorization.length !== 16) return res.status(401).json({ message: 'Token inválido' });

  next();
};

const nameValidation = (req, res, next) => {
  const { name } = req.body;
  
  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' }); 
  }

  next();
};

const ageValidation = (req, res, next) => {
  const { age } = req.body;
  
  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  if (+age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' }); 
  }

  next();
};

const talkValidation = (req, res, next) => {
  const { talk } = req.body;

  if (!talk || !talk.watchedAt || talk.rate === undefined) {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
  });
  }

  next();
};

const dateAndRateValidation = (req, res, next) => {
  const { talk: { watchedAt, rate } } = req.body;
  const validDate = /(0?[1-9]|[12][0-9]|3[01])[/](0?[1-9]|1[012])[/]\d{4}/;

  if (!validDate.test(watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  if (+rate < 1 || +rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

module.exports = {
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  dateAndRateValidation,
};