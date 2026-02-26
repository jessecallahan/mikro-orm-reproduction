'use client';
import {Actions} from "~/app/_components/action";

export const Admin = ({permissions}) => {
    console.log(permissions);
    return (
        <div>
            <h2>User Permissions</h2>
            {Object.entries(permissions).map(([resource, actions]) => (
                <li key={resource}>
                    <strong>{resource}</strong>
                    <Actions actions={actions} />
                </li>
            ))}
        </div>
    );
};