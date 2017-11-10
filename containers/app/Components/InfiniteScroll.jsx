import React from 'react';
import _ from 'lodash'
import Infinite from 'react-infinite'
import { observable, computed, toJS, reaction } from 'mobx'
import { observer } from 'mobx-react'

import Paper from 'material-ui/Paper'
import {List, ListItem} from 'material-ui/List';
import LinearProgress from 'material-ui/LinearProgress';
import DownArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import UpArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-up'
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

@observer
class ScrollList extends React.Component {

    // Required Props:
    //     list: a list of objects each with the same keys where the key is the column name (first key:value pair must be unique for the row highlighting to work properly)
    //     width: total width of the component
    //     height: total height of the component
    //     onClick: Function called when a row is clicked (passes the whole object to the function)
    //     shiftClick: Function called when a row is shift+clicked (passes a list of objects to the function)
    //     ctrlClick: Function called when a row is ctrl+clicked (passes the whole object to the function)
    //     selected: list of objects that are copies of objects in the main list. Used to highlight appropriate rows
    //     loadFlag: bool
    //     loadFunc: function that appends to the main list when the scroll bar gets close to the end of the list
    //     widths: a list of percentages representing the width of each column as it pertains to overall width of the component

    constructor(props) {
        super(props)
        this.state = observable({
            idx: 0,
            newlySelected: 0
        })
    }

    @computed get divMaker () {
        let divList = []
        let listItems = []
        this.props.list.slice().forEach((brand, idx) => {
            let selectedListIdx = this.props.selected.map((x) => {
                return x[Object.keys(brand)[0]]
            }).indexOf(brand[Object.keys(brand)[0]])
            Object.keys(brand).forEach((key, bidx) => {
                if (key === "RepNum") {
                    console.log('rep')
                    listItems.push(
                        <div
                            key={bidx}
                            className="noselect"
                            style={{
                                userSelect: 'none',
                                fontSize: 12,
                                width: this.props.width * this.props.widths[bidx],
                                textAlign: 'right',
                                paddingRight: 15
                            }}
                            onClick={(e) => {this.handleSpecificDivClick(e, key, brand[key])}}
                        >
                            {brand[key]}
                        </div>
                    )
                } else {
                    listItems.push(
                        <div
                            key={bidx}
                            className="noselect"
                            style={{
                                userSelect: 'none',
                                fontSize: 12,
                                width: this.props.width * this.props.widths[bidx]
                            }}
                            onClick={(e) => {this.handleSpecificDivClick(e, key, brand[key])}}
                        >
                            {brand[key]}
                        </div>
                    )
                }

            })
            divList.push(
                <ListItem
                    style={{marginLeft: 5, height: 20}}
                    className="noselect"
                    key={idx}
                    id={idx === this.state.newlySelected ? 'selected' : idx}
                    isKeyboardFocused={selectedListIdx !== -1}
                    onClick={(e) => {this.handleClick(e, brand)}}
                    onDoubleClick={(e) => {this.props.dblClick ? this.props.dblClick() : console.log('dblClick')}}
                    innerDivStyle={{padding: 0}}
                    hoverColor="darkSeaGreen"
                >
                <div style={{display: 'flex'}} key={idx} className={idx}>
                    {listItems}
                </div>
                </ListItem>
            )
            listItems = []
        })

        return divList
    }

    @computed get sortIndicator () {
        if (this.props.sortDir === 'asc'){
            return <UpArrow style={{height: 10, width: 10}}/>
        } else {
            return <DownArrow style={{height: 10, width: 10}}/>
        }
    }

    @computed get labels () {
        if(this.props.list.length > 0){
            let labelList = Object.keys(this.props.list[0])
            let labelDivs = []
            labelList.forEach((label, idx) => {
                labelDivs.push(
                    <ListItem
                        key={idx}
                        id={idx}
                        style={{height: this.props.height * 0.2}}
                        innerDivStyle={{padding: 0}}
                        onClick={() => {if(this.props.clickLabel){this.props.clickLabel(label)}}}
                    >
                        <div
                            className="noselect"
                            key={idx}
                            style={{
                                fontSize: 14,
                                width: this.props.width * (this.props.widths[idx] - (this.props.widths[idx]*.01))
                            }}
                        >
                            {this.props.sortOn === label ? this.sortIndicator : ''}
                            {label}
                        </div>
                    </ListItem>
                )
            })
            return labelDivs
        } else {
            if(this.props.loadFlag){
                return <div style={{height: this.props.height * 0.2}}>
                    loading...
                </div>
            } else {
                return ['No Records Returned From Search']
            }
        }

    }

    handleClick(e, brand) {

        if (e.shiftKey) {
            let mostRecentlySelectedIdx = this.props.list.indexOf(this.props.selected[this.props.selected.length - 1])
            if (this.props.selected.length === 1) { // Only shift click if one item is selected
                let selectionList = []
                let end = Math.max(this.props.list.indexOf(brand), this.props.list.indexOf(this.props.selected[0]))
                let start = [this.props.list.indexOf(brand), this.props.list.indexOf(this.props.selected[0])].filter(x => {return x !== end})[0]
                _.range(start, end +1).map(idx => {
                    selectionList.push(this.props.list[idx])
                })
                this.props.shiftClick(selectionList)
            } else if (this.props.selected.length === 0) { // If no items are selected, simply select that single item
                this.props.onClick(brand)
            } else { //No way.
                let selectionList = []
                let end = Math.max(this.props.list.indexOf(brand), mostRecentlySelectedIdx)
                let start = [this.props.list.indexOf(brand), mostRecentlySelectedIdx].filter(x => {return x !== end})[0]
                _.range(start, end +1).map(idx => {
                    selectionList.push(this.props.list[idx])
                })
                this.props.shiftClick(selectionList)
            }
        } else if (e.ctrlKey) {
            this.props.ctrlClick(brand)
        } else {
            this.props.onClick(brand)
        }
    }

    handleSpecificDivClick (e, key, val) {
        if(e.altKey){
            this.props.altClick(key, val)
        }
    }

    onKeyDown = (e) => {
        if(e.keyCode === 40){
            if (this.props.onKeyDown) {
                this.props.onKeyDown()
                let num = (this.props.list.indexOf(this.props.selected[0]) + 1)
                this.state.newlySelected = num
                let elem = document.getElementById('selected')
                elem.scrollIntoView(false, {block: "end", behavior: "auto"})
                // console.log(elem.offsetTop, elem.offsetHeight, elem.offsetTop>elem.offsetHeight)
            }
        }
        else if (e.keyCode === 38) {
            if (this.props.onKeyUp) {
                this.props.onKeyUp()
                let num = (this.props.list.indexOf(this.props.selected[0]) + 1)
                this.state.newlySelected = num
                let elem = document.getElementById('selected')
                elem.scrollIntoView(false, {block: "end", behavior: "auto"})
                // console.log(elem.offsetTop, elem.offsetHeight, elem.offsetTop>elem.offsetHeight)
            }
        }
    }

    elementInfiniteLoad = () => {
        return <div className="infinite-list-item">
            <LinearProgress style={{margin: 0}} mode="indeterminate" />
        </div>
    }

    load = () => {
        this.props.loadFunc(this.state.idx)
        this.state.idx += 1
    }

    render() {
        return (
            <div onKeyDown={e => {this.onKeyDown(e)}} className="noselect" style={{margin: 7, width: this.props.width}}>
                <Paper>
                    <div style={{display: 'flex', borderBottomStyle: 'solid', borderColor: 'grey'}}>
                        {this.labels}
                    </div>
                    <div

                    >
                        <List>
                            <Infinite
                                containerHeight={this.props.height}
                                elementHeight={20}
                                infiniteLoadBeginEdgeOffset={100}
                                onInfiniteLoad={this.load}
                                isInfiniteLoading={this.props.loadFlag}
                            >
                                {this.divMaker}
                            </Infinite>
                        </List>
                    </div>
                </Paper>
            </div>
        )
    }
}

export default ScrollList;
