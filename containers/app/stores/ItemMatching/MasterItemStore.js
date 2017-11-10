import {observable, computed, reaction, action, observe, when, spy, extendObservable, toJS } from 'mobx'
import { clientConfig } from '../../ClientConfig.js'
const apiURL = clientConfig.apiURL
const Api = require('superagent-bluebird-promise')

import { GET_LIST, GET_MANY } from 'admin-on-rest';
import { rpcClient, restClient } from 'infobate-transport-layer'
import { inject, observer } from 'mobx-react'

export default class MasterBrandStore {

    //observables:
    @observable masterBrandList = []
    @observable selectedMasterBrands = []
    @observable masterBrandsLoading = false
    @observable widths = [10, 16, 60, 20, 10, 50, 10, 14, 20, 20]
    @observable searchObj = {}
    @observable searchIdx = 0
    @observable count = 0
    @observable sortKey = 'brand_id'
    @observable sortDir = 'asc'

    @inject(BrandUtilityStore)
    constructor(BrandUtilityStore) {
        extendObservable(this)
        this.searchObj = this.props.BrandUtilityStore.masterSearchObj
    }

    @action
    getMasterBrands = (idx) => {
        this.masterBrandsLoading = true
        restClient(GET_LIST, 'master_item',{
            filter: this.searchObj,
            sort: { field: this.sortBy, order: this.sortDir },
            pagination: { page: this.searchIdx, perPage: 30 },
        }).then(resp => {
            resp.data.map(brand => {
                this.masterBrandList.push({
                    "brand_id": brand.master_item_id,
                    "upc": brand.upc,
                    "description": brand.description,
                    "pack_desc": brand.measure,
                    "pack": brand.pack,
                    "vendor": brand.vendor,
                    "type": brand.packtype,
                    "gtin_upc": brand.upc,
                    "nacs": brand.brandcode,
                    "boxequiv": brand.boxequiv
                })
            })
            this.masterBrandsLoading = false
            this.searchIdx += 1                     
        })
        // Api.get(`http://${apiURL}/master_item?order=${this.sortBy}.${this.sortDir}&limit=30&offset=${this.searchIdx*30}${this.searchString}`)
        //     .set('Prefer', 'count=exact')
        //     .then(resp => {
        //         this.count = (parseInt(resp.headers['content-range'].split('/')[1]))
                // resp.body.map(brand => {
                //     this.masterBrandList.push({
                //         "brand_id": brand.master_item_id,
                //         "upc": brand.upc,
                //         "description": brand.description,
                //         "pack_desc": brand.measure,
                //         "pack": brand.pack,
                //         "vendor": brand.vendor,
                //         "type": brand.packtype,
                //         "gtin_upc": brand.upc,
                //         "nacs": brand.brandcode,
                //         "boxequiv": brand.boxequiv
                //     })
                // })
                // this.masterBrandsLoading = false
                // this.searchIdx += 1
        //     })
        //     .catch(resp => {
        //         console.log(resp)
        //     })
    }

    @action
    viewGroup = (brandid) => {
        this.masterBrandsLoading = true
        this.searchIdx = 0
        this.masterBrandList = []
        Api.post(`http://${apiURL}/rpc/viewgroup`)
            .send({
                "brandid": brandid
            })
            .set('Prefer', 'count=exact')
            .then((resp => {
                this.count = (parseInt(resp.headers['content-range'].split('/')[1]))
                resp.body.map(brand => {
                    this.masterBrandList.push({
                        "brand_id": brand.master_item_id,
                        "upc": brand.upc,
                        "description": brand.description,
                        "pack_desc": brand.measure,
                        "pack": brand.pack,
                        "vendor": brand.vendor,
                        "type": brand.packtype,
                        "gtin_upc": brand.upc,
                        "nacs": brand.brandcode,
                        "boxequiv": brand.boxequiv
                    })
                })
                // this.masterBrandsLoading = false
                // this.searchIdx += 1
            }))
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
                case 'brand_id':
                    search += `&master_item_id=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'reported_upc':
                    search += `&upc=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'description':
                    search += `&${key}=ilike.*${encodeURIComponent(this.searchObj[key])}*`
                    break;
                case 'pack':
                    search += `&${key}=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'vendor':
                    search += `&${key}=ilike.*${encodeURIComponent(this.searchObj[key])}*`
                    break;
                case 'type':
                    search += `&packtype=ilike.${encodeURIComponent(this.searchObj[key])}`
                    break;
            }
        })
        return search
    }

    @computed get sortBy () {
        switch(this.sortKey){
            case 'brand_id':
                return 'master_item_id'
            case 'sku':
                return this.sortKey
            case 'upc':
                return this.sortKey
            case 'gtin_upc':
                return 'upc'
            case 'description':
                return this.sortKey
            case 'pack_desc':
                return 'measure'
            case 'pack':
                return this.sortKey
            case 'vendor':
                return this.sortKey
            case 'type':
                return 'packtype'
            case 'cost':
                return 'basecost'
            case 'warehouse_id':
                return this.sortKey
            case 'nacs':
                return 'brandcode'
            case 'boxequiv':
                return this.sortKey
            default:
                return 'master_item_id'
        }
    }


    @action
    searchMaster = () => {
        this.masterBrandList = []
        this.searchIdx = 0
        this.getMasterBrands()
    }



    @action
    selectOne = (brand_id) => {
        this.selectedMasterBrands = [brand_id]
    }

    @action
    shiftSelect = (xrefBrandIdList) => {
        xrefBrandIdList.map(brand => {
            this.selectedMasterBrands.push(brand)
        })
    }

    @action
    ctrlSelect = (brand) => {
        //if brand is already in list, remove it. Else, add it.
        if (this.selectedMasterBrands.indexOf(brand)  === -1) {
            this.selectedMasterBrands.push(brand)
        } else {
            this.selectedMasterBrands.splice(this.selectedMasterBrands.indexOf(brand), 1)
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