import 'dotenv/config'
import app from './app.js'
import sequelize,{connectedDB} from './db.js'
import './libs/syncDB.js'

connectedDB(sequelize)

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
})