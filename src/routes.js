// Components
import Home from './routes/Home.svelte'
import About from './routes/About.svelte'
import Burn from './routes/Burn.svelte'
import NotFound from './routes/NotFound.svelte'

// Export the route definition object
export default {
    '/': Home,
    '/burn/:id': Burn,
    '/about': About,
    '*': NotFound
}
