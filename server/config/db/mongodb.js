import mongoose from 'mongoose';
import ErrorService from '../../services/errorService';

export default async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_CONNECTION);
    console.log('Connecté à la base de données Mongoose');
  } catch (error) {
    ErrorService.record(error);
  }
};
