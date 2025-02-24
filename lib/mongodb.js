import mongoose from "mongoose"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let clientPromise

if (process.env.NODE_ENV === "development") {
  if (!global._mongooseClientPromise) {
    global._mongooseClientPromise = mongoose.connect(uri, options)
  }
  clientPromise = global._mongooseClientPromise
} else {
  clientPromise = mongoose.connect(uri, options)
}

export default clientPromise

