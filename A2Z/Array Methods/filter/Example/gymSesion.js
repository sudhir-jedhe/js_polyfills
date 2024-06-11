function selectData(sessions, options) {
    return sessions.filter(session => {
        // Check if session meets all filter criteria
        return (
            (!options.date || session.date === options.date) &&
            (!options.type || session.type === options.type) &&
            (!options.duration || session.duration >= options.duration) &&
            (!options.trainer || session.trainer === options.trainer)
        );
    });
}

// Example usage:
const sessions = [
    { date: '2024-06-01', type: 'Strength Training', duration: 60, trainer: 'John' },
    { date: '2024-06-02', type: 'Cardio', duration: 45, trainer: 'Alice' },
    { date: '2024-06-03', type: 'Yoga', duration: 90, trainer: 'Bob' }
];

const options = {
    date: '2024-06-02',
    type: 'Cardio',
    duration: 40,
    trainer: 'Alice'
};

const selectedSessions = selectData(sessions, options);
console.log(selectedSessions);
