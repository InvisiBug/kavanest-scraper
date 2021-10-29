import mongoose from "mongoose";

const sunSchema = new mongoose.Schema({
  id: { type: String },
  state: { type: String },
});

export default sunSchema;
