import React from 'react';
import{observer, inject} from'mobx-react'
import { observable, action, computed, toJS } from 'mobx'

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import RadioGroup from './RadioGroup.jsx'
import NewMasterForm from './NewMasterForm.jsx'
import ScrollList from './InfiniteScroll.jsx'
import SearchBars from './SearchBars.jsx'

import AutoComplete from 'material-ui/AutoComplete';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui/svg-icons/action/search';

@inject('CustomerUtilityStore', 'uistate', 'MatchedXrefsCustomerStore') @observer
class EditMasterCustomer extends React.Component {

    constructor(props) {
        super(props)
        this.state = observable({

        })
        this.fruit = [
            'Apple', 'Apricot', 'Avocado',
            'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry',
            'Boysenberry', 'Blood Orange',
            'Cantaloupe', 'Currant', 'Cherry', 'Cherimoya', 'Cloudberry',
            'Coconut', 'Cranberry', 'Clementine',
            'Damson', 'Date', 'Dragonfruit', 'Durian',
            'Elderberry',
            'Feijoa', 'Fig',
            'Goji berry', 'Gooseberry', 'Grape', 'Grapefruit', 'Guava',
            'Honeydew', 'Huckleberry',
            'Jabouticaba', 'Jackfruit', 'Jambul', 'Jujube', 'Juniper berry',
            'Kiwi fruit', 'Kumquat',
            'Lemon', 'Lime', 'Loquat', 'Lychee',
            'Nectarine',
            'Mango', 'Marion berry', 'Melon', 'Miracle fruit', 'Mulberry', 'Mandarine',
            'Olive', 'Orange',
            'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Physalis', 'Plum', 'Pineapple',
            'Pumpkin', 'Pomegranate', 'Pomelo', 'Purple Mangosteen',
            'Quince',
            'Raspberry', 'Raisin', 'Rambutan', 'Redcurrant',
            'Salal berry', 'Satsuma', 'Star fruit', 'Strawberry', 'Squash', 'Salmonberry',
            'Tamarillo', 'Tamarind', 'Tomato', 'Tangerine',
            'Ugli fruit',
            'Watermelon',
        ];
    }


    render() {

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.props.CustomerUtilityStore.closeEditMaster}
            />,
            <FlatButton
                label="Edit"
                primary={true}
                keyboardFocused={true}
                onClick={this.props.CustomerUtilityStore.editMaster}
            />,
        ];

        return (
            // TODO set restraints for editing based on current table restraints.
            <div>
                <Dialog
                    title="Edit Master Customer Record"
                    actions={actions}
                    modal={false}
                    open={this.props.CustomerUtilityStore.editMasterCustomerOpen}
                    onRequestClose={this.props.CustomerUtilityStore.closeEditMaster}
                    bodyStyle={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                    contentStyle={{
                        width: this.props.uistate.width * .45,
                        maxWidth: 'none',
                        maxHeight: 'none'
                    }}
                >
                    <div>
                        <div>
                            <TextField
                                floatingLabelText="MCUID"
                                defaultValue={this.props.CustomerUtilityStore.editMasterObj.MCUID}
                                disabled={true}
                                style={{width: 150, margin:5}}
                            />
                        </div>
                        <div>
                            <TextField
                                hintText="Notes"
                                multiLine={true}
                                rows={2}
                                rowsMax={6}
                                defaultValue={this.props.CustomerUtilityStore.editMasterObj.Notes}
                                onChange={(e, v) => {this.props.CustomerUtilityStore.updateEditMasterObj("Notes", v)}}
                                style={{width: 500, margin:5}}
                            />
                        </div>
                        <div>
                            <TextField
                                floatingLabelText="Name"
                                defaultValue={this.props.CustomerUtilityStore.editMasterObj.Name}
                                onChange={(e, v) => {this.props.CustomerUtilityStore.updateEditMasterObj("Name", v)}}
                                style={{width: 500, margin:5}}
                            />
                        </div>
                        <div>
                            <TextField
                                floatingLabelText="Address"
                                defaultValue={this.props.CustomerUtilityStore.editMasterObj.Address}
                                onChange={(e, v) => {this.props.CustomerUtilityStore.updateEditMasterObj("Address", v)}}
                                style={{width: 375, margin:5}}
                            />
                            <TextField
                                floatingLabelText="Address 2"
                                defaultValue={this.props.CustomerUtilityStore.editMasterObj.Address2}
                                onChange={(e, v) => {this.props.CustomerUtilityStore.updateEditMasterObj("Address2", v)}}
                                style={{width: 200, margin:5}}
                            />
                        </div>
                        <div>
                            <TextField
                                floatingLabelText="City"
                                defaultValue={this.props.CustomerUtilityStore.editMasterObj.City}
                                onChange={(e, v) => {this.props.CustomerUtilityStore.updateEditMasterObj("City", v)}}
                                style={{width: 300, margin:5}}
                            />
                            <TextField
                                floatingLabelText="State"
                                defaultValue={this.props.CustomerUtilityStore.editMasterObj.State}
                                onChange={(e, v) => {this.props.CustomerUtilityStore.updateEditMasterObj("State", v)}}
                                style={{width: 75, margin:5}}
                            />
                            <TextField
                                floatingLabelText="Zip"
                                defaultValue={this.props.CustomerUtilityStore.editMasterObj.Zip}
                                onChange={(e, v) => {this.props.CustomerUtilityStore.updateEditMasterObj("Zip", v)}}
                                style={{width: 150, margin:5}}
                            /><br />
                            <TextField
                                floatingLabelText="Phone Number"
                                defaultValue={this.props.CustomerUtilityStore.editMasterObj.PhoneNum}
                                onChange={(e, v) => {this.props.CustomerUtilityStore.updateEditMasterObj("PhoneNum", v)}}
                                style={{width: 150, margin:5}}
                            />
                            <TextField
                                floatingLabelText="Created By"
                                defaultValue={this.props.CustomerUtilityStore.editMasterObj.CreatedBy}
                                onChange={(e, v) => {this.props.CustomerUtilityStore.updateEditMasterObj("CreatedBy", v)}}
                                style={{width: 125, margin:5}}
                            /><br />
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}

export default EditMasterCustomer;
