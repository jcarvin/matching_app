import {observable, computed, reaction, action, observe, when, spy, extendObservable } from 'mobx'
import { clientConfig } from '../../ClientConfig.js'
const apiURL = clientConfig.apiURL
const Api = require('superagent-bluebird-promise')



export default class MatchedXrefsCustomerStore {

    //observables:
    @observable matchedXrefsCustomersList = []
    @observable selectedMatchedXrefCustomer=[]
    @observable matchedXrefsLoading = false
    @observable widths = [26, 30, 25, 25, 25, 60, 60, 60, 30, 13, 23/*, 15, 15*/]
    @observable searchObj = {}
    @observable searchIdx = 0
    @observable count = 0
    @observable sortKey = 'ImportCustomerId'
    @observable sortDir = 'asc'

    constructor(CustomerUtilityStore) {
        extendObservable(this)
        this.searchObj = CustomerUtilityStore.matchedSearchObj
    }

            @action
                getMatchedXrefs = (idx) => {
                    this.matchedXrefsLoading = true
                    Api.get(`http://${apiURL}/import_customer?order=${this.sortBy}.${this.sortDir}&master_customer_id=not.is.null&limit=30&offset=${this.searchIdx*30}${this.searchString}`)
                        .set('Prefer', 'count=exact')
                        .then(resp => {
                this.count = (parseInt(resp.headers['content-range'].split('/')[1]))
                resp.body.map(customer => {
                    this.matchedXrefsCustomersList.push({
                        "ImportCustomerId": customer.import_customer_id,
                        "MasterStoreId": customer.master_customer_id,
                        "Warehouse": customer.warehouse_id,
                        "ChainNum": customer.chain_num,
                        "StoreNum": customer.customer_num,
                        "Name": customer.customer_name,
                        "Address": customer.address_1,
                        "Address2": customer.address_2,
                        "City": customer.city,
                        "State": customer.state,
                        "Zip": customer.zip,
                        // "RepNum": customer.repnum,
                        // "RepName": customer.repname
                    })
                })
                this.matchedXrefsLoading = false
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
            case 'ImportCustomerId':
                return 'import_customer_id'
            case 'MasterStoreId':
                return 'master_customer_id'
            case 'Warehouse':
                return 'warehouse_id';
            case 'ChainNum':
                return 'chain_num'
            case 'StoreNum':
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
        }
    }

    @action
    searchMatched = () => {
        this.matchedXrefsCustomersList = []
        this.searchIdx = 0
        this.getMatchedXrefs()
    }

    @action
    removeUnmatched = (customers) => {
        let removed = []
        this.selectedMatchedXrefCustomer = []
        customers.map(cust => {
            removed.push(this.matchedXrefsCustomersList.splice(this.matchedXrefsCustomersList.indexOf(cust), 1))
        })
    }

    @action
    selectOne = (xrefCustomerId) => {
        this.selectedMatchedXrefCustomer = [xrefCustomerId]
    }

    @action
    shiftSelect = (xrefCustomerIdList) => {
        xrefCustomerIdList.map(customer => {
            this.selectedMatchedXrefCustomer.push(customer)
        })
    }

    @action
    ctrlSelect = (customer) => {
        //if brand is already in list, remove it. Else, add it.
        if (this.selectedMatchedXrefCustomer.indexOf(customer)  === -1) {
            this.selectedMatchedXrefCustomer.push(customer)
        } else {
            this.selectedMatchedXrefCustomer.splice(this.selectedMatchedXrefCustomer.indexOf(customer), 1)
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
        this.searchMatched()
    }

}
