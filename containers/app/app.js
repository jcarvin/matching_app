import React from 'react'
// import { render } from 'react-dom'
// import {
//     Router,
//     browserHistory
// } from 'react-router'
// import routes from './app-routes.js'
// import { Provider } from 'mobx-react'

import 'react-virtualized/styles.css'
import './css/style.css'
import './css/common.css'
import './css/cssplot.full.css'
// import MainStore from './stores/MainStore.js'

// custom imports -------
import im from './Components/BrandMatchingMain.jsx'
// ----------------------
import cm from './Components/CustomerMatchingMain.jsx'
// const stores = new MainStore()
// console.log('brand component', im)

export const BrandMatchingMain = im
export const CustomerMatchingMain = cm
// export CustomerMatchingMain
// render((
//     <Provider {...stores}>
//         <Router
//             routes={routes}
//             history={stores.history}
//         />
//     </Provider>
//
// ), document.getElementById('app'))
