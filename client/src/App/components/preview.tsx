import {usePreview} from "react-dnd-preview";
import {LetterText, LetterValue, PreviewLetterBox} from "Styles/components/letter/styles";
import React from "react";

export default function Preview(): JSX.Element | null {
    const {display, item, style} = usePreview();

    if (!display) {
        return null;
    }

    return (
        <PreviewLetterBox WebkitTransform={style.WebkitTransform} transform={style.transform}
                          top={style.top} position={style.position} pointerEvents={style.pointerEvents}
                          left={style.left}>
            <LetterText>{item.letter}</LetterText>
            <LetterValue>{item.value}</LetterValue>
        </PreviewLetterBox>
    );
}