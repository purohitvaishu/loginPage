module.exports = (sequelize, DataType) => {
  const Comments = sequelize.define("Comments", {
    commentId: {
      type: DataType.UUID,
      AllowNull: false,
      primaryKey: true,
      defaultValue: DataType.UUIDV1
    },
    parent_comment_id: {
      type: DataType.UUID,
      defaultValue: null
    },
    comment: {
      type: DataType.STRING,
    },
    comment_sender_name: {
      type: DataType.STRING,
    },
    c_id: {
      type: DataType.UUID
    }
  }, {
      classMethods: {
        associate: (models) => {
          comments.hasOne(models.PostComments, {
            as: 'p_comment',
            foreignKey: 'c_id',
            foreignKeyConstraint: true,
          });
        },
        associate: (models) => {
          comments.hasOne(models.comments, {
            as: 'comment',
            foreignKey: 'parent_comment_id',
            foreignKeyConstraint: true,
          });
        }
      }
    });
  return Comments;
};