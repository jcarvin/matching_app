import React from 'react';
import {computed, action} from 'mobx'
import { observer } from 'mobx-react'

@observer
class CheckBoxGroup extends React.Component {

    constructor(props) {
        super(props)
    }

    @computed get checkBoxGroup () {
        let checkboxes = []
        this.props.checkBoxList.forEach((x, idx) => {
            checkboxes.push(
                <label key={idx} id={x.label} style={{fontSize: 12}}>
                    <input type="checkbox" style={{margin: 0}} onChange={x.handler}/>
                    {x.label}
                </label>
            )
        })
        return checkboxes
    }


    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                {this.checkBoxGroup}
            </div>
        )
    }
}

export default CheckBoxGroup;
