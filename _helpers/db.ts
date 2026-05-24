import 'mysql2'; // Force Vercel to bundle mysql2 for Sequelize
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;

initialize();

async function initialize() {
    try {
        const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSL, NODE_ENV } = process.env;
        const host = DB_HOST || 'localhost';
        const port = DB_PORT ? parseInt(DB_PORT) : 3306;
        const user = DB_USER || 'root';
        const password = DB_PASSWORD || '';
        const database = DB_NAME || 'node_mysql_api';

        // SSL configuration (often required for cloud DBs like Aiven/DigitalOcean, but not for XAMPP/Local)
        const sslConfig = NODE_ENV === 'production' ? { 
            ssl: { rejectUnauthorized: false } 
        } : {};
        
        console.log(`Connecting to database: ${database} at ${host}:${port}...`);

        const sequelize = new Sequelize(database, user, password, {
            dialect: 'mysql',
            host,
            port,
            dialectOptions: sslConfig,
            logging: false 
        });


        db.account = accountModel(sequelize);
        db.RefreshToken = refreshTokenModel(sequelize);

     
        db.account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
        db.RefreshToken.belongsTo(db.account);

        await sequelize.sync({ alter: true });
        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}