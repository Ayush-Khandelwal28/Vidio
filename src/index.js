import dotenv from 'dotenv';
import connectDB from './database/index.js';
import app from './app.js';

dotenv.config({
    path: './.env'
});


connectDB().then(() => {
    console.log('Database connected');
    app.listen(process.env.PORT || 9000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}
).catch((err) => {
    console.log(err);
});