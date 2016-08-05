
import React from 'react';
import _ from 'underscore';

import materials from '../models/Materials.js';


export default class BuildingDetail extends React.Component {
    render() {
        return <div>
            {_.pairs(materials).map((pair)=> {
                var [name, material] = pair;
                return <div key={name}>{material.label}: {this.props.building.store[name].toFixed(3)}</div>;
            })
            }
        </div>;
    }
}
