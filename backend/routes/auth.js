const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

//secret
const JWT_SECRET = "HI_THIS_IS_TOKEN";

// Route 1: create user  no login required at /api/auth/createuser
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid mail").isEmail(),
    body("password", "Password must ne atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    //If there are any errors ,  return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    // check whether the user with same email exits already

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({
            success,
            errors: "Sorry a user with this Email already exits",
          });
      }

      const salt = await bcrypt.genSalt(10);
      const secpass = await bcrypt.hash(req.body.password, salt);

      //creating new user
      user = await User.create({
        name: req.body.name,
        password: secpass,
        email: req.body.email,
      });

      // .then(user=>res.json(user))
      // .catch(err=>{console.log(err)
      // res.json({error:'Please enter a unique value for email',message:err.message})})

      const data = {
        user: {
          id: user.id,
        },
      };
      success = true;
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }
  }
);

// //Login user Authentication /api/auth/login,  no login required
// router.post(
//   "/login",
//   [
//     body("email", "Enter a valid mail").isEmail(),
//     body("password", "Password cannot be blank").exists(),
//   ],
//   async (req, res) => {
//     //If there are any errors ,  return bad request and the errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;

//     try {
//       let user = await User.findOne({ email });
//       if (!user) {
//         return res
//           .status(400)
//           .json({ errors: "Please Enter Correct Credentials user not found" });
//       }

//       const passcompare = await bcrypt.compare(password, user.password);
//       console.log(user.password);
//       console.log(password);
//       console.log(passcompare);
//       if (!passcompare) {
//         return res
//           .status(400)
//           .json({ errors: "Please Enter Correct Credentials password dont match" });
//       }

//       const data = {
//         user: {
//           id: user.id,
//         },
//       };

//       const authtoken = jwt.sign(data, JWT_SECRECT);
//       res.json({ authtoken });

//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Internal Server error");
//     }
//   }

// );

// Route 2: Login user Authentication /api/auth/login,  no login required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ position, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({
            success,
            error: "Please try to login with correct credentials",
          });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      success = true;
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: getuser details  /api/auth/getuser,  no login required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userID = req.user.id;
    const user = await User.findById(userID).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Error");
  }
});

module.exports = router;
