/* eslint-env mocha */

import React from 'react';
import ReactDOM from 'react-dom';
import {expect} from 'chai';

import Bot from '../js/models/Bot.js';
import BotView from '../js/views/BotView.jsx';

describe('Bot', function() {

    var elem, bot;

    beforeEach(function () {
        bot = new Bot;
        elem = document.createElement('div');

        ReactDOM.render(
            React.createElement(BotView, {bot: bot}),
            elem
        );
    });

    it('should init', function() {
        expect(bot.velocity).equal(0);
        expect(bot.turn).equal(0);
        expect(bot.stepOn).equal(0);
        expect(bot.x).equal(0);
        expect(bot.y).equal(0);
    });
    it('should drive to front', function() {
        var drive = bot.goto({ x: 250, y: 200 });
        drive.run();
        drive.loop();

        expect(bot.stepOn).equal(1);
    });

    it('should brake', function() {
        var drive = bot.goto({ x: 250, y: 200 });
        drive.run();
        drive.loop();

        expect(bot.stepOn).equal(1);

        bot.stop();

        expect(bot.stepOn).equal(-1);
    });
    it('should turn', function() {
        [
            [{'x': -30, 'y': -50}, -1],
            [{'x': -50, 'y': -30}, -1],
            [{'x': -50, 'y':   0}, -1],

            [{'x': -50, 'y':  30}, -1],
            [{'x': -30, 'y':  50}, -1],
            [{'x':   0, 'y':  50},  1],

            [{'x':  50, 'y':  30},  1],
            [{'x':  30, 'y':  50},  1],
            [{'x':  50, 'y':   0},  1],

            [{'x':  50, 'y': -30},  1],
            [{'x':  30, 'y': -50},  1],
            [{'x':   0, 'y': -50},  0],
        ].forEach(function (args) {
            var [destination, expected] = args;

            var drive = bot.goto(destination);
            drive.run();
            drive.loop();

            if (expected === 1) {
                expect(bot.turn).gt(0);
            } else if (expected === -1) {
                expect(bot.turn).lt(0);
            } else {
                expect(bot.turn).equal(expected);
            }
        });
    });

    it('should turn when directed to left', function() {
        bot.direction = -Math.PI / 2;
        
        [
            [{'x': -30, 'y': -50},  1],
            [{'x': -50, 'y': -30},  1],
            [{'x': -50, 'y':   0},  0],

            [{'x': -50, 'y':  30}, -1],
            [{'x': -30, 'y':  50}, -1],
            [{'x':   0, 'y':  50}, -1],

            [{'x':  50, 'y':  30}, -1],
            [{'x':  30, 'y':  50}, -1],
            [{'x':  50, 'y':   0},  1],

            [{'x':  50, 'y': -30},  1],
            [{'x':  30, 'y': -50},  1],
            [{'x':   0, 'y': -50},  1],
        ].forEach(function (args) {
            var [destination, expected] = args;

            var drive = bot.goto(destination);
            drive.run();
            drive.loop();

            if (expected === 1) {
                expect(bot.turn).gt(0);
            } else if (expected === -1) {
                expect(bot.turn).lt(0);
            } else {
                expect(bot.turn).equal(expected);
            }

        });
    });

    it('should turn when directed to right', function() {
        bot.direction = Math.PI / 2;
        
        [
            [{'x': -30, 'y': -50}, -1],
            [{'x': -50, 'y': -30}, -1],
            [{'x': -50, 'y':   0},  1],

            [{'x': -50, 'y':  30},  1],
            [{'x': -30, 'y':  50},  1],
            [{'x':   0, 'y':  50},  1],

            [{'x':  50, 'y':  30},  1],
            [{'x':  30, 'y':  50},  1],
            [{'x':  50, 'y':   0},  0],

            [{'x':  50, 'y': -30}, -1],
            [{'x':  30, 'y': -50}, -1],
            [{'x':   0, 'y': -50}, -1],
        ].forEach(function (args) {
            var [destination, expected] = args;

            var drive = bot.goto(destination);
            drive.run();
            drive.loop();

            if (expected === 1) {
                expect(bot.turn).gt(0);
            } else if (expected === -1) {
                expect(bot.turn).lt(0);
            } else {
                expect(bot.turn).equal(expected);
            }

        });
    });
    it('should turn when directed to bottom', function() {
        bot.direction = Math.PI;

        [
            [{'x': -30, 'y': -50},  1],
            [{'x': -50, 'y': -30},  1],
            [{'x': -50, 'y':   0},  1],

            [{'x': -50, 'y':  30},  1],
            [{'x': -30, 'y':  50},  1],
            [{'x':   0, 'y':  50},  0],

            [{'x':  50, 'y':  30}, -1],
            [{'x':  30, 'y':  50}, -1],
            [{'x':  50, 'y':   0}, -1],

            [{'x':  50, 'y': -30}, -1],
            [{'x':  30, 'y': -50}, -1],
            [{'x':   0, 'y': -50},  1],
        ].forEach(function (args) {
            var [destination, expected] = args;

            var drive = bot.goto(destination);
            drive.run();
            drive.loop();

            if (expected === 1) {
                expect(bot.turn).gt(0);
            } else if (expected === -1) {
                expect(bot.turn).lt(0);
            } else {
                expect(bot.turn).equal(expected);
            }

        });
    });
});
