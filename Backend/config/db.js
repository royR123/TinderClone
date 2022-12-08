const mongoose = require('mongoose')

const db_connect = async () => {
    try{
        const conn = await mongoose.connect(process.env.URI)
        console.log(`db is connected at ${conn.connection.host}`)
    }catch(e){
        console.log(e)
    }
}

module.exports = db_connect;