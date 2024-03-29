export abstract class GameStateLetter {
    protected abstract readonly _letter: string;
    protected abstract readonly _value: number;
    protected abstract _count: number;

    get value(): number {
        return this._value;
    }

    get letter(): string {
        return this._letter;
    }

    get count(): number {
        return this._count;
    }

    set count(value: number) {
        this._count = value;
    }
}

export class LetterA extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "A";
        this._value = 1;
        this._count = 9;
    }
}

export class LetterB extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "B";
        this._value = 3;
        this._count = 2;
    }
}

export class LetterC extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "C";
        this._value = 3;
        this._count = 2;
    }
}

export class LetterD extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "D";
        this._value = 2;
        this._count = 4;
    }
}

export class LetterE extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "E";
        this._value = 1;
        this._count = 12;
    }
}

export class LetterF extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "F";
        this._value = 4;
        this._count = 2;
    }
}

export class LetterG extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "G";
        this._value = 2;
        this._count = 3;
    }
}

export class LetterH extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "H";
        this._value = 4;
        this._count = 2;
    }
}

export class LetterI extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "I";
        this._value = 1;
        this._count = 9;
    }
}

export class LetterJ extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "J";
        this._value = 8;
        this._count = 1;
    }
}

export class LetterK extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "K";
        this._value = 5;
        this._count = 1;
    }
}

export class LetterL extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "L";
        this._value = 1;
        this._count = 4;
    }
}

export class LetterM extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "M";
        this._value = 3;
        this._count = 2;
    }
}

export class LetterN extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "N";
        this._value = 1;
        this._count = 6;
    }
}

export class LetterO extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "O";
        this._value = 1;
        this._count = 8;
    }
}

export class LetterP extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "P";
        this._value = 3;
        this._count = 2;
    }
}

export class LetterQ extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "Q";
        this._value = 10;
        this._count = 1;
    }
}

export class LetterR extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "R";
        this._value = 1;
        this._count = 6;
    }
}

export class LetterS extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "S";
        this._value = 1;
        this._count = 4;
    }
}

export class LetterT extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "T";
        this._value = 1;
        this._count = 6;
    }
}

export class LetterU extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "U";
        this._value = 1;
        this._count = 4;
    }
}

export class LetterV extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "V";
        this._value = 4;
        this._count = 2;
    }
}

export class LetterW extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "W";
        this._value = 4;
        this._count = 2;
    }
}

export class LetterX extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "X";
        this._value = 8;
        this._count = 1;
    }
}

export class LetterY extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "Y";
        this._value = 4;
        this._count = 2;
    }
}

export class LetterZ extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "Z";
        this._value = 10;
        this._count = 1;
    }
}

export class LetterBlank extends GameStateLetter {
    protected readonly _letter: string;
    protected readonly _value: number;
    protected _count: number;

    constructor() {
        super();
        this._letter = "";
        this._value = 0;
        this._count = 2;
    }
}

export const GameLetters = [
    new LetterA(),
    new LetterB(),
    new LetterC(),
    new LetterD(),
    new LetterE(),
    new LetterF(),
    new LetterG(),
    new LetterH(),
    new LetterI(),
    new LetterJ(),
    new LetterK(),
    new LetterL(),
    new LetterM(),
    new LetterN(),
    new LetterO(),
    new LetterP(),
    new LetterQ(),
    new LetterR(),
    new LetterS(),
    new LetterT(),
    new LetterU(),
    new LetterV(),
    new LetterW(),
    new LetterX(),
    new LetterY(),
    new LetterZ(),
    new LetterBlank(),
];
