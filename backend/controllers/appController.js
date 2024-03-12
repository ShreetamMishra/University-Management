import UserModel from '../model/User.model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import otpGenerator from 'otp-generator';
import OTPModel from '../model/otpmodel.js';

// Rest of your code...


// Use OTPModel and connectToDatabase as needed
// For example:
// connectToDatabase();
// Use OTPModel for database operations

 // Adjust the path based on the file location
 import nodemailer from 'nodemailer';
// Adjust the path based on your project structure

// import { registerMail } from './mailer.js';
/** middleware for verify user */
export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}


/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
// export async function createOTP(req) {
//     try {
//         // Ensure req or req.app is properly defined before accessing req.app.locals
//         if (req && req.app && req.app.locals) {
//             req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
//             return req.app.locals.OTP;
//         } else {
//             throw new Error('Invalid request object.');
//         }
//     } catch (error) {
//         console.error('Error generating OTP:', error);
//         throw new Error('Failed to generate OTP.');
//     }
// }

// export async function register(req, res) {
//     try {
//         const { username, password, profile, email } = req.body;

//         // Validate user input (perform necessary validation checks)

//         const isUsernameTaken = await UserModel.exists({ username });
//         if (isUsernameTaken) {
//             return res.status(400).send({ error: 'Please use a unique username.' });
//         }

//         const isEmailTaken = await UserModel.exists({ email });
//         if (isEmailTaken) {
//             return res.status(400).send({ error: 'Please use a unique email.' });
//         }

//         const otp = await createOTP(req);

//         // Separate function for sending OTP via email
//         await sendOTPEmail(username, email, otp);

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new UserModel({
//             username,
//             password: hashedPassword,
//             profile: profile || '',
//             email
//         });

//         await newUser.save();

//         return res.status(201).send({ msg: 'User Registered Successfully' });
//     } catch (error) {
//         console.error('Registration error:', error);
//         return res.status(500).send({ error: 'Registration failed.' });
//     }
// }

// Function to generate OTP
export async function createOTP(req) {
    try {
        if (req && req.app && req.app.locals) {
            const OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
            req.app.locals.OTP = OTP; // Store OTP in app locals

            // Perform any additional logic or database operations here if needed

            return OTP; // Return OTP
        } else {
            throw new Error('Invalid request object.');
        }
    } catch (error) {
        console.error('Error generating OTP:', error);
        throw new Error('Failed to generate OTP.');
    }
}






// Function to send OTP email
export async function sendOTPEmail(username, userEmail, otp) {
    try {
        // Create nodemailer transporter (use your email service provider's settings)
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'shreetammishra01@gmail.com',
                pass: 'rsfghymlzapvfbyh'
            }
        });

        // Construct email message
        let mailOptions = {
            from: 'shreetammishra01@gmail.com',
            to: userEmail,
            subject: 'Verification OTP for Registration',
            text: `Hello ${username}, Your OTP is: ${otp}`
        };

        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email.');
    }
}



export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;

        // Generate OTP
        const storedOTP = await createOTP(req);

        // Validate user input (perform necessary validation checks)

        const isUsernameTaken = await UserModel.exists({ username });
        if (isUsernameTaken) {
            return res.status(400).send({ error: 'Please use a unique username.' });
        }

        const isEmailTaken = await UserModel.exists({ email });
        if (isEmailTaken) {
            return res.status(400).send({ error: 'Please use a unique email.' });
        }

        // Send OTP via email
        await sendOTPEmail(username, email, storedOTP);

        return res.status(200).send({ msg: 'OTP sent successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).send({ error: 'Registration failed.' });
    }
}

// POST /api/validateOTPAndRegister
// {
//     "username": "example123",
//     "password": "admin123",
//     "email": "example@gmail.com",
//     "firstName": "bill",
//     "lastName": "william",
//     "mobile": 8009860560,
//     "address": "Apt. 556, Kulas Light, Gwenborough",
//     "profile": "",
//     "enteredOTP": "123456" // This is the OTP entered by the user
//   }
  // Example function to retrieve stored OTP based on the email address
// Retrieve stored OTP based on email
// export async function retrieveStoredOTP(email) {
//     try {
//         // Find the OTP document based on the email
//         const otpDocument = await OTPModel.findOne({ email });

//         return otpDocument ? otpDocument.otp : null; // Return the OTP if found, or null otherwise
//     } catch (error) {
//         console.error('Error retrieving OTP:', error);
//         throw new Error('Failed to retrieve OTP.');
//     }
// }



// export async function validateOTPAndRegister(req, res) {
//     try {
//         const { username, password, email, enteredOTP } = req.body;

//         // Retrieve stored OTP using the updated method
//         const storedOTP = req.app.locals.OTP;

//         console.log('Entered OTP:', enteredOTP);
//         console.log('Stored OTP:', storedOTP);

//         // Ensure both storedOTP and enteredOTP are strings for comparison
//         const stringEnteredOTP = enteredOTP.toString();
//         const stringStoredOTP = storedOTP ? storedOTP.toString() : null;

//         if (stringStoredOTP !== stringEnteredOTP) {
//             return res.status(400).send({ error: 'Invalid OTP. Registration failed.' });
//         }

//         // Proceed with user registration
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new UserModel({
//             username,
//             password: hashedPassword,
//             email
//             // Other user details here...
//         });

//         // Save user to the database
//         await newUser.save();

//         // Reset the stored OTP after successful registration
//         req.app.locals.OTP = null;

//         return res.status(201).send({ msg: 'User Registered Successfully' });
//     } catch (error) {
//         console.error('Registration error:', error);
//         return res.status(500).send({ error: 'Registration failed.' });
//     }
// }
// export async function validateOTPAndRegister(req, res) {
//     try {
//       const { username, enteredOTP, email, password } = req.body;
  
//       // Retrieve stored OTP based on email (use your logic for fetching the stored OTP)
//       const storedOTP = req.app.locals.OTP;
  
//       console.log('Entered OTP:', enteredOTP);
//       console.log('Stored OTP:', storedOTP);
  
//       if (storedOTP && enteredOTP === storedOTP) {
//         try {
//           const existingUser = await UserModel.findOne({ email });
  
//           if (existingUser) {
//             return res.status(400).send({ error: 'User already exists' });
//           }
  
//           // Create the user in the database
//           const newUser = new UserModel({
//             username,
//             email,
//             password, // Include the password in the user creation process
//           });
  
//           await newUser.save();
  
//           res.status(201).send({ msg: 'User Registered Successfully' });
//         } catch (error) {
//           console.error('Error creating user:', error);
//           res.status(500).send({ error: 'Error creating user' });
//         }
//       } else {
//         res.status(400).send({ error: 'Invalid OTP. Registration failed.' });
//       }
//     } catch (error) {
//       console.error('Internal server error:', error);
//       res.status(500).send({ error: 'Internal server error' });
//     }
//   }
  
// export async function validateOTPAndRegister(req, res) {
//     try {
//       const { enteredOTP, email, username, password } = req.body;
  
//       // Retrieve stored OTP based on the request or app locals
//       const storedOTP = req.app.locals.OTP;
  
//       if (storedOTP && enteredOTP === storedOTP) {
//         try {
//           // Check if a user with the provided email exists
//           const existingUser = await UserModel.findOne({ email });
  
//           if (existingUser) {
//             return res.status(400).send({ error: 'User already exists' });
//           }
  
//           // Create the user in the database if no user exists
//           const newUser = new UserModel({
//             username,
//             email,
//             password, // Include the password in the user creation process
//             // Other user details here...
//           });
  
//           await newUser.save();
  
//           // Reset the stored OTP after successful registration
//           req.app.locals.OTP = null;
  
//           res.status(201).send({ msg: 'User Registered Successfully' });
//         } catch (error) {
//           console.error('Error creating user:', error);
//           res.status(500).send({ error: 'Error creating user' });
//         }
//       } else {
//         res.status(400).send({ error: 'Invalid OTP. Registration failed.' });
//       }
//     } catch (error) {
//       console.error('Internal server error:', error);
//       res.status(500).send({ error: 'Internal server error' });
//     }
//   }
export async function validateOTPAndRegister(req, res) {
    try {
        const { enteredOTP, email, username, password } = req.body;

        // Retrieve stored OTP based on the request or app locals
        const storedOTP = req.app.locals.OTP;

        if (storedOTP && enteredOTP === storedOTP) {
            try {
                // Check if a user with the provided email exists
                const existingUser = await UserModel.findOne({ email });

                if (existingUser) {
                    return res.status(400).send({ error: 'User already exists' });
                }

                // Hash the password before saving the user
                const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

                // Create the user in the database if no user exists
                const newUser = new UserModel({
                    username,
                    email,
                    password: hashedPassword, // Save the hashed password
                    // Other user details here...
                });

                await newUser.save();

                // Reset the stored OTP after successful registration
                req.app.locals.OTP = null;

                res.status(201).send({ msg: 'User Registered Successfully' });
            } catch (error) {
                console.error('Error creating user:', error);
                res.status(500).send({ error: 'Error creating user' });
            }
        } else {
            res.status(400).send({ error: 'Invalid OTP. Registration failed.' });
        }
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}
  
/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req,res){
   
    const { username, password } = req.body;

    try {
        
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

                        // create jwt token
                        const token = jwt.sign({
                                        userId: user._id,
                                        username : user.username
                                    }, ENV.JWT_SECRET , { expiresIn : "24h"});

                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });                                    

                    })
                    .catch(error =>{
                        return res.status(400).send({ error: "Password does not Match"})
                    })
            })
            .catch( error => {
                return res.status(404).send({ error : "Username not Found"});
            })

    } catch (error) {
        return res.status(500).send({ error});
    }
}


/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req,res){
    
    const { username } = req.params;

    try {
        
        if(!username) return res.status(501).send({ error: "Invalid Username"});

        UserModel.findOne({ username }, function(err, user){
            if(err) return res.status(500).send({ err });
            if(!user) return res.status(501).send({ error : "Couldn't Find the User"});

            /** remove password from user */
            // mongoose return unnecessary data with object so convert it into json
            const { password, ...rest } = Object.assign({}, user.toJSON());

            return res.status(201).send(rest);
        })

    } catch (error) {
        return res.status(404).send({ error : "Cannot Find User Data"});
    }

}


/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req,res){
    try {
        
        // const id = req.query.id;
        const { userId } = req.user;

        if(userId){
            const body = req.body;

            // update the data
            UserModel.updateOne({ _id : userId }, body, function(err, data){
                if(err) throw err;

                return res.status(201).send({ msg : "Record Updated...!"});
            })

        }else{
            return res.status(401).send({ error : "User Not Found...!"});
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){
   if(req.app.locals.resetSession){
        return res.status(201).send({ flag : req.app.locals.resetSession})
   }
   return res.status(440).send({error : "Session expired!"})
}


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req,res){
    try {
        
        if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});

        const { username, password } = req.body;

        try {
            
            UserModel.findOne({ username})
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ username : user.username },
                            { password: hashedPassword}, function(err, data){
                                if(err) throw err;
                                req.app.locals.resetSession = false; // reset session
                                return res.status(201).send({ msg : "Record Updated...!"})
                            });
                        })
                        .catch( e => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error : "Username not Found"});
                })

        } catch (error) {
            return res.status(500).send({ error })
        }

    } catch (error) {
        return res.status(401).send({ error })
    }
}

// export async function resetPassword(req, res) {
//     try {
//       if (!req.app.locals.resetSession)
//         return res.status(440).send({ error: "Session expired!" });
  
//       const { username, password } = req.body;
  
//       // Find the user by username
//       const user = await UserModel.findOne({ username });
  
//       if (!user) {
//         return res.status(404).send({ error: "Username not found" });
//       }
  
//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // Update the user's password in the database
//       await UserModel.updateOne(
//         { username: user.username },
//         { password: hashedPassword }
//       );
  
//       req.app.locals.resetSession = false; // reset session
//       return res.status(201).send({ msg: "Record Updated...!" });
//     } catch (error) {
//       return res.status(500).send({ error: "Error updating password" });
//     }
//   }
  
