import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { Roles } from '#models/user'

router.post('/api/login', [controllers.Auth, 'login'])

router
  .group(() => {
    router
      .group(() => {
        //        router.get('/gateways', '#controllers/gateways_controller.index')
        //        router.patch('/gateways/:id/toggle', '#controllers/gateways_controller.toggle')
        //        router.patch('/gateways/priority', '#controllers/gateways_controller.updatePriority')
      })
      .use(middleware.role([Roles.ADMIN]))
  })
  .prefix('/api')
  .use(middleware.auth())
