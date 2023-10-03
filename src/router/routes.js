const routes = [
  {
    path: '',
    component: () => import('layouts/MainLayout'),
    redirect: '/projects',
    meta: {
      auth: true
    },

    children: [
      { path: '/projects', component: () => import('src/link-routes/projects'), children: [
          { path: '/projects-overview/:id', name: 'projectsOverview',
            component: () => import('src/link-routes/projectsOverview')
          }
        ]},
      { path: '/employees', component: () => import('src/link-routes/working-employess-link'),
        children: [
          { path: 'employee-overview/:id', name: 'employeeOverview',
            component: () => import('src/link-routes/overViewEmployee')},
        ]},
      { name: 'approvals', path: '/approvals', component: () => import('src/link-routes/approval-table')},

    ]
  },
      { path: '/login', component: () => import('src/veiw/login/Login')},


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
