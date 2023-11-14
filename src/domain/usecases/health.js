const { usecase, step, Ok } = require('@herbsjs/herbs')
const healthUseCase = () => () => usecase('Health', {
    request: {},
    response: Boolean,
    authorize: async () => Ok(),
    'verify api health': step(async (ctx) => {
        ctx.ret = true
        return Ok()
    })
})

module.exports = { healthUseCase }