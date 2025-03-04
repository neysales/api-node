module.exports = (sequelize, DataTypes) => {
  const Attendant = sequelize.define('Attendant', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: 'Id'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'Name'
    },
    specialtyId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'SpecialtyId',
      references: {
        model: 'Specialties',
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
    mobileNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'MobileNumber'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Email'
    },
    hiringDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'HiringDate'
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'IsAdmin'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'IsActive'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'CreatedAt'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'UpdatedAt'
    }
  }, {
    tableName: 'Attendants',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
  });

  return Attendant;
};