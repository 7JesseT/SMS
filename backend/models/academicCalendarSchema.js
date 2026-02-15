const mongoose = require("mongoose");

const academicCalendarSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    eventType: {
        type: String,
        enum: ['Exam', 'Holiday', 'Event', 'Term', 'Other'],
        default: 'Event'
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("academicCalendar", academicCalendarSchema);
