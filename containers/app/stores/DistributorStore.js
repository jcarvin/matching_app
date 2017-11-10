import {observable, computed, reaction, action, observe, when, spy, extendObservable, toJS } from 'mobx'
import { clientConfig } from '../ClientConfig.js'
const apiURL = clientConfig.apiURL
const Api = require('superagent-bluebird-promise')


export default class DistributorStore {

    //observables:
    @observable distributorList = []
    @observable selectedDistributor //int
    @observable selectedWarehouses = []
    @observable visibleWarehouses = []

    constructor(BrandUtilityStore) {
        extendObservable(this)
        this.filterOnWarehouse = BrandUtilityStore.filterOnWarehouse
        this.getDistributors()
    }

//DropDown List------------------------------------------------------------------------------------------------------

    @action
    getDistributors = () => {
        Api.get(`http://${apiURL}/data_suppliers?order=distributor_name.asc&select=distributor_name,distributor_id`)
            .set('Prefer', 'count=exact')
            .then(resp => {
                let idList = []
                resp.body.map(x => {
                    if(idList.indexOf(x.distributor_id) === -1) {
                        idList.push(x.distributor_id)
                        this.distributorList.push({
                            distributor_id: x.distributor_id,
                            distributor_name: x.distributor_name
                        })
                    }
                })
            })
            .catch(resp => {
                console.log(resp)
            })
    }

    @computed get distNameList () {
        return this.distributorList.map(x => {
            return ({
                value: x.distributor_id,
                label: x.distributor_name
            })
        })
    }

    @action
    updateSelectedDistributor = (value) => {
        this.selectedDistributor = value //<-- distributor_id (int)
        this.getVisibleWarehouses()
    }

//Available warehouses list-------------------------------------------------------------------------------------------

    @action
    getVisibleWarehouses () {
        let list = []
        if (this.selectedDistributor) {
            list = []
            Api.get(`http://${apiURL}/data_suppliers?select=warehouse_name,warehouse_id&distributor_id=eq.${this.selectedDistributor}`)
                .set('Prefer', 'count=exact')
                .then(resp => {
                    resp.body.map( x => {
                        list.push({
                            ID: x.warehouse_id,
                            Warehouse: x.warehouse_name
                        })
                    })
                    this.visibleWarehouses = list
                })
                .catch(resp => {
                })
        } else {
            list = [{ID: 0, Warehouse: "No Distributor Selected"}]
        }
    }
    
    @action
    visibleWarehousesOnClick = (warehouse) => {
        let idList = this.selectedWarehouses.map(x => {
            return x.ID
        })
        if (idList.indexOf(warehouse.ID) === -1 && this.visibleWarehouses[0].ID !==0){
            this.selectedWarehouses.push(warehouse)
        }
    }

    shiftSelect = (x) => {
        let idList = this.selectedWarehouses.map(x => {
            return x.ID
        })
        x.map(wh => {
            if(wh){
                if (idList.indexOf(wh.ID) === -1 && this.visibleWarehouses[0].ID !==0){
                    this.selectedWarehouses.push(wh)
                }
            }
        })
    }

    selectAllVis = () => {
        this.shiftSelect(this.visibleWarehouses)
    }

    ctrlSelect = (x) => {
        let idList = this.selectedWarehouses.map(x => {
            return x.ID
        })
        if (idList.indexOf(x.ID) === -1 && this.visibleWarehouses[0].ID !==0){
            this.selectedWarehouses.push(x)
        }
    }

//Selected Warehouses List------------------------------------------------------------------------------------------

    @action
    selectedWarehousesOnClick = (warehouse) => {
        this.selectedWarehouses.splice(this.selectedWarehouses.indexOf(warehouse), 1)
        this.filterOnWarehouse()
    }

    removeAllSelected = () => {
        this.selectedWarehouses = []
    }

    //Arbitrary funcs--------------------------------------------------------------------------------------------------



    loadFunc = (x) => {
        return this.visibleWarehouses
    }

}