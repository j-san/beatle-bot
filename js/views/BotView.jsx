
import React from 'react';

import Gague from './Gauge.jsx';


export default class BotView extends React.Component {
    render() {
        return <g transform={`rotate(${this.props.bot.direction * 180 / Math.PI} ${this.props.bot.x} ${this.props.bot.y}) translate(${this.props.bot.x} ${this.props.bot.y})`}
                onClick={this.props.onClick} className={this.props.selected ? 'active' : ''}>
            {/*
            <rect className="bot"   height={40} width={20} x={-10} y={-20} />
            <rect className="wheel" height={10} width={6}  x={-3}  y={-24}   />
            <rect className="wheel" height={10} width={6}  x={-11 - 3}  y={8}   />
            <rect className="wheel" height={10} width={6}  x={11 - 3}  y={8}   />
            */}
            <rect className="bot"   height={20} width={10} x={-5}     y={-5} />
            <rect className="wheel" height={10} width={4}  x={-2}     y={-10} />
            <rect className="wheel" height={10} width={4}  x={-7 - 2} y={4}  />
            <rect className="wheel" height={10} width={4}  x={ 7 - 2} y={4}  />
            {this.props.bot.accumulator ?
                <Gague value={this.props.bot.accumulator} size={30} color="red" />
            :
                <Gague value={this.props.bot.cargo.quantity / this.props.bot.cargo.capacity} size={30} color="blue" />
            }
        </g>;
    }
}
