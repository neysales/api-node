module.exports = (sequelize, DataTypes) => {
  const Especialidade = sequelize.define('Especialidade', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT
    },
    empresa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'empresas',
        key: 'id'
      }
    }
  }, {
    tableName: 'especialidades'
  });

  return Especialidade;
};
