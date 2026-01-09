import { Sequelize } from 'sequelize';


export const sequelize = new Sequelize('storemax', 'storemax', 'storemax123', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false,
});

// Testa conexão ao iniciar
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão MySQL estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MySQL:', error);
  }
})();
