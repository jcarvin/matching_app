import React from 'react';
import{observer, inject} from'mobx-react'
import { observable, action, computed, toJS } from 'mobx'

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import RadioGroup from './RadioGroup.jsx'
import NewMasterForm from './NewMasterForm.jsx'
import ScrollList from './InfiniteScroll.jsx'
import SearchBars from './SearchBars.jsx'

@inject('CustomerUtilityStore', 'uistate', 'MatchedXrefsCustomerStore') @observer
class CreateNewMasterDialog extends React.Component {

    constructor(props) {
        super(props)
        this.state = observable({
            test: true
        })
    }


    render() {

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.props.CustomerUtilityStore.closePurchaseRecordsDialog}
            />,
            <FlatButton
                label="Next"
                primary={true}
                keyboardFocused={true}
                onClick={this.changeStep}
            />,
        ];

        return (
            <div>
                <Dialog
                    title="Purchase Records"
                    actions={actions}
                    modal={false}
                    open={this.props.CustomerUtilityStore.purchaseRecordsDialogOpen}
                    onRequestClose={this.props.CustomerUtilityStore.closePurchaseRecordsDialog}
                    bodyStyle={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                    contentStyle={{
                        width: this.props.uistate.width * .89,
                        maxWidth: 'none',
                        maxHeight: 'none'
                    }}
                >
                    <ScrollList
                        list={this.props.MatchedXrefsCustomerStore.matchedXrefsCustomersList}
                        width={this.props.uistate.width * .88}
                        height={this.props.uistate.height * .15}
                        onClick={this.props.MatchedXrefsCustomerStore.selectOne}
                        shiftClick={this.props.MatchedXrefsCustomerStore.shiftSelect}
                        ctrlClick={this.props.MatchedXrefsCustomerStore.ctrlSelect}
                        selected={this.props.MatchedXrefsCustomerStore.selectedMatchedXrefCustomer}
                        loadFlag={this.props.MatchedXrefsCustomerStore.matchedXrefsLoading}
                        loadFunc={this.props.MatchedXrefsCustomerStore.getMatchedXrefs}
                        widths={this.props.MatchedXrefsCustomerStore.widthPcts}//a list of ints representing each columns width pct. (maxCharacters/TotalCharacters)
                    />
                </Dialog>
            </div>
        )
    }
}

export default CreateNewMasterDialog;
