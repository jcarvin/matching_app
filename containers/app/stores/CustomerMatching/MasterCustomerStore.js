import {observable, computed, reaction, action, observe, when, spy, extendObservable } from 'mobx'
import { clientConfig } from '../../ClientConfig.js'
const apiURL = clientConfig.apiURL
const Api = require('superagent-bluebird-promise')

import { GET_LIST, GET_MANY } from 'admin-on-rest';
import { rpcClient, restClient } from 'infobate-transport-layer'

export default class MasterCustomerStore {

    //observables:
    @observable masterCustomersList = []
    @observable selectedMasterCustomers=[]
    @observable masterCustomersLoading = false
    @observable widths = [12, 10, 60, 60, 60, 30, 10, 20, 20, 18, 28]
    @observable searchObj = {}
    @observable searchIdx = 0
    @observable count = 0
    @observable sortKey = 'MCUID'
    @observable sortDir = 'asc'

    constructor(CustomerUtilityStore) {
        extendObservable(this)
        this.searchObj = CustomerUtilityStore.masterSearchObj
    }

    @action
    getMasterCustomers = (idx) => {
        this.masterCustomersLoading = true
        restClient(GET_LIST, 'master_customer',{
            filter: this.searchObj,
            sort: { field: this.sortBy, order: this.sortDir },
            pagination: { page: this.searchIdx, perPage: 30 },
        }).then(resp => {
            resp.data.map(brand => {
                this.masterCustomersList.push({
                    "MCUID": customer.master_customer_id,
                    "Notes": 0,
                    "Name": customer.customer_name,
                    "Address": customer.address1,
                    "Address2": customer.address2,
                    "City": customer.city,
                    "State": customer.state,
                    "Zip": customer.zip,
                    "PhoneNum": customer.phone,
                    "CreatedBy": customer.mcidcodedby,
                    "CreatedDate": customer.mcidcodeddate
                })
            })
            this.masterCustomersLoading = false
            this.searchIdx += 1                     
        })
        // Api.get(`http://${apiURL}/master_customer?order=${this.sortBy}.${this.sortDir}&limit=30&offset=${this.searchIdx*30}${this.searchString}`)
        //     .set('Prefer', 'count=exact')
        //     .then(resp => {
        //         if(resp.headers['content-range'].split('/')[0] !== '0-0'){
        //             this.count = (parseInt(resp.headers['content-range'].split('/')[1]))
        //         }
        //         resp.body.map(customer => {
        //             this.masterCustomersList.push({
                        // "MCUID": customer.master_customer_id,
                        // "Notes": 0,
                        // "Name": customer.customer_name,
                        // "Address": customer.address1,
                        // "Address2": customer.address2,
                        // "City": customer.city,
                        // "State": customer.state,
                        // "Zip": customer.zip,
                        // "PhoneNum": customer.phone,
                        // "CreatedBy": customer.mcidcodedby,
                        // "CreatedDate": customer.mcidcodeddate
        //             })
        //         })
        //         this.masterCustomersLoading = false
        //         this.searchIdx += 1
        //     })
        //     .catch(resp => {
        //         console.log(resp)
        //     })
    }

    @computed get widthPcts () {
        return this.widths.map(width => {
            return width/this.widths.reduce(function(a, b) { return a + b; }, 0);
        })
    }

    @computed get searchString () {
        let search = ''
        Object.keys(this.searchObj).map(key =>{
            switch(key){
                case 'MCID':
                    // search += `&master_chain_id=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'MCUID':
                    search += `&master_customer_id=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'ChainID':
                    // search += `&master_chain_id=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'Rep ID':
                    // search += `&repid=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'Name':
                    search += `&customer_name=ilike.*${encodeURIComponent(this.searchObj[key])}*`
                    break;
                case 'Address':
                    search += `&address1=ilike.*${encodeURIComponent(this.searchObj[key])}*`
                    break;
                case 'Address2':
                    search += `&address2=ilike.*${encodeURIComponent(this.searchObj[key])}*`
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
                case 'Phone #':
                    search += `&phone=eq.${encodeURIComponent(this.searchObj[key])}`
            }
        })
        return search
    }

    @computed get sortBy () {
        switch(this.sortKey){
            case 'MCUID':
                return 'master_customer_id'
            case 'Notes':
                return 'cr_comments'
            case 'Name':
                return 'customer_name'
            case 'Address':
                return 'address1';
            case 'Address2':
                return 'address2'
            case 'City':
                return 'city'
            case 'State':
                return 'state'
            case 'Zip':
                return 'zip'
            case 'PhoneNum':
                return 'phone'
            case 'CreatedBy':
                return 'mcidcodedby'
            case 'CreatedDate':
                return 'mcidcodeddate'
        }
    }

    @action
    deleteMaster = () => {
        if (this.selectedMasterCustomers.length === 1) {
            this.masterCustomersList.map(cust => {
                if (cust.MCUID === this.selectedMasterCustomers[0].MCUID) {
                    this.masterCustomersList.splice(this.masterCustomersList.indexOf(cust), 1)
                }
            })
        }
    }

    @action
    searchMaster = () => {
        this.masterCustomersList = []
        this.searchIdx = 0
        this.getMasterCustomers()
    }

    @action
    selectOne = (xrefCustomerId) => {
        this.selectedMasterCustomers = [xrefCustomerId]
    }

    @action
    shiftSelect = (xrefCustomerIdList) => {
        xrefCustomerIdList.map(customer => {
            this.selectedMasterCustomers.push(customer)
        })
    }

    @action
    ctrlSelect = (customer) => {
        //if brand is already in list, remove it. Else, add it.
        if (this.selectedMasterCustomers.indexOf(customer)  === -1) {
            this.selectedMasterCustomers.push(customer)
        } else {
            this.selectedMasterCustomers.splice(this.selectedMasterCustomers.indexOf(customer), 1)
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
        this.searchMaster()
    }

}
