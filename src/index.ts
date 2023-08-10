import { router } from './submodules/router'

async function loadEngine() {
  if (typeof window !== 'undefined') {
    const module = await import('./submodules/engine/ezkl')
    const { default: init, poseidonHash, genPk, genVk, verify, prove } = module
    const engine = {
      init,
      poseidonHash,
      genPk,
      genVk,
      verify,
      prove,
    }
    return engine
  } else {
    console.log('Node.js')
    return null
  }
}
// export { router, loadEngine }
// export default { router, loadEngine }

export { router }
export default { router }
