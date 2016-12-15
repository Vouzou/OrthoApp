var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Patient = mongoose.model('Patient');
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
    return res.redirect('/#login');
    };

    //Register the authentication middleware
    router.use('/patients', isAuthenticated);

    router.route('/patients')
    //creates a new patient
    .post(function(req, res){

        var patient = new Patient();
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

        patient.save(function(err, patient) {
            if (err){
                return res.send(500, err);
            }
            return res.json(patient);
        });
    })
    //gets all patients
    .get(function(req, res){
        console.log('debug1');
        Patient.find(function(err, patients){
            console.log('debug2');
            if(err){
                return res.send(500, err);
            }
            return res.send(200,patients);
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

                patient.save(function(err, patient){
                if(err)
                    res.send(err);

                res.json(patient);
                });
            });
        })
        //deletes the patient
        .delete(function(req, res) {
            Patient.remove({
                _id: req.params.id
            }, function(err) {
                if (err)
                    res.send(err);
                res.json("deleted :(");
            });
    });
 
module.exports = router;