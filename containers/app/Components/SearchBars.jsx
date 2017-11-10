import React from 'react';
import { inject, observer } from 'mobx-react'
import {computed, observable, toJS, reaction} from 'mobx'

import TextField from 'material-ui/TextField';

@inject('uistate') @observer
class SearchBars extends React.Component {

    constructor(props) {
        super(props)
        this.state = observable({

        })
    }

    @computed get searchBarGenerator () {
        if(this.props.list.length > 0) {
            let searchBars = []
            this.props.list.forEach((key, idx) => {
                this.state[key] = ''
                searchBars.push(
                    <form key={idx}>
                        <input
                            type="text"
                            name={key}
                            onChange={(e)=>{this.props.searchFunc(key, e.target.value)}}
                            onKeyDown={e => {this.onKeyDown(e)}}
                            // onKeyUp={(e) => {this.onKeyUp(e)}}
                            value={toJS(this.props.values)[key] ? toJS(this.props.values)[key] : ''}
                            id={key}
                            placeholder={key}
                            style={{
                                width: this.props.width * (this.props.widths[idx] - (this.props.widths[idx]*.098)),
                                marginRight: 5,
                                marginLeft: 5
                            }}
                        />
                    </form>
                )
            })
            // console.log(toJS(this.state))
            return searchBars
        }
    }

    onKeyUp = (e) => {
        if(e.keyCode === 13){
            e.preventDefault()
            this.props.onEnter()
        }
    }

    onKeyDown = (e) => {
        // console.log(e.keyCode)
        if(e.keyCode === 13){
            e.preventDefault()
        }
    }


    render() {
        return (
            <div style={{display: 'flex', flexWrap: 'wrap', width: this.props.width, height: this.props.height}}>
                {this.searchBarGenerator}
            </div>
        )
    }
}

export default SearchBars;
