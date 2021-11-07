import mongoose from "mongoose";

const sunSchema = new mongoose.Schema({
  id: { type: String },
  state: { type: Boolean },
  connected: { type: Boolean },
});

export default sunSchema;
