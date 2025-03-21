const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    attendant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'attendants',
        key: 'id'
      }
    },
    day_of_week: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'schedules',
    timestamps: false
  });

  Schedule.associate = function(models) {
    Schedule.belongsTo(models.Attendant, {
      foreignKey: 'attendant_id',
      as: 'attendant'
    });
  };

  return Schedule;
};