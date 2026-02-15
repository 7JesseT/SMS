const mongoose = require("mongoose");

const prayerScheduleSchema = new mongoose.Schema({
    prayerName: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("prayerSchedule", prayerScheduleSchema);
