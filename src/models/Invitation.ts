import mongoose, { Document, Schema } from 'mongoose';
import { UserRole } from './User';

export interface IInvitation extends Document {
  email: string;
  role: UserRole;
  school?: string;
  department?: string;
  class?: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
  invitedBy?: mongoose.Types.ObjectId;
}

const invitationSchema = new Schema<IInvitation>({
  email: { type: String, required: true },
  role: { 
    type: String, 
    enum: Object.values(UserRole),
    required: true 
  },
  school: { type: String },
  department: { type: String },
  class: { type: String },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  isUsed: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IInvitation>('Invitation', invitationSchema); 