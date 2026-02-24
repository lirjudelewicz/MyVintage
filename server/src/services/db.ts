import mongoose from 'mongoose';


const connectDB = async (mongoUri: string): Promise<void> => {
  try {
    if (!mongoUri) {
        throw new Error("DATABASE_URL is not defined");
    }
    await mongoose.connect(mongoUri);
    const databaseConnection = mongoose.connection;
    databaseConnection.on("error", (error) => {throw new Error(error)});
    databaseConnection.once("open", () => console.log("Connected to Database"));
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectDB;
