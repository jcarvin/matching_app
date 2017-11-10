import {
    observable,
    computed,
    reaction,
    action,
    observe,
    when,
    spy,
    extendObservable,
    toJS
} from 'mobx'
import { clientConfig } from '../../ClientConfig.js'
const apiURL = clientConfig.apiURL
const Api = require('superagent-bluebird-promise')



export default class NacsStore {

    //observables:
    @observable categoryList = [] // {id: 123, code: "N01-00-00", category: 'Fuel Products', subCategory: 'Unleaded - Regular'}
    @observable strListObj = []

    constructor(initialState) {
        extendObservable(this)
        this.getCategories()
    }

    @action
    getCategories = () => {
        Api.get(`http://${apiURL}/item_categories`)
            .set('Prefer', 'count=exact')
            .then(resp => {
                resp.body.map(x => {
                    this.categoryList.push({
                        id: x.ID,
                        code: x.ProductCategoryCode,
                        category: x.Category,
                        subCategory: x['Sub-Category']
                    })
                })
                this.setStrListObj()
            })
    }

    @action
    setStrListObj = () => {
        this.categoryList.map(cat => {
            this.strListObj.push({
                string: `${cat.code} - ${cat.category} - ${cat.subCategory}`,
                code: cat.code
        })
        })
    }

    @computed get strList () {
        return this.strListObj.map(x => {
            return x.string
        })
    }

}