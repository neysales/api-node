const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  Id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  CustomerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  CompanyId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  AttendantId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  AppointmentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  IsServiceDone: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'Appointments'
});

module.exports = Appointment;