//路由配置

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

//layout template
import Index from '@/main/index'
import Layout from '@/main/layout'

//modules
import Test from '@/modules/test'
import Abc from '@/modules/abc'
import Table from '@/modules/table'
import Relation from '@/modules/relation'

export default new Router({
  routes: [{
      path: '/',
      name: 'Index',
      component: Index,
      children: [{
        path: '/abc',
        name: 'Abc',
        component: Abc,
      }, {
        path: '/table',
        name: 'Table',
        component: Table,
      }, {
        path: '/relation',
        name: 'Relation',
        component: Relation,
      }]
    },
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      children: [{
        path: '/test',
        name: 'Test',
        component: Test,
      } ]
    }
  ]
})
