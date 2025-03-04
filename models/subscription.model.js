import mongoose from "mongoose"



const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription Name is required"],
        trim: true,
        minLength: 3,
        maxLength: 100
    },
    price : {
        type: Number,
        required: [true, "Subscription Price is required"],
        min: [0, "Price cannot be negative"]
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        default: 'USD'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: 'monthly'
    },
    category: {
        type: String,
        enum: ['sports', 'news', "entertainment", "education", "lifestyle", "technology", "other"],
        required: [true, "Subscription Category is required"]
    },
    paymentMethod: {
        type: String,
        required: [true, "Payment Method is required"],
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'trial', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: [true, "Subscription Start Date is required"],
        validate : {
            validator : (value) => value <= Date.now(),
            message: "Start Date must be in the past"
        }
    },
    renewalDate: {
        type: Date,
        required: [true, "Subscription Start Date is required"],
        validate : {
            validator : function (value) {
                return value > this.startDate
            },
            message: "Renewal Date must be after the Start Date"
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true
    }
}, { timestamps: true });

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;