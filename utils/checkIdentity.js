const checkIdentity = ({ target, userId }) => {
  if (target.user.valueOf() !== userId) {
    throw new CustomError.UnauthorizedError('無此權限');
  };
};

module.exports = { checkIdentity };