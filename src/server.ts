import express from 'express';
import dotenv from 'dotenv'
import bookRoutes from './routes/bookRoutes'; 
import bodyParser from 'body-parser';

const app = express();
dotenv.config()
const PORT = 3001
app.use(bodyParser.json()); // Parse JSON body


app.use('/api', bookRoutes);

app.listen(PORT || 8000, () => {
    console.log(`Server is listening on: ${PORT}`);
})