
import React from 'react';


export default class Gague extends React.Component {
    render() {
        return <g transform={`translate(${-this.props.size / 2} 20)`}>
            <rect className="gauge-border" height={this.props.height || 6} width={this.props.size} />
            <rect className="gauge" height={(this.props.height || 6) - 2} width={this.props.value * this.props.size} y={1} fill={this.props.color} />
        </g>;
    }
}
