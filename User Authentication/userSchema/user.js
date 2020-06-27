let mongoose= require("mongoose");

let userSchema = mongoose.Schema({
    firstname: { type: String, min: 4, max: 100, required: true },
    lastname: { type: String, min: 4, max: 100, required: true },
    Address: { type: String, required: true },
    UserLogin: {
      EmailId: { type: String, unique: true },
      Password: { type: String, required: true, min: 4, max: 1000 },
    },
  });
  
  let User = mongoose.model("password_encryptions", userSchema);
  
  module.exports = User;
  