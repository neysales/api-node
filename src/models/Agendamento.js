module.exports = (sequelize, DataTypes) => {
  const Agendamento = sequelize.define('Agendamento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('confirmado', 'cancelado', 'concluido'),
      defaultValue: 'confirmado'
    },
    observacoes: {
      type: DataTypes.TEXT
    },
    empresa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'empresas',
        key: 'id'
      }
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      }
    },
    atendente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'atendentes',
        key: 'id'
      }
    },
    horario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'horarios',
        key: 'id'
      }
    }
  }, {
    tableName: 'agendamentos'
  });

  return Agendamento;
};
