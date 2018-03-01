import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

let storageItems = { }

const localStorageMock = {
    setItem: (key, item) => {
        storageItems[key] = item
    },
    getItem: (key) => storageItems[key],
    removeItem: (key) => {
        storageItems[key] = undefined
    }
}

window.localStorage = localStorageMock