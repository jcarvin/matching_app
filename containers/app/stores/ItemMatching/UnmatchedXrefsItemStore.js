import {observable, computed, reaction, action, observe, when, spy, extendObservable, toJS } from 'mobx'
import { inject } from 'mobx-react'
import { clientConfig } from '../../ClientConfig.js'
const apiURL = clientConfig.apiURL
const Api = require('superagent-bluebird-promise')

export default class UnmatchedXrefsBrandStore {

    //observables:
    @observable unmatchedXrefsBrandsList = []
    @observable selectedUnmatchedXrefBrand=[]
    @observable unmatchedXrefsLoading = false
    @observable widths = [10, 10, 14, 60, 14, 6, 50, 10, 10]
    @observable searchObj = {}
    @observable searchIdx = 0
    @observable count = 0
    @observable sortKey = 'xrefid'
    @observable sortDir = 'asc'

    @inject(BrandUtilityStore)
    constructor(BrandUtilityStore) {
        extendObservable(this)
        this.searchObj = this.props.BrandUtilityStore.unmatchedSearchObj
    }

    @action
    getUnmatchedXrefs = (idx) => {
        this.unmatchedXrefsLoading = true
        Api.get(`http://${apiURL}/import_item?order=${this.sortBy}.${this.sortDir}&master_item_id=is.null&limit=30&offset=${this.searchIdx*30}${this.searchString}`)
            .set('Prefer', 'count=exact')
            .then(resp => {
                this.count = (parseInt(resp.headers['content-range'].split('/')[1]))
                resp.body.map(brand => {
                    this.unmatchedXrefsBrandsList.push({
                        "xrefid": brand.import_item_id,
                        "sku": brand.sku,
                        "reported_upc": brand.reported_upc,
                        "description": brand.description,
                        "pack_desc": brand.measure,
                        "pack": brand.pack,
                        "vendor": brand.manufacturer,
                        "type": brand.packtype,
                        "warehouse_id": brand.warehouse_id
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
                case 'xrefid':
                    search += `&import_item_id=eq.${encodeURIComponent(this.searchObj[key])}`
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
            case 'sku':
                return this.sortKey
            case 'reported_upc':
                return this.sortKey;
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
        }
    }

    @action
    searchUnmatched = () => {
        this.unmatchedXrefsBrandsList = []
        this.searchIdx = 0
        this.getUnmatchedXrefs()
    }

    @action
    removeMatched = (brands) => {
        let removed = []
        this.selectedUnmatchedXrefBrand = []
        brands.map(brand => {
            removed.push(this.unmatchedXrefsBrandsList.splice(this.unmatchedXrefsBrandsList.indexOf(brand), 1))
        })
    }


    @action
    selectOne = (xrefBrandId) => {
        this.selectedUnmatchedXrefBrand = [xrefBrandId]
    }

    @action
    shiftSelect = (xrefBrandIdList) => {
        xrefBrandIdList.map(brand => {
            this.selectedUnmatchedXrefBrand.push(brand)
        })
    }

    @action
    ctrlSelect = (brand) => {
        //if brand is already in list, remove it. Else, add it.
        if (this.selectedUnmatchedXrefBrand.indexOf(brand)  === -1) {
            this.selectedUnmatchedXrefBrand.push(brand)
        } else {
            this.selectedUnmatchedXrefBrand.splice(this.selectedUnmatchedXrefBrand.indexOf(brand), 1)
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

    printStuff  ()  {
        console.log("testtttt")
    }

}