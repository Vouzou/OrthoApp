var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Patient = mongoose.model('Patient');
var Dropbox = mongoose.model('Dropbox');
var Appointment = mongoose.model('Appointment');

function updatePatient(inputPatient) {
    var patient = new Patient();
    patient.first_name = inputPatient.first_name;
    patient.last_name = inputPatient.last_name;
    patient.parent_name = inputPatient.parent_name;
    patient.date_of_birth = inputPatient.date_of_birth;
    patient.phone = inputPatient.phone;
    patient.address = inputPatient.address;
    patient.email = inputPatient.email;
    patient.referral = inputPatient.referral;
    patient.reason = inputPatient.reason;
    patient.medical_history = inputPatient.medical_history;
    patient.medication = inputPatient.medication;
    patient.treatment = inputPatient.treatment;
    patient.first_appointment = inputPatient.first_appointment;
    patient.payment = inputPatient.payment;
    patient.price = inputPatient.price;
    patient.notes = inputPatient.notes;
    patient.image_url = inputPatient.image_url;
    return patient;
}

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
// if user is authenticated in the session, call the next() to call the next request handler
// Passport adds this method to request object. A middleware is allowed to add properties to
// request and response objects

    //allow all get request methods
    if(req.method === "GET"){
        return next();
    }
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/login');
    };

    //Register the authentication middleware
    router.use('/patients', isAuthenticated);

    router.route('/users/:userId/patients')
    //creates a new patient
    .post(function(req, res){
        console.log('user_id: ' + req.params.userId);
        console.log('add new patient');
        var patient = new Patient();
        patient.user_id = req.params.userId;
        patient.first_name = req.body.first_name;
        patient.last_name = req.body.last_name;
        patient.parent_name = req.body.parent_name;
        patient.date_of_birth = req.body.date_of_birth;
        patient.phone = req.body.phone;
        patient.address = req.body.address;
        patient.email = req.body.email;
        patient.referral = req.body.referral;
        patient.reason = req.body.reason;
        patient.medical_history = req.body.medical_history;
        patient.medication = req.body.medication;
        patient.treatment = req.body.treatment;
        patient.first_appointment = req.body.first_appointment;
        patient.payment = req.body.payment;
        patient.price = req.body.price;
        patient.notes = req.body.notes;
        patient.image_url = req.body.image_url;

        patient.save(function(err, patient) {
            if (err){
                return res.send(500, err);
            }
            return res.json(patient);
        });
    })
    //gets all patients
    .get(function(req, res){
        console.log('user_id: ' + req.params.userId);
        console.log('get all patients request');
        Patient.find({'user_id': req.params.userId}, function(err, patients){
            if(err){
                return res.send(500, err);
            }
            return res.status(200).send(patients);
        });
    });

    router.route('/dropboxes')
    .get(function(req, res){
        Dropbox.find(function(err, dropboxes){
            console.log('get all dropboxes');
            if(err){
                return res.send(500, err);
            }
            return res.send(200, dropboxes);
        });
    })
    //creates a new dropbox record
    .post(function(req, res){
        var dropbox = new Dropbox();
        dropbox.user_id = req.body.user_id;
        dropbox.token = req.body.dropboxToken;
        dropbox.save(function(err, dropbox) {
            if (err){
                return res.send(500, err);
            }
            return res.send(dropbox);
        });
    });
    
    router.route('/dropboxes/:userId')
    .get(function(req, res){
        console.log('user_id: ' + req.params.userId);
        Dropbox.findOne({'user_id': req.params.userId}, function(err, dropbox){
            if(err)
                res.send(err);
            res.status(200).send(dropbox);
        });
    });

    //patient-specific commands. likely won't be used
    router.route('/patients/:id')
    //gets specified patient
    .get(function(req, res){
        Patient.findById(req.params.id, function(err, patient){
            if(err)
                res.send(err);  
            res.json(patient);
        });
    })
    //updates specified patient
    .put(function(req, res){
        Patient.findById(req.params.id, function(err, patient){
            if(err)
                res.send(err);
            console.log('Update Patient!');
            patient.first_name = req.body.first_name;
            patient.last_name = req.body.last_name;
            patient.parent_name = req.body.parent_name;
            patient.date_of_birth = req.body.date_of_birth;
            patient.phone = req.body.phone;
            patient.address = req.body.address;
            patient.email = req.body.email;
            patient.referral = req.body.referral;
            patient.reason = req.body.reason;
            patient.medical_history = req.body.medical_history;
            patient.medication = req.body.medication;
            patient.treatment = req.body.treatment;
            patient.first_appointment = req.body.first_appointment;
            patient.payment = req.body.payment;
            patient.price = req.body.price;
            patient.notes = req.body.notes;
            patient.image_url = req.body.image_url;

            patient.save(function(err, patient){
            if(err)
                res.send(err);

            res.json(patient);
            });
        });
    })
    //deletes the patient
    .delete(function(req, res) {
        console.log('Delete Patient!' + req.params.id);
        Patient.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send(err);
            res.json("deleted");
        });
    });

    router.route('/users/:userId/appointment')
    .post(function(req, res){
        console.log('user_id: ' + req.params.userId);
        console.log('patient_id: ' + req.query.patient_id);
        console.log('reason: ' + req.query.reason);
        console.log('date time:' + req.query.date_time);
        console.log('add new appointment');
        var appointment = new Appointment();
        appointment.user_id = req.params.userId;
        if (req.query.patient_id) {
            appointment.patient_id = req.query.patient_id;
        }
        if (req.query.date_time) {
            appointment.date_time = req.query.date_time;
        }
        if (req.query.reason) {
            appointment.reason = req.query.reason;
        }
        appointment.save(function(err, appointment) {
            if (err){
                return res.status(500).send(err);
            }
            return res.json(appointment);
        });
    })
    //updates specified appointment
    .put(function(req, res){
        Appointment.findById(req.query.appointment_id, function(err, appointment){
            if(err)
                res.send(err);
            console.log('Update Appointment!');
            if (req.query.date_time) {
                appointment.date_time = req.query.date_time;
            }
            if (req.query.reason) {
                appointment.reason = req.query.reason;
            }
            if (req.query.patient_id) {
                appointment.patient_id = req.query.patient_id;
            }
            patient.save(function(err, appointment){
            if(err)
                res.send(err);

            res.json(appointment);
            });
        });
    })
    //deletes the appointment
    .delete(function(req, res) {
        console.log('Delete appointment!' + req.query.appointment_id);
        Appointment.remove({
            _id: req.query.appointment_id
        }, function(err) {
            if (err)
                res.send(err);
            res.json("deleted");
        });
    })
    //return all the appointments for the specified user and specified patient
    .get(function(req, res){
        console.log('user_id: ' + req.params.userId);
        console.log('patient_id: ' + req.query.patient_id);
        console.log('appointment_id ' + req.query.appointment_id);
        if (req.query.appointment_id) {
            console.log('get appointment by id');
            Appointment.findById(req.query.appointment_id, function(err, appointment){
                if(err)
                    return res.send(err);  
                return res.json(appointment);
            });
        }
        if (req.query.date_time) {
            console.log('get appointment by date');
            Appointment.find({'user_id': req.params.userId, 'date_time': req.query.date_time}, function(err, appointments){
                if(err){
                    return res.status(500).send(err);
                }
                return res.status(200).send(appointments);
            });
        }
        if (req.query.patient_id) {
            console.log('get all appointments for specific patient request');
            Appointment.find({'user_id': req.params.userId, 'patient_id': req.query.patient_id}, function(err, appointments){
                if(err){
                    return res.status(500).send(err);
                }
                return res.status(200).send(appointments);
            });
        }
        console.log('get all appointments for specific user request after current date');
        Appointment.find({'user_id': req.params.userId, date_time: { $gt: new Date()}}, function(err, appointments){
            if(err){
                return res.status(500).send(err);
            }
            return res.status(200).send(appointments);
        });
    })
    
module.exports = router;