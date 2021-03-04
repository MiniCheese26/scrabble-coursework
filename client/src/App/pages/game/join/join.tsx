import React, {useState} from "react";
import {InputOption} from "Styles/game/styles";
import {JoinButton} from "Styles/game/join/styles";

export default function Join(): JSX.Element {
    const [code, setCode] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
    }

    const handleSubmit = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
    }

    return (
        <>
            <InputOption placeholder="Game Code" maxLength={4} onChange={handleChange}/>
            <JoinButton to="/joinGame" onClick={handleSubmit}>Join</JoinButton>
        </>
    )
}