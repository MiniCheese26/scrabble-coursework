declare module "*.png";
declare module "*.woff";
declare module "*.woff2";
declare module "react-dnd-preview" {
    import {XYCoord} from "react-dnd";

    interface Style {
        pointerEvents: string;
        position: string;
        top: number;
        left: number;
        transform: string;
        WebkitTransform: string;
    }

    interface UsePreviewResults {
        currentOffset: XYCoord | null;
        isDragging: boolean;
        itemType: string | symbol | null;
        item: any;
        style: Style;
        display: boolean;
    }

    function usePreview(): UsePreviewResults;
}