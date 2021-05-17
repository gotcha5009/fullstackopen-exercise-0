require('express-async-errors');
const logger = require('./logger');
const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('../models/User');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  logger.info('error.name:', error.name);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  } else {
    request.token = false;
  }

  next();
};

const userExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    const decodedToken = jwt.verify(token, config.SECRET);
    if (!decodedToken.username || !decodedToken.id) {
      req.user = false;
    } else {
      const user = await User.findById(decodedToken.id);
      if (!user) {
        req.user = false;
      }
      req.user = decodedToken;
    }
  } else {
    req.user = false;
  }

  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
