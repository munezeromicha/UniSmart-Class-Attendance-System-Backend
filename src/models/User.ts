import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'ADMIN',
  HOD = 'HOD',
  LECTURER = 'LECTURER',
  CLASS_REP = 'CLASS_REP',
  STUDENT = 'STUDENT'
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  school?: string;
  department?: string;
  class?: string;
  registrationNumber?: string;
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: Object.values(UserRole),
    required: true 
  },
  school: { type: String },
  department: { type: String },
  class: { type: String },
  registrationNumber: { 
    type: String, 
    sparse: true, 
    validate: {
      validator: function(v: string) {
        if (this.role === 'STUDENT') {
          return /^\d{9}$/.test(v);
        }
        return true;
      },
      message: 'Invalid registration number format'
    }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

userSchema.index({ registrationNumber: 1 }, { 
  unique: true, 
  partialFilterExpression: { role: 'STUDENT' } 
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema); 