
import {Factory} from './Building.js';
import Bot from './Bot.js';
import processUnit from './ProcessUnit.js';


class Action {
    constructor(bot) {
        this.bot = bot;
    }
    run() {
        return new Promise((resolve, reject)=> {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
    loop() {}
    runnable() {
        return true;
    }
    animate() {}
}

export class Drive extends Action {
    constructor(bot, destination) {
        super(bot);
        this.destination = destination;
    }
    animate() {}
    loop() {
        var bot = this.bot;
        var distance = Math.sqrt(Math.pow(this.destination.x - bot.x, 2) + Math.pow(this.destination.y - bot.y, 2));
        var targetDirection = Math.acos((bot.y - this.destination.y) / distance);

        if (bot.x - this.destination.x > 0) {
            targetDirection = -targetDirection;
        }

        var directionVariance = this.normalizeAngle(targetDirection - bot.direction);
        if (directionVariance > Math.PI) {
            directionVariance -= 2 * Math.PI;
        }

        bot.turn = this.limit(2 * directionVariance, -1, 1);

        var brakeDistance = Math.pow(bot.velocity, 2) / (2 * bot.acceleration);

        if (distance < 1.5 * brakeDistance || distance < 4 * Math.abs(bot.turn) * brakeDistance) {
            bot.stepOn = -1;
        } else {
            bot.stepOn = 1;
        }

        if (distance < 50) {
            bot.stop();
            this.resolve();
        }
    }
    normalizeAngle(angle) {
        while (angle < 0) {
            angle += 2 * Math.PI;
        }
        return angle % (2 * Math.PI);
    }
    limit(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }
}

export class BootBuilding extends Action {
    run() {
        var buildingHere = processUnit.buildings.some((building)=> {
            return Math.abs(building.x - this.bot.x) < 200 && Math.abs(building.y - this.bot.y) < 200;
        });
        if(buildingHere) {
            return Promise.reject(new Error('There is already a building here'));
        }
        var building = new Factory({x: this.bot.x, y: this.bot.y});
        processUnit.add(building);
        return Promise.resolve(building);
    }
}

/* Buildings actions */

class BuildingAction extends Action {
    constructor(bot, building) {
        super(bot);
        this.building = building;
    }
    run() {
        return new Promise((resolve, reject)=> {
            this.resolve = (value)=> {
                this.building.currentBot = null;
                resolve(value);
            };
            this.reject = reject;
        });
    }
    loop() {
        var distance = Math.sqrt(
            Math.pow(this.bot.x - this.building.position.x, 2) + 
            Math.pow(this.bot.y - this.building.position.y, 2)
        );
        if (distance > 100) {
            this.reject();
        }
    }
    runnable() {
        if (!this.building.currentBot) {
            this.building.currentBot = this.bot;
        }
        return this.building.currentBot === this.bot;
    }
    animate() {}
}

export class LoadMaterial extends BuildingAction {
    run() {
        this.bot.cargo.quantity = 0;
        this.bot.cargo.material = this.building.material;
        return super.run();
    }
    animate(delta) {
        var quantity = delta / 100;
        quantity = Math.min(quantity, this.building.store[this.building.material]);
        quantity = Math.min(quantity, this.bot.cargo.capacity - this.bot.cargo.quantity);
        this.bot.cargo.quantity += quantity;
        this.building.store[this.building.material] -= quantity;
        if(this.bot.cargo.quantity >= this.bot.cargo.capacity) {
            this.resolve();
        }
    }
}

export class UnloadMaterial extends BuildingAction {
    animate(delta) {
        var quantity = delta / 100;
        quantity = Math.min(quantity, this.bot.cargo.quantity);
        this.bot.cargo.quantity -= quantity;
        this.building.store[this.bot.cargo.material] += quantity;
        if(this.bot.cargo.quantity <= 0) {
            this.resolve();
        }
    }
}

export class Smelt extends BuildingAction {
    animate(delta) {
        var quantity = delta / 100;
        quantity = Math.min(quantity, this.building.store.mineral);
        this.building.store.mineral -= quantity;
        this.building.store.metal += quantity / 4;
        if(this.building.store.mineral <= 0) {
            this.resolve();
        }
    }
}

export class BuildBot extends BuildingAction {
    run() {
        if (this.building.store.metal < 100) {
            return Promise.reject();
        }
        this.building.store.metal -= 100;
        this.newBot = new Bot();
        this.newBot.accumulator = 0;
        processUnit.add(this.newBot);
        return super.run();
    }
    animate(delta) {
        this.newBot.accumulator += delta / 60000;
        if(this.newBot.accumulator >= 1) {
            this.newBot.reboot(this.bot.program);
            this.newBot.accumulator = null;
            this.resolve(this.newBot);
        }
    }
}

