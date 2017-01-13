var mongoose = require('mongoose');
 
var userSchema = mongoose.Schema({
        username: String,
        password: String,
        dropboxToken: String,
        created_at: {type: Date, default: Date.now}
});
 
var patientSchema = new mongoose.Schema({
        user_id: String,
        first_name: String,
        last_name: String,
        parent_name: String,
        date_of_birth: Date,
        phone: String,
        address: String,
        email: String,
        referral: String,
        reason: String,
        medical_history: String,
        medication: String,
        treatment: String,
        first_appointment: Date,
        payment: String,
        price: String,
        notes: String,
        image_url: String
});
 
var appointmentSchema = new mongoose.Schema({
        user_id: String,
        patient_id: String,
        date_time: Date,
        reason: String
});

var dropboxSchema = new mongoose.Schema({
        user_id: String,
        token: String
});

 
mongoose.model("User", userSchema);
mongoose.model("Patient", patientSchema);
mongoose.model("Appointment", appointmentSchema);
mongoose.model("Dropbox", dropboxSchema);