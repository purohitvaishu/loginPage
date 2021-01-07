module.exports = (sequelize, DataType) => {
  const VerificationToken = sequelize.define("VerificationToken", {
    userId: {
      type: DataType.UUID,
      unique: true
    },
    token: {
      type: DataType.STRING,
    },
    cno: {
      type: DataType.BIGINT,
      unique: true
    }
  }, {
      classMethods: {
        associate: (models) => {
          VerificationToken.hasOne(models.Users, {
            as: 'users',
            foreignKey: 'userId',
            foreignKeyConstraint: true,
          });
        }
      }
    });
  return VerificationToken;
};