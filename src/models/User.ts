import { Schema, model } from 'mongoose';

interface IUser {
    fullName: string;
    email: string;
    password: string;
    studentId?: string; 
    role: 'student' | 'lecturer';
    
}

const userSchema = new Schema<IUser>({
     fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    studentId: { type: String },
    role: { type: String, enum: ['student', 'lecturer'], required: true },
});

export const User = model<IUser>('User', userSchema);