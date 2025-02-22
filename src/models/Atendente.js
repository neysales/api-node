module.exports = (sequelize, DataTypes) => {
  const Atendente = sequelize.define('Atendente', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefone_celular: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING
    },
    data_contratacao: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    empresa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'empresas',
        key: 'id'
      }
    },
    especialidade_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'especialidades',
        key: 'id'
      }
    }
  }, {
    tableName: 'atendentes'
  });

  return Atendente;
};
