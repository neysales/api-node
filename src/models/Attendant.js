module.exports = (sequelize, DataTypes) => {
  const Attendant = sequelize.define('Attendant', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: 'id'
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'nome'
    },
    specialtyId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'especialidade_id',
      references: {
        model: 'especialidades',
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
    mobileNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'telefone_celular'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'email'
    },
    hiringDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'data_contratacao'
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'administrador'
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
    tableName: 'atendentes',
    timestamps: false
  });

  Attendant.associate = function(models) {
    Attendant.belongsTo(models.Company, { foreignKey: 'empresa_id', as: 'empresa' });
    Attendant.belongsTo(models.Specialty, { foreignKey: 'especialidade_id', as: 'especialidade' });
    Attendant.hasMany(models.Schedule, { foreignKey: 'atendente_id', as: 'horarios' });
    Attendant.hasMany(models.Appointment, { foreignKey: 'atendente_id', as: 'agendamentos' });
  };

  return Attendant;
};