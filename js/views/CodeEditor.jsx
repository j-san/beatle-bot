
import React from 'react';
import ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';


export default class CodeEditor extends React.Component {
    componentDidMount() {
        this.editor = ace.edit(this.refs.editor);

        this.editor.$blockScrolling = Infinity;
        this.editor.setTheme('ace/theme/monokai');
        this.editor.getSession().setMode('ace/mode/javascript');
        this.editor.getSession().setValue(this.props.value);
        this.editor.getSession().on('change', ()=> {
            this.props.onChange && this.props.onChange(this.editor.getSession().getValue());
        });
    }
    componentWillReceiveProps(props) {
        if(props.value != this.editor.getSession().getValue()) {
            this.editor.getSession().setValue(props.value);
        }
    }
    render() {
        return <div ref="editor"></div>;
    }
}
