import {Schema, model} from "mongoose";

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    age: {type: Number, required: true},
    gender: {type: String, required: true},
    isAdmin: {type: Boolean, required: true, default: false}
});

export default model("User", userSchema);