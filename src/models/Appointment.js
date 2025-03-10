module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: 'id'
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'cliente_id',
      references: {
        model: 'clientes',
        key: 'id'
      }
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'empresa_id',
      references: {
        model: 'empresas',
        key: 'id'
      }
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
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'data_agendamento'
    },
    isServiceDone: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'servico_realizado'
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'observacoes'
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'agendado',
      field: 'status'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'data_cadastro'
    }
  }, {
    tableName: 'agendamentos',
    timestamps: false
  });

  Appointment.associate = function(models) {
    Appointment.belongsTo(models.Customer, { foreignKey: 'cliente_id', as: 'cliente' });
    Appointment.belongsTo(models.Company, { foreignKey: 'empresa_id', as: 'empresa' });
    Appointment.belongsTo(models.Attendant, { foreignKey: 'atendente_id', as: 'atendente' });
  };

  return Appointment;
};