'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //belongsTo association to users model
      campaign.belongsTo(models.users, {
        as: 'user',
        foreignKey: {
          name: 'created_by'
        }
      })

      //belongsToMany association to users through user_campaign model
      campaign.belongsToMany(models.users, {
        as: 'users',
        through: {
          model: 'user_campaign',
          as: 'bridge',
        },
        foreignKey: 'campaign_id',
      })
    }
  }
  campaign.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    location_name: DataTypes.STRING,
    location_url: DataTypes.STRING,
    person: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    start_hour: DataTypes.TIME,
    end_hour: DataTypes.TIME,
    target: DataTypes.INTEGER,
    image_url: DataTypes.STRING,
    created_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'campaign',
  });
  return campaign;
};