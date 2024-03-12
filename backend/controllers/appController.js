// Import necessary modules and models
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import ENV from '../config.js';
import UserModel from '../model/User.model.js';
import StaffModel from '../model/StaffModel.js';
import Facultymodel from '../model/Facultymodel.js';
// Function to create a new staff member
export async function createStaff(req, res) {
    // if (req.user.role !== 'collegeadmin' && req.user.role !== 'universityadmin') {
    //     return res.status(403).send({ error: "Permission denied. You are not authorized to perform this action." });
    // }

    const { name, role, email, id, collegename } = req.body;

    try {
        const newStaff = new StaffModel({
            name,
            role,
            email,
            id,
            collegename
        });

        const savedStaff = await newStaff.save();

        return res.status(201).send(savedStaff);
    } catch (error) {
        console.error("Error adding staff:", error);
        return res.status(500).send({ error: "An error occurred while adding staff." });
    }
}
// Function to retrieve a list of all staff members
export async function getStaffList(req, res) {
    try {
        const staffList = await StaffModel.find();
        return res.status(200).send(staffList);
    } catch (error) {
        return res.status(500).send({ error: "An error occurred while fetching staff list." });
    }
}

export async function getStaffById(req, res) {
    const { id } = req.params;

    try {
        const staff = await StaffModel.findById(id);
        if (!staff) {
            return res.status(404).send({ error: "Staff not found." });
        }
        return res.status(200).send(staff);
    } catch (error) {
        console.error("Error fetching staff details:", error);
        return res.status(500).send({ error: "An error occurred while fetching staff details." });
    }
}

// Function to update staff member details
export async function updateStaff(req, res) {
 
    const { name, role, email, collegename,id} = req.body;

    try {
        const updatedStaff = await StaffModel.findByIdAndUpdate(id, { name, role, email, collegename }, { new: true });
        if (!updatedStaff) {
            return res.status(404).send({ error: "Staff not found." });
        }
        return res.status(200).send(updatedStaff);
    } catch (error) {
        console.error("Error updating staff details:", error);
        return res.status(500).send({ error: "An error occurred while updating staff details." });
    }
}

// Function to delete a staff member
export async function deleteStaff(req, res) {
    const { id } = req.params;

    try {
        const deletedStaff = await StaffModel.findByIdAndDelete(id);
        if (!deletedStaff) {
            return res.status(404).send({ error: "Staff not found." });
        }
        return res.status(200).send({ message: "Staff deleted successfully." });
    } catch (error) {
        console.error("Error deleting staff:", error);
        return res.status(500).send({ error: "An error occurred while deleting staff." });
    }
}

// Function to authenticate and login users
export async function login(req, res) {
    const { email, password } = req.body;

    try {
        let user;

        if (email === 'gcek@gmail.com' && password === 'Password@123') {
            user = await UserModel.findOne({ email: 'gcek@gmail.com' });
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }
            user.role = 'collegeadmin';
        } else if (email === 'bput@gmail.com' && password === 'Password@123') {
            user = await UserModel.findOne({ email: 'bput@gmail.com' });
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }
            user.role = 'universityadmin';
        } else {
            user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }
        }

        const passwordCheck = await bcrypt.compare(password, user.password);

        if (!passwordCheck) {
            return res.status(400).send({ error: "Password does not match" });
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        }, ENV.JWT_SECRET, { expiresIn: "24h" });

        return res.status(200).send({
            msg: "Login Successful",
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        return res.status(500).send({ error });
    }
}

// Function to retrieve user details by username
export async function getUser(req, res) {
    const { username } = req.params;

    try {
        if (!username) return res.status(501).send({ error: "Invalid Username" });

        UserModel.findOne({ username }, function (err, user) {
            if (err) return res.status(500).send({ err });
            if (!user) return res.status(501).send({ error: "Couldn't Find the User" });

            const { password, ...rest } = Object.assign({}, user.toJSON());

            return res.status(201).send(rest);
        });

    } catch (error) {
        return res.status(404).send({ error: "Cannot Find User Data" });
    }
}

// Function to update user details
export async function updateUser(req, res) {
    try {
        const { userId } = req.user;

        if (userId) {
            const body = req.body;

            UserModel.updateOne({ _id: userId }, body, function (err, data) {
                if (err) throw err;

                return res.status(201).send({ msg: "Record Updated...!" });
            });
        } else {
            return res.status(401).send({ error: "User Not Found...!" });
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}

// Function to create a new faculty member
export async function createFaculty(req, res) {
    const { name, role, email, id, collegename } = req.body;

    try {
        const newFaculty = new Facultymodel({
            name,
            role,
            email,
            id,
            collegename
        });

        const savedFaculty = await newFaculty.save();

        return res.status(201).send(savedFaculty);
    } catch (error) {
        console.error("Error creating faculty:", error);
        return res.status(500).send({ error: "An error occurred while creating faculty." });
    }
}

// Function to retrieve a list of all faculty members
export async function getFacultyList(req, res) {
    try {
        const facultyList = await Facultymodel.find();
        return res.status(200).send(facultyList);
    } catch (error) {
        console.error("Error fetching faculty list:", error);
        return res.status(500).send({ error: "An error occurred while fetching faculty list." });
    }
}

// Function to retrieve a faculty member by their ID
export async function getFacultyById(req, res) {
    const { id } = req.params;

    try {
        const faculty = await Facultymodel.findById(id);
        if (!faculty) {
            return res.status(404).send({ error: "Faculty not found." });
        }
        return res.status(200).send(faculty);
    } catch (error) {
        console.error("Error fetching faculty details:", error);
        return res.status(500).send({ error: "An error occurred while fetching faculty details." });
    }
}

// Function to update faculty member details
export async function updateFaculty(req, res) {
    
    const { name, role, email, collegename,id } = req.body;

    try {
        const updatedFaculty = await Facultymodel.findByIdAndUpdate(id, { name, role, email, collegename }, { new: true });
        if (!updatedFaculty) {
            return res.status(404).send({ error: "Faculty not found." });
        }
        return res.status(200).send(updatedFaculty);
    } catch (error) {
        console.error("Error updating faculty details:", error);
        return res.status(500).send({ error: "An error occurred while updating faculty details." });
    }
}

// Function to delete a faculty member
export async function deleteFaculty(req, res) {
    const { id } = req.params;

    try {
        const deletedFaculty = await Facultymodel.findByIdAndDelete(id);
        if (!deletedFaculty) {
            return res.status(404).send({ error: "Faculty not found." });
        }
        return res.status(200).send({ message: "Faculty deleted successfully." });
    } catch (error) {
        console.error("Error deleting faculty:", error);
        return res.status(500).send({ error: "An error occurred while deleting faculty." });
    }
}