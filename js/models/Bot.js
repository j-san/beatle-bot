
import EventEmitter from 'wolfy87-eventemitter';

import {Drive, BootBuilding, LoadMaterial, UnloadMaterial, Smelt, BuildBot} from './Actions.js';
import processUnit from './ProcessUnit.js';


class Cargo {
    capacity = 100;
    quantity = 0;
    material = null;
}


/* read only attributes */
var x = Symbol('x');
var y = Symbol('y');

export default class Bot extends EventEmitter {
    data = {};

    maxVelocity = 2;
    acceleration = 0.01;
    turnVelocity = 0.01;

    direction = 0;

    velocity = 0;
    turn = 0; /* 1: right, -1: left, 0: ahead */
    stepOn = 0; /* 1: step on, -1: brake, 0: no velocity change */

    constructor(program) {
        super();
        this[x] = 0;
        this[y] = 0;
        this.program = program;
        this.cargo = new Cargo();
    }
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

    goto(destination) {
        return new Drive(this, destination);
    }
    bootBuilding() {
        return new BootBuilding(this);
    }
    loadMaterial(building) {
        return new LoadMaterial(this, building);
    }
    unloadMaterial(building) {
        return new UnloadMaterial(this, building);
    }
    smelt(building) {
        return new Smelt(this, building);
    }
    buildBot(building) {
        return new BuildBot(this, building);
    }

    move(delta) {
        var timeFactor = delta / 20;
        this.velocity += this.stepOn * this.acceleration * timeFactor;

        if (this.velocity > this.maxVelocity) {
            this.velocity = this.maxVelocity;
        }
        if (this.velocity > this.maxVelocity) {
            this.stepOn = 0;
        }
        this.direction += this.turn * this.turnVelocity * timeFactor;

        this[x] += this.velocity * timeFactor * Math.sin(this.direction);
        this[y] -= this.velocity * timeFactor * Math.cos(this.direction);
    }

    stop() {
        this.stepOn = -1;
        this.turn = 0;
    }

    reboot(program) {
        processUnit.rebootBot(this, program);
    }

    isMoving() {
        return this.stepOn > 0 || this.velocity > this.acceleration;
    }
}