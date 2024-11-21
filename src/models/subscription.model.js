import { Schema } from "mongoose";

const SubscriptionSchema = new Schema({
    subsciber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    subsciberCount: {
        type: Number,
        default: 0
    }
});

export default Subscription = mongoose.model("Subscription", SubscriptionSchema);