import React from 'react';
import { computed } from 'mobx'


class RadioGroup extends React.Component {

    constructor(props) {
        super(props)
    }

    @computed get radioList () {
        let radios = []
        this.props.list.forEach((x, idx) => {
            radios.push(
                <label key={idx} style={{fontSize: 12}}>
                    <input type="radio" onClick={(e) => {this.props.action(e.target.value)}} name={x.groupname} value={x.value}/>
                    {x.label}
                </label>
            )
        })
        return radios
    }

    render() {
        return (
            <div style={this.props.style}>
                {this.radioList}
            </div>
        )
    }
}

export default RadioGroup;
