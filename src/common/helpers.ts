const addDaysToCurrentDate = (days) => (new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000));

export { addDaysToCurrentDate };
