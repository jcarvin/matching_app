import React from 'react';
// import { inject, observer } from 'mobx-react'
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import Paper from 'material-ui/Paper'

// import ScrollList from './InfiniteScroll.jsx'
// import SearchBars from './SearchBars.jsx'
// import ButtonGroup from './ButtonGroup.jsx'
// import CheckBoxGroup from './CheckBoxGroup.jsx'
// import RadioGroup from './RadioGroup.jsx'
// import CreateNewMasterDialog from './CreateNewMasterDialog.jsx'
// import PurchaseRecordsDialog from './PurchaseRecordsDialog.jsx'
// import EditMasterCustomer from './EditMasterCustomer.jsx'
// import DropDown from './DropDown.jsx'

// import uistate from '../stores/UIState.js'
// import UnmatchedXrefsBrandStore from '../stores/ItemMatching/UnmatchedXrefsItemStore.js'
// import MasterBrandStore from '../stores/ItemMatching/MasterItemStore.js'
// import MatchedXrefsBrandStore from '../stores/ItemMatching/MatchedXrefsItemStore.js'
// import BrandUtilityStore from '../stores/ItemMatching/ItemUtilityStore.js'
// import DistributorStore from '../stores/DistributorStore.js'
// import { Provider } from 'mobx-react'
// import MainStore from '../stores/MainStore.js'
// const stores = new MainStore()

// TODO Everything needs to be changed from 'customer' to 'site' now..... 'customer' is now a reference to what used to be 'chain' -_-

// @inject(
//     'uistate',
//     'UnmatchedXrefsCustomerStore',
//     'MasterCustomerStore',
//     'MatchedXrefsCustomerStore',
//     'BrandUtilityStore',
//     'DistributorStore',
//     'CustomerUtilityStore'
// )
// @observer
class CustomerMatchingMain extends React.Component {
    render() {
        return (
            <div>stores!!!</div>
        )
    }
}
// class CustomerMatchingMain extends React.Component {

//     uistate = new uistate()
//     UnmatchedXrefsBrandStore = new UnmatchedXrefsBrandStore()
//     MasterBrandStore = new MasterBrandStore()
//     MatchedXrefsBrandStore = new MatchedXrefsBrandStore()
//     BrandUtilityStore = new BrandUtilityStore()
//     DistributorStore = new DistributorStore(BrandUtilityStore)

//     constructor(props) {
//         super(props)
//         this.confirm()
//     }

//     componentWillUnmount () {
//         this.DistributorStore.removeAllSelected()
//         this.CustomerUtilityStore.resetTempSearch()
//         this.CustomerUtilityStore.searchUp()
//         this.CustomerUtilityStore.searchDown()
//     }

//     confirm = () => {
//         console.log("updated?")
//     }

//     onKeyDown = (e) => {
//         if(e.keyCode === 13){
//             e.preventDefault()
//             this.CustomerUtilityStore.searchDown()
//         }
//     }

//     render() {
//         return (
//             <Provider {...stores}>
//                 <div
//                     className="main-container"
//                     style={{
//                         width: this.uistate.width,
//                         minWidth: 1519
//                     }}
//                     onKeyDown={this.onKeyDown}
//                 >
//                     <MuiThemeProvider>
//                         <Paper style={{paddingLeft: 1, height: '100%'}}>
//                             Unmatched Customers - {this.UnmatchedXrefsCustomerStore.unmatchedXrefsCustomersList.length} / {this.UnmatchedXrefsCustomerStore.count}
//                             <div>
//                                 <ScrollList
//                                     list={this.UnmatchedXrefsCustomerStore.unmatchedXrefsCustomersList}
//                                     width={this.uistate.width *.95}
//                                     height={this.uistate.height * .2}
//                                     onClick={this.UnmatchedXrefsCustomerStore.selectOne}
//                                     shiftClick={this.UnmatchedXrefsCustomerStore.shiftSelect}
//                                     ctrlClick={this.UnmatchedXrefsCustomerStore.ctrlSelect}
//                                     altClick={this.CustomerUtilityStore.updateTempSearchObj}
//                                     dblClick={this.CustomerUtilityStore.openPurchaseRecordsDialog}
//                                     clickLabel={this.UnmatchedXrefsCustomerStore.clickLabel}
//                                     onKeyDown={this.UnmatchedXrefsCustomerStore.selectNext}
//                                     onKeyUp={this.UnmatchedXrefsCustomerStore.selectPrev}
//                                     selected={this.UnmatchedXrefsCustomerStore.selectedUnmatchedXrefCustomer}
//                                     sortDir={this.UnmatchedXrefsCustomerStore.sortDir}
//                                     sortOn={this.UnmatchedXrefsCustomerStore.sortKey}
//                                     loadFlag={this.UnmatchedXrefsCustomerStore.unmatchedXrefsLoading}
//                                     loadFunc={this.UnmatchedXrefsCustomerStore.getUnmatchedXrefs}
//                                     widths={this.UnmatchedXrefsCustomerStore.widthPcts} //a list of ints representing each columns width pct. (maxCharacters/TotalCharacters)
//                                 />
//                             </div>
//                             <br/>
//                             <div>
//                                 <div style={{marginTop: 10, display: 'flex'}}>
//                                     <div style={{marginLeft: 10}}>
//                                         <DropDown
//                                             label="Select a Distributor"
//                                             width={this.uistate.width * .18}
//                                             list={this.DistributorStore.distNameList}
//                                             updateValue={this.DistributorStore.updateSelectedDistributor}
//                                         />
//                                         <ScrollList
//                                             list={
//                                                 this.DistributorStore.visibleWarehouses.length > 0 ?
//                                                     this.DistributorStore.visibleWarehouses :
//                                                     [{ID: '', 'No Distributor Selected': ''}]
//                                             }
//                                             width={this.uistate.width * .18}
//                                             height={this.uistate.height * .08}
//                                             onClick={this.DistributorStore.visibleWarehousesOnClick}
//                                             shiftClick={this.DistributorStore.shiftSelect}
//                                             ctrlClick={this.DistributorStore.ctrlSelect}
//                                             clickLabel={this.DistributorStore.selectAllVis}
//                                             selected={this.DistributorStore.selectedWarehouses}
//                                             loadFlag={false}
//                                             loadFunc={this.DistributorStore.getVisibleWarehouses}
//                                             widths={[.2, .8]}//a list of ints representing each columns width pct. (maxCharacters/TotalCharacters)
//                                         />
//                                     </div>
//                                     <ScrollList
//                                         list={
//                                             this.DistributorStore.selectedWarehouses.length > 0 ?
//                                                 this.DistributorStore.selectedWarehouses :
//                                                 [{ID: '', 'No Warehouses Selected': ''}]
//                                         }
//                                         width={this.uistate.width * .18}
//                                         height={this.uistate.height * .1}
//                                         onClick={this.DistributorStore.selectedWarehousesOnClick}
//                                         shiftClick={this.DistributorStore.selectedWarehousesOnClick}
//                                         ctrlClick={this.DistributorStore.selectedWarehousesOnClick}
//                                         clickLabel={this.DistributorStore.removeAllSelected}
//                                         selected={[]}
//                                         loadFlag={false}
//                                         loadFunc={this.DistributorStore.loadFunc}
//                                         widths={[.2, .8]}//a list of ints representing each columns width pct. (maxCharacters/TotalCharacters)
//                                     />
//                                     <SearchBars
//                                         list={[
//                                             'MCID',
//                                             'MCUID'
//                                         ]}
//                                         height={this.uistate.height * .05}
//                                         width={this.uistate.width * .04}
//                                         widths={[1, 1]}
//                                         searchFunc={this.CustomerUtilityStore.updateTempSearchObj}
//                                         values={this.CustomerUtilityStore.tempSearchObj}
//                                         onEnter={this.CustomerUtilityStore.searchDown}
//                                     />
//                                     <SearchBars
//                                         list={[
//                                             'ChainID',
//                                             'StoreID',
//                                             'Phone #',
//                                             'Rep ID'
//                                         ]}
//                                         height={this.uistate.height * .12}
//                                         width={this.uistate.width * .18}
//                                         widths={[1, 1, 1, 1]}
//                                         searchFunc={this.CustomerUtilityStore.updateTempSearchObj}
//                                         values={this.CustomerUtilityStore.tempSearchObj}
//                                         onEnter={this.CustomerUtilityStore.searchDown}
//                                     />
//                                     <SearchBars
//                                         list={[
//                                             'Name',
//                                             'Address',
//                                             'Address2',
//                                             'City',
//                                             'State',
//                                             'Zip'
//                                         ]}
//                                         height={this.uistate.height * .12}
//                                         width={this.uistate.width * .25}
//                                         widths={[1, 1, 1, .52, .1, .3]}
//                                         searchFunc={this.CustomerUtilityStore.updateTempSearchObj}
//                                         values={this.CustomerUtilityStore.tempSearchObj}
//                                         onEnter={this.CustomerUtilityStore.searchDown}
//                                     />
//                                     <div>
//                                         <CheckBoxGroup
//                                             checkBoxList={this.CustomerUtilityStore.customerCheckBoxList}
//                                         />
//                                         <ButtonGroup
//                                             buttonList={[
//                                                 {
//                                                     "label": "Reset",
//                                                     "action": this.CustomerUtilityStore.resetTempSearch,
//                                                     "disabled": false,
//                                                     "style": {
//                                                         margin: 5,
//                                                         marginTop: 10,
//                                                         width: 70,
//                                                         height: 20
//                                                     }
//                                                 }
//                                             ]}
//                                         />
//                                     </div>
//                                     <div style={{marginLeft: 20}}>
//                                         Search
//                                         <ButtonGroup
//                                             buttonList={
//                                                 [
//                                                     {
//                                                         "label": "^",
//                                                         "action": this.CustomerUtilityStore.searchUp,
//                                                         "disabled": false,
//                                                         "style": {
//                                                             color: 'green',
//                                                             margin: 5,
//                                                             marginTop: 10,
//                                                             width: 20,
//                                                             height: 20
//                                                         }
//                                                     },
//                                                     {
//                                                         "label": "v",
//                                                         "action": this.CustomerUtilityStore.searchDown,
//                                                         "disabled": false,
//                                                         "style": {
//                                                             color: 'green',
//                                                             margin: 5,
//                                                             marginTop: 10,
//                                                             width: 20,
//                                                             height: 20
//                                                         }
//                                                     }
//                                                 ]
//                                             }
//                                             style={{
//                                                 width: 100,
//                                                 display: 'flex',
//                                                 flexWrap: 'wrap'
//                                             }}
//                                         />
//                                     </div>

//                                 </div>
//                             </div>
//                             <br/>
//                             Master Customer Records - {this.MasterCustomerStore.masterCustomersList.length} / {this.MasterCustomerStore.count}
//                             <div style={{display: 'flex'}}>
//                                 <ScrollList
//                                     list={this.MasterCustomerStore.masterCustomersList}
//                                     width={this.uistate.width * .89}
//                                     height={this.uistate.height * .15}
//                                     onClick={this.MasterCustomerStore.selectOne}
//                                     shiftClick={this.MasterCustomerStore.shiftSelect}
//                                     ctrlClick={this.MasterCustomerStore.ctrlSelect}
//                                     altClick={this.CustomerUtilityStore.updateTempSearchObj}
//                                     clickLabel={this.MasterCustomerStore.clickLabel}
//                                     selected={this.MasterCustomerStore.selectedMasterCustomers}
//                                     sortDir={this.MasterCustomerStore.sortDir}
//                                     sortOn={this.MasterCustomerStore.sortKey}
//                                     loadFlag={this.MasterCustomerStore.masterCustomersLoading}
//                                     loadFunc={this.MasterCustomerStore.getMasterCustomers}
//                                     widths={this.MasterCustomerStore.widthPcts}//a list of ints representing each columns width pct. (maxCharacters/TotalCharacters)
//                                 />
//                                 <ButtonGroup
//                                     buttonList={this.CustomerUtilityStore.matchingButtonList}
//                                     style={{
//                                         width: 105,
//                                         marginLeft: 10,
//                                         display: 'flex',
//                                         flexWrap: 'wrap'
//                                     }}
//                                 />
//                             </div>
//                             Matched Customer Records - {this.MatchedXrefsCustomerStore.matchedXrefsCustomersList.length} / {this.MatchedXrefsCustomerStore.count}
//                             <div style={{display: 'flex'}}>
//                                 <ScrollList
//                                     list={this.MatchedXrefsCustomerStore.matchedXrefsCustomersList}
//                                     width={this.uistate.width * .89}
//                                     height={this.uistate.height * .15}
//                                     onClick={this.MatchedXrefsCustomerStore.selectOne}
//                                     shiftClick={this.MatchedXrefsCustomerStore.shiftSelect}
//                                     ctrlClick={this.MatchedXrefsCustomerStore.ctrlSelect}
//                                     altClick={this.CustomerUtilityStore.updateTempSearchObj}
//                                     dblClick={this.CustomerUtilityStore.openPurchaseRecordsDialog}
//                                     clickLabel={this.MatchedXrefsCustomerStore.clickLabel}
//                                     selected={this.MatchedXrefsCustomerStore.selectedMatchedXrefCustomer}
//                                     sortDir={this.MatchedXrefsCustomerStore.sortDir}
//                                     sortOn={this.MatchedXrefsCustomerStore.sortKey}
//                                     loadFlag={this.MatchedXrefsCustomerStore.matchedXrefsLoading}
//                                     loadFunc={this.MatchedXrefsCustomerStore.getMatchedXrefs}
//                                     widths={this.MatchedXrefsCustomerStore.widthPcts}//a list of ints representing each columns width pct. (maxCharacters/TotalCharacters)
//                                 />
//                                 <ButtonGroup
//                                     buttonList={this.CustomerUtilityStore.masterButtonList}
//                                     style={{
//                                         width: 105,
//                                         marginLeft: 10,
//                                         display: 'flex',
//                                         flexWrap: 'wrap'
//                                     }}
//                                 />
//                             </div>
//                             <div>
//                                 <PurchaseRecordsDialog/>
//                                 <EditMasterCustomer/>
//                             </div>
//                         </Paper>
//                     </MuiThemeProvider>
//                 </div>
//             </Provider>
//         )
//     }
// }
export default CustomerMatchingMain;
