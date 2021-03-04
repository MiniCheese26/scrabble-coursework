export abstract class TileBase {
    abstract backgroundColour: string;
    abstract topText: string;
    abstract bottomText: string;
    abstract textColour: string;
}

export class ThreeWordTile extends TileBase {
    backgroundColour;
    topText;
    bottomText;
    textColour;

    constructor() {
        super();
        this.backgroundColour = "#F00";
        this.topText = "3X";
        this.bottomText = "WS";
        this.textColour = "#FFF";
    }
}

export class TwoWordTile extends TileBase {
    backgroundColour;
    topText;
    bottomText;
    textColour;

    constructor() {
        super();
        this.backgroundColour = "#f700ff";
        this.topText = "2X";
        this.bottomText = "WS";
        this.textColour = "#000";
    }
}

export class ThreeLetterTile extends TileBase {
    backgroundColour;
    topText;
    bottomText;
    textColour;

    constructor() {
        super();
        this.backgroundColour = "#002aff";
        this.topText = "3X";
        this.bottomText = "LS";
        this.textColour = "#FFF";
    }
}

export class TwoLetterTile extends TileBase {
    backgroundColour;
    topText;
    bottomText;
    textColour;

    constructor() {
        super();
        this.backgroundColour = "#00a6ff";
        this.topText = "2X";
        this.bottomText = "LS";
        this.textColour = "#000";
    }
}

export class StartingTile extends TileBase {
    backgroundColour;
    topText;
    bottomText;
    textColour;

    constructor() {
        super();
        this.backgroundColour = "#f700ff";
        this.topText = "Start";
        this.bottomText = "";
        this.textColour = "#000";
    }
}

export class EmptyTile extends TileBase {
    backgroundColour;
    topText;
    bottomText;
    textColour;

    constructor() {
        super();
        this.backgroundColour = "#FFF";
        this.topText = "";
        this.bottomText = "";
        this.textColour = "";
    }
}