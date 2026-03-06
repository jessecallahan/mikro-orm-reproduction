'use client';
import {Actions} from "~/app/_components/action";
import type {PermissionsMapAsArray} from "~/app/_components/session-info";

export const Admin = ({permissions}: {permissions: PermissionsMapAsArray}) => {
    console.log(permissions);
    return (
        <div>
            {permissions.map(([resource, actions]) => (
                <li className="mx-4" key={resource}>
                    <strong>{resource}</strong>
                    <Actions actions={actions} />
                </li>
            ))}
        </div>
    );
};