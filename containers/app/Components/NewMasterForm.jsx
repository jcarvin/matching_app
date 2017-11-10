import React from 'react';
import { observable, action, computed, toJS } from 'mobx'
import { observer, inject } from 'mobx-react'

import AutoComplete from 'material-ui/AutoComplete';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui/svg-icons/action/search';


import ScrollList from './InfiniteScroll.jsx'
import SearchBars from './SearchBars.jsx'

@inject('ItemCreationStore', 'DistributorStore', 'NacsStore', 'uistate') @observer
class NewMasterForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = observable({
            value: 'EA'
        });
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

    handleChange = (e, i, value) => {
        console.log(value)
        this.state.value = value
        this.props.ItemCreationStore.updateNewMasterObj('type', value)
    }



    render() {
        return (
            <div>
                <div>
                    <AutoComplete
                        floatingLabelText="Reported Manufacturer"
                        filter={AutoComplete.fuzzyFilter}
                        searchText={this.props.ItemCreationStore.newMasterObj.get('reportedanufacturer')}
                        onUpdateInput={(e) => {this.props.ItemCreationStore.updateNewMasterObj('reportedanufacturer', e)}}
                        dataSource={this.fruit}
                        maxSearchResults={5}
                        style={{width: 500, margin:5}}
                        textFieldStyle={{width: 500, fontSize: 12}}
                    />
                </div>
                <div>
                    <AutoComplete
                        floatingLabelText="Manufacturer"
                        filter={AutoComplete.fuzzyFilter}
                        searchText={this.props.ItemCreationStore.newMasterObj.get('manufacturer')}
                        onUpdateInput={(e) => {this.props.ItemCreationStore.updateNewMasterObj('manufacturer', e)}}
                        dataSource={toJS(this.props.ItemCreationStore.manufacturerNames)}
                        maxSearchResults={8}
                        style={{width: 500, margin:5}}
                        textFieldStyle={{width: 500, fontSize: 15}}
                    />
                </div>
                <div>
                    <AutoComplete
                        floatingLabelText="Description"
                        filter={AutoComplete.fuzzyFilter}
                        searchText={this.props.ItemCreationStore.newMasterObj.get('description')}
                        onUpdateInput={(e) => {this.props.ItemCreationStore.updateNewMasterObj('description', e)}}
                        dataSource={this.fruit}
                        maxSearchResults={5}
                        style={{width: 500, margin:5}}
                        textFieldStyle={{width: 500, fontSize: 15}}
                    />
                </div>
                <div>
                    <AutoComplete
                        floatingLabelText="Brand Code"
                        filter={AutoComplete.fuzzyFilter}
                        searchText={this.props.ItemCreationStore.newMasterObj.get('brandcodestr')}
                        onUpdateInput={(e) => {this.props.ItemCreationStore.updateNewMasterObj('brandcodestr', e)}}
                        dataSource={this.props.NacsStore.strList}
                        maxSearchResults={40}
                        style={{width: 350, margin:5}}
                        textFieldStyle={{width: 350, fontSize: 15}}
                        menuStyle={{width: 500, maxHeight: 260, overflow: 'auto'}}
                        listStyle={{width: 500}}
                    />
                    <AutoComplete
                        floatingLabelText="*UPC"
                        filter={AutoComplete.fuzzyFilter}
                        searchText={this.props.ItemCreationStore.newMasterObj.get('upc')}
                        onUpdateInput={(e) => {this.props.ItemCreationStore.updateNewMasterObj('upc', e)}}
                        dataSource={this.fruit}
                        maxSearchResults={5}
                        style={{width: 150, margin:5}}
                        textFieldStyle={{width: 150, fontSize: 15}}
                    />
                </div>
                <div>
                    <AutoComplete
                        floatingLabelText="Measure"
                        filter={AutoComplete.fuzzyFilter}
                        searchText={this.props.ItemCreationStore.newMasterObj.get('measure')}
                        onUpdateInput={(e) => {this.props.ItemCreationStore.updateNewMasterObj('measure', e)}}
                        dataSource={this.fruit}
                        maxSearchResults={5}
                        style={{width: 150, margin:5}}
                        textFieldStyle={{width: 150, fontSize: 15}}
                    />
                    <AutoComplete
                        floatingLabelText="Pack"
                        filter={AutoComplete.fuzzyFilter}
                        searchText={this.props.ItemCreationStore.newMasterObj.get('pack')}
                        onUpdateInput={(e) => {this.props.ItemCreationStore.updateNewMasterObj('pack', e)}}
                        dataSource={this.fruit}
                        maxSearchResults={5}
                        style={{width: 150, margin:5}}
                        textFieldStyle={{width: 150, fontSize: 15}}
                    />
                        <DropDownMenu
                            value={this.props.ItemCreationStore.newMasterObj.get('type')}
                            onChange={this.handleChange}
                        >
                            <MenuItem value={'EA'} primaryText="Each" />
                            <MenuItem value={'BX'} primaryText="Box" />
                            <MenuItem value={'CS'} primaryText="Case" />
                            <MenuItem value={'SH'} primaryText="Shipper" />
                        </DropDownMenu>
                </div>
                <div>
                    <br/>
                   Selected Box Equiv - {
                    this.props.ItemCreationStore.selectedBoxEquiv ?
                        this.props.ItemCreationStore.selectedBoxEquiv.length > 0 ?
                            toJS(this.props.ItemCreationStore.selectedBoxEquiv[0]).id :
                            '' :
                        ''
                }
                    <ScrollList
                        list={
                            this.props.ItemCreationStore.boxEquivList.length > 0 ?
                                this.props.ItemCreationStore.boxEquivList :
                                [{'ID': '', 'No Manufacturer Selected': ''}]
                        }
                        width={this.props.uistate.width * .25}
                        height={this.props.uistate.height * .08}
                        onClick={this.props.ItemCreationStore.selectOne}
                        shiftClick={this.props.ItemCreationStore.arbitraryLoadFunc}
                        ctrlClick={this.props.ItemCreationStore.arbitraryLoadFunc}
                        clickLabel={this.props.ItemCreationStore.arbitraryLoadFunc}
                        selected={this.props.ItemCreationStore.selectedBoxEquiv}
                        loadFlag={this.props.ItemCreationStore.boxEquivsLoading}
                        loadFunc={this.props.ItemCreationStore.arbitraryLoadFunc}
                        widths={[.1, .68, .12, .05]}//a list of ints representing each columns width pct. (maxCharacters/TotalCharacters)
                    />
                    <div style={{display: 'flex'}}>
                        <SearchBars
                            list={[
                                'id',
                                'description',
                                'measure'
                            ]}
                            height={25}
                            width={this.props.uistate.width * .23}
                            widths={[.1, .7, .2]}
                            searchFunc={this.props.ItemCreationStore.updateBoxEquivSearchObj}
                            values={this.props.ItemCreationStore.boxEquivSearchObj}
                            onEnter={this.props.ItemCreationStore.searchBoxEquivs}
                        />
                        <IconButton
                            tooltip="Search"
                            style={{paddingTop: 0}}
                            onTouchTap={this.props.ItemCreationStore.searchBoxEquivs}
                        >
                            <Search />
                        </IconButton>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewMasterForm;
