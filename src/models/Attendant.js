module.exports = (sequelize, DataTypes) => {
  const Attendant = sequelize.define('Attendant', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    specialty_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'specialties',
        key: 'id'
      }
    },
    company_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      }
    },
    phone_mobile: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    hiring_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    administrator: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'attendants',
    timestamps: false
  });

  Attendant.associate = function(models) {
    Attendant.belongsTo(models.Company, { 
      foreignKey: 'company_id', 
      as: 'company' 
    });
    Attendant.belongsTo(models.Specialty, { 
      foreignKey: 'specialty_id', 
      as: 'specialty' 
    });
    Attendant.hasMany(models.Schedule, { 
      foreignKey: 'attendant_id', 
      as: 'schedules' 
    });
    Attendant.hasMany(models.Appointment, { 
      foreignKey: 'attendant_id', 
      as: 'appointments' 
    });
  };

  return Attendant;
};