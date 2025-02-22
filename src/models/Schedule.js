const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Schedule = sequelize.define('Schedule', {
  Id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  AttendantId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  DayOfWeek: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  StartTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  EndTime: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'Schedules'
});

module.exports = Schedule;