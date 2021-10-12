export type Style = {
  pointerEvents: string;
  position: string;
  top: number;
  left: number;
  transform: string;
  WebkitTransform: string;
};

declare module 'react-dnd-preview' {
  import {XYCoord} from 'react-dnd';

  type Style = {
    pointerEvents: string;
    position: string;
    top: number;
    left: number;
    transform: string;
    WebkitTransform: string;
  };

  type UsePreviewResults = {
    currentOffset: XYCoord | null;
    isDragging: boolean;
    itemType: string | symbol | null;
    item: any;
    style: Style;
    display: boolean;
  };

  function usePreview(): UsePreviewResults;
}
