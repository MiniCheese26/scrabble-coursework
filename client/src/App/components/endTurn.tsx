import React from "react";
import { EndTurnButton } from "Styles/components/endTurn/styles";
import {GameOperations} from "Types/index";

type EndTurnProps = {
  gameOperations: GameOperations
}

export default function EndTurn(props: EndTurnProps) {
  return (
    <EndTurnButton onClick={props.gameOperations.endTurn}>End Turn</EndTurnButton>
  )
}