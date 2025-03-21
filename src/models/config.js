module.exports = (sequelize, DataTypes) => {
    const Config = sequelize.define('Config', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      company_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id'
        }
      },
      logo_url: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      evolution_url: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      evolution_key: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      evolution_instance: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      minio_bucket: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      minio_port: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      minio_access_key: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      minio_secret_key: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      minio_endpoint: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      email_password: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      email_smtp: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      email_port: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      email_text_scheduled: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      email_text_canceled: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      email_text_confirmed: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      email_text_rejected: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ai_provider: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'openai'
      },
      ai_api_key: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ai_model: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'gpt-3.5-turbo'
      },
      registration_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'config',
      timestamps: false
    });
  
    Config.associate = function(models) {
      Config.belongsTo(models.Company, {
        foreignKey: 'company_id',
        as: 'company'
      });
    };
  
    return Config;
  };