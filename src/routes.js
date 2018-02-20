// import App from './App'
import Welcome from './pages/Welcome'
import DataSource from './pages/datasources/DataSource'
import CSVSource from './pages/datasources/csv/CSVSource'
import FbSource from './pages/datasources/firebase/FirebaseSource'
import GetMetaData from './pages/datasources/csv/GetMetaData'
import Save2Firebase from './pages/datasources/firebase/Save2Firebase'
import ChooseViz from './pages/viz/ChooseVizType'
import Pareto from './pages/viz/pareto/Pareto'
import Parallel from './pages/viz/parallel/ParallelController'


export default [

  { path:'/', redirect: '/welcome' },
  { path:'/welcome', component:Welcome },
  { path:'/datasource', component:DataSource },
  { path:'/csvsource', component:CSVSource },
  { path:'/fbsource', component:FbSource },
  { path:'/getmetadata', component:GetMetaData },
  { path: '/save2fb', component: Save2Firebase },
  { path:'/chooseviz', component:ChooseViz },
  { path:'/pareto', component:Pareto },
  { path:'/parallel', component:Parallel }

]