'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //belongsTo association to users model
      user_campaign.belongsTo(models.users, {
        as: 'user',
        foreignKey: {
          name: 'user_id'
        }
      })

      //belongsTo association to campaign model
      user_campaign.belongsTo(models.campaign, {
        as: 'campaign',
        foreignKey: {
          name: 'campaign_id'
        }
      })
    }
  }
  user_campaign.init({
    campaign_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_campaign',
  });
  return user_campaign;
};