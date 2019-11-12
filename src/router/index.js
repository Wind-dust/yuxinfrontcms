import Vue from 'vue';
import Router from 'vue-router';

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

const Home = r => require.ensure([], () => r(require('../components/common/Home')), 'Home')
const index = r => require.ensure([], () => r(require('../components/page/index')), 'index')

const article = r => require.ensure([], () => r(require('../components/page/article')), 'article')

const member = r => require.ensure([], () => r(require('../components/page/jurisdiction/member')), 'member')
const group = r => require.ensure([], () => r(require('../components/page/jurisdiction/group')), 'group')
const permissions = r => require.ensure([], () => r(require('../components/page/jurisdiction/permissions')), 'permissions')
const peoplemanagement = r => require.ensure([], () => r(require('../components/page/jurisdiction/peoplemanagement')), 'peoplemanagement')
const jurisdictionList = r => require.ensure([], () => r(require('../components/page/jurisdiction/jurisdictionList')), 'jurisdictionList')

const recharge = r => require.ensure([], () => r(require('../components/page/money/recharge')), 'recharge')
const becomeBoss = r => require.ensure([], () => r(require('../components/page/money/becomeBoss')), 'becomeBoss')
const upgradeBoss = r => require.ensure([], () => r(require('../components/page/money/upgradeBoss')), 'upgradeBoss')
const cardbag = r => require.ensure([], () => r(require('../components/page/money/cardbag')), 'cardbag')
const withdraw = r => require.ensure([], () => r(require('../components/page/money/withdraw')), 'withdraw')
const bounty = r => require.ensure([], () => r(require('../components/page/money/bounty')), 'bounty')
const addbankcard = r => require.ensure([], () => r(require('../components/page/money/addbankcard')), 'addbankcard')
const bountyList = r => require.ensure([], () => r(require('../components/page/money/bountyList')), 'bountyList')

const demotion = r => require.ensure([], () => r(require('../components/page/member/demotion')), 'demotion')
const memberList = r => require.ensure([], () => r(require('../components/page/member/memberList')), 'memberList')

const memberOrder = r => require.ensure([], () => r(require('../components/page/order/memberOrder')), 'memberOrder')
const orderList = r => require.ensure([], () => r(require('../components/page/order/orderList')), 'orderList')
const orderDetails = r => require.ensure([], () => r(require('../components/page/order/orderDetails')), 'orderDetails')
const orderSearch = r => require.ensure([], () => r(require('../components/page/order/orderSearch')), 'orderSearch')
const orderExport = r => require.ensure([], () => r(require('../components/page/order/orderExport')), 'orderExport')

const goodsList = r => require.ensure([], () => r(require('../components/page/goods/goodsList')), 'goodsList')
const goodDetails = r => require.ensure([], () => r(require('../components/page/goods/goodDetails')), 'goodDetails')
const supplier = r => require.ensure([], () => r(require('../components/page/goods/supplier')), 'supplier')
const courier = r => require.ensure([], () => r(require('../components/page/goods/courier')), 'courier')
const freight = r => require.ensure([], () => r(require('../components/page/goods/freight')), 'freight')
const goodsclassify = r => require.ensure([], () => r(require('../components/page/goods/goodsclassify')), 'goodsclassify')
const specifications = r => require.ensure([], () => r(require('../components/page/goods/specifications')), 'specifications')
const attribute = r => require.ensure([], () => r(require('../components/page/goods/attribute')), 'attribute')
const subject = r => require.ensure([], () => r(require('../components/page/goods/subject')), 'subject')
const audioList = r => require.ensure([], () => r(require('../components/page/goods/audioList')), 'audioList')
const tabble = r => require.ensure([], () => r(require('../components/page/goods/tabble')), 'tabble')

const bossShare = r => require.ensure([], () => r(require('../components/page/activity/bossShare')), 'bossShare')
const offline = r => require.ensure([], () => r(require('../components/page/activity/offline')), 'offline')
const offlineGoods = r => require.ensure([], () => r(require('../components/page/activity/offlineGoods')), 'offlineGoods')
const lucky = r => require.ensure([], () => r(require('../components/page/activity/lucky')), 'lucky')
const coupons = r => require.ensure([], () => r(require('../components/page/activity/coupons')), 'coupons')
const coupons_associated = r => require.ensure([], () => r(require('../components/page/activity/coupons_associated')), 'coupons_associated')
const couponsHd = r => require.ensure([], () => r(require('../components/page/activity/couponsHd')), 'couponsHd')
const couponsHd_associated = r => require.ensure([], () => r(require('../components/page/activity/couponsHd_associated')), 'couponsHd_associated')
const luckyDraw = r => require.ensure([], () => r(require('../components/page/activity/luckyDraw')), 'luckyDraw')
const luckyDrawGoods = r => require.ensure([], () => r(require('../components/page/activity/luckyDrawGoods')), 'luckyDrawGoods')

const homePage = r => require.ensure([], () => r(require('../components/page/advertising/homePage')), 'homePage')

const account = r => require.ensure([], () => r(require('../components/page/supmanagement/account')), 'account')

const login = r => require.ensure([], () => r(require('../components/login/login')), 'login')

const modifyPwd = r => require.ensure([], () => r(require('../components/page/jurisdiction/modifyPwd')), 'modifyPwd')

const application = r => require.ensure([], () => r(require('../components/page/application/appList')), 'appList')

const slider = r => require.ensure([], () => r(require('../components/page/slider/slider')), 'slider')
const download = r => require.ensure([], () => r(require('../components/page/download/download')), 'download')
const message = r => require.ensure([], () => r(require('../components/page/message/message')), 'message')
const product = r => require.ensure([], () => r(require('../components/page/product/product')), 'product')
const solution = r => require.ensure([], () => r(require('../components/page/solution/solution')), 'solution')
const about = r => require.ensure([], () => r(require('../components/page/about/about')), 'about')
Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: '/',
  routes: [{
    path: '/',
    component: Home,
    children: [{
      path: '',
      component: index
    }, {
      path: '/index',
      component: index
    }, {
      path: '/member',
      component: member
    }, {
      path: '/group',
      component: group,
    }, {
      path: '/group/permissions',
      component: permissions
    }, {
      path: '/group/peoplemanagement',
      component: peoplemanagement
    }, {
      path: '/jurisdictionList',
      component: jurisdictionList
    }, {
      path: '/recharge',
      component: recharge
    }, {
      path: '/becomeBoss',
      component: becomeBoss
    }, {
      path: '/upgradeBoss',
      component: upgradeBoss
    }, {
      path: '/cardbag',
      component: cardbag
    }, {
      path: '/withdraw',
      component: withdraw
    }, {
      path: '/bounty',
      component: bounty
    }, {
      path: '/addbankcard',
      component: addbankcard
    }, {
      path: '/bountyList',
      component: bountyList
    }, {
      path: '/demotion',
      component: demotion
    }, {
      path: '/memberList',
      component: memberList
    }, {
      path: '/memberOrder',
      component: memberOrder
    }, {
      path: '/orderList',
      component: orderList
    }, {
      path: '/orderSearch',
      component: orderSearch
    }, {
      path: '/orderExport',
      component: orderExport
    },
      {
        path: '/orderList/orderDetails',
        component: orderDetails
      }, {
        path: '/goodsList',
        component: goodsList,
        meta: {
          keepAlive: true
        }
      }, {
        path: '/goodsList/goodDetails',
        component: goodDetails
      }, {
        path: '/supplier',
        component: supplier
      }, {
        path: '/supplier/courier',
        component: courier
      }, {
        path: '/supplier/freight',
        component: freight
      }, {
        path: '/goodsclassify',
        component: goodsclassify
      }, {
        path: '/specifications',
        component: specifications
      }, {
        path: '/specifications/attribute',
        component: attribute
      }, {
        path: '/subject',
        component: subject
      }, {
        path: '/audioList',
        component: audioList
      }, {
        path: '/tabble',
        component: tabble
      }, {
        path: '/bossShare',
        component: bossShare
      }, {
        path: '/offline',
        component: offline
      }, {
        path: '/offline/offlineGoods',
        component: offlineGoods
      }, {
        path: '/lucky',
        component: lucky
      }, {
        path: '/coupons',
        component: coupons
      }, {
        path: '/coupons/coupons_associated',
        component: coupons_associated
      }, {
        path: '/couponsHd',
        component: couponsHd
      }, {
        path: '/couponsHd/couponsHd_associated',
        component: couponsHd_associated
      }, {
        path: '/luckyDraw',
        component: luckyDraw
      }, {
        path: '/luckyDraw/luckyDrawGoods',
        component: luckyDrawGoods
      }, {
        path: '/homePage',
        component: homePage
      }, {
        path: '/account',
        component: account
      }, {
        path: '/article',
        component: article
      }, {
        path: '/modifyPwd',
        component: modifyPwd
      }, {
        path: '/application',
        component: application
      }, {
        path: '/slider',
        component: slider
      }, {
        path: '/download',
        component: download
      },
      {
        path: '/message',
        component: message
      }, {
        path: '/product',
        component: product
      }, {
        path: '/solution',
        component: solution
      }, {
        path: '/about',
        component: about
      }]
  }, {
    path: '/login',
    component: login
  }]
})
