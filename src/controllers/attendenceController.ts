import { Request, Response } from "express";
import attendence from "../models/attendence";
import * as XLSX from "xlsx";
import { Op } from "sequelize";
import { io } from "../app";
import { Server as SocketIOServer } from "socket.io";

export const firstAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      studentId,
      college,
      school,
      department,
      approvalReason,
      class: className,
      module,
      start,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !college ||
      !school ||
      !department ||
      !studentId
    ) {
      res.status(400).json({
        message: "Missing required fields",
      });
      return;
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingAttendance = await attendence.findOne({
      studentId,
      createdAt: {
        $gte: todayStart,
        $lt: todayEnd,
      },
    });

    if (existingAttendance) {
      res.status(400).json({
        message: "Attendance already registered for today",
      });
      return;
    }

    const newAttendance = await attendence.create({
      attendenceOwner: req.user?.userId,
      firstName,
      lastName,
      studentId,
      college,
      school,
      department,
      approvalReason,
      class: className,
      module,
      start,
    });
    io.emit("attendanceCreated", newAttendance);
    res.status(201).json({
      message: "Attendance registered successfully",
      data: newAttendance,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Error registering attendance",
      error: error.message || "Internal Server Error",
    });
  }
};
export const secondAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, studentId } = req.params;
    const {
      end,
      attendenceOwner: attendanceOwner,
      firstName,
      lastName,
      college,
      school,
      department,
      approvalReason,
      class: className,
      module,
      start,
    } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendanceRecord = await attendence.findOne({
      studentId,
      createdAt: { $gte: today },
    });

    if (!attendanceRecord) {
      const newAttendance = new attendence({
        attendenceOwner: req.user?.userId,
        studentId,
        firstName,
        lastName,
        college,
        school,
        department,
        approvalReason,
        class: className,
        module,
        start,
        end,
        status: "Absent",

        createdAt: new Date(),
      });

      await newAttendance.save();
      res.status(201).json({
        message: "New attendance record created for the student",
        data: newAttendance,
      });
      return;
    }

    attendanceRecord.end = end;

    if (attendanceRecord.start && attendanceRecord.end) {
      attendanceRecord.status = "Present";
    }

    await attendanceRecord.save();
    io.emit("attendanceUpdated", attendanceRecord);

    res.status(200).json({
      message: "Attendance updated successfully",
      data: attendanceRecord,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Error updating attendance",
      error: error.message || "Internal Server Error",
    });
  }
};

export const getAttendanceByClassToday = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classId } = req.params;

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const attendanceRecords = await attendence
      .find({
        class: classId,
        createdAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      })
      .sort({ createdAt: 1 });

    if (attendanceRecords.length === 0) {
      res.status(404).json({
        message: "No attendance records found for this class today.",
      });
      return;
    }

    res.status(200).json({
      message: "Today's attendance records retrieved successfully.",
      data: attendanceRecords,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving attendance records.",
      error: error.message || "Internal Server Error",
    });
  }
};

export const getAttendanceByClassThisWeek = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classId } = req.params;

    const today = new Date();
    const firstDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const lastDayOfWeek = new Date(today.setDate(firstDayOfWeek.getDate() + 6)); // Saturday

    const attendanceRecords = await attendence.find({
      class: classId,
      createdAt: {
        $gte: firstDayOfWeek,
        $lte: lastDayOfWeek,
      },
    });

    if (attendanceRecords.length === 0) {
      res.status(404).json({
        message: "No attendance records found for this class this week.",
      });
      return;
    }

    res.status(200).json({
      message: "This week's attendance records retrieved successfully.",
      data: attendanceRecords,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving attendance records.",
      error: error.message || "Internal Server Error",
    });
  }
};

export const approveAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classId } = req.params;
    const { reason } = req.body;

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const attendanceRecords = await attendence.find({
      class: classId,
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });

    if (attendanceRecords.length === 0) {
      res.status(404).json({
        message: "No attendance records found for this class today.",
      });
      return;
    }

    await Promise.all(
      attendanceRecords.map(async (record: any) => {
        record.approved = true;
        record.approvalReason = reason;
        await record.save();
      })
    );

    res.status(200).json({
      message: "Attendance records approved successfully.",
      data: attendanceRecords,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Error approving attendance records.",
      error: error.message || "Internal Server Error",
    });
  }
};
export const sendAttendence = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classId } = req.params;
    const { send } = req.body;

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const attendanceRecords = await attendence.find({
      class: classId,
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });

    if (attendanceRecords.length === 0) {
      res.status(404).json({
        message: "No attendance records found for this class today.",
      });
      return;
    }

    await Promise.all(
      attendanceRecords.map(async (record: any) => {
        record.approved = true;
        record.assignedTo = send;
        await record.save();
      })
    );

    res.status(200).json({
      message: "Attendance assigned successfully.",
      data: attendanceRecords,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Error assigning attendance records.",
      error: error.message || "Internal Server Error",
    });
  }
};
export const getAttendenceAssignedToYou = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classId } = req.params;
    const { email } = req.params;

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const attendanceRecords = await attendence.find({
      class: classId,
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });

    if (attendanceRecords.length === 0) {
      res.status(404).json({
        message: "No attendance records found for this class today.",
      });
      return;
    }

    await Promise.all(
      attendanceRecords.map(async (record) => {
        record.assignedTo = email;
        await record.save();
      })
    );

    res.status(200).json({
      message: "Attendance assigned successfully.",
      data: attendanceRecords,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Error assigning attendance records.",
      error: error.message || "Internal Server Error",
    });
  }
};

export const exportAttendanceToday = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classId } = req.params;

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const attendanceRecords = await attendence.find({
      class: classId,
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });

    if (attendanceRecords.length === 0) {
      res.status(404).json({
        message: "No attendance records found for this class today.",
      });
    }

    const dataForExcel = attendanceRecords.map((record) => ({
      LectureID: record.attendenceOwner ? record.attendenceOwner : "",
      FirstName: record.firstName,
      LastName: record.lastName,
      College: record.college,
      School: record.school,

      Department: record.department,
      Class: record.class,
      Start: record.start ? "Yes" : "No",
      End: record.end ? "Yes" : "No",
      Status: record.status,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Attendance_${classId}_${
        new Date().toISOString().split("T")[0]
      }.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error: any) {
    console.error("Error exporting attendance records:", error);
    res.status(500).json({
      message: "Error exporting attendance records.",
      error: error.message || "Internal Server Error",
    });
  }
};
