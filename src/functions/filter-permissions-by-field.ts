export const filterPermissionsByField = (obj, substring) => Object.fromEntries(
    Object.entries(obj).filter(([key]) => {
        return key.includes(substring);
    })
);