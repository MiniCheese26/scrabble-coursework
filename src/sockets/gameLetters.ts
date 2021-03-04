export abstract class Letter {
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

export class LetterA extends Letter {
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

export class LetterB extends Letter {
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

export class LetterC extends Letter {
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

export class LetterD extends Letter {
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

export class LetterE extends Letter {
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

export class LetterF extends Letter {
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

export class LetterG extends Letter {
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

export class LetterH extends Letter {
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

export class LetterI extends Letter {
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

export class LetterJ extends Letter {
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

export class LetterK extends Letter {
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

export class LetterL extends Letter {
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

export class LetterM extends Letter {
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

export class LetterN extends Letter {
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

export class LetterO extends Letter {
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

export class LetterP extends Letter {
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

export class LetterQ extends Letter {
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

export class LetterR extends Letter {
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

export class LetterS extends Letter {
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

export class LetterT extends Letter {
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

export class LetterU extends Letter {
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

export class LetterV extends Letter {
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

export class LetterW extends Letter {
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

export class LetterX extends Letter {
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

export class LetterY extends Letter {
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

export class LetterZ extends Letter {
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

export class LetterBlank extends Letter {
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