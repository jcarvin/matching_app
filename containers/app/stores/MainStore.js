import {observable, computed, reaction, action, observe, when, spy } from 'mobx'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import {
    Router, browserHistory // Route, IndexRoute,
} from 'react-router'

// Custom stores
import UiState from './UIState.js'
import UnmatchedXrefsBrandStore from './ItemMatching/UnmatchedXrefsItemStore.js'
import MatchedXrefsBrandStore from './ItemMatching/MatchedXrefsItemStore.js'
import MasterBrandStore from './ItemMatching/MasterItemStore.js'
import BrandUtilityStore from './ItemMatching/ItemUtilityStore.js'
import CustomerUtilityStore from './CustomerMatching/CustomerUtilityStore.js'
import DistributorStore from './DistributorStore.js'
import UnmatchedXrefsCustomerStore from './CustomerMatching/UnmatchedXrefsCustomerStore.js'
import MatchedXrefsCustomerStore from './CustomerMatching/MatchedXrefsCustomerStore.js'
import MasterCustomerStore from './CustomerMatching/MasterCustomerStore.js'
import ItemCreationStore from './ItemMatching/ItemCreationStore.js'
import NacsStore from './ItemMatching/NacsStore.js'


export default class MainStore {
    @observable routing
    @observable uistate
    @observable UnmatchedXrefsBrandStore
    @observable MatchedXrefsBrandStore
    @observable MasterBrandStore
    @observable BrandUtilityStore
    @observable DistributorStore
    @observable UnmatchedXrefsCustomerStore
    @observable MatchedXrefsCustomerStore
    @observable MasterCustomerStore
    @observable CustomerUtilityStore
    @observable ItemCreationStore
    @observable NacsStore

    constructor() {
        this.init()
    }

    @action init() {
        this.uistate = new UiState()
        this.NacsStore = new NacsStore()
        this.routing = new RouterStore()
        this.BrandUtilityStore = new BrandUtilityStore(this)
        this.ItemCreationStore = new ItemCreationStore(this)
        this.CustomerUtilityStore = new CustomerUtilityStore(this)
        this.UnmatchedXrefsBrandStore = new UnmatchedXrefsBrandStore(this.BrandUtilityStore)
        this.MasterBrandStore = new MasterBrandStore(this.BrandUtilityStore)
        this.MatchedXrefsBrandStore = new MatchedXrefsBrandStore(this.BrandUtilityStore)
        this.DistributorStore = new DistributorStore(this.BrandUtilityStore)
        this.UnmatchedXrefsCustomerStore = new UnmatchedXrefsCustomerStore(this.CustomerUtilityStore)
        this.MatchedXrefsCustomerStore = new MatchedXrefsCustomerStore(this.CustomerUtilityStore)
        this.MasterCustomerStore = new MasterCustomerStore(this.CustomerUtilityStore)
        this.history = syncHistoryWithStore(browserHistory, this.routing)
    }
}