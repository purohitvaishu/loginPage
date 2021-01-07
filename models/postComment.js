module.exports = (sequelize, DataType) => {
  const PostComments = sequelize.define("PostComments", {
    id: {
      type: DataType.UUID,
      AllowNull: false,
      primaryKey: true,
      defaultValue: DataType.UUIDV1
    },
    postId: {
      type: DataType.UUID,
    },
    postUname: {
      type: DataType.STRING,
    },
    comment: {
      type: DataType.STRING,
    },
    totalLikes: {
      type: DataType.BIGINT
    },
    totalUnlikes: {
      type: DataType.BIGINT
    }
  }, {
      classMethods: {
        associate: (models) => {
          PostComments.hasOne(models.Users, {
            as: 'users',
            foreignKey: 'postId',
            foreignKeyConstraint: true,
          });
        },
        associate: (models) => {
          PostComments.hasMany(models.comments, {
            as: 'p_comment',
            foreignKey: 'c_id',
            foreignKeyConstraint: true,
            onDelete: 'cascade',
            hooks: true
          });
        }
      }
    });
  return PostComments;
};