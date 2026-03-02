import {filterAllPermissionsStartingWith} from "~/functions/filter-all-permissions-starting-with";

export const authorizeForResourceStartingWith = (obj, substring) => {
    const filteredPermissions = filterAllPermissionsStartingWith(obj, substring);
    return Object.values(filteredPermissions).length > 0;
};