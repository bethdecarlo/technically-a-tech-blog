const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

//User attributes
Comment.init(
  {
//numbered post id for database
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
//comment will be stored as a string
    comment_text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len:[1]
        }
    },
//links comment to user id
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
            }
    },
//links comment to post id
    post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: 'post',
        key: 'id'
        }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment'
  }
);

module.exports = Comment;