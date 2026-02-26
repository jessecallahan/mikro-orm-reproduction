export const hasMatchingField = (obj, substring) => {
    // Get all the object's own property names as an array
    const keys = Object.keys(obj);

    // Check if any key in the array includes the specified substring
    return keys.some(key => key.includes(substring));
};