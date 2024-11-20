import { Schema, model } from 'mongoose';

interface IUser {
    fullname: string;
    email: string;
    password: string;
    studentID?: string; 
    role: 'student' | 'lecturer';
}

const userSchema = new Schema<IUser>({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    studentID: { type: String },
    role: { type: String, enum: ['student', 'lecturer'], required: true },
});

export const User = model<IUser>('User', userSchema);