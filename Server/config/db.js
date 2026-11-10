import mongoose from 'mongoose'

let cached = globalThis.mongoose

if (!cached) {
  cached = globalThis.mongoose = {
    conn: null,
    promise: null,
  }
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI)
      .then((mongoose) => mongoose)
      .catch((error) => {
        cached.promise = null
        throw error
      })
  }

  cached.conn = await cached.promise
  console.log('MongoDB connected')

  return cached.conn
}

export default connectDB
