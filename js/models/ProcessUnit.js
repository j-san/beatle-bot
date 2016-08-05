/* global regeneratorRuntime */
import EventEmitter from 'wolfy87-eventemitter';
import {transform} from 'babel-standalone';

import Bot from '../models/Bot.js';

class ProcessUnit extends EventEmitter {

    DEFAULT_RUNTIME = `/*
______  _____   ___  ______ ___  ___ _____ 
| ___ \\|  ___| / _ \\ |  _  \\|  \\/  ||  ___|
| |_/ /| |__  / /_\\ \\| | | || .  . || |__  
|    / |  __| |  _  || | | || |\\/| ||  __| 
| |\\ \\ | |___ | | | || |/ / | |  | || |___ 
\\_| \\_|\\____/ \\_| |_/|___/  \\_|  |_/\\____/ 

\`yield\` bot actions and it will do the job for you.

More info [here].
*/

export default function* main(bot, processUnit) {
    var factory = processUnit.buildings[0];
    var deposit = processUnit.buildings[1];
    yield bot.goto(deposit.position);
    yield bot.loadMaterial(deposit);
    yield bot.goto(factory.position);
    yield bot.unloadMaterial(factory);
    yield bot.smelt(factory);
    if (factory.store.metal >= 100) {
        yield bot.buildBot(factory);
    }
}
`
    bots = [];
    buildings = [];
    accelerate = 4;
    add(object) {
        if (object instanceof Bot) {
            this.bots.push(object);
        } else {
            this.buildings.push(object);
        }
    }
    resume() {
        this.clockTimer = setInterval(this.loop.bind(this), 200 / this.accelerate);
        this.animate();
    }
    pause() {
        clearInterval(this.clockTimer);
        cancelAnimationFrame(this.animationTimer);
        this.animationTimer = null;
        this.lastTime = null;
    }
    loop() {
        this.bots.forEach((bot)=> {
            if (bot.runtime && bot.runtime.action && bot.runtime.action.runnable()) {
                bot.runtime.action.loop();
            }
        });
    }
    animate() {
        var now = Date.now();
        var deltaTime = (now - this.lastTime) * this.accelerate;
        if (this.lastTime && deltaTime < 1000) {
            this.bots.forEach((bot)=> {
                if (bot.isMoving()) {
                    bot.move(deltaTime);
                }
                if (bot.runtime && bot.runtime.action && bot.runtime.action.runnable()) {
                    bot.runtime.action.animate(deltaTime);
                }
            });
            this.trigger('animate');
        }
        this.lastTime = now;

        this.animationTimer = requestAnimationFrame(this.animate.bind(this));
    }


    loadCode(source) {
        this.source = source;
        this.code = transform(source, {presets: ['es2015', 'stage-1']}).code;

        var init = new Function('exports', 'regeneratorRuntime', this.code);
        var exports = {};
        init(exports, regeneratorRuntime);
        this.defaultProgram = exports.default;

        this.bots.forEach((bot)=> {
            bot.reboot(this.defaultProgram);
        });
    }

    rebootBot(bot, program) {
        if (bot.runtime) {
            bot.runtime.stop();
        }
        if (program) {
            bot.program = program;
        }

        bot.runtime = new Runtime();
        bot.runtime.start(bot, this).then(()=> {
            this.rebootBot(bot);
        });
    }
}

class Runtime {
    start(bot, processUnit) {
        this.iterator = bot.program(bot, processUnit);
        return new Promise((resolve, reject)=> {
            return this.next(resolve, reject);
        });
    }
    stop() {
        this.stopped = true;
    }
    next(resolve, reject, previous) {
        if (this.stopped) {
            reject();
        }
        var action = this.iterator.next(previous).value;
        if (action instanceof Promise) {
            action.then(()=> {
                return this.next(resolve, reject);
            });
        } else if (action) { // instanceof Action
            this.action = action;
            action.run().then((result)=> {
                this.action = null;
                return this.next(resolve, reject, result);
            });
        } else {
            resolve();
        }
    }
}

export default new ProcessUnit();