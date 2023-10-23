import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';

const getSequelize = () =>
  new Sequelize(`${process.env.MYSQL_BASE}/${process.env.MYSQL_DB}`, {
    logging: false,
  });

export const connectMYSQL = async () => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || '3306',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DB}\`;`,
  );

  const sequelize = getSequelize();

  await sequelize.authenticate();
  console.warn('Connecté à MySQL');
};

export const sequelize = getSequelize();
