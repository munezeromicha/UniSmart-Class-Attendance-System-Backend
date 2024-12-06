import mongoose, { Document, Schema } from 'mongoose';


export interface IAttendance extends Document {
  attendenceOwner: string; 
  firstName: string; 
  lastName: string; 
  studentId:string;
  college: string; 
  school?: string; 
  approvalReason:string
  department?: string;
  class?: string;
  start: boolean; 
  end: boolean; 
  status: string; 
  approved:boolean;
  assignedTo:string;

 
}


const attendanceSchema = new Schema<IAttendance>({
  attendenceOwner: { type: String, required: true }, 
  firstName: { type: String, required: true }, 
  studentId: { type: String}, 
  lastName: { type: String, required: true }, 
  college: { type: String, required: true }, 
  school: { type: String ,require:true}, 
  approvalReason:{type:String,default:"no reason"},
  department: { type: String },
  class: { type: String }, 
  start: { type: Boolean, default: false }, 
  end: { type: Boolean, default: false },
  status: { type: String, default:"absence" }, 
  approved: { type: Boolean, default: false }, 
  assignedTo: { type: String, default:"none" }, 

 
}, {
  timestamps: true 
});


export default mongoose.model<IAttendance>('Attendance', attendanceSchema);
