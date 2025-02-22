'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Companies
      await queryInterface.createTable('Companies', {
        Id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        Name: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        Activity: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        Responsible: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        Address_Street: {
          type: Sequelize.TEXT
        },
        Address_City: {
          type: Sequelize.TEXT
        },
        Address_State: {
          type: Sequelize.TEXT
        },
        Address_PostalCode: {
          type: Sequelize.TEXT
        },
        Address_Country: {
          type: Sequelize.TEXT
        },
        Address_AdditionalInfo: {
          type: Sequelize.TEXT
        },
        Address_Number: {
          type: Sequelize.TEXT
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      }, { transaction });

      // 2. Specialties
      await queryInterface.createTable('Specialties', {
        Id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        Name: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        Description: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        CompanyId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Companies',
            key: 'Id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      }, { transaction });

      // 3. Customers
      await queryInterface.createTable('Customers', {
        Id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        Name: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        MobileNumber: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        Email: {
          type: Sequelize.STRING(255)
        },
        RegistrationDate: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        Password: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        CompanyId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Companies',
            key: 'Id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      }, { transaction });

      // 4. Attendants
      await queryInterface.createTable('Attendants', {
        Id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        Name: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        SpecialtyId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Specialties',
            key: 'Id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        CompanyId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Companies',
            key: 'Id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        MobileNumber: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        Email: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        HiringDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        IsAdmin: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      }, { transaction });

      // 5. Schedules
      await queryInterface.createTable('Schedules', {
        Id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        AttendantId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Attendants',
            key: 'Id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        DayOfWeek: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        StartTime: {
          type: Sequelize.DATE,
          allowNull: false
        },
        EndTime: {
          type: Sequelize.DATE,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      }, { transaction });

      // 6. Appointments
      await queryInterface.createTable('Appointments', {
        Id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        CustomerId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Customers',
            key: 'Id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        CompanyId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Companies',
            key: 'Id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        AttendantId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Attendants',
            key: 'Id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        AppointmentDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        IsServiceDone: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      }, { transaction });

      // Criar índices para melhor performance
      await queryInterface.addIndex('Customers', ['CompanyId'], {
        name: 'idx_customers_company_id',
        transaction
      });

      await queryInterface.addIndex('Attendants', ['CompanyId'], {
        name: 'idx_attendants_company_id',
        transaction
      });

      await queryInterface.addIndex('Attendants', ['SpecialtyId'], {
        name: 'idx_attendants_specialty_id',
        transaction
      });

      await queryInterface.addIndex('Appointments', ['CompanyId'], {
        name: 'idx_appointments_company_id',
        transaction
      });

      await queryInterface.addIndex('Appointments', ['CustomerId'], {
        name: 'idx_appointments_customer_id',
        transaction
      });

      await queryInterface.addIndex('Appointments', ['AttendantId'], {
        name: 'idx_appointments_attendant_id',
        transaction
      });

      await queryInterface.addIndex('Schedules', ['AttendantId'], {
        name: 'idx_schedules_attendant_id',
        transaction
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Remover tabelas na ordem inversa
      await queryInterface.dropTable('Appointments', { transaction });
      await queryInterface.dropTable('Schedules', { transaction });
      await queryInterface.dropTable('Attendants', { transaction });
      await queryInterface.dropTable('Customers', { transaction });
      await queryInterface.dropTable('Specialties', { transaction });
      await queryInterface.dropTable('Companies', { transaction });
    });
  }
};
