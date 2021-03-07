import {GameOperations} from "Types/index";
import {LetterWithCount} from "Types/sharedTypes";

export type LettersProps = {
  letters: LetterWithCount[],
  gameOperations: GameOperations
};