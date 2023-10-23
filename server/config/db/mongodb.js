import mongoose from 'mongoose';
import ErrorService from '@app/services/errorService';

export default async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_CONNECTION);
    console.warn('Connecté à la base de données Mongoose');
  } catch (error) {
    ErrorService.record(error);
  }
};
