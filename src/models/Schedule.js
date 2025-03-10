const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: 'id'
    },
    attendantId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'atendente_id',
      references: {
        model: 'atendentes',
        key: 'id'
      }
    },
    dayOfWeek: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'dia_semana'
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'hora_inicio'
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'hora_fim'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'ativo'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'data_cadastro'
    }
  }, {
    tableName: 'horarios',
    timestamps: false
  });

  Schedule.associate = function(models) {
    Schedule.belongsTo(models.Attendant, { foreignKey: 'atendente_id', as: 'atendente' });
  };

  return Schedule;
};