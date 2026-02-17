const AcademicCalendar = require('../models/academicCalendarSchema.js');

// Create academic calendar event
const createCalendarEvent = async (req, res) => {
    try {
        const { title, description, startDate, endDate, eventType, school } = req.body;

        const event = new AcademicCalendar({
            title,
            description,
            startDate,
            endDate,
            eventType,
            school
        });

        const result = await event.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong! Please try again.', error: error.message });
    }
};

// Get all calendar events for a school
const getCalendarEvents = async (req, res) => {
    try {
        const events = await AcademicCalendar.find({ school: req.params.schoolId })
            .sort({ startDate: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong! Please try again.', error: error.message });
    }
};

// Update calendar event
const updateCalendarEvent = async (req, res) => {
    try {
        const event = await AcademicCalendar.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong! Please try again.', error: error.message });
    }
};

// Delete calendar event
const deleteCalendarEvent = async (req, res) => {
    try {
        const event = await AcademicCalendar.findByIdAndDelete(req.params.id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong! Please try again.', error: error.message });
    }
};

module.exports = {
    createCalendarEvent,
    getCalendarEvents,
    updateCalendarEvent,
    deleteCalendarEvent
};
