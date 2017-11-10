import {observable, computed, reaction, action, observe, when, spy, extendObservable, toJS } from 'mobx'
import {observer} from 'mobx-react'
import { clientConfig } from '../../ClientConfig.js'
const apiURL = clientConfig.apiURL
const Api = require('superagent-bluebird-promise')


export default class CustomerUtilityStore {

    //observables:
    @observable customerCheckBoxList = []
    @observable selectedUnmatchedXrefCustomer = []
    @observable selectedMasterCustomers = []
    @observable selectedMatchedXrefCustomer = []
    @observable unmatchedSearchObj = {}
    @observable masterSearchObj = {}
    @observable matchedSearchObj = {}
    @observable tempSearchObj = observable.map({})
    @observable searchUnmatched
    @observable searchMaster
    @observable searchMatched
    @observable createNewMasterDialogOpen = false
    @observable createNewMasterRadioGroup = ''
    @observable purchaseRecordsDialogOpen = false
    @observable editMasterCustomerOpen = false
    @observable editMasterObj = {
        MCUID: '',
        Notes: '',
        Name: '',
        Address: '',
        Address2: '',
        City: '',
        State: '',
        Zip: '',
        PhoneNum: '',
        CreatedBy: ''
    }
    @observable autoSearch = false
    @observable excludeNums = false

    constructor(stores) {
        extendObservable(this)
        this.createCustomerCheckBoxList()
        this.createMatchingButtonList()
        this.createMasterButtonList()

        when(
            () => (stores.UnmatchedXrefsCustomerStore.unmatchedXrefsCustomersList.length > 0),
            () => {
                this.searchUnmatched = stores.UnmatchedXrefsCustomerStore.searchUnmatched
                this.searchMaster = stores.MasterCustomerStore.searchMaster
                this.searchMatched = stores.MatchedXrefsCustomerStore.searchMatched
                this.selectedUnmatchedXrefCustomer = stores.UnmatchedXrefsCustomerStore.selectedUnmatchedXrefCustomer
                this.selectedMasterCustomers = stores.MasterCustomerStore.selectedMasterCustomers
                this.deleteMaster = stores.MasterCustomerStore.deleteMaster
                this.selectedMatchedXrefCustomer = stores.MatchedXrefsCustomerStore.selectedMatchedXrefCustomer
                this.removeMatched = stores.UnmatchedXrefsCustomerStore.removeMatched
                this.removeUnmatched = stores.MatchedXrefsCustomerStore.removeUnmatched
                this.selectedWarehouses = stores.DistributorStore.selectedWarehouses

    //--------------------------------- Auto Search Shit ----------------------------------------------------------------------------

                const selectedUnmatchedXrefCustomerUpdater = reaction(
                    () => stores.UnmatchedXrefsCustomerStore.selectedUnmatchedXrefCustomer.map(x => {return x}),
                    length => {
                        this.selectedUnmatchedXrefCustomer = stores.UnmatchedXrefsCustomerStore.selectedUnmatchedXrefCustomer
                        if (this.selectedUnmatchedXrefCustomer.length === 1 &&
                            this.autoSearch &&
                            this.tempSearchObj.keys().length > 0) {
                            this.tempSearchObj.keys().map(x => {
                                if (this.excludeNums) {
                                    if(!isNaN(this.selectedUnmatchedXrefCustomer[0][x].split(' ')[0])) {
                                        // if the first 'word' in the addr is just a number
                                        if (this.selectedUnmatchedXrefCustomer[0]['Address'].split(' ')[1].toLowerCase().replace(/[^a-z]/g, '').length > 1) {
                                            // if the first non-numeric word isn't something like "N." ect... eg: "1234 Ollie St"
                                            switch (x) {
                                                case 'Name':
                                                    this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x].slice(0, 8))
                                                    break
                                                case 'Zip':
                                                    this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x].slice(0, 3))
                                                    break
                                                case 'Address':
                                                    this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x].split(' ')[1]) // use the first non-numeric word eg: "Ollie"
                                                    break
                                                default:
                                                    this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x])
                                            }
                                        } else {
                                            // if the first non-numeric word is something like "N." eg: "1234 N. Ollie St
                                            switch (x) {
                                                case 'Name':
                                                    this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x].slice(0, 8))
                                                    break
                                                case 'Zip':
                                                    this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x].slice(0, 3))
                                                    break
                                                case 'Address':
                                                    this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x].split(' ')[2]) // Use the second non-numeric word eg: "Ollie"
                                                    break
                                                default:
                                                    this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x])
                                            }
                                        }
                                    } else {
                                        // if the first word isn't just a number eg: "Ollie st"
                                        switch (x) {
                                            case 'Name':
                                                this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x].slice(0, 8))
                                                break
                                            case 'Zip':
                                                this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x].slice(0, 3))
                                                break
                                            case 'Address':
                                                this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x].split(' ')[0]) // just use that first word
                                                break
                                            default:
                                                this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x])
                                        }
                                    }
                                } else {
                                    // this ones the same as the one right there ^
                                    switch (x) {
                                        case 'Name':
                                            this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x].slice(0, 8))
                                            break
                                        case 'Zip':
                                            this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x].slice(0, 3))
                                            break
                                        case 'Address':
                                            this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x].split(' ')[0])
                                            break
                                        default:
                                            this.tempSearchObj.set(x, this.selectedUnmatchedXrefCustomer[0][x])
                                    }
                                }
                            })
                            this.searchDown()
                        }
                    })

                const selectedMasterCustomersUpdater = reaction(
                    () => stores.MasterCustomerStore.selectedMasterCustomers.map(x => {return x}),
                    length => {
                        this.selectedMasterCustomers = stores.MasterCustomerStore.selectedMasterCustomers
                    })

                const selectedMatchedXrefCustomerUpdater = reaction(
                    () => stores.MatchedXrefsCustomerStore.selectedMatchedXrefCustomer.map(x => {return x}),
                    length => {
                        this.selectedMatchedXrefCustomer = stores.MatchedXrefsCustomerStore.selectedMatchedXrefCustomer
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
    createCustomerCheckBoxList = () => {
        this.customerCheckBoxList = [
            {
                "label": "Auto Search",
                "handler": this.autoSearchHandler
            },
            {
                "label": "Exclude #s",
                "handler": this.excludeNumsHandler
            }
        ]
    }

    @action
    autoSearchHandler = () => {
        this.autoSearch = !this.autoSearch
    }

    @action
    excludeNumsHandler = () => {
        this.excludeNums = !this.excludeNums
    }

    @action
    createMatchingButtonList = () => {
        this.matchingButtonList = [
            {
                "label" : "Match",
                "action": this.matchCustomers,
                "disabled": false,
                "style": {
                    color: 'green',
                    margin: 0,
                    width: 100
                }
            },
            {
                "label" : "Add New",
                "action": this.openCreateNewMasterDialog,
                "disabled": false,
                "style": {
                    margin: 0,
                    width: 100
                }
            },
            {
                "label" : "Edit",
                "action": this.openEditMaster,
                "disabled": false,
                "style": {
                    color: 'green',
                    margin: 0,
                    width: 100
                }
            },
            {
                "label" : "Delete",
                "action": this.deleteMaster,
                "disabled": false,
                "style": {
                    color: 'green',
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
                "label": "Verify Match",
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
                "label": "Match",
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
                    marginTop: 30,
                    width: 100
                }
            },
            {
                "label": "Recode",
                "action": this.reCodeCustomers,
                "disabled": false,
                "style": {
                    color: 'green',
                    margin: 0,
                    marginTop: 30,
                    width: 100
                }
            },
            {
                "label": "export",
                "action": this.exportjson,
                "disabled": false,
                "style": {
                    margin: 0,
                    width: 100
                }
            }
        ]
    }



//Button Functions----------------------------------------------------------------------------------------------

    @action
    checkCoding = () => {
        if(this.selectedMasterCustomers.length === 1){
            this.updateTempSearchObj('warehouse', []) // <-- don't filter this search on warehouses.
            this.updateTempSearchObj('MCUID', this.selectedMasterCustomers[0].MCUID)
            this.resetMatchedSearch()
            this.searchMatched()
            this.filterOnWarehouse() // < --- okay, now filter on warehouses again.
            this.resetTempSearch()
        }

    }

    @action
    viewGroup = () => {
        if (this.selectedMatchedXrefCustomer.length === 1) {
            this.resetTempSearch()
            this.updateTempSearchObj('MCUID', this.selectedMatchedXrefCustomer[0].MasterStoreId)
            this.resetMasterSearch()
            this.searchMaster()
            this.resetTempSearch()
        }
    }

    @action
    reCodeCustomers = () => {
        let customerList = []
        let importCustomerId = "{"
        this.selectedMatchedXrefCustomer.forEach((x, idx) => {
            if (this.selectedMatchedXrefCustomer.length === 1) {
                importCustomerId += `${x.ImportCustomerId}}`
            } else if (
                idx === this.selectedMatchedXrefCustomer.length - 1
            ){
                importCustomerId += `, ${x.ImportCustomerId}}`
            } else if (idx === 0) {
                importCustomerId += x.ImportCustomerId
            } else {
                importCustomerId += `, ${x.ImportCustomerId}`
            }
            customerList.push(x)
            console.log(x.ImportCustomerId)
        })
        console.log("importCustomerId: ", toJS(importCustomerId))
        Api.post(`http://${apiURL}/rpc/recodecustomers`)
            .send({
                "matched_customers": importCustomerId
            })
            .then(resp => {
                if(resp.status === 200){
                    this.removeUnmatched(customerList)
                }
            })
    }

    @action
    open = () => {
        this.openCreateNewMasterDialog()
    }

    @action
    matchCustomers = () => {
        if(this.selectedMasterCustomers.length === 1){
            let customerList = []
            let xrefids = "{"
            let store_id = this.selectedMasterCustomers[0].MCUID
            this.selectedUnmatchedXrefCustomer.forEach((x, idx) => {
                if (this.selectedUnmatchedXrefCustomer.length === 1) {
                    xrefids += `${x.xrefstoreid}}`
                } else if (
                    idx === this.selectedUnmatchedXrefCustomer.length - 1
                ){
                    xrefids += `, ${x.xrefstoreid}}`
                } else if (idx === 0) {
                    xrefids += x.xrefstoreid
                } else {
                    xrefids += `, ${x.xrefstoreid}`
                }
                customerList.push(x)
            })
            console.log('{"unmatchedxrefs": ', xrefids, '"storeid": ', store_id, '}')
            Api.post(`http://${apiURL}/rpc/matchcustomers`)
                .send({
                    "unmatchedxrefs": xrefids,
                    "storeid": store_id
                })
                .then(resp => {
                    console.log(resp.body)
                    if(resp.status === 200){
                        this.removeMatched(customerList)
                    }
                })
        }
    }

    @action
    updateEditMasterObj = (key, value) => {
        this.editMasterObj[key] = value
    }


    @action
    editMaster = () => {
        let postObj = {}
        Object.keys(this.editMasterObj).map(key => {
            if (this.editMasterObj[key] !== this.selectedMasterCustomers[0][key]) {
                if (key === "Name"){
                    postObj['storename'] = this.editMasterObj[key]
                }
                if (key === "Address"){
                    postObj['storeaddress'] = this.editMasterObj[key]
                }
                if (key === "Address2"){
                    postObj['storeaddress2'] = this.editMasterObj[key]
                }
                if (key === "City"){
                    postObj['storecity'] = this.editMasterObj[key]
                }
                if (key === "State"){
                    postObj['storestate'] = this.editMasterObj[key]
                }
                if (key === "Zip"){
                    postObj['storezip'] = this.editMasterObj[key]
                }
                if (key === "PhoneNum"){
                    postObj['phonenum'] = this.editMasterObj[key]
                }
                if (key === "CreatedBy"){
                    postObj['createdbyid'] = this.editMasterObj[key]
                }
                this.selectedMasterCustomers[0][key] = this.editMasterObj[key]
            }
        })
        Api.patch(`http://${apiURL}/master_customer?master_customer_id=eq.${this.selectedMasterCustomers[0].MCUID}`)
            .send(postObj)
            .then(resp => {
                console.log(resp.body)
                this.editMasterCustomerOpen = false
            })
    }

    @action
    deleteMaster = () => {
        if (this.selectedMasterCustomers.length === 1) {
            this.deleteMaster()
            Api.delete(`http://${apiURL}/master_customer?master_customer_id=eq.${this.selectedMasterCustomers[0].MCUID}`)
                .then(resp => {
                    console.log(resp.body)
                })
        }
    }

    @action
    exportjson = () => {
        console.log('poo')
        Api.get(`http://localhost:4000/testdownload`)
            .then(resp => {
                console.log(resp)
            })
    }

//Radio Handlers ----------------------------------------------------------------------------------------------------

    @action
    handleCreateNewMasterRadioGroup = (selected) => {
        this.createNewMasterRadioGroup = selected
    }

//Dialog State Handlers-------------------------------------------------------------------------------------------------------

    @action
    openPurchaseRecordsDialog = () => {
        this.purchaseRecordsDialogOpen = true
        console.log(this.purchaseRecordsDialogOpen)
    }

    @action
    closePurchaseRecordsDialog = () => {
        this.purchaseRecordsDialogOpen = false
    }

    @action
    openCreateNewMasterDialog = () => {
        this.createNewMasterDialogOpen = true
    }

    @action
    closeCreateNewMasterDialog = () => {
        this.createNewMasterDialogOpen = false
    }

    log = (x) => {
        console.log('logging: ', x)
    }

    @action
    openEditMaster = () => {
        if (this.selectedMasterCustomers.length === 1) {
            Object.keys(this.selectedMasterCustomers[0]).map(key => {
                this.editMasterObj[key] = this.selectedMasterCustomers[0][key]
            })
            this.editMasterCustomerOpen = true
        }
    }

    @action
    closeEditMaster = () => {
        this.editMasterCustomerOpen = false
    }

}

//{
//   "description": "whatever"
// }