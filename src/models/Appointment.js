module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: 'Id'
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'CustomerId',
      references: {
        model: 'Customers',
        key: 'Id'
      }
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'CompanyId',
      references: {
        model: 'Companies',
        key: 'Id'
      }
    },
    attendantId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'AttendantId',
      references: {
        model: 'Attendants',
        key: 'Id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'AppointmentDate'
    },
    isServiceDone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      field: 'IsServiceDone'
    }
  }, {
    tableName: 'Appointments'
  });

  return Appointment;
};