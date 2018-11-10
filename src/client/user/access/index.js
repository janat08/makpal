import jwt from './jwt/index';
// import session from './session';

// import Feature from './connector';

const login = client => {
  return client.cache.reset();
};

const logout = client => {
  return client.cache.reset();
};

export default jwt