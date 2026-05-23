import 'mysql2'; // Force Vercel to bundle mysql2 for Sequelize
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;

initialize();

async function initialize() {
    try {
        const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSL } = process.env;
        const host = DB_HOST || 'localhost';
        const port = DB_PORT ? parseInt(DB_PORT) : 3306;
        const user = DB_USER || 'root';
        const password = DB_PASSWORD || '';
        const database = DB_NAME || 'node_mysql_api';

        // SSL is often not required for local development
        const sslConfig = DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {};

        // Create database if it doesn't already exist
        const connection = await mysql.createConnection({ 
            host, 
            port, 
            user, 
            password,
            ...sslConfig
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();

        // Connect to the database
        const sequelize = new Sequelize(database, user, password, { 
            dialect: 'mysql',
            host,
            port,
            dialectOptions: sslConfig
        });

        // Initialize models and add them to the exported db object
        db.Account = accountModel(sequelize);
        db.RefreshToken = refreshTokenModel(sequelize);

        // Define relationships
        db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
        db.RefreshToken.belongsTo(db.Account);

        // Sync all models with database
        await sequelize.sync({ alter: true });
        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}