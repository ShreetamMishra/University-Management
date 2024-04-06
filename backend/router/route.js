import { getItems, addItem,getUserItems, downloadFile } from '../controllers/items.js';
import upload from '../middleware/multer.js';
import { Router } from "express";
import * as controller from '../controllers/appController.js';
import { registerMail } from '../controllers/mailer.js'
import Auth, { localVariables } from '../middleware/auth.js';
import { downloadAnswerFile } from '../controllers/items.js';
import { addAnswer } from '../controllers/items.js';
const router = Router();
// POST Methods
// router.route('/register').post(controller.register);
// router.route('/registerMail').post(registerMail);
// router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end());
router.route('/login').post(controller.login);
// router.route('/validate-otp-and-register').post(controller.validateOTPAndRegister);

router.route('/staff')
    .post(controller.createStaff) // Create a new staff
    .get(controller.getStaffList); // Get a list of all staff

router.route('/staff/:id')
    .get(controller.getStaffById) // Get staff by ID
    .put(controller.updateStaff) // Update staff by ID
    .delete(controller.deleteStaff); // Delete staff by ID


// Routes for faculty
router.route('/faculty')
    .post(controller.createFaculty) // Create a new faculty member
    .get(controller.getFacultyList); // Get a list of all faculty members

router.route('/faculty/:id')
    .get(controller.getFacultyById) // Get faculty member by ID
    .put(controller.updateFaculty) // Update faculty member by ID
    .delete(controller.deleteFaculty); // Delete faculty member by ID
 router.post('/signup', controller.signup);

// Generate OTP route
router.post('/generate-otp', controller.createOTP);
router.route('/validate-otp-and-register').post(controller.validateOTPAndRegister);
// Send mail route
router.post('/send-mail', controller.sendOTPEmail);
// GET Methods
// router.route('/user/:username').get(controller.getUser);
// router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP);
// router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP);
// router.route('/createResetSession').get(controller.createResetSession);
// router.route('/upload-file').post(upload.single("file"), addItem);
// router.route('/').get(getItems).post(upload.single("file"), addItem);
// router.route('/user-items/:semester/:subject').get(getUserItems);
// router.route('/download/:id').get(downloadFile);

// router.route('/download-answer/:id').get(downloadAnswerFile);
// router.route('/upload-answer/:id').post(upload.single("answerFile"), addAnswer);


// // PUT Methods
// router.route('/updateuser').put(Auth, controller.updateUser);
// router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword);

export default router;
