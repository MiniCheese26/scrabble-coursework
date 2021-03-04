import {PlayerWrapper, SingleplayerCreation, StartGame} from "Styles/game/createLocal/styles";
import Player from "Components/player";
import {Break} from "Styles/utils";
import React, {ChangeEvent, useState} from "react";
import {CreateLocalProps} from "Types/createLocal";
import {GameStatePlayerType, LocalPlayer} from "Types/sharedTypes";
import {useHistory} from "react-router-dom";

export default function CreateLocal(props: CreateLocalProps): JSX.Element {
    const [players, setPlayers] = useState<LocalPlayer[]>([
        {
            name: "1",
            type: "Human",
            id: "0"
        },
        {
            name: "2",
            type: "Human",
            id: "1"
        },
        {
            name: "",
            type: "Empty",
            id: "2"
        },
        {
            name: "",
            type: "Ignore",
            id: "3"
        }
    ]);

    const history = useHistory();

    const handleSetPlayers = (newType: GameStatePlayerType, index: number) => {
        const playersCopy = [...players];

        if (newType === "Empty") {
            const f = playersCopy.filter(x => x.type !== "Ignore" && x.type !== "Empty").length - 1;

            if (index < f) {
                for (let i = index + 1; i < f + 1; i++) {
                    playersCopy[i - 1] = playersCopy[i];
                }

                if (index < 3) {
                    playersCopy[index + 1].type = "Ignore";
                }
            } else {
                playersCopy[index].name = "";
                playersCopy[index].type = newType;

                if (index < 3) {
                    playersCopy[index + 1].type = "Ignore";
                }
            }
        } else {
            playersCopy[index].name = "";
            playersCopy[index].type = newType;

            if (newType === "Ai") {
                playersCopy[index].name = `AI${index + 1}`;
            }

            if (index < 3) {
                playersCopy[index + 1].type = "Empty";
            }

        }

        setPlayers(playersCopy);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const playersCopy = [...players];
        playersCopy[index].name = e.target.value;
        setPlayers(playersCopy);
    };

    const onStartGame = () => {
        props.createLocalGame(players);
        history.push("/game");
    };

    return (
        <SingleplayerCreation>
            <PlayerWrapper gridArea={"player1"}>
                <Player handlePlayers={handleSetPlayers} handleInput={handleInputChange} players={players} index={0}/>
            </PlayerWrapper>
            <PlayerWrapper gridArea={"player2"}>
                <Player handlePlayers={handleSetPlayers} handleInput={handleInputChange} players={players} index={1}/>
            </PlayerWrapper>
            <Break/>
            <PlayerWrapper gridArea={"player3"}>
                <Player handlePlayers={handleSetPlayers} handleInput={handleInputChange} players={players} index={2}/>
            </PlayerWrapper>
            <PlayerWrapper gridArea={"player4"}>
                <Player handlePlayers={handleSetPlayers} handleInput={handleInputChange} players={players} index={3}/>
            </PlayerWrapper>
            <StartGame onClick={onStartGame}>Start Game</StartGame>
        </SingleplayerCreation>
    );
}
