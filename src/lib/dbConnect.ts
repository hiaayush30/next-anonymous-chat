// compared to pure backends next is a edge time framework ie  it is executed as the user comes 
// and does not run contineously like pure backends do so check first if the db connection 
// is already present and then proceed

import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        return console.log("db already connected")
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "")
        connection.isConnected = db.connections[0].readyState;
        console.log('db connected successfully')
    } catch (error) {
        console.log("db connection failed:" + error);
        process.exit(1)
    }
}

export default dbConnect;