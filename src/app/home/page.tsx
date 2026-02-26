'use client';
import {SessionInfo} from "~/app/_components/session-info";

export default function Home() {
    return (
            <div className="m-16 w-full">
                <h1>Home</h1>
                <SessionInfo/>
            </div>
    );
}
