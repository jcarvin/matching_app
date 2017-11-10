import {observable, computed, reaction, action, observe, when, spy, extendObservable, toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import { clientConfig } from '../../ClientConfig.js'
const apiURL = clientConfig.apiURL
const Api = require('superagent-bluebird-promise')


export default class matchedXrefsBrandStore {

    //observables:
    @observable matchedXrefsBrandsList = []
    @observable selectedMatchedXrefBrand=[]
    @observable matchedXrefsLoading = false
    @observable widths = [10, 15, 20, 25, 60, 20, 10, 50, 35]
    @observable searchObj = {}
    @observable searchIdx = 0
    @observable count = 0
    @observable sortKey = 'xrefid'
    @observable sortDir = 'asc'

    @inject(BrandUtilityStore)
    constructor(BrandUtilityStore) {
        extendObservable(this)
        this.searchObj = this.props.BrandUtilityStore.matchedSearchObj
    }

    @action
    getMatchedXrefs = (idx) => {
        this.matchedXrefsLoading = true
        Api.get(`http://${apiURL}/import_item?order=${this.sortBy}.${this.sortDir}&master_item_id=not.is.null&limit=30&offset=${this.searchIdx*30}${this.searchString}`)
            .set('Prefer', 'count=exact')
            .then(resp => {
                this.count = (parseInt(resp.headers['content-range'].split('/')[1]))
                resp.body.map(brand => {
                    this.matchedXrefsBrandsList.push({
                        "xrefid": brand.import_item_id,
                        "brand_id": brand.master_item_id,
                        "sku": brand.sku,
                        "reported_upc": brand.reported_upc,
                        "description": brand.description,
                        "pack_desc": brand.measure,
                        "pack": brand.pack,
                        "vendor": brand.manufacturer,
                        "warehouse_id": brand.warehouse_id
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
        Object.keys(this.searchObj).map(key =>{
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
            switch(key){
                case 'xrefid':
                    search += `&import_item_id=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'brand_id':
                    search += `&master_item_id=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'sku':
                    search += `&${key}=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'reported_upc':
                    search += `&${key}=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'description':
                    search += `&${key}=ilike.*${encodeURIComponent(this.searchObj[key])}*`
                    break;
                case 'pack_desc':
                    search += `&measure=ilike.*${encodeURIComponent(this.searchObj[key])}*`
                    break;
                case 'pack':
                    search += `&${key}=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'vendor':
                    search += `&manufacturer=ilike.*${encodeURIComponent(this.searchObj[key])}*`
                    break;
                case 'type':
                    search += `&packtype=ilike.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'user':
                    search += `&userid=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
                case 'warehouse_id':
                    search += `&warehouse_id=eq.${encodeURIComponent(this.searchObj[key])}`
                    break;
            }
        })
        return search
    }

    @computed get sortBy () {
        switch(this.sortKey){
            case 'xrefid':
                return 'import_item_id'
            case 'brand_id':
                return 'master_item_id'
            case 'sku':
                return this.sortKey
            case 'reported_upc':
                return this.sortKey
            case 'description':
                return this.sortKey
            case 'pack_desc':
                return 'measure'
            case 'pack':
                return this.sortKey
            case 'vendor':
                return 'manufacturer'
            case 'type':
                return 'packtype'
            case 'user':
                return 'userid'
            case 'warehouse_id':
                return this.sortKey
            case 'verified':
                return 'verflag'
            case 'lastchange':
                return 'xrefid'
            case 'verifiedby':
                return 'userid'
            case 'lastmonth':
                return this.sortKey
            default:
                return 'import_item_id'
        }
    }


    @action
    searchMatched = () => {
        this.matchedXrefsBrandsList = []
        this.searchIdx = 0
        this.getMatchedXrefs()
    }

    @action
    removeUnmatched = (brands) => {
        let removed = []
        this.selectedMatchedXrefBrand = []
        brands.map(brand => {
            removed.push(this.matchedXrefsBrandsList.splice(this.matchedXrefsBrandsList.indexOf(brand), 1))
        })
    }

    @action
    selectOne = (xrefBrandId) => {
        this.selectedMatchedXrefBrand = [xrefBrandId]
    }

    @action
    shiftSelect = (xrefBrandIdList) => {
        xrefBrandIdList.map(brand => {
            this.selectedMatchedXrefBrand.push(brand)
        })
    }

    @action
    ctrlSelect = (brand) => {
        //if brand is already in list, remove it. Else, add it.
        if (this.selectedMatchedXrefBrand.indexOf(brand)  === -1) {
            this.selectedMatchedXrefBrand.push(brand)
        } else {
            this.selectedMatchedXrefBrand.splice(this.selectedMatchedXrefBrand.indexOf(brand), 1)
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