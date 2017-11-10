import React from 'react';
import { inject, observer } from 'mobx-react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper'

import ScrollList from './InfiniteScroll.jsx'
import SearchBars from './SearchBars.jsx'
import ButtonGroup from './ButtonGroup.jsx'
import CheckBoxGroup from './CheckBoxGroup.jsx'
import RadioGroup from './RadioGroup.jsx'
import CreateNewMasterDialog from './CreateNewMasterDialog.jsx'
import DropDown from './DropDown.jsx'

import uistate from '../stores/UIState.js'
import UnmatchedXrefsBrandStore from '../stores/ItemMatching/UnmatchedXrefsItemStore.js'
import MasterBrandStore from '../stores/ItemMatching/MasterItemStore.js'
import MatchedXrefsBrandStore from '../stores/ItemMatching/MatchedXrefsItemStore.js'
import BrandUtilityStore from '../stores/ItemMatching/ItemUtilityStore.js'
import DistributorStore from '../stores/DistributorStore.js'
import { Provider } from 'mobx-react'
import MainStore from '../stores/MainStore.js'
const stores = new MainStore()

// @inject(
//     'uistate',
//     'UnmatchedXrefsBrandStore',
//     'MasterBrandStore',
//     'MatchedXrefsBrandStore',
//     'BrandUtilityStore',
//     'DistributorStore'
// )

// class BrandMatchingMain extends React.Component {
//     render() {
//         return (
//             <div>Cool cool cool</div>
//         )
//     }
// }

@observer
class BrandMatchingMain extends React.Component {
    uistate = new uistate()
    UnmatchedXrefsBrandStore = new UnmatchedXrefsBrandStore()
    MasterBrandStore = new MasterBrandStore()
    MatchedXrefsBrandStore = new MatchedXrefsBrandStore()
    BrandUtilityStore = new BrandUtilityStore()
    DistributorStore = new DistributorStore(BrandUtilityStore)

    constructor(props) {
        super(props)


    }

    componentWillUnmount () {
        this.DistributorStore.removeAllSelected()
        this.BrandUtilityStore.resetTempSearch()
        this.BrandUtilityStore.searchUp()
        this.BrandUtilityStore.searchDown()
    }

    onKeyUp = (e) => {
        if(e.keyCode === 13){
            e.preventDefault()
            this.BrandUtilityStore.searchDown()
        }
    }

    render() {
        return (
            <Provider {...stores}>
                <div
                    onKeyUp={this.onKeyUp}
                    className="main-container"
                    style={{
                        width: this.uistate.width,
                        minWidth: 1519
                    }}
                >
                    <MuiThemeProvider>
                        <Paper style={{paddingLeft: 1, height: '100%'}}>
                            Unmatched Records - {this.UnmatchedXrefsBrandStore.unmatchedXrefsBrandsList.length}/{this.UnmatchedXrefsBrandStore.count}
                            <div>
                                <ScrollList
                                    list={this.UnmatchedXrefsBrandStore.unmatchedXrefsBrandsList}
                                    width={this.uistate.width *.95}
                                    height={this.uistate.height * .18}
                                    onClick={this.UnmatchedXrefsBrandStore.selectOne}
                                    shiftClick={this.UnmatchedXrefsBrandStore.shiftSelect}
                                    ctrlClick={this.UnmatchedXrefsBrandStore.ctrlSelect}
                                    altClick={this.BrandUtilityStore.altClick}
                                    clickLabel={this.UnmatchedXrefsBrandStore.clickLabel}
                                    selected={this.UnmatchedXrefsBrandStore.selectedUnmatchedXrefBrand}
                                    sortDir={this.UnmatchedXrefsBrandStore.sortDir}
                                    sortOn={this.UnmatchedXrefsBrandStore.sortKey}
                                    loadFlag={this.UnmatchedXrefsBrandStore.unmatchedXrefsLoading}
                                    loadFunc={this.UnmatchedXrefsBrandStore.getUnmatchedXrefs}
                                    widths={this.UnmatchedXrefsBrandStore.widthPcts}//a list of ints representing each columns width pct. (maxCharacters/TotalCharacters)
                                />
                            </div>
                            <br/>
                            <div>
                                <SearchBars
                                    list={this.BrandUtilityStore.searchBarList}
                                    height={25}
                                    width={this.uistate.width * .95}
                                    widths={this.UnmatchedXrefsBrandStore.widthPcts}
                                    searchFunc={this.BrandUtilityStore.updateTempSearchObj}
                                    values={this.BrandUtilityStore.tempSearchObj}
                                    onEnter={this.BrandUtilityStore.searchDown}
                                />
                                <div style={{marginTop: 10, display: 'flex'}}>
                                    <ButtonGroup
                                        buttonList={this.BrandUtilityStore.filterBuuttonList}
                                        style={{
                                            width: 420,
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            maxHeight: 60
                                        }}
                                    />
                                    <CheckBoxGroup
                                        checkBoxList={this.BrandUtilityStore.checkBoxList}
                                    />
                                    <div style={{marginLeft: 20}}>
                                        <CheckBoxGroup
                                            checkBoxList={[{"label": "AutoSearch"}]}
                                        />
                                        <ButtonGroup
                                            buttonList={
                                                [
                                                    {
                                                        "label": "^",
                                                        "action": this.BrandUtilityStore.searchUp,
                                                        "disabled": false,
                                                        "style": {
                                                            color: 'green',
                                                            margin: 5,
                                                            marginTop: 10,
                                                            width: 20,
                                                            height: 20
                                                        }
                                                    },
                                                    {
                                                        "label": "v",
                                                        "action": this.BrandUtilityStore.searchDown,
                                                        "disabled": false,
                                                        "style": {
                                                            color: 'green',
                                                            margin: 5,
                                                            marginTop: 10,
                                                            width: 20,
                                                            height: 20
                                                        }
                                                    }
                                                ]
                                            }
                                            style={{
                                                width: 100,
                                                display: 'flex',
                                                flexWrap: 'wrap'
                                            }}
                                        />
                                    </div>
                                    <div style={{marginLeft: 10}}>
                                        <DropDown
                                            label="Select a Distributor"
                                            width={this.uistate.width * .18}
                                            list={this.DistributorStore.distNameList}
                                            updateValue={this.DistributorStore.updateSelectedDistributor}
                                        />
                                        <ScrollList
                                            list={
                                                this.DistributorStore.visibleWarehouses.length > 0 ?
                                                    this.DistributorStore.visibleWarehouses :
                                                    [{ID: '', 'No Distributor Selected': ''}]
                                            }
                                            width={this.uistate.width * .18}
                                            height={this.uistate.height * .08}
                                            onClick={this.DistributorStore.visibleWarehousesOnClick}
                                            shiftClick={this.DistributorStore.shiftSelect}
                                            ctrlClick={this.DistributorStore.ctrlSelect}
                                            clickLabel={this.DistributorStore.selectAllVis}
                                            selected={this.DistributorStore.selectedWarehouses}
                                            loadFlag={false}
                                            loadFunc={this.DistributorStore.getVisibleWarehouses}
                                            widths={[.2, .8]}//a list of ints representing each columns width pct. (maxCharacters/TotalCharacters)
                                        />
                                    </div>
                                    <ScrollList
                                        list={
                                            this.DistributorStore.selectedWarehouses.length > 0 ?
                                                this.DistributorStore.selectedWarehouses :
                                                [{ID: '', 'No Warehouses Selected': ''}]
                                        }
                                        width={this.uistate.width * .18}
                                        height={this.uistate.height * .1}
                                        onClick={this.DistributorStore.selectedWarehousesOnClick}
                                        shiftClick={this.DistributorStore.shiftSelect}
                                        ctrlClick={this.DistributorStore.ctrlSelect}
                                        clickLabel={this.DistributorStore.removeAllSelected}
                                        selected={[]}
                                        loadFlag={false}
                                        loadFunc={this.DistributorStore.loadFunc}
                                        widths={[.2, .8]}//a list of ints representing each columns width pct. (maxCharacters/TotalCharacters)
                                    />
                                </div>
                            </div>
                            Master Brand Records - {this.MasterBrandStore.masterBrandList.length}/{this.MasterBrandStore.count}
                            <div style={{display: 'flex'}}>
                                <ScrollList
                                    list={this.MasterBrandStore.masterBrandList}
                                    width={this.uistate.width * .89}
                                    height={this.uistate.height * .15}
                                    onClick={this.MasterBrandStore.selectOne}
                                    shiftClick={this.MasterBrandStore.shiftSelect}
                                    ctrlClick={this.MasterBrandStore.ctrlSelect}
                                    altClick={this.BrandUtilityStore.altClick}
                                    clickLabel={this.MasterBrandStore.clickLabel}
                                    selected={this.MasterBrandStore.selectedMasterBrands}
                                    sortDir={this.MasterBrandStore.sortDir}
                                    sortOn={this.MasterBrandStore.sortKey}
                                    loadFlag={this.MasterBrandStore.masterBrandsLoading}
                                    loadFunc={this.MasterBrandStore.getMasterBrands}
                                    widths={this.MasterBrandStore.widthPcts}//a list of ints representing each columns width pct. (maxCharacters/TotalCharacters)
                                />
                                <ButtonGroup
                                    buttonList={this.BrandUtilityStore.matchingButtonList}
                                    style={{
                                        width: 105,
                                        marginLeft: 10,
                                        display: 'flex',
                                        flexWrap: 'wrap'
                                    }}
                                />
                            </div>
                            Matched Records - {this.MatchedXrefsBrandStore.matchedXrefsBrandsList.length}/{this.MatchedXrefsBrandStore.count}
                            <div style={{display: 'flex'}}>
                                <ScrollList
                                    list={this.MatchedXrefsBrandStore.matchedXrefsBrandsList}
                                    width={this.uistate.width * .89}
                                    height={this.uistate.height * .15}
                                    onClick={this.MatchedXrefsBrandStore.selectOne}
                                    shiftClick={this.MatchedXrefsBrandStore.shiftSelect}
                                    ctrlClick={this.MatchedXrefsBrandStore.ctrlSelect}
                                    altClick={this.BrandUtilityStore.altClick}
                                    clickLabel={this.MatchedXrefsBrandStore.clickLabel}
                                    selected={this.MatchedXrefsBrandStore.selectedMatchedXrefBrand}
                                    sortDir={this.MatchedXrefsBrandStore.sortDir}
                                    sortOn={this.MatchedXrefsBrandStore.sortKey}
                                    loadFlag={this.MatchedXrefsBrandStore.matchedXrefsLoading}
                                    loadFunc={this.MatchedXrefsBrandStore.getMatchedXrefs}
                                    widths={this.MatchedXrefsBrandStore.widthPcts}//a list of ints representing each columns width pct. (maxCharacters/TotalCharacters)
                                />
                                <ButtonGroup
                                    buttonList={this.BrandUtilityStore.masterButtonList}
                                    style={{
                                        width: 105,
                                        marginLeft: 10,
                                        display: 'flex',
                                        flexWrap: 'wrap'
                                    }}
                                />
                            </div>
                            <div>
                                <CreateNewMasterDialog/>
                            </div>
                        </Paper>
                    </MuiThemeProvider>
                </div>
            </Provider>
        )
    }
}
export default BrandMatchingMain;
