import {Letter} from "Types/sharedTypes";

export type LetterTradeToggleType = "select" | "deselect";

export type LetterProps = {
    letter: string,
    value: number,
    isTradingLetters: boolean,
    onLetterTradeToggled(letter: Letter, type: LetterTradeToggleType): void
};

export type LetterDragItem = {
    type: "letter"
} & Letter;