// Don't know what's causing this the declare module is valid
// @ts-ignore
import {usePreview} from 'react-dnd-preview';
import React from 'react';
import {LetterText, LetterValue, PreviewLetterBox } from 'Styles/layout/letter';
import {LetterDragItem} from 'Types/types';
import {Style} from 'Types/preview';

export default function Preview(): JSX.Element | null {
    const {display, item, style}: {display: boolean, item: LetterDragItem, style: Style} = usePreview();

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
