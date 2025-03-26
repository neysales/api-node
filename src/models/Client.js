module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    cpf_cnpj: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    phone_mobile: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    address_street: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address_city: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address_state: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address_neighborhood: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address_zip: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address_country: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'Brasil'
    },
    address_complement: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address_number: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'clients',
    timestamps: false
  });

  Client.associate = function(models) {
    Client.belongsToMany(models.Company, {
      through: 'clients_companies',
      foreignKey: 'client_id',
      otherKey: 'company_id',
      as: 'companies'
    });
    
    Client.hasMany(models.Appointment, {
      foreignKey: 'client_id',
      as: 'appointments'
    });
  };

  return Client;
};