const sequelize = require('../config/sequelize');
const { DataTypes } = require('sequelize');

// Importar modelos
const Empresa = require('./Empresa')(sequelize, DataTypes);
const Cliente = require('./Cliente')(sequelize, DataTypes);
const Atendente = require('./Atendente')(sequelize, DataTypes);
const Especialidade = require('./Especialidade')(sequelize, DataTypes);
const Horario = require('./Horario')(sequelize, DataTypes);
const Agendamento = require('./Agendamento')(sequelize, DataTypes);

// Definir relacionamentos
Empresa.hasMany(Cliente, { foreignKey: 'empresa_id' });
Cliente.belongsTo(Empresa, { foreignKey: 'empresa_id' });

Empresa.hasMany(Atendente, { foreignKey: 'empresa_id' });
Atendente.belongsTo(Empresa, { foreignKey: 'empresa_id' });

Empresa.hasMany(Especialidade, { foreignKey: 'empresa_id' });
Especialidade.belongsTo(Empresa, { foreignKey: 'empresa_id' });

Atendente.belongsTo(Especialidade, { foreignKey: 'especialidade_id' });
Especialidade.hasMany(Atendente, { foreignKey: 'especialidade_id' });

Empresa.hasMany(Horario, { foreignKey: 'empresa_id' });
Horario.belongsTo(Empresa, { foreignKey: 'empresa_id' });

Atendente.hasMany(Horario, { foreignKey: 'atendente_id' });
Horario.belongsTo(Atendente, { foreignKey: 'atendente_id' });

Empresa.hasMany(Agendamento, { foreignKey: 'empresa_id' });
Agendamento.belongsTo(Empresa, { foreignKey: 'empresa_id' });

Cliente.hasMany(Agendamento, { foreignKey: 'cliente_id' });
Agendamento.belongsTo(Cliente, { foreignKey: 'cliente_id' });

Atendente.hasMany(Agendamento, { foreignKey: 'atendente_id' });
Agendamento.belongsTo(Atendente, { foreignKey: 'atendente_id' });

Horario.hasMany(Agendamento, { foreignKey: 'horario_id' });
Agendamento.belongsTo(Horario, { foreignKey: 'horario_id' });

module.exports = {
  sequelize,
  Empresa,
  Cliente,
  Atendente,
  Especialidade,
  Horario,
  Agendamento
};
