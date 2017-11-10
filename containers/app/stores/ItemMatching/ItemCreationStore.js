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


export default class ItemCreationStore {

    //observables:
    @observable searchIdx = 0
    @observable boxEquivSearchObj = observable.map({})
    @observable createNewMasterDialogOpen = false
    @observable createNewMasterRadioGroup = ''
    @observable searchBarList = []
    @observable newMasterObj = observable.map({
        'reportedanufacturer': '',
        'manufacturer': '',
        'manufacturer_id': '',
        'brandcodestr': '',
        'brandcode': '',
        'description': '',
        'trackingcategory': '',
        'upc': '',
        'upc_10': '',
        'deal': '',
        'measure': '',
        'pack': '',
        'boxconversion': '',
        'boxequiv': '',
        'basecost': '',
        'type': ''
    })
    @observable boxEquivList = []
    @observable boxEquivsLoading = false
    @observable selectedBoxEquiv = []
    @observable manufacturerList = []
    @observable selectedUnmatchedXrefBrand = []
    @observable selectedMasterBrands = []
    @observable strListObj = []

    constructor(stores) {
        extendObservable(this)
        this.getManufacturers()

        when(
            () => (stores.BrandUtilityStore.selectedUnmatchedXrefBrand),
            () => {
                const unmatchedXrefsUpdater = reaction(
                    () => stores.BrandUtilityStore.selectedUnmatchedXrefBrand.map(x => {return x}),
                    brand => {
                        this.selectedUnmatchedXrefBrand = stores.BrandUtilityStore.selectedUnmatchedXrefBrand
                    })
                const masterUpdater = reaction(
                    () => stores.BrandUtilityStore.selectedMasterBrands.map(x => {return x}),
                    brand => {
                        this.selectedMasterBrands = stores.BrandUtilityStore.selectedMasterBrands
                    })
                const brandcodeUpdater = reaction(
                () => stores.NacsStore.strListObj.map(x => {return x}),
                x => {
                    this.strListObj = stores.NacsStore.strListObj
                })
            })

        when(
            () => (stores.NacsStore.strListObj),
            () => {this.strListObj = stores.NacsStore.strListObj})
    }

    //Radio Handlers ----------------------------------------------------------------------------------------------------

    @action
    handleCreateNewMasterRadioGroup = (selected) => {
        this.createNewMasterRadioGroup = selected
        console.log(toJS(this.createNewMasterRadioGroup))
    }

    //New Master Funcs-----------------------------------------------------------------------------------------------------

    @action
    updateNewMasterObj = (key, value) => {
        this.newMasterObj.set(key, value)
        if(key === 'manufacturer'){
            this.searchIdx = 0
            this.boxEquivList.clear()
            this.getboxEquivs()
        } else if (key === 'brandcodestr') {
            // console.log(toJS(this.strListObj))
            let obj = this.strListObj.filter(obj => {
                return value === obj.string
            })[0]
            if(obj){
                this.newMasterObj.set('brandcode', obj.code)
            }
        } else if (key === 'brandcode'){
            let obj = this.strListObj.filter(obj => {
                return value === obj.code
            })[0]
            if(obj){
                this.newMasterObj.set('brandcodestr', obj.string)
            }
        }
    }

    @action
    clearNewMasterObj = () => {
        this.newMasterObj.keys().map(key => {
            this.newMasterObj.set(key, '')
        })
    }

    //Vendor Stuff---------------------------------------------------------------------------------------------------------

    @action
    getManufacturers = () => {
        Api.get(`http://${apiURL}/vwmanufacturers`)
            .then(resp => {
                resp.body.map(x => {
                    this.manufacturerList.push({
                        manufacturerName: x.vendor,
                        manufacturer_id: x.manufacturer_id
                    })
                })
            })
    }

    @computed get manufacturerNames () {
        return this.manufacturerList.map(x => {
            return x.manufacturerName
        })
    }

    @computed get chosenManufacturerID () {
        let man
        if(this.newMasterObj.get('manufacturer') !== ''){
            man = this.manufacturerList.filter(x => {
                return x.manufacturerName === this.newMasterObj.get('manufacturer')
            })[0]
        }
        if(man){
            this.updateNewMasterObj('manufacturer_id', man.manufacturer_id)
            return man.manufacturer_id
        }else{
            return ``
        }
    }

//Dialog State Handlers------------------------------------------------------------------------------------------------


    @action
    openCreateNewMasterDialog = () => {
        this.createNewMasterDialogOpen = true
        if (this.selectedUnmatchedXrefBrand.length === 1){
            this.boxEquivList.clear()
            this.searchIdx = 0
        }
    }

    @action
    getboxEquivs = () => {
        this.boxEquivsLoading = true
        if(this.chosenManufacturerID !== ''){
            Api.get(`http://${apiURL}/vwboxequivs?manufacturer_id=eq.${this.chosenManufacturerID}${this.searchString}`)
                .then(resp => {
                    resp.body.map(brand => {
                        this.boxEquivList.push({
                            "id": brand.brand_id,
                            "description": brand.description,
                            "measure": brand.measure,
                            "pack": brand.pack,
                        })
                    })
                    this.boxEquivsLoading = false
                    this.searchIdx +=1

                    this.selectboxequivid()
                })
        }
    }

    @action
    searchBoxEquivs = () => {
        this.boxEquivList.clear()
        this.searchIdx = 0
        this.getboxEquivs()
    }

    @action
    updateBoxEquivSearchObj = (key, value) => {
        if(value === ''){
            this.boxEquivSearchObj.delete(key)
        } else {
            this.boxEquivSearchObj.set(key, value)
        }
    }

    @computed get searchString () {
        let search = ''
        this.boxEquivSearchObj.keys().map(key => {
            switch (key){
                case 'id':
                    search += `&import_item_id=eq.${this.boxEquivSearchObj.get(key)}`
                    break;
                case 'description':
                    search += `&description=ilike.*${this.boxEquivSearchObj.get(key)}*`
                    break
                case 'measure':
                    search += `&measure=ilike.${this.boxEquivSearchObj.get(key)}`
            }
        })
        return search
    }

    selectboxequivid = () => {
        if(this.selectedMasterBrands){
            if(this.selectedMasterBrands.length === 1 && this.createNewMasterRadioGroup !== 'brand') {
                let defequiv = this.boxEquivList.filter(x => {
                    return x.id === this.selectedMasterBrands[0].boxequiv
                })[0]
                if(defequiv){
                    this.selectedBoxEquiv = [defequiv]
                    this.updateNewMasterObj('boxequiv', this.selectedBoxEquiv[0].id)
                }
            } else {
                return ''
            }
        }
    }

    @action
    fillNewMasterObj = () => {
        console.log(this.createNewMasterRadioGroup)
        let xrefid = this.selectedUnmatchedXrefBrand[0].xrefid
        let brand_id
        if(this.selectedMasterBrands.length ===1){
            brand_id = this.selectedMasterBrands[0].brand_id
        }
        if (this.createNewMasterRadioGroup === 'brand'){
            Api.get(`http://${apiURL}/import_item?import_item_id=eq.${xrefid}`)
                .then(resp => {
                    this.updateNewMasterObj('measure', resp.body[0].measure)
                    this.updateNewMasterObj('pack', resp.body[0].pack)
                    this.updateNewMasterObj('type', resp.body[0].packtype)
                    this.updateNewMasterObj('reportedanufacturer', resp.body[0].vendor)
                    this.updateNewMasterObj('description', resp.body[0].description)
                    if(resp.body[0].reported_upc){
                        this.updateNewMasterObj('upc', resp.body[0].reported_upc)
                    }
                })
        } else if (this.createNewMasterRadioGroup === 'style') {
            Api.get(`http://${apiURL}/master_item?master_item_id=eq.${brand_id}`)
                .then(resp => {
                    this.updateNewMasterObj('description', this.selectedUnmatchedXrefBrand[0].description)
                    if(resp.body[0].upc){
                        this.updateNewMasterObj('upc', resp.body[0].upc)
                    }
                    this.updateNewMasterObj('reportedanufacturer', resp.body[0].vendor)
                    this.updateNewMasterObj('manufacturer', resp.body[0].vendor)
                    this.updateNewMasterObj('brandcode', resp.body[0].brandcode)
                    this.updateNewMasterObj('type', resp.body[0].packtype)
                    this.updateNewMasterObj('measure', resp.body[0].measure)
                    this.updateNewMasterObj('pack', resp.body[0].pack.toString())
                })
        } else if (this.createNewMasterRadioGroup === 'boxFromEach') {
            Api.get(`http://${apiURL}/master_item?master_item_id=eq.${brand_id}`)
                .then(resp => {
                    this.updateNewMasterObj('description', resp.body[0].description)
                    if(resp.body[0].upc){
                        this.updateNewMasterObj('upc', resp.body[0].upc)
                    }
                    this.updateNewMasterObj('reportedanufacturer', resp.body[0].vendor)
                    this.updateNewMasterObj('manufacturer', resp.body[0].vendor)
                    this.updateNewMasterObj('brandcode', resp.body[0].brandcode)
                    this.updateNewMasterObj('type', 'BX')
                    this.updateNewMasterObj('measure', resp.body[0].measure)
                    this.updateNewMasterObj('pack', resp.body[0].pack.toString())
                })
        } else if (this.createNewMasterRadioGroup === 'eachFromBox') {
            Api.get(`http://${apiURL}/import_item?master_item_id=eq.${brand_id}`)
                .then(resp => {
                    this.updateNewMasterObj('description', resp.body[0].description)
                    if(resp.body[0].upc){
                        this.updateNewMasterObj('upc', resp.body[0].upc)
                    }
                    this.updateNewMasterObj('reportedanufacturer', resp.body[0].vendor)
                    this.updateNewMasterObj('manufacturer', resp.body[0].vendor)
                    this.updateNewMasterObj('brandcode', resp.body[0].brandcode)
                    this.updateNewMasterObj('type', 'EA')
                    this.updateNewMasterObj('measure', resp.body[0].measure)
                    this.updateNewMasterObj('pack', resp.body[0].pack.toString())
                    this.updateNewMasterObj('boxequiv', resp.body[0].boxequiv.toString())
                })
        } else if (this.createNewMasterRadioGroup === 'caseFromBox') {
            Api.get(`http://${apiURL}/master_item?master_item_id=eq.${brand_id}`)
                .then(resp => {
                    this.updateNewMasterObj('description', resp.body[0].description)
                    if(resp.body[0].upc){
                        this.updateNewMasterObj('upc', resp.body[0].upc)
                    }
                    this.updateNewMasterObj('reportedanufacturer', resp.body[0].vendor)
                    this.updateNewMasterObj('manufacturer', resp.body[0].vendor)
                    this.updateNewMasterObj('brandcode', resp.body[0].brandcode)
                    this.updateNewMasterObj('type', 'CS')
                    this.updateNewMasterObj('measure', resp.body[0].measure)
                    this.updateNewMasterObj('pack', resp.body[0].pack.toString())
                    this.updateNewMasterObj('boxequiv', resp.body[0].boxequiv.toString())
                })
        }
    }

    @action
    selectOne = (brandObj) => {
        this.selectedBoxEquiv = [brandObj]
    }

    @action
    closeCreateNewMasterDialog = () => {
        console.log('new master obj: ', toJS(this.newMasterObj))
        this.boxEquivSearchObj.clear()
        this.clearNewMasterObj()
        this.selectedBoxEquiv = []
        this.createNewMasterDialogOpen = false
    }

    arbitraryLoadFunc() {
        return false
    }
}