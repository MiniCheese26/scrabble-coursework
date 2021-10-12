import Player from 'Components/player';
import React, {ChangeEvent, useState} from 'react';
import {GamePlayerType, LocalPlayer} from 'Types/sharedTypes';
import {useHistory} from 'react-router-dom';
import {CreateLocalProps} from 'Types/props';
import { PlayerWrapper } from 'Styles/layout/lobbyCard';
import { LobbyBox, StartGame } from 'Styles/layout/lobby';

export default function CreateLocal(props: CreateLocalProps): JSX.Element {
    const [players, setPlayers] = useState<LocalPlayer[]>([
        {
            name: '1',
            type: 'Human',
            id: '0'
        },
        {
            name: '2',
            type: 'Human',
            id: '1'
        },
        {
            name: '',
            type: 'Empty',
            id: '2'
        },
        {
            name: '',
            type: 'Empty',
            id: '3'
        }
    ]);

    const history = useHistory();

    const handleSetPlayers = (newType: GamePlayerType, index: number) => {
        const playersClone = [...players];

        playersClone[index].type = newType;

        if (playersClone[index].type === 'Empty') {
            playersClone[index].name = `Player ${index + 1}`;
        }

        setPlayers(playersClone);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const playersCopy = [...players];
        playersCopy[index].name = e.target.value;
        setPlayers(playersCopy);
    };

    const onStartGame = () => {
        if ([...players].every(x => x.type === 'Empty')) {
            return;
        }

        const playersClone = [...players];

        for (const player of playersClone) {
            if (player.type !== 'Empty' && player.name.trim().length === 0) {
                player.name = `Player ${Number.parseInt(player.id) + 1}`;
            }
        }

        setPlayers(playersClone);

        props.socketOperations.current.createLocalGame({localPlayers: players});
        history.push('/game');
    };

    return (
        <LobbyBox>
            <PlayerWrapper gridArea={'player1'}>
                <Player handlePlayers={handleSetPlayers} handleInput={handleInputChange} player={players[0]}/>
            </PlayerWrapper>
            <PlayerWrapper gridArea={'player2'}>
                <Player handlePlayers={handleSetPlayers} handleInput={handleInputChange} player={players[1]}/>
            </PlayerWrapper>
            <PlayerWrapper gridArea={'player3'}>
                <Player handlePlayers={handleSetPlayers} handleInput={handleInputChange} player={players[2]}/>
            </PlayerWrapper>
            <PlayerWrapper gridArea={'player4'}>
                <Player handlePlayers={handleSetPlayers} handleInput={handleInputChange} player={players[3]}/>
            </PlayerWrapper>
            <StartGame onClick={onStartGame}>Start Game</StartGame>
        </LobbyBox>
    );
}
