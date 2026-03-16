import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { Roles } from '#models/user'

// Public routes
router.post('/api/login', [controllers.Auth, 'login'])
router.post('/api/signup', [controllers.Auth, 'signup'])

router
  .group(() => {
    // Users routes
    router
      .group(() => {
        router.get('/users', [controllers.Users, 'index'])
        router.patch('/users/:id', [controllers.Users, 'update'])
        router.delete('/users/:id', [controllers.Users, 'destroy'])
      })
      .use(middleware.role([Roles.ADMIN, Roles.MANAGER]))

    // Gateways routes
    router
      .group(() => {
        router.get('/gateways', [controllers.Gateways, 'index'])
        router.patch('/gateways/:id/toggle', [controllers.Gateways, 'toggle'])
        router.patch('/gateways/priority', [controllers.Gateways, 'updatePriority'])
      })
      .use(middleware.role([Roles.ADMIN]))

    // Products routes
    router.get('/products', [controllers.Products, 'index'])
    router
      .group(() => {
        router.post('/products', [controllers.Products, 'store'])
        router.patch('/products/:id', [controllers.Products, 'update'])
        router.delete('/products/:id', [controllers.Products, 'destroy'])
      })
      .use(middleware.role([Roles.ADMIN, Roles.MANAGER, Roles.FINANCE]))
  })
  .prefix('/api')
  .use(middleware.auth())
