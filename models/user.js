module.exports = (sequelize, DataType) => {
  const Users = sequelize.define("Users", {
    uid: {
      type: DataType.UUID,
      AllowNull: false,
      primaryKey: true,
      defaultValue: DataType.UUIDV1
    },
    fname: {
      type: DataType.STRING,
    },
    lname: {
      type: DataType.STRING,
    },
    emailId: {
      type: DataType.STRING,
      unique: true,
    },
    uname: {
      type: DataType.STRING,
      unique: true,
    },
    password: {
      type: DataType.STRING,
    },
    contact: {
      type: DataType.BIGINT,
    },
    isVerified: {
      type: DataType.BOOLEAN
    }
  }, {
      classMethods: {
        associate: (models) => {
          Users.hasOne(models.VerificationToken, {
            as: 'verificationtoken',
            foreignKey: 'userId',
            foreignKeyConstraint: true,
          });
        },
        associate: (models) => {
          Users.hasMany(models.Following, {
            as: 'active_user',
            foreignKey: 'follower_Id',
            foreignKeyConstraint: true,
            onDelete: 'cascade',
            hooks: true
          });
        },
        associate: (models) => {
          Users.hasMany(models.PostComments, {
            as: 'comment_user',
            foreignKey: 'postId',
            foreignKeyConstraint: true,
            onDelete: 'cascade',
            hooks: true
          })
        }
      }
    });
  return Users;
};