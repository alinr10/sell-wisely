import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import { userRoles } from '../constants/constants.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const registerCompanyUser = async (req, res) => {

  try {
    const { registerData } = req.body;
    const salt = await bcrypt.genSalt(10)

    const phoneNumber = await UserModel.findOne({ phone: registerData.phone })

    const email = await UserModel.findOne({ email: registerData.email })

    const hashedPassword = await bcrypt.hash(registerData.password, salt)

    if (!checkPasswordValidity(registerData.password)) {
      return res.status(401).json({
        succeeded: false,
        error: 'Şifre geçerli değil. Özel karakter, rakam ve büyük harf içermelidir. Minimum 8 karakter uzunluğunda olmalıdır.',
      });
    }

    if (registerData.password !== registerData.passwordConfirmation) {
      return res.status(401).json({
        succeeded: false,
        error: 'Passwords are not matched',
      });
    }

    if (phoneNumber) {
      return res.status(401).json({
        succeeded: false,
        error: 'Sistemde kayıtlı telefon numarası bulunmaktadır. Farklı bir numara deneyiniz.',
      });
    }

    if (email) {
      return res.status(401).json({
        succeeded: false,
        error: 'Sistemde kayıtlı email numarası bulunmaktadır. Farklı bir email adresi deneyiniz.',
      });
    }

    const user = await new UserModel({
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      companyName: registerData.companyName,
      password: hashedPassword,
      phone: registerData.phone,
      role: userRoles.COMPANY,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}


const registerPersonelUser = async (req, res) => {

  try {
    const { registerData } = req.body;

    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(registerData.password, salt)

    const phoneNumber = await UserModel.findOne({ phone: registerData.phone })

    const email = await UserModel.findOne({ email: registerData.email })

    if (registerData.password !== registerData.passwordConfirmation) {
      return res.status(401).json({
        succeeded: false,
        error: 'Passwords are not matched',
      });
    }

    if (phoneNumber) {
      return res.status(401).json({
        succeeded: false,
        error: 'Sistemde kayıtlı telefon numarası bulunmaktadır. Farklı bir numara deneyiniz.',
      });
    }

    if (email) {
      return res.status(401).json({
        succeeded: false,
        error: 'Sistemde kayıtlı email numarası bulunmaktadır. Farklı bir email adresi deneyiniz.',
      });
    }

    if (!checkPasswordValidity(registerData.password)) {
      return res.status(401).json({
        succeeded: false,
        error: 'Şifre geçerli değil. Özel karakter, rakam ve büyük harf içermelidir. Minimum 8 karakter uzunluğunda olmalıdır.',
      });
    }

    const user = await new UserModel({
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      password: hashedPassword,
      phone: registerData.phone,
      role: userRoles.PERSONAL,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}


function checkPasswordValidity(password) {
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const digitRegex = /\d/;
  const uppercaseRegex = /[A-Z]/;
  const lengthValid = password.length >= 8;

  const hasSpecialChar = specialCharRegex.test(password);
  const hasDigit = digitRegex.test(password);
  const hasUppercase = uppercaseRegex.test(password);

  const isValid =
    lengthValid && hasSpecialChar && hasDigit && hasUppercase;

  return isValid;
}




const login = async (req, res, next) => {
  const { email, password } = req.body;

  //console.log()
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(402).json({ message: 'Incorrect password' });
    } else {

      const token = jwt.sign({ userId: user._id, firstName: user.firstName, lastName: user.lastName }, process.env.SECRET_TOKEN, {
        expiresIn: '1d'

      });

      // res.cookie('jwt', token, {
      //   httpOnly: true,
      //   maxAge: 1000 * 60 * 60 * 24,
      //   sameSite: 'none',
      //   secure: true
      // });


      // console.log("mesaj222",req.user.email)
      res.status(200).json({ success: true, token: token });
    }


  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie('jwt');


    res.status(200).json({
      succeded: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error: 'Server error',
    });
  }
};









const showProfile = async (req, res) => {

  try {

    const { id } = req.body;
    console.log("bu gelen id:", id)
    const newUser = await UserModel.findById(id);
    res.status(200).json(newUser);


  } catch (error) {
    res.status(500).json({ message: "server hatası." })
  }
}

export {
  registerCompanyUser, registerPersonelUser, login, logout,
  showProfile
}