import {
    observable,
    computed,
    reaction,
    action,
    observe,
    when,
    spy,
    extendObservable,
    toJS,
    autorun
} from 'mobx'
import {observer} from 'mobx-react'
import { clientConfig } from '../../ClientConfig.js'
const apiURL = clientConfig.apiURL
const Api = require('superagent-bluebird-promise')

//hello there
export default class BrandUtilityStore {

    //observables:
    @observable searchIdx = 0
    @observable filterBuuttonList = []
    @observable matchingButtonList = []
    @observable masterButtonList = []
    @observable checkBoxList = []
    @observable customerCheckBoxList = []
    @observable selectedUnmatchedXrefBrand
    @observable selectedMasterBrands
    @observable selectedMatchedXrefBrand = []
    @observable unmatchedSearchObj = {}
    @observable masterSearchObj = {}
    @observable matchedSearchObj = {}
    @observable tempSearchObj = observable.map({})
    @observable searchUnmatched
    @observable searchMaster
    @observable searchMatched
    @observable searchBarList = []

    constructor(stores) {
        extendObservable(this)
        this.createFilterButtonList()
        this.createCheckBoxList()
        this.createMatchingButtonList()
        this.createMasterButtonList()

        when(
            () => (stores.UnmatchedXrefsBrandStore.unmatchedXrefsBrandsList.length > 0),
            () => {
                this.searchUnmatched = stores.UnmatchedXrefsBrandStore.searchUnmatched
                this.searchMaster = stores.MasterBrandStore.searchMaster
                this.searchMatched = stores.MatchedXrefsBrandStore.searchMatched
                this.selectedUnmatchedXrefBrand = stores.UnmatchedXrefsBrandStore.selectedUnmatchedXrefBrand
                this.selectedMasterBrands = stores.MasterBrandStore.selectedMasterBrands
                this.selectedMatchedXrefBrand = stores.MatchedXrefsBrandStore.selectedMatchedXrefBrand
                this.viewMasterGroup = stores.MasterBrandStore.viewGroup
                this.removeMatched = stores.UnmatchedXrefsBrandStore.removeMatched
                this.removeUnmatched = stores.MatchedXrefsBrandStore.removeUnmatched
                this.selectedWarehouses = stores.DistributorStore.selectedWarehouses
                this.searchBarList = Object.keys(stores.UnmatchedXrefsBrandStore.unmatchedXrefsBrandsList[0])
                this.openCreateNewMasterDialog = stores.ItemCreationStore.openCreateNewMasterDialog

                const selectedUnmatchedXrefBrandUpdater = reaction(
                    () => stores.UnmatchedXrefsBrandStore.selectedUnmatchedXrefBrand.map(x => {return x}),
                    length => {
                        this.selectedUnmatchedXrefBrand = stores.UnmatchedXrefsBrandStore.selectedUnmatchedXrefBrand
                    })

                const selectedMasterBrandsUpdater = reaction(
                    () => stores.MasterBrandStore.selectedMasterBrands.map(x => {return x}),
                    length => {
                        this.selectedMasterBrands = stores.MasterBrandStore.selectedMasterBrands
                    })

                const selectedMatchedXrefBrandUpdater = reaction(
                    () => stores.MatchedXrefsBrandStore.selectedMatchedXrefBrand.map(x => {return x}),
                    length => {
                        this.selectedMatchedXrefBrand = stores.MatchedXrefsBrandStore.selectedMatchedXrefBrand
                    })

                const selectedWarehousesUpdater = reaction(
                    () => stores.DistributorStore.selectedWarehouses.map(x => {return x}),
                    warehouse => {
                        this.selectedWarehouses = stores.DistributorStore.selectedWarehouses
                        this.filterOnWarehouse()
                    })
            }
        )
    }

//Search Resets (clears current search obj and re-compiles a new one -- for scrolling purposes mainly)------------

    @action
    updateTempSearchObj = (field, value) => {
        if (value !== '') {
            if (field === 'brand_id') {
                this.tempSearchObj.keys().map(key => {
                    this.tempSearchObj.delete(key)
                })
                this.tempSearchObj.set(field, value)
            } else if (field === 'warehouse') {
                if (value.length <= 0) {
                    this.tempSearchObj.delete(field)
                }else{
                    this.tempSearchObj.set(field, value)
                }
            } else {
                this.tempSearchObj.set(field, value)
            }
        } else {
            this.tempSearchObj.delete(field)
        }
    }

    @action
    resetUnmatchedSearch = () => {
        Object.keys(this.unmatchedSearchObj).map(x => {
            delete this.unmatchedSearchObj[x]
        })
        this.tempSearchObj.keys().map(key => {
            if (key === 'brand_id') {
                Object.keys(this.unmatchedSearchObj).map(x => {
                    delete this.unmatchedSearchObj[x]
                })
                this.unmatchedSearchObj[key] = this.tempSearchObj.get(key)
            } else {
                this.unmatchedSearchObj[key] = this.tempSearchObj.get(key)
            }
        })
    }

    @action
    resetMatchedSearch = () => {
        Object.keys(this.matchedSearchObj).map(x => {
            delete this.matchedSearchObj[x]
        })
        this.tempSearchObj.keys().map(key => {
            if (key === 'brand_id') {
                Object.keys(this.matchedSearchObj).map(x => {
                    delete this.matchedSearchObj[x]
                })
                this.matchedSearchObj[key] = this.tempSearchObj.get(key)
            } else {
                this.matchedSearchObj[key] = this.tempSearchObj.get(key)
            }
        })
    }

    @action
    resetMasterSearch = () => {
        Object.keys(this.masterSearchObj).map(x => {
            delete this.masterSearchObj[x]
        })
        this.tempSearchObj.keys().map(key => {
            if (key === 'brand_id') {
                Object.keys(this.masterSearchObj).map(x => {
                    delete this.masterSearchObj[x]
                })
                this.masterSearchObj[key] = this.tempSearchObj.get(key)
            } else {
                this.masterSearchObj[key] = this.tempSearchObj.get(key)
            }
        })
    }

    @action
    resetTempSearch = () => {
        this.tempSearchObj.keys().map(x => {
            if (x !== 'warehouse'){
                this.tempSearchObj.delete(x)
            }
        })
    }

//Search: calls appropriate reset functions and runs appropriate Api functions ----------------------------------

    @action
    filterOnWarehouse = () => {
        if(this.selectedWarehouses){
            if(this.selectedWarehouses.length > 0) {
                let list = this.selectedWarehouses.map(x => {
                    return x.ID
                })
                this.selectedWarehouses.map(warehouse => {
                    this.updateTempSearchObj('warehouse', list)
                })
            } else {
                this.updateTempSearchObj('warehouse', [])
            }
        }
    }

    @action
    searchUp = () => {
        this.resetUnmatchedSearch()
        this.searchUnmatched()
    }

    @action
    searchDown = () => {
        this.resetMatchedSearch()
        this.resetMasterSearch()
        this.searchMatched()
        this.searchMaster()
    }

//Buttons---------------------------------------------------------------------------------------------------------

    @action
    createFilterButtonList = () => {
        this.filterBuuttonList = [
            {
                "label": "Find MBR1",
                "action": this.printStuff,
                "disabled": false,
                "style": {
                    margin : 2,
                    width: 100
                }
            },
            {
                "label": "Export unMtch",
                "action": this.printStuff,
                "disabled": false,
                "style": {
                    margin : 2,
                    width: 100
                }
            },
            {
                "label": "Export NFIs",
                "action": this.printStuff,
                "disabled": false,
                "style": {
                    margin : 2,
                    width: 100
                }
            },
            {
                "label": "Reset",
                "action": this.resetTempSearch,
                "disabled": false,
                "style": {
                    color: 'green',
                    margin : 2,
                    width: 100
                }
            },
            {
                "label": "Search By NACS Code",
                "action": this.printStuff,
                "disabled": false,
                "style": {
                    margin : 2,
                    width: 204
                }
            },
            {
                "label": "Export MBRs",
                "action": this.printStuff,
                "disabled": false,
                "style": {
                    margin : 2,
                    width: 100
                }
            },
            {
                "label": "NFIs Only",
                "action": this.printStuff,
                "disabled": false,
                "style": {
                    margin : 2,
                    width: 100
                }
            },
        ]
    }

    @action
    createMatchingButtonList = () => {
        this.matchingButtonList = [
            {
                "label" : "Match",
                "action": this.matchBrands,
                "disabled": false,
                "style": {
                    color: 'green',
                    margin: 0,
                    width: 100
                }
            },
            {
                "label" : "Create New",
                "action": this.open,
                "disabled": false,
                "style": {
                    color: 'green',
                    margin: 0,
                    width: 100
                }
            },
            {
                "label" : "Edit",
                "action": this.printStuff,
                "disabled": false,
                "style": {
                    margin: 0,
                    width: 100
                }
            },
            {
                "label" : "Track",
                "action": this.printStuff,
                "disabled": false,
                "style": {
                    color: 'red',
                    margin: 0,
                    width: 100
                }
            },
            {
                "label" : "Reset Tracking",
                "action": this.printStuff,
                "disabled": false,
                "style": {
                    color: 'red',
                    margin: 0,
                    width: 100
                }
            },
            {
                "label" : "Check Coding",
                "action": this.checkCoding,
                "disabled": false,
                "style": {
                    color: 'green',
                    margin: 0,
                    width: 100
                }
            },
            {
                "label" : "Delete",
                "action": this.printStuff,
                "disabled": false,
                "style": {
                    margin: 0,
                    width: 100
                }
            },
        ]
    }

    @action
    createMasterButtonList = () => {
        this.masterButtonList = [
            {
                "label": "PCH Records",
                "action": this.printStuff,
                "disabled": false,
                "style": {
                    margin: 0,
                    width: 100
                }
            },
            {
                "label": "View Group",
                "action": this.viewGroup,
                "disabled": false, //TODO for now
                "style": {
                    color: 'green',
                    margin: 0,
                    width: 100
                }
            },
            {
                "label": "Export",
                "action": this.printStuff,
                "disabled": false,
                "style": {
                    margin: 0,
                    width: 100
                }
            },
            {
                "label": "Verify",
                "action": this.printStuff,
                "disabled": false,
                "style": {
                    margin: 0,
                    width: 100
                }
            },
            {
                "label": "Re-Code",
                "action": this.reCodeBrands,
                "disabled": false,
                "style": {
                    color: 'green',
                    margin: 0,
                    width: 100
                }
            },
            {
                "label": "Re-Match",
                "action": this.reMatchBrands,
                "disabled": false,
                "style": {
                    color: 'green',
                    margin: 0,
                    width: 100
                }
            },
            {
                "label": "Exit",
                "action": this.printStuff,
                "disabled": false,
                "style": {
                    margin: 0,
                    marginTop: 10,
                    width: 100
                }
            },
        ]
    }

    @action
    createCheckBoxList = () => {
        this.checkBoxList = [
            {
                "label": "Matched Records"
            },
            {
                "label": "Matched Only"
            },
            {
                "label": "NFIs"
            },
            {
                "label": "Review"
            },
        ]
    }

//Button Functions----------------------------------------------------------------------------------------------

    @action
    checkCoding = () => {
        if(this.selectedMasterBrands.length === 1){
            this.updateTempSearchObj('brand_id', this.selectedMasterBrands[0].brand_id)
            this.resetMatchedSearch()
            this.searchMatched()
            this.resetTempSearch()
        }

    }

    @action
    viewGroup = () => {
        if (this.selectedMatchedXrefBrand.length === 1) {
            this.updateTempSearchObj('brand_id', this.selectedMatchedXrefBrand[0].brand_id)
            this.resetMasterSearch()
            this.viewMasterGroup(this.selectedMatchedXrefBrand[0].brand_id)
            this.resetTempSearch()
        }
    }

    @action
    matchBrands = () => {
        if(this.selectedMasterBrands.length === 1){
            let brandList = []
            let xrefids = "{"
            let brand_id = this.selectedMasterBrands[0].brand_id
            this.selectedUnmatchedXrefBrand.forEach((x, idx) => {
                if (this.selectedUnmatchedXrefBrand.length === 1) {
                    xrefids += `${x.xrefid}}`
                } else if (
                    idx === this.selectedUnmatchedXrefBrand.length - 1
                ){
                    xrefids += `, ${x.xrefid}}`
                } else if (idx === 0) {
                    xrefids += x.xrefid
                } else {
                    xrefids += `, ${x.xrefid}`
                }
                brandList.push(x)
            })
            console.log("xrefids: ", toJS(xrefids), "Brand_id: ", toJS(brand_id))
            Api.post(`http://${apiURL}/rpc/matchbrands`)
                .send({
                    "unmatchedxrefs": xrefids,
                    "brandid": brand_id
                })
                .then(resp => {
                    if(resp.status === 200){
                        this.removeMatched(brandList)
                    }
                })
        }
    }

    @action
    reMatchBrands = () => {
        if(this.selectedMasterBrands.length === 1){
            let brandList = []
            let xrefids = "{"
            let brand_id = this.selectedMasterBrands[0].brand_id
            this.selectedMatchedXrefBrand.forEach((x, idx) => {
                if (this.selectedMatchedXrefBrand.length === 1) {
                    xrefids += `${x.xrefid}}`
                } else if (
                    idx === this.selectedMatchedXrefBrand.length - 1
                ){
                    xrefids += `, ${x.xrefid}}`
                } else if (idx === 0) {
                    xrefids += x.xrefid
                } else {
                    xrefids += `, ${x.xrefid}`
                }
                brandList.push(x)
            })
            console.log("xrefids: ", toJS(xrefids), "Brand_id: ", toJS(brand_id))
            Api.post(`http://${apiURL}/rpc/matchbrands`)
                .send({
                    "unmatchedxrefs": xrefids,
                    "brandid": brand_id
                })
                .then(resp => {
                    if(resp.status === 200){
                        this.searchDown()
                    }
                })
        }
    }

    @action
    reCodeBrands = () => {
        let brandList = []
        let xrefids = "{"
        this.selectedMatchedXrefBrand.forEach((x, idx) => {
            if (this.selectedMatchedXrefBrand.length === 1) {
                xrefids += `${x.xrefid}}`
            } else if (
                idx === this.selectedMatchedXrefBrand.length - 1
            ){
                xrefids += `, ${x.xrefid}}`
            } else if (idx === 0) {
                xrefids += x.xrefid
            } else {
                xrefids += `, ${x.xrefid}`
            }
            brandList.push(x)
        })
        console.log("xrefids: ", toJS(xrefids))
        Api.post(`http://${apiURL}/rpc/recodebrands`)
            .send({
                "unmatchedxrefs": xrefids
            })
            .then(resp => {
                if(resp.status === 200){
                    this.removeUnmatched(brandList)
                }
            })
    }

    @action
    open = () => {
        this.openCreateNewMasterDialog()
    }

// Click Handler-------------------------------------------------------------------------------------------------------

    @action
    altClick = (field, value) => {
        if(
            this.searchBarList.indexOf(field) !== -1 &&
                field !== 'warehouse_id'
        ){
            this.updateTempSearchObj(field, value)
        }else {
            console.log("wasn't a search bar")
        }
    }
}

//{
//   "description": "whatever"
// } Select * from vwStaging where xrefid = 2279816 and period >= 201401 and period <= 201410 order by period, storenum