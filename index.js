import './src/style/index.scss'
import Items from './src/CheckIngredients'

const buttonSearchItem = document.getElementById('btnItemSearch')
buttonSearchItem.addEventListener('click', () => {
  Items.searchItems()
})