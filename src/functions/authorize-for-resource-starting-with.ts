import type { PermissionsMapAsArray } from "~/app/_components/session-info";
import {filterAllPermissionsStartingWith} from "~/functions/filter-all-permissions-starting-with";

export const authorizeForResourceStartingWith = (obj: PermissionsMapAsArray | null, substring: string) => {
    const filteredPermissions = filterAllPermissionsStartingWith(obj, substring);
    return Object.values(filteredPermissions).length > 0;
};