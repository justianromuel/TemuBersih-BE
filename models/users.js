'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //hasMany association to campaign model
      users.hasMany(models.campaign, {
        as: 'campaign',
        foreignKey: {
          name: 'created_by',
        },
      })

      //belongsToMany association to campaign through user_campaign model
      users.belongsToMany(models.campaign, {
        as: 'campaigns',
        through: {
          model: 'user_campaign',
          as: 'bridge',
        },
        foreignKey: 'user_id',
      })
    }
  }
  users.init({
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};