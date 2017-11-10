import TitlePage from './Components/TitlePage.jsx'
import BrandMatchingMain from './Components/BrandMatchingMain.jsx'
import CustomerMatchingMain from './Components/CustomerMatchingMain.jsx'

let routes = [
    {
        path: '/',
        component: TitlePage,
    },
    {
        path: 'brandmatching',
        component: BrandMatchingMain,
    },
    {
      path: 'customermatching',
      component: CustomerMatchingMain
    }
]

export default routes
