const formatMessage = (ip, port, message) => {
    const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return `[${ip}:${port}][${time}]: ${message}`;
};

const formatServerMessage = (message) => {
    const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return `[server][${time}]: ${message}`;
};

module.exports = { formatMessage, formatServerMessage };
