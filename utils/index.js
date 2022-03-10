const { createJWT, isTokenValid, attachCookieToResponse } = require('./jwt');
const { createTokenUser } = require('./createTokenUser');
const { checkIdentity } = require('./checkIdentity');
module.exports = {
  createJWT,
  isTokenValid,
  attachCookieToResponse,
  createTokenUser,
  checkIdentity,
};