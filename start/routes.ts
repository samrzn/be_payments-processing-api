import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { Roles } from '#models/user'

// User routes
router.post('/api/login', [controllers.Auth, 'login'])
router.post('/api/signup', [controllers.Auth, 'signup'])

router
  .group(() => {
    router
      // Gateways routes
      .group(() => {
        router.get('/gateways', [controllers.Gateways, 'index'])
        router.patch('/gateways/:id/toggle', [controllers.Gateways, 'toggle'])
        router.patch('/gateways/priority', [controllers.Gateways, 'updatePriority'])
      })
      .use(middleware.role([Roles.ADMIN]))

    // Products routes
    router.get('/products', [controllers.Products, 'index'])
    router
      .post('/products', [controllers.Products, 'store'])
      .use(middleware.role([Roles.ADMIN, Roles.MANAGER]))
  })
  .prefix('/api')
  .use(middleware.auth())
