
import React from 'react';


export default class BotDetail extends React.Component {
    render() {
        return <div>
            <div>{this.props.bot.isMoving() ? 'Power on' : 'Stand by'}</div>
            <div>
                {'Speed: '}
                <progress className="progress" value={this.props.bot.velocity} max={this.props.bot.maxVelocity}></progress>
            </div>
            <div>
                Direction: {this.props.bot.turn.toFixed(2)}
                <div>
                    <progress className="progress" value={this.props.bot.turn + 1} max={2}></progress>
                </div>
            </div>
            <div>
            {'Destination: '}
            {this.props.bot.runtime && this.props.bot.runtime.action && this.props.bot.runtime.action.destination ?
                `${this.props.bot.runtime.action.destination.x.toFixed(2)}, ${this.props.bot.runtime.action.destination.y.toFixed(2)}`
            :
                <i>None</i>
            }
            </div>
            <div>Cargo: {this.props.bot.cargo.quantity.toFixed(3)} / {this.props.bot.cargo.capacity} {this.props.bot.cargo.material}</div>
            <progress className="progress" value={this.props.bot.cargo.quantity} max={this.props.bot.cargo.capacity}></progress>

            {this.props.bot.program &&
                <div>program: {this.props.bot.program.name}</div>
            }

            {this.props.bot.runtime && this.props.bot.runtime.action &&
                <div>action: {this.props.bot.runtime.action.constructor.name}</div>
            }
        </div>;
    }
}
