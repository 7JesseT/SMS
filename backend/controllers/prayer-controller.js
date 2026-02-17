const PrayerSchedule = require('../models/prayerScheduleSchema.js');

// Create prayer schedule
const createPrayerSchedule = async (req, res) => {
    try {
        const { prayerName, time, description, school } = req.body;

        const prayer = new PrayerSchedule({
            prayerName,
            time,
            description,
            school
        });

        const result = await prayer.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong! Please try again.', error: error.message });
    }
};

// Get all prayer schedules for a school
const getPrayerSchedules = async (req, res) => {
    try {
        const prayers = await PrayerSchedule.find({ school: req.params.schoolId })
            .sort({ time: 1 });
        res.json(prayers);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong! Please try again.', error: error.message });
    }
};

// Update prayer schedule
const updatePrayerSchedule = async (req, res) => {
    try {
        const prayer = await PrayerSchedule.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!prayer) {
            return res.status(404).json({ message: 'Prayer schedule not found' });
        }

        res.json(prayer);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong! Please try again.', error: error.message });
    }
};

// Delete prayer schedule
const deletePrayerSchedule = async (req, res) => {
    try {
        const prayer = await PrayerSchedule.findByIdAndDelete(req.params.id);
        
        if (!prayer) {
            return res.status(404).json({ message: 'Prayer schedule not found' });
        }

        res.json({ message: 'Prayer schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong! Please try again.', error: error.message });
    }
};

module.exports = {
    createPrayerSchedule,
    getPrayerSchedules,
    updatePrayerSchedule,
    deletePrayerSchedule
};
