import React from 'react';
import {computed} from 'mobx'
import { observer } from 'mobx-react'

@observer
class ButtonGroup extends React.Component {

    constructor(props) {
        super(props)
    }

    @computed get buttonGroup () {
        let buttons = []
        this.props.buttonList.forEach((x, idx) => {
            buttons.push(
                <form key={idx}>
                    <input
                        key={idx}
                        type="button"
                        value={x.label}
                        onClick={x.action}
                        style={x.style}
                        disabled={x.disabled}
                    />
                </form>
            )
        })
        return buttons
    }

    render() {
        return (
            <div style={this.props.style}>
                {this.buttonGroup}
            </div>
        )
    }
}

export default ButtonGroup;
