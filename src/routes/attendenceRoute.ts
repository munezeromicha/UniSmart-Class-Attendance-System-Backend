import express from "express";
import { auth } from "../middleware/auth";
import {
  approveAttendance,
  exportAttendanceToday,
  firstAttendance,
  getAttendanceByClassThisWeek,
  getAttendanceByClassToday,
  getAttendenceAssignedToYou,
  secondAttendence,
  sendAttendence,
} from "../controllers/attendenceController";

const attendanceRoute = express.Router();
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
 *    
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               college:
 *                 type: string
 *               studentId:
 *                 type: string
 *               school:
 *                 type: string
 *               department:
 *                 type: string
 *               class:
 *                 type: string
 *               start:
 *                 type: boolean
 *                 description: Indicates if this is the start of attendance.
 *
 *             required:
 *               - firstName
 *               - lastName
 *               - college
 *
 *
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
 *
 *       500:
 *         description: Error registering attendance.
 */

/**
* @swagger
* components:
*   schemas:
*     Attendance:
*       type: object
*       properties:
*         studentId:
*           type: string
*           description: The unique identifier for the student.
*         firstName:
*           type: string
*           description: The first name of the student.
*         lastName:
*           type: string
*           description: The last name of the student.
*         college:
*           type: string
*           description: The college of the student.
*         school:
*           type: string
*           description: The school of the student.
*         department:
*           type: string
*           description: The department of the student.
*         class:
*           type: string
*           description: The class assigned to the student.
*         start:
*           type: boolean
*           description: Indicates if this is the start of attendance.
*/





attendanceRoute.post("/register", auth(), firstAttendance);
/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: API for managing attendance registrations
 */

/**
 * @swagger
 * /api/attendence/update/{id}:
 *   put:
 *     summary: second attendence
 *     tags: [Attendance]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the attendance record to update
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
 *                 description: Set to true to mark attendance as ended
 *             required:
 *               - end
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
 *                 data:
 *                   $ref: '#/components/schemas/Attendance'
 *
 *       404:
 *         description: Attendance record not found.
 *
 *       500:
 *         description: Error updating attendance.
 */

attendanceRoute.put("/update/:id", secondAttendence);
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

