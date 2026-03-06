import type {PermissionsMapAsArray} from "~/app/_components/session-info";

export const filterAllPermissionsStartingWith = (obj: PermissionsMapAsArray | null, substring: string) => {
    if (obj === null) {
        return [] as PermissionsMapAsArray;
    }

    return obj.filter(([key]) => {
        return key.includes(substring);
    });

};