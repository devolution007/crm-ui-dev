import { RouteRecordRaw } from 'vue-router'

import MainLayout from 'layouts/MainLayout.vue'
import IndexPage from 'pages/IndexPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: IndexPage,
        alias: [''],
        children: [
          {
            path: 'task/:taskId',
            name: 'task',
            component: IndexPage
          }
        ],
        props (route) {
          return { taskId: Number(route.params.taskId) || 0 }
        }
      },
      {
        path: '/customers',
        name: 'customers',
        component: () => import('pages/customers/CustomersList.vue'),
        alias: ['customers-list']
      },
      {
        name: 'customer-add',
        path: '/customer-new',
        component: () => import('pages/customers/RegisterPage.vue')
      },
      {
        path: '/customers/:customerId',
        component: () => import('pages/customers/CustomerIndex.vue'),
        props (route) {
          return {
            customerId: Number(route.params.customerId),
            justRegistered: (route.query.registered as string === '1')
          }
        },
        children: [
          {
            name: 'customer-details',
            path: '',
            redirect: { name: 'customer-orders' }
          },
          {
            path: 'orders',
            name: 'customer-orders',
            component: () => import('pages/customers/CustomerOrders.vue'),
            props (route) {
              return {
                customerId: Number(route.params.customerId)
              }
            }
          },
          {
            path: 'place-order/:orderId?',
            name: 'place-order',
            component: () => import('pages/customers/PlaceOrder.vue'),
            props (route) {
              return {
                customerId: Number(route.params.customerId),
                orderId: Number(route.params.orderId) || null,
                type: route.query.type as string || null,
                repeat: route.query.repeat === '1' || false
              }
            }
          },
          {
            path: 'checkout/:orderId',
            name: 'checkout',
            component: () => import('pages/customers/Checkout.vue'),
            props (route) {
              return {
                customerId: Number(route.params.customerId),
                orderId: Number(route.params.orderId)
              }
            }
          },
          {
            path: 'order/:orderId',
            name: 'customer-order-details',
            component: () => import('pages/customers/CustomerOrderDetails.vue'),
            props (route) {
              return {
                customerId: Number(route.params.customerId),
                orderId: Number(route.params.orderId),
                showConfirmationDialog: (route.query.new as string === '1') || null
              }
            }
          },
          {
            path: 'notes',
            name: 'customer-notes',
            component: () => import('pages/customers/CustomerNotes.vue'),
            props (route) {
              return {
                customerId: Number(route.params.customerId)
              }
            }
          },
          {
            path: 'issues/new',
            name: 'customer-new-issues',
            component: () => import('pages/customers/issue/Add.vue')
          },
          {
            path: 'issue/:issueId',
            name: 'customer-issue-details',
            component: () => import('pages/customers/issue/Card.vue'),
            props (route) {
              return {
                customerId: Number(route.params.customerId),
                issueId: Number(route.params.issueId)
              }
            }
          },
          {
            path: 'issues',
            name: 'customer-issues',
            component: () => import('pages/customers/issue/Index.vue')
          },
          {
            path: 'history',
            name: 'customer-history',
            component: () => import('pages/customers/CustomerHistory.vue'),
            props (route) {
              return {
                customerId: Number(route.params.customerId)
              }
            }
          }
        ]
      },
      {
        path: 'order/:orderId',
        name: 'order-details',
        component: () => import('pages/OrderDetailsRedirect.vue'),
        props (route) {
          return { orderId: Number(route.params.orderId) }
        }
      },
      {
        path: 'refunds',
        children: [
          {
            name: 'refunds',
            path: '',
            redirect: { name: 'refunds-list' }
          },
          {
            name: 'refunds-list',
            path: '',
            component: () => import('pages/refunds/IndexPage.vue')
          },
          {
            path: ':refundId',
            name: 'refund-details',
            component: () => import('pages/refunds/DetailsPage.vue'),
            props (route) {
              return { refundId: Number(route.params.refundId) }
            }
          }
        ]
      },
      {
        path: 'card-check',
        name: 'card-check',
        component: () => import('pages/CardCheck.vue')
      },
      {
        path: 'catalog-sync',
        name: 'catalog-sync',
        component: () => import('pages/catalog/SyncPage.vue')
      },
      {
        path: 'target-list',
        component: () => import('pages/TargetList.vue')
      },
      {
        path: '/staff',
        children: [
          {
            name: 'staff',
            path: '',
            redirect: '/staff/list'
          },
          {
            name: 'staff-list',
            path: 'list',
            component: () => import('pages/staff/StaffList.vue')
          },
          {
            name: 'staff-edit',
            path: ':staffId/edit',
            component: () => import('pages/staff/Edit.vue'),
            props (route) {
              return { staffId: Number(route.params.staffId), facilityId: route.query.facility ? Number(route.query.facility) : undefined }
            }
          },
          {
            name: 'staff-add',
            path: 'add',
            component: () => import('pages/staff/Add.vue'),
            props (route) {
              return { facilityId: route.query.facility ? Number(route.query.facility) : undefined }
            }
          }
        ]
      },
      {
        path: '/facilities',
        children: [
          {
            name: 'facilities',
            path: '',
            redirect: '/facilities/list'
          },
          {
            name: 'facility-list',
            path: 'list',
            component: () => import('pages/facilities/Index.vue')
          },
          {
            name: 'facility-associations',
            path: 'associations',
            component: () => import('pages/facilities/Associations.vue')
          },
          {
            name: 'facility-add',
            path: 'add',
            component: () => import('pages/facilities/Add.vue')
          },
          {
            name: 'facility-edit',
            path: ':facilityId/edit',
            component: () => import('pages/facilities/Edit.vue'),
            props (route) {
              return { facilityId: Number(route.params.facilityId) }
            }
          },
          {
            path: ':facilityId',
            name: 'facility-view',
            component: () => import('pages/facilities/View.vue'),
            props (route) {
              return { facilityId: Number(route.params.facilityId), enterTab: route.query.tab ? route.query.tab : undefined }
            }
          }
        ]
      },
      {
        path: '/brokers',
        children: [
          {
            name: 'brokers',
            path: '',
            redirect: 'brokers/list'
          },
          {
            name: 'brokers-list',
            path: 'list',
            component: () => import('pages/brokers/Brokers.vue'),
            props (route) {
              return {
                brokerAgency: route.query.brokerAgency ? Number(route.query.brokerAgency) : undefined,
                status: route.query.status ? Number(route.query.status) : undefined
              }
            }
          },
          {
            name: 'broker-agencies',
            path: 'broker-agencies',
            component: () => import('pages/brokers/BrokerAgencies.vue')
          },
          {
            name: 'add-broker-agency',
            path: 'broker-agencies/add',
            component: () => import('pages/brokers/AddBrokerAgency.vue')
          },
          {
            name: 'edit-broker-agency',
            path: 'broker-agencies/:brokerAgency',
            component: () => import('pages/brokers/EditBrokerAgency.vue'),
            props (route) {
              return { brokerAgency: route.params.brokerAgency ? Number(route.params.brokerAgency) : undefined }
            }
          }
        ]
      }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/reports',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'report-calls',
        path: 'calls',
        component: () => import('pages/reports/ReportCallsPage.vue')
      },
      {
        name: 'report-issues',
        path: 'issues',
        component: () => import('pages/reports/ReportIssuesPage.vue')
      },
      {
        name: 'report-orders',
        path: 'orders',
        component: () => import('pages/reports/ReportOrdersPage.vue')
      },
      {
        name: 'report-product-request',
        path: 'product-request',
        component: () => import('pages/reports/ReportProductRequestPage.vue')
      },
      {
        name: 'report-orders-schedule',
        path: 'orders-schedule',
        component: () => import('pages/reports/ReportOrdersSchedulePage.vue')
      },
      {
        name: 'report-facilities',
        path: 'facilities',
        component: () => import('pages/reports/ReportFacilitiesPage.vue')
      },
      {
        name: 'report-contact-request',
        path: 'contact-request',
        component: () => import('pages/reports/ReportContactRequestPage.vue')
      },
      {
        name: 'report-back-in-stock',
        path: 'back-in-stock',
        component: () => import('pages/reports/ReportBackInStockPage.vue')
      }
    ]
  },

  {
    path: '/login',
    component: () => import('layouts/BlankLayout.vue'),
    children: [{
      path: '',
      component: () => import('pages/LoginPage.vue')
    }]
  },

  {
    path: '/ui-kit',
    component: () => import('layouts/BlankLayout.vue'),
    children: [{
      path: '',
      component: () => import('pages/UiKit.vue')
    }]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
