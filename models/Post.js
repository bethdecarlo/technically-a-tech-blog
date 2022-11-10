const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');


class Post extends Model {}


Post.init(
    {
    //gives each post a unique id
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
    // the title is a string
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len:[1]
      }
      },
    // the text is a string
      post_text: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len:[1]
      }
      },
    // links post to the user id
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'post'
    }
  );

  module.exports = Post;