import Joi from 'joi';
import { User } from '../models/User';

export const validateUser = async (data: any) => {
    // Basic Joi validation
    const schema = Joi.object({
        fullname: Joi.string()
            .min(3)
            .max(50)
            .required(),
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
        studentID: Joi.string()
            .when('role', {
                is: 'student',
                then: Joi.required(),
                otherwise: Joi.optional()
            }),
        role: Joi.string()
            .valid('student', 'lecturer')
            .required()
    });

    const { error } = schema.validate(data);
    if (error) return { error };

    const emailExists = await User.findOne({ email: data.email });
    if (emailExists) {
        return { error: { details: [{ message: 'Email already registered' }] } };
    }

    if (data.role === 'student' && data.studentID) {
        const studentIDExists = await User.findOne({ studentID: data.studentID });
        if (studentIDExists) {
            return { error: { details: [{ message: 'Student ID already registered' }] } };
        }
    }

    return { value: data };
};