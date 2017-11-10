import React from 'react';
import { observable, action, computed } from 'mobx'
import { observer } from 'mobx-react'

@observer
class DropDown extends React.Component {

    constructor(props) {
        super(props)
        this.state = observable({
            value: ''
        })
    }

    @computed get options () {
        let divList = []
        this.props.list.forEach((x, idx) => {
            divList.push(
                <option key={idx} value={x.value}>{x.label}</option>
            )
        })
        return divList
    }

    @action
    updateValue = (value) => {
        this.state.value = this.props.list.filter(x=>{
            return parseInt(x.value) === parseInt(value)
        })[0].label
        this.props.updateValue(value)
    }


    render() {
        return (
            <div>
                <div style={{position:'relative', width:this.props.width, height:25, marginLeft:6}}>
                    <select style={{position:'absolute', top:0, left:0, width:this.props.width,  height:25, lineHeight:20, margin:0, padding:0 }}
                            onChange={(e) => {this.updateValue(e.target.value)}}>
                        <option></option>
                        {this.options}
                    </select>
                    <input type="text" name="displayValue" id="displayValue"
                           placeholder={this.props.label} onFocus={this.select}
                           disabled={true}
                           value={this.state.value}
                           style={{position:'absolute', top:0, left:0, width:this.props.width-25, height:18}}/>
                    <input name="idValue" id="idValue" type="hidden"/>
                </div>
            </div>
        )
    }
}

export default DropDown;
