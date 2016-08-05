
import _ from 'underscore';
import React from 'react';
import ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import ReactDOM from 'react-dom';

import Bot from '../models/Bot.js';
import Building, {Deposit, Factory} from '../models/Building.js';
import processUnit from '../models/ProcessUnit.js';

import MapView from './MapView.jsx';
import BotDetail from './BotDetail.jsx';
import BuildingDetail from './BuildingDetail.jsx';
import ProgramEditor from './ProgramEditor.jsx'


export default class AppView extends React.Component {
    constructor() {
        super();
        this.state = {
            scale: 1,
            mainView: 'map'
        };
    }
    componentDidMount() {
        processUnit.on('animate', ()=> {
            this.refs.detail && this.refs.detail.forceUpdate();
            this.refs.map && this.refs.map.forceUpdate();
        });
    }
    componentWillMount() {
        var createBot = ()=> {
            var bot = new Bot();

            processUnit.add(bot);
        }

        var botFactory = new Factory({x: 0, y: 0});
        var deposit = new Deposit({
            x: 100 + Math.random() * 400,
            y: 100 + Math.random() * 400
        });
        processUnit.add(botFactory);
        processUnit.add(deposit);

        createBot();
        // _.range(5).forEach(()=>{
        //     createBot();
        // });

        if (localStorage.getItem('source')) {
            try {
                processUnit.loadCode(localStorage.getItem('source'));
            } catch(e) {
                processUnit.loadCode(processUnit.DEFAULT_RUNTIME);
            }
        } else {
            processUnit.loadCode(processUnit.DEFAULT_RUNTIME);
        }
        processUnit.resume();
        window.processUnit = processUnit;
    }
    render() {
        return <div>
            <aside className="side-left-card card">
                <div className="text-xs-center">
                    <div className="btn-group">
                        <button className={`btn btn-primary ${this.state.mainView === 'map' ? 'active' : ''}`} onClick={this.setMainView.bind(this, "map")}>Bots</button>
                        <button className={`btn btn-primary ${this.state.mainView === 'code' ? 'active' : ''}`} onClick={this.setMainView.bind(this, "code")}>Program</button>
                    </div>
                </div>
                {this.state.selected && this.state.selected instanceof Bot &&
                    <BotDetail bot={this.state.selected} ref="detail" />
                }
                {this.state.selected && this.state.selected instanceof Building &&
                    <BuildingDetail building={this.state.selected} ref="detail" />
                }
            </aside>
            {this.state.mainView == 'map' &&
            <div className="main-card card">
                <div className="controls controls-scale">
                    <button className="btn btn-secondary" onClick={this.scaleView.bind(this, true )}>
                        <span className="fa fa-plus"></span>
                    </button>
                    <button className="btn btn-secondary" onClick={this.scaleView.bind(this, false)}>
                        <span className="fa fa-minus"></span>
                    </button>
                    <button className="btn btn-secondary" onClick={this.pause.bind(this)}>{this.state.pause ? 
                        <span className="fa fa-play"></span>
                    :
                        <span className="fa fa-pause"></span>
                    }</button>
                </div>
                <MapView bots={processUnit.bots} buildings={processUnit.buildings} pause={this.state.pause} scale={this.state.scale} selected={this.state.selected} onSelect={(selected)=> { this.setState({selected: selected}) }} ref="map" />
            </div>
            }
            {this.state.mainView == 'code' &&
            <div className="main-card card">
                <ProgramEditor program={this.program} />
            </div>
            }
        </div>;
    }
    pause() {
        var pause = !this.state.pause;
        if (pause) {
            processUnit.pause();
        } else {
            processUnit.resume();
        }
        this.setState({pause: pause});
    }
    scaleView(zoom) {
        if (zoom) {
            this.setState({scale: this.state.scale * 1.5})
        } else {
            this.setState({scale: this.state.scale / 1.5})
        }
    }
    setMainView(view) {
        this.setState({mainView: view});
    }
}
