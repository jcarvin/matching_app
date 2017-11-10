import {observable, computed, reaction, action, observe, when, spy, extendObservable } from 'mobx'
import { clientConfig } from '../../ClientConfig.js'
const apiURL = clientConfig.apiURL
const Api = require('superagent-bluebird-promise')



export default class UnmatchedXrefsCustomerStore {

    //observables:
    @observable unmatchedXrefsCustomersList = []
    @observable selectedUnmatchedXrefCustomer=[]
    @observable unmatchedXrefsLoading = false
    @observable widths = [23, 14, 15, 15, 65, 60, 50, 30, 13, 15, 16, 14, 42, 25]
    @observable searchObj = {}
    @observable searchIdx = 0
    @observable count = 0
    @observable sortKey = 'xrefstoreid'
    @observable sortDir = 'asc'

    constructor(CustomerUtilityStore) {
        extendObservable(this)
        this.searchObj = CustomerUtilityStore.unmatchedSearchObj
        this.autoSearch = false

        const autoSearchUpdater = reaction(
            () => CustomerUtilityStore.autoSearch,
            autosearch => {
                this.autoSearch = CustomerUtilityStore.autoSearch
            })
    }

    @action
    getUnmatchedXrefs = (idx) => {
        this.unmatchedXrefsLoading = true
        Api.get(`http://${apiURL}/import_customer?order=${this.sortBy}.${this.sortDir}&master_customer_id=is.null&limit=30&offset=${this.searchIdx*30}${this.searchString}`)
            .set('Prefer', 'count=exact')
            .then(resp => {
                this.count = (parseInt(resp.headers['content-range'].split('/')[1]))
                resp.body.map(customer => {
                    this.unmatchedXrefsCustomersList.push({
                        "xrefstoreid": customer.import_customer_id,
                        "WHID": customer.warehouse_id,
                        "MCID": customer.chain_num,
                        "MCUID": customer.customer_num,
                        "Name": customer.customer_name,
                        "Address": customer['address_1'],
                        "Address2": customer['address_2'],
                        "City": customer['city'],
                        "State": customer['state'],
                        "Zip": customer['zip'],
                        "Phone #": customer['phone'],
                        "RepNum": customer.repnum,
                        "RepName": customer.repname,
                        "AssignedTo": customer.userid
                    })
                })
                this.unmatchedXrefsLoading = false
                this.searchIdx += 1
            })
            .catch(resp => {
                console.log(resp)
            })
    }

    @computed get widthPcts () {
        return this.widths.map(width => {
            return width/this.widths.reduce(function(a, b) { return a + b; }, 0);
        })
    }

    @computed get searchString () {
        let search = ''
        if(Object.keys(this.searchObj).indexOf('warehouse') !== -1) {
            let intString = ''
            this.searchObj.warehouse.map(x => {
                if (this.searchObj.warehouse.indexOf(x) !== this.searchObj.warehouse.length -1) {
                    intString += `${x},`
                } else {
                    intString += x
                }
            })
            search += `&warehouse_id=in.${intString}`
        }
        Object.keys(this.searchObj).map(key =>{
            switch(key){
                case 'MCID':
                    search += `&chain_num=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'MCUID':
                    search += `&master_customer_id=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'ChainID':
                    search += `&chain_num=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'StoreID':
                    search += `&customer_num=ilike.*${encodeURIComponent(this.searchObj[key])}*`
                    break;
                case 'Rep ID':
                    search += `&repnum=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'Name':
                    search += `&customer_name=ilike.*${encodeURIComponent(this.searchObj[key])}*`
                    break;
                case 'Address':
                    search += `&address_1=ilike.*${encodeURIComponent(this.searchObj[key])}*`
                    break;
                case 'Add 2':
                    search += `&address_2=ilike.*${encodeURIComponent(this.searchObj[key])}*`
                    break;
                case 'City':
                    search += `&city=ilike.*${encodeURIComponent(this.searchObj[key])}*`
                    break;
                case 'State':
                    search += `&state=ilike.*${encodeURIComponent(this.searchObj[key])}*`
                    break;
                case 'Zip':
                    search += `&zip=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
            }
        })
        return search
    }

    @computed get sortBy () {
        switch(this.sortKey){
            case 'xrefstoreid':
                return 'import_chain_id'
            case 'WHID':
                return 'warehouse_id';
            case 'MCID':
                return 'chain_num'
            case 'MCUID':
                return 'customer_num'
            case 'Name':
                return 'customer_name'
            case 'Address':
                return 'address_1'
            case 'Address2':
                return 'address_2'
            case 'City':
                return 'city'
            case 'State':
                return 'state'
            case 'Zip':
                return 'zip'
            case 'RepNum':
                return 'repnum'
            // case 'StartPeriod':
            //     return 'startperiod'
            // case 'EndPeriod':
            //     return 'endperiod'
            // case 'CodedBy':
            //     return 'userid'
            // case 'RepNum':
            //     return 'repnum'
            // case 'RepName':
            //     return 'repname'
            // case 'AssignedTo':
            //     return 'userid'
        }
    }

    @action
    searchUnmatched = () => {
        this.unmatchedXrefsCustomersList = []
        this.searchIdx = 0
        this.getUnmatchedXrefs()
    }

    @action
    selectNext = () => {
        this.selectedUnmatchedXrefCustomer = [this.unmatchedXrefsCustomersList[this.unmatchedXrefsCustomersList.indexOf(this.selectedUnmatchedXrefCustomer[0]) + 1]]
        // console.log(this.autoSearch)
    }

    @action
    selectPrev = () => {
        this.selectedUnmatchedXrefCustomer = [this.unmatchedXrefsCustomersList[this.unmatchedXrefsCustomersList.indexOf(this.selectedUnmatchedXrefCustomer[0]) - 1]]
        // console.log(this.autoSearch)
    }

    @action
    removeMatched = (customers) => {
        let removed = []
        this.selectedUnmatchedXrefCustomer = []
        customers.map(customer => {
            removed.push(this.unmatchedXrefsCustomersList.splice(this.unmatchedXrefsCustomersList.indexOf(customer), 1))
        })
    }

    @action
    selectOne = (xrefCustomerId) => {
        this.selectedUnmatchedXrefCustomer = [xrefCustomerId]
    }

    @action
    shiftSelect = (xrefCustomerIdList) => {
        xrefCustomerIdList.map(customer => {
            this.selectedUnmatchedXrefCustomer.push(customer)
        })
    }

    @action
    ctrlSelect = (customer) => {
        //if brand is already in list, remove it. Else, add it.
        if (this.selectedUnmatchedXrefCustomer.indexOf(customer)  === -1) {
            this.selectedUnmatchedXrefCustomer.push(customer)
        } else {
            this.selectedUnmatchedXrefCustomer.splice(this.selectedUnmatchedXrefCustomer.indexOf(customer), 1)
        }
    }

    @action
    clickLabel = (label) => {
        if(this.sortKey === label){
            if(this.sortDir === 'asc') {
                this.sortDir = 'desc'
            } else if (this.sortDir === 'desc'){
                this.sortDir = 'asc'
            }
        }else{
            this.sortKey = label
        }
        this.searchUnmatched()
    }

}
