
const createTokenUser = (user) => {
  const tokenUser = { name: user.name, userId: user._id };
  return tokenUser;
}

module.exports = { createTokenUser };