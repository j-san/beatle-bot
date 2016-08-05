
import _ from 'underscore';

import materials from './Materials.js';

class Storage {
    constructor() {
        _.keys(materials).forEach((material)=> {
            this[material] = 0;
        });
    }
}


/* read only attributes */
var x = Symbol('x');
var y = Symbol('y');

export default class Building {
    data = {}

    get x() {
        return this[x];
    }
    get y() {
        return this[y];
    }

    get position() {
        return {
            x: this[x],
            y: this[y]
        };
    }

    constructor(position) {
        this[x] = position.x;
        this[y] = position.y;
        this.store = new Storage();
    }

    isBuzy() {
        return !!this.currentBot;
    }
}

export class Deposit extends Building {
    material = 'mineral'
    constructor(position) {
        super(position);
        this.store.mineral = 10000;
    }
}

export class Factory extends Building {
}
