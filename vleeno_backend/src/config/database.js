import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pritam372_db_user:pIcvMegjs9bO9QAj@vleeno.zrqir5h.mongodb.net/vleeno"
  );
};

export default connectDB;
