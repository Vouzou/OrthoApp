var mongoose = require('mongoose');
 
var userSchema = mongoose.Schema({
                username: String,
                password: String,
                created_at: {type: Date, default: Date.now}
});
 
var patientSchema = new mongoose.Schema({
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
                patient_name: String,
                date_time: Date
});
 
mongoose.model("User", userSchema);
mongoose.model("Patient", patientSchema);
mongoose.model("Appointment", appointmentSchema);