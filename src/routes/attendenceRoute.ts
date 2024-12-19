import express from "express";
import { auth } from "../middleware/auth";
import {
  approveAttendance,
  exportAttendanceToday,
  firstAttendance,
  getAttendanceByClassThisWeek,
  getAttendanceByClassToday,
  getAttendenceAssignedToYou,
  
  secondAttendance,
  
  sendAttendence,
} from "../controllers/attendenceController";

const attendanceRoute = express.Router();
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Attendance:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         college:
 *           type: string
 *         studentId:
 *           type: string
 *         school:
 *           type: string
 *         department:
 *           type: string
 *         class:
 *           type: string
 *         module:
 *           type: string
 *         start:
 *           type: boolean
 *           description: Indicates if this is the start of attendance.
 *       required:
 *         - firstName
 *         - lastName
 *         - college
 */

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: API for managing attendance registrations
 */

/**
 * @swagger
 * /api/attendence/register:
 *   post:
 *     summary: Register attendance
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attendance'
 *     responses:
 *       201:
 *         description: Attendance registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message for successful registration.
 *                 data:
 *                   $ref: '#/components/schemas/Attendance'
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */


attendanceRoute.post("/register", auth(), firstAttendance);
/**
 * @swagger
 * tags:
 *   - name: Attendance
 *     description: API for managing attendance registrations
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/attendence/update/{studentId}/{id}:
 *   put:
 *     summary: Update or create attendance for a student
 *     tags:
 *       - Attendance
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: studentId
 *         in: path
 *         required: true
 *         description: The ID of the student
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the attendance record
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               end:
 *                 type: boolean
 *                 description: Indicates if the attendance has ended
 *               start:
 *                 type: boolean
 *                 description: Indicates if the attendance has started
 *               firstName:
 *                 type: string
 *                 description: First name of the student
 *               lastName:
 *                 type: string
 *                 description: Last name of the student
 *               studentId:
 *                 type: string
 *                 description: Student ID
 *               college:
 *                 type: string
 *                 description: College name
 *               school:
 *                 type: string
 *                 description: School name
 *               department:
 *                 type: string
 *                 description: Department name
 *               approvalReason:
 *                 type: string
 *                 description: Reason for attendance approval
 *               class:
 *                 type: string
 *                 description: Class name
 *               module:
 *                 type: string
 *                 description: Module name
 *             required:
 *               - end
 *               - start
 *     responses:
 *       200:
 *         description: Attendance updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Attendance updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Attendance'
 *       201:
 *         description: New attendance record created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New attendance record created for the student
 *                 data:
 *                   $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: Attendance record not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Attendance record not found
 *       500:
 *         description: Error updating attendance.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating attendance
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */



attendanceRoute.put("/update/:studentId/:id",auth(), secondAttendance);



/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: API for managing attendance records
 */

/**
 * @swagger
 * /api/attendence/class/{classId}/today:
 *   get:
 *     summary: Get today's attendance by class
 *     tags: [Attendance]
 *     parameters:
 *       - name: classId
 *         in: path
 *         required: true
 *         description: The unique identifier for the class whose attendance is being requested.
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Successfully retrieved today's attendance data.
 *         content:
 *           


 */
attendanceRoute.get("/class/:classId/today", getAttendanceByClassToday)

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: API for managing attendance records
 */

/**
 * @swagger
 * /api/attendence/class/{classId}/this-week:
 *   get:
 *     summary: Get this-week attendance by class
 *     tags: [Attendance]
 *     parameters:
 *       - name: classId
 *         in: path
 *         required: true
 *         description: The unique identifier for the class whose attendance is being requested.
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Successfully retrieved today's attendance data.
 *         content:
 *           


 */


attendanceRoute.get("/class/:classId/this-week", getAttendanceByClassThisWeek);
/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: API for managing attendance records
 */

/**
 * @swagger
 * /api/attendence/class/{classId}/approve:
 *   put:
 *     summary: Approve attendance 
 *     tags: [Attendance]
 *     parameters:
 *       - name: classId
 *         in: path
 *         required: true
 *         description: The ID of the class for which attendance is being approved.
 *         schema:
 *           type: string
 *     
 *
 *     responses:
 *       200:
 *         description: Attendance updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Attendance approved successfully."
 *                 data:
 *                   $ref: '#/components/schemas/Attendance'
 *
 *       404:
 *         description: Attendance record not found.
 *
 *       500:
 *         description: Error updating attendance.
 */


attendanceRoute.put("/class/:classId/approve", approveAttendance)

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: API for managing attendance records
 */

/**
 * @swagger
 * /api/attendence/class/{classId}/assign/{email}:
 *   get:
 *     summary: Get attendance assigned to a specific email
 *     tags: [Attendance]
 *     parameters:
 *       - name: classId
 *         in: path
 *         required: true
 *         description: The unique identifier for the class whose attendance is being requested.
 *         schema:
 *           type: string
 *       - name: email
 *         in: path
 *         required: true
 *         description: The email address of the user for whom attendance is being requested.
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Successfully retrieved attendance data assigned to the specified email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the retrieval was successful.
 *                 data:
 *                   type: object
 *                   properties:
 *                     classId:
 *                       type: string
 *                       description: The unique identifier for the class.
 *                     email:
 *                       type: string
 *                       description: The email address of the user.
 *                     attendanceRecords:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                             description: The date of attendance.
 *                           status:
 *                             type: string
 *                             description: The attendance status (e.g., present, absent).
 *
 *       400:
 *         description: Bad request, invalid class ID or email format.
 *
 *       404:
 *         description: Attendance records not found for the specified email and class ID.
 *
 */
attendanceRoute.get(
  "/class/:classId/assign/:email",
  getAttendenceAssignedToYou
);


/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: API for managing attendance records
 */

/**
 * @swagger
 * /api/attendence/class/{classId}/assignTo:
 *   put:
 *     summary: Assign attendance to hod
 *     tags: [Attendance]
 *     parameters:
 *       - name: classId
 *         in: path
 *         required: true
 *         description: The unique identifier for the class to which attendance is being assigned.
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               send:
 *                 type: string
 *                 description: The email address of the user to whom attendance is being assigned.
 *         
 *
 *     responses:
 *       200:
 *         description: Successfully assigned attendance to the specified class.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the assignment was successful.
 *
 *       400:
 *         description: Bad request, invalid input data.
 *
 *       404:
 *         description: Class not found or user not found.
 *
 */


attendanceRoute.put("/class/:classId/assignTo", sendAttendence)
/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: API for managing attendance records
 */

/**
 * @swagger
 * /api/attendence/class/{classId}/export/today:
 *   get:
 *     summary: export to day attendence
 *     tags: [Attendance]
 *     parameters:
 *       - name: classId
 *         in: path
 *         required: true
 *         description: The unique identifier for the class whose attendance is being requested.
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Successfully exported today's attendance data.
 *         content:
 *           


 */



attendanceRoute.get('/class/:classId/export/today', exportAttendanceToday);

export default attendanceRoute;

