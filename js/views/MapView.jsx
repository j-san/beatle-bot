
import React from 'react';
import ReactDOM from 'react-dom';

import BotView from './BotView.jsx';
import BuildingView from './BuildingView.jsx';

export default class MapView extends React.Component {
    componentDidMount() {
        this.computeSize();
    }
    componentWillReceiveProps() {
        // after scale
        this.computeSize();
    }
    render() {
        return <svg className="map">
            <g transform={`translate(${this.width / 2} ${this.height / 2}) scale(${this.props.scale})`}>

                <line className="guide" x1={-10000} y1={0}      x2={10000} y2={0} />
                <line className="guide" x1={0}      y1={-10000} x2={0}     y2={10000} />

                {this.props.buildings.map((building, index)=> {
                    return <BuildingView building={building} key={'builing-' + index} selected={building == this.props.selected} onClick={()=> { this.props.onSelect(building); }} />;
                })}
                {this.props.bots.map((bot, index)=> {
                    return <BotView bot={bot} key={'bot-' + index} selected={bot == this.props.selected} onClick={()=> { this.props.onSelect(bot); }} />;
                })}
                {this.props.selected && this.props.selected.runtime && this.props.selected.runtime.action && this.props.selected.runtime.action.destination &&
                    <text className="target active" x={this.props.selected.runtime.action.destination.x - 6} y={this.props.selected.runtime.action.destination.y + 6}>⨯</text>
                }
            </g>
        </svg>;
    }

    computeSize() {
        this.element = ReactDOM.findDOMNode(this);
        this.width = this.element.clientWidth;
        this.height = this.element.clientHeight;
    }
}
