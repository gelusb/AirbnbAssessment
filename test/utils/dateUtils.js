module.exports.getFormattedDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`; // Format: MM/DD/YYYY
};

