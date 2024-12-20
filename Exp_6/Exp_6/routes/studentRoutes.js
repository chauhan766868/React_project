import express from "express";
import Student from "../models/student.js"; // Ensure this path is correct

const router = express.Router();

// Get all students
router.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new student
router.post("/students", async (req, res) => {
  const { name, age, department, year } = req.body;

  if (!name || !age || !department || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const student = new Student({
    name,
    age,
    department,
    year
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a student
router.delete("/students/:id", async (req, res) => {
  try {
    console.log(`Attempting to delete student with ID: ${req.params.id}`);
    const student = await Student.findById(req.params.id);
    if (!student) {
      console.error(`Student not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "Student not found" });
    }

    console.log(`Student found. Deleting student with ID: ${req.params.id}`);
    await Student.deleteOne({ _id: req.params.id });  // Use deleteOne() with filter

    console.log(`Student successfully deleted with ID: ${req.params.id}`);
    res.json({ message: "Student deleted" });
  } catch (error) {
    console.error(`Error deleting student with ID ${req.params.id}:`, error.message);
    console.error(error.stack);
    res.status(500).json({ message: "Failed to delete student. " + error.message });
  }
});

// Update a student
router.put("/students/:id", async (req, res) => {
  const { name, age, department, year } = req.body;

  if (!name || !age || !department || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.name = name;
    student.age = age;
    student.department = department;
    student.year = year;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;