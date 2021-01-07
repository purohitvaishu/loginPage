module.exports = (sequelize, DataType) => {
  const Following = sequelize.define("Following", {
    id: {
      type: DataType.UUID,
      AllowNull: false,
      primaryKey: true,
      defaultValue: DataType.UUIDV1
    },
    follower_Id: {
      type: DataType.UUID,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    followed_Id: {
      type: DataType.UUID,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
  }, {
      freezeTableName: true,
      classMethods: {
        associate: (models) => {
          Following.belongsTo(models.Users,
            {
              as: 'follower',
              foreignKey: 'follower_Id'
            });
          Following.belongsTo(models.Users,
            {
              as: 'followed',
              foreignKey: 'followed_Id'
            });
        }
      }
    });
  return Following;
};