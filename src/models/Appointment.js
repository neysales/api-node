module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'clients',
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
    attendant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'attendants',
        key: 'id'
      }
    },
    appointment_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    service_performed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'scheduled'
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'appointments',
    timestamps: false
  });

  Appointment.associate = function(models) {
    Appointment.belongsTo(models.Client, { 
      foreignKey: 'client_id', 
      as: 'client' 
    });
    Appointment.belongsTo(models.Company, { 
      foreignKey: 'company_id', 
      as: 'company' 
    });
    Appointment.belongsTo(models.Attendant, { 
      foreignKey: 'attendant_id', 
      as: 'attendant' 
    });
  };

  return Appointment;
};