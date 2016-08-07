
import React from 'react';

import {Deposit, Factory} from '../models/Building.js';


export default class BuidingView extends React.Component {
    render() {
        return <g transform={`translate(${this.props.building.position.x} ${this.props.building.position.y})`}
                onClick={this.props.onClick} className={this.props.selected ? 'active' : ''}>
            { this.props.building instanceof Deposit &&
                this.renderExtractor()
            }
            { this.props.building instanceof Factory &&
                this.renderFactory()
            }
            {/*<Gague height={40} width={8} value={this.props.building.store.bulk / this.props.building.store.capacity} />*/}
        </g>;
    }
    renderFactory() {
        return <g>
            <rect className="building" height={120} width={120} x={-60} y={-60} />
            <rect className="building" height={40} width={20} x={-50} y={-50} />
            <rect className="building" height={20} width={80} x={-50} y={30} />
            <rect className="building" height={70} width={60} x={-10} y={-50} />
        </g>;
    }
    renderExtractor() {
        return <g>
            <rect className="building" height={60} width={100} x={-50} y={-30} />
            <circle className="building" r={15} cx={-20} cy={5} />
            <circle className="building" r={5} cx={10} cy={-12} />
            <rect className="building" height={4} width={25} x={-15} y={3} transform="rotate(-30 -20 5)" />
            <rect className="building" height={40} width={20} x={20} y={-20} />
        </g>;
    }
}
