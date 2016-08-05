
import React from 'react';

import CodeEditor from './CodeEditor.jsx';


var CodeStore = {
    guid() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    },
    getCodeNameList() {
        return JSON.parse(localStorage.getItem('code-index')) || [];
    },
    setCodeNameList(list) {
        localStorage.setItem('code-index', JSON.stringify(list));
    },
    hasCodeName(name) {
        return this.getCodeNameList().indexOf(name) > 0;
    },
    createCode() {
        var name = 'new-program-' + this.guid();
        var list = this.getCodeNameList();
        if (!this.hasCodeName()) {
            list.push(name);
            this.setCodeNameList(list);
            return name;
        }
    },
    deleteCurrentCode() {
        var list = this.getCodeNameList();
        var current = this.getCurrentCodeName();
        list = list.filter((name)=> name !== current);
        this.setCodeNameList(list);
    },
    renameCurrentCode(newName) {
        var list = this.getCodeNameList();
        var current = this.getCurrentCodeName();
        localStorage.setItem('saved-' + newName, localStorage.getItem('saved-' + current));

        list = list.map((name)=> name === current ? newName : name);
        this.setCodeNameList(list);
    },
    getCurrentCodeName() {
        return localStorage.getItem('current-code');
    },
    setCurrentCodeName(name) {
        localStorage.setItem('current-code', name);
    },
    getCurrentCode() {
        var name = this.getCurrentCodeName();

        return localStorage.getItem('saved-' + name);
    },
    setCurrentCode(content) {
        var name = this.getCurrentCodeName();

        localStorage.setItem('saved-' + name, content);
    }
}

export default class ProgramEditor extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentWillMount() {
        this.setState({source: CodeStore.getCurrentCode()});
    }

    render() {
        return <form onSubmit={this.deploy.bind(this)} className="card-group">
            {this.state.selectFile &&
                <div className="card">
                    <SavedCode codes={CodeStore.getCodeNameList()} selected={CodeStore.getCurrentCodeName()} 
                    onSelect={this.loadCode.bind(this)} 
                    onSave={this.saveCode.bind(this)} 
                    onDismiss={()=> this.setState({selectFile: false})}/>
                </div>
            }
            <div className="card">
                <CodeEditor value={this.state.source || ''} onChange={this.setCode.bind(this)} />
                <div className="editor-actions">
                    <button className="btn btn-secondary" onClick={(evt)=> {evt.preventDefault(); this.setState({selectFile: !this.state.selectFile})}}>Save / Load</button>
                    {' '}
                    <button className="btn btn-primary">Deploy</button>
                </div>
            </div>
        </form>;
    }
    setCode(source) {
        this.setState({source: source});
        CodeStore.setCurrentCode(source);
    }
    loadCode(name) {
        CodeStore.setCurrentCodeName(name);
        this.setState({source: CodeStore.getCurrentCode()});
    }
    saveCode() {
        CodeStore.setCurrentCode(this.state.source);
        this.setState({selectFile: false});
    }
    deploy(evt) {
        evt.preventDefault();
        var source = this.state.source;

        processUnit.loadCode(source);
        localStorage.setItem('source', source);
    }
}

class SavedCode extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    create(evt) {
        evt.preventDefault();
        var id = CodeStore.createCode();
        CodeStore.setCurrentCodeName(id);
        CodeStore.setCurrentCode(processUnit.DEFAULT_RUNTIME);
        this.props.onSelect(id);
    }
    rename(evt) {
        evt.preventDefault();
        var name = this.state.name;
        CodeStore.renameCurrentCode(name);
        CodeStore.setCurrentCodeName(name);
        this.props.onSelect(name);
        this.setState({rename: false, name: null});
    }
    delete(evt) {
        evt.preventDefault();
        CodeStore.deleteCurrentCode();
        this.props.onSelect(this.props.codes[0]);
    }
    render() {
        return <div>
            <div className="card-block">
                <div className="text-xs-right">
                    <a onClick={()=> this.props.onDismiss()}><i className="fa fa-close" /></a>
                </div>
                <ul className="list-group">
                    {this.props.codes.map((code)=> {
                        return <li key={code} 
                                className={'list-group-item ' + (this.props.selected == code ? 'active' : '')}
                                onClick={this.props.onSelect && this.props.onSelect.bind(this, code)}>
                            {code}
                        </li>;
                    })}
                </ul>
            </div>
            {this.state.rename &&
                <div className="card-block">
                    <div className="row">
                        <div className="col-xs-8">
                            <input className="form-control"
                                value={this.state.name}
                                onChange={(evt)=> this.setState({'name': evt.target.value})} />
                        </div>
                        <div className="col-xs-4">
                            <button className="btn btn-secondary btn-block" onClick={this.rename.bind(this)}>Save</button>
                        </div>
                    </div>
                </div>
            }
            <div className="card-block text-xs-right">
                <button className="btn btn-danger pull-left" onClick={this.delete.bind(this)}>Delete</button>
                {' '}
                <button className="btn btn-secondary" onClick={()=> this.setState({rename: true, name: this.props.selected})}>Rename</button>
                {' '}
                <button className="btn btn-secondary" onClick={this.create.bind(this)}>Create</button>
            </div>
        </div>;
    }
}