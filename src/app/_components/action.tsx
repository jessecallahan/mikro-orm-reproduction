'use client';
import {allowedActionIcon} from "~/functions/allowed-action-icon";

export const Actions = ({actions}) => {
    return (
        <span>
            {Object.entries(actions).map(([action, allowed]) => (
                <span key={action}>
                    {allowed ? allowedActionIcon(action) : null}
                </span>
            ))}
        </span>
    );
};