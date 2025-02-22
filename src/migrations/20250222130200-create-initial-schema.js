'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Empresas
      await queryInterface.createTable('empresas', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nome: {
          type: Sequelize.STRING,
          allowNull: false
        },
        atividade: {
          type: Sequelize.STRING,
          allowNull: false
        },
        responsavel: {
          type: Sequelize.STRING,
          allowNull: false
        },
        telefone_celular: {
          type: Sequelize.STRING,
          allowNull: false
        },
        chave_api: {
          type: Sequelize.STRING,
          unique: true
        },
        ativa: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
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

      // 2. Clientes
      await queryInterface.createTable('clientes', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nome: {
          type: Sequelize.STRING,
          allowNull: false
        },
        telefone_celular: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING
        },
        data_nascimento: {
          type: Sequelize.DATEONLY
        },
        observacoes: {
          type: Sequelize.TEXT
        },
        empresa_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'empresas',
            key: 'id'
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

      // 3. Especialidades
      await queryInterface.createTable('especialidades', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nome: {
          type: Sequelize.STRING,
          allowNull: false
        },
        descricao: {
          type: Sequelize.TEXT
        },
        empresa_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'empresas',
            key: 'id'
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

      // 4. Atendentes
      await queryInterface.createTable('atendentes', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nome: {
          type: Sequelize.STRING,
          allowNull: false
        },
        telefone_celular: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING
        },
        data_contratacao: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        ativo: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        empresa_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'empresas',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        especialidade_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'especialidades',
            key: 'id'
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

      // 5. Horários
      await queryInterface.createTable('horarios', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        dia_semana: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            min: 0,
            max: 6
          }
        },
        hora_inicio: {
          type: Sequelize.TIME,
          allowNull: false
        },
        hora_fim: {
          type: Sequelize.TIME,
          allowNull: false
        },
        ativo: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        empresa_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'empresas',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        atendente_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'atendentes',
            key: 'id'
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

      // 6. Agendamentos
      await queryInterface.createTable('agendamentos', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        data: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        status: {
          type: Sequelize.ENUM('confirmado', 'cancelado', 'concluido'),
          defaultValue: 'confirmado'
        },
        observacoes: {
          type: Sequelize.TEXT
        },
        empresa_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'empresas',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        cliente_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'clientes',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        atendente_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'atendentes',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        horario_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'horarios',
            key: 'id'
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
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('agendamentos', { transaction });
      await queryInterface.dropTable('horarios', { transaction });
      await queryInterface.dropTable('atendentes', { transaction });
      await queryInterface.dropTable('especialidades', { transaction });
      await queryInterface.dropTable('clientes', { transaction });
      await queryInterface.dropTable('empresas', { transaction });
    });
  }
};
