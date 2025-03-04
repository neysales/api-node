const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: 'Id'
    },
    attendantId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'AttendantId',
      references: {
        model: 'Attendants',
        key: 'Id'
      }
    },
    dayOfWeek: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'DayOfWeek'
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'StartTime'
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'EndTime'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'IsActive'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'CreatedAt'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'UpdatedAt'
    }
  }, {
    tableName: 'Schedules',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
  });

  return Schedule;
};