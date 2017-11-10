import React from 'react';
import{observer, inject} from'mobx-react'
import { observable, action, computed, toJS } from 'mobx'

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import RadioGroup from './RadioGroup.jsx'
import NewMasterForm from './NewMasterForm.jsx'

@inject('BrandUtilityStore', 'ItemCreationStore') @observer
class CreateNewMasterDialog extends React.Component {

    constructor(props) {
        super(props)
        this.state = observable({
            stepNum: 0
        })
    }

    @computed get optionsList () {
        if (this.props.BrandUtilityStore.selectedMasterBrands.length === 1){
            if(this.props.BrandUtilityStore.selectedMasterBrands[0].type === 'EA') {
                return([
                    {
                        "label": "New Brand Record",
                        "value": 'brand',
                        "groupname": "CreateNew"
                    },
                    {
                        "label": "New Brand Record - Same Brand, New Style",
                        "value": 'style',
                        "groupname": "CreateNew"
                    },
                    {
                        "label": "Box Record of Existing Each Record",
                        "value": 'boxFromEach',
                        "groupname": "CreateNew"
                    }
                ])
            } else if (
                this.props.BrandUtilityStore.selectedMasterBrands[0].type === 'BX' ||
                this.props.BrandUtilityStore.selectedMasterBrands[0].type === 'CS' ||
                this.props.BrandUtilityStore.selectedMasterBrands[0].type === 'SH'
            ) {
                return([
                    {
                        "label": "New Brand Record",
                        "value": 'brand',
                        "groupname": "CreateNew"
                    },
                    {
                        "label": "New Brand Record - Same Brand, New Style",
                        "value": 'style',
                        "groupname": "CreateNew"
                    },
                    {
                        "label": "Each Record of Existing Box Record",
                        "value": "eachFromBox",
                        "groupname": "CreateNew"
                    },
                    {
                        "label": "Case Record of Existing Box Record",
                        "value": "caseFromBox",
                        "groupname": "CreateNew"
                    }
                ])
            }
        } else {
            return ([
                {
                    "label": "New Brand Record",
                    "value": 'brand',
                    "groupname": "CreateNew"
                }
            ])
        }
    }

    @computed get step () {
        switch (this.state.stepNum){
            case 0:
                return(
                    <RadioGroup
                        list={this.optionsList}
                        style={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        action={this.props.ItemCreationStore.handleCreateNewMasterRadioGroup}
                    />
                )
            case 1:
                this.props.ItemCreationStore.fillNewMasterObj()
                return(<NewMasterForm/>)
            default:
                return "Yer trespassin' on private land, son."
        }
    }

    @computed get dialogContent () {
        if(this.props.BrandUtilityStore.selectedUnmatchedXrefBrand) {
            if (this.props.BrandUtilityStore.selectedUnmatchedXrefBrand.length === 1) {
                return(
                    <div>
                        {this.step}
                    </div>
                )
            } else if (this.props.BrandUtilityStore.selectedUnmatchedXrefBrand.length > 1) {
                return("Select only 1 Unmatched Brand")
            } else if (this.props.BrandUtilityStore.selectedUnmatchedXrefBrand.length < 1) {
                return("Select 1 Unmatched Brand")
            }
        }
    }

    @action
    changeStep = () => {
        this.state.stepNum += 1
    }

    @action
    handleClose = () => {
        this.state.stepNum = 0
        this.props.ItemCreationStore.closeCreateNewMasterDialog()
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
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
                    title="Create New Master Brand"
                    actions={actions}
                    modal={false}
                    open={this.props.ItemCreationStore.createNewMasterDialogOpen}
                    onRequestClose={this.handleClose}
                    bodyStyle={{
                        display: 'flex',
                        justifyContent: 'center',
                        overflow: 'auto'
                    }}
                >
                    {this.dialogContent}
                </Dialog>
            </div>
        )
    }
}

export default CreateNewMasterDialog;
