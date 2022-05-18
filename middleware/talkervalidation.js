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

module.exports = {
  tokenValidation,
  nameValidation,
};