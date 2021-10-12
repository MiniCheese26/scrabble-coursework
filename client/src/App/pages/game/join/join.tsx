import React, {useState} from 'react';
import { InputOption } from 'Styles/layout/inputOption';
import { SubmitButtonLink } from 'Styles/layout/submitButton';

export default function Join(): JSX.Element {
    const [lobbyId, setLobbyId] = useState('');

    return (
        <>
            <InputOption onChange={(e) => setLobbyId(e.target.value)} placeholder='Game Code' maxLength={8}/>
            <SubmitButtonLink to={{
                pathname: '/joiningGame',
                state: lobbyId
            }}>Join</SubmitButtonLink>
        </>
    );
}
