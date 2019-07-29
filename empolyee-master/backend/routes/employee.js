const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const router = express.Router();

const Employee = require('../models/employee');


router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const employee = new Employee({
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      phoneNumber:req.body.phoneNumber,
      email: req.body.email,
      password: hash
    });
    employee
      .save()
      .then(result => {
        res.status(201).json({
          message: 'Signed up successfully!',
          result: result
        });
      })
      .catch(err => {
        console.log('err:'+JSON.stringify(err))
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedEmployee;
  Employee.findOne({ email: req.body.email })
    .then(employee => {
      if (!employee) {
        return res.status(401).json({
          message: "Authentication failed"
        });
      }
      fetchedEmployee = employee;
      return bcrypt.compare(req.body.password, employee.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Authentication failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedEmployee.email, employeeId: fetchedEmployee._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        employee: fetchedEmployee,
        token: token
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Authentication failed"
      });
    });
});


router.get("", (req, res, next) => {
  Employee.find().then(documents => {
    res.status(200).json({
      message: "Employee details fetched successfully!",
      employees: documents
    });
  });
});


router.get("/:id", (req, res, next) => {
  Employee.findById(req.params.id).then(employee => {
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found!" });
    }
  });
});


router.delete("/:id", (req, res, next) => {
  Employee.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Employee records deleted!" });
  });
});

module.exports = router;
