'use client';
import {allowedActionIcon} from "~/functions/allowed-action-icon";
import type {Permission} from "~/app/_components/session-info";

export const Actions = ({actions}: { actions: Permission }) => {
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