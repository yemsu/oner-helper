const Items = {
  allItem: null,
  $wrapSearch: document.getElementById('wrapSearch'),
  $input: document.getElementById('inputItemSearch'),
  $resultArea: null,
  $resultWrap: null,
  $wrapItemInfo: null,
  ingredientsD1: [],
  ingredientsD2: [],
  ingredientsByDepth: {},
  addKeyValue: function(objList, key, value) {
    return objList.map(item => {
      item[key] = value
      return item
    })
  },
  getAllItem: async function() {
    const sailors = await fetch('http://1.227.192.121:8000/api/sailorList')
      .then(res => res.json())
      .then(data => data)
    this.addKeyValue(sailors, "type", "sailor")

    const etcItems = await fetch('http://1.227.192.121:8000/api/etcItemList')
      .then(res => res.json())
      .then(data => data)
    this.addKeyValue(etcItems, "type", "etcItem")

    // const nonItems = [{
    //   name: '잼베리'
    // }]
    
    return [...sailors, ...etcItems]
  },
  searchItems: function() {
    this.getAllItem()
    .then(allItem => {
      this.allItem = allItem
      this.drawResult()
    })
  },
  drawResult: function () {
    const searchResults = this.allItem.filter(item => item.name.includes(this.$input.value))
    const $resultWrap = document.getElementById('resultWrap')
    if(!$resultWrap) {
      // 최초
      const $title = newElement('h3', null, '검색 결과')
      this.$resultArea = newElement('div', {id: 'resultArea'})  
      this.$resultArea.appendChild($title)
    } else {
      // 기존 검색 제거
      this.$resultArea.removeChild(document.getElementById('resultWrap'))
    }
    this.setResultWrap(searchResults)
    this.$resultArea.appendChild(this.$resultWrap)
    this.$wrapSearch.appendChild(this.$resultArea)
  },
  setResultWrap: function(itemResults) {
    const resultWrap = newElement('div', {id: 'resultWrap'})

    if(itemResults.length < 1) {
      const $p = newElement('p', null, '해당하는 아이템명이 없습니다.')
      resultWrap.appendChild($p)
    } else {
      for(const item of itemResults) {
        resultWrap.appendChild(this.resultItemHTML(item))
      }
    }

    this.$resultWrap = resultWrap
  },  
  resultItemHTML: function(item) {
    const resultItem = newElement('div', 'item-result')
    item.grade && resultItem.classList.add(item.grade)

    const img = newElement('img')
    const itemType = item.type
    // img.src = `http://1.227.192.121:8000/static/image/${itemType}/${itemType[0]}${item.id}.png`
    img.alt = `${item.name}`

    const p = newElement('p', null, item.name)
    const span = newElement('span', null, '아이템 자세히 보기')
    p.appendChild(span)

    const button = newElement('button', {'data-js': item.id})
    button.addEventListener('click', e => this.showItemDetail(item, resultItem))
    button.appendChild(img)
    button.appendChild(p)
    resultItem.appendChild(button)

    return resultItem
  },
  showItemDetail: function(clickItem, resultItemHTML) {
    console.log('click item', clickItem)
    if(clickItem.ingredients) {
      this.setIngredients(clickItem)
      this.setIngredientsTotal()
    }
    // console.log('ingredientsD1', this.ingredientsD1)
    // console.log('ingredientsD2', this.ingredientsD2 )

    this.setWrapItemInfoHTML(clickItem)
    resultItemHTML.appendChild(this.$wrapItemInfo)
  },
  setIngredients: function(clickItem) {
    // this.ingredientsD1 = this.ingredientsData(clickItem.ingredients)
    // this.ingredientsD2 = this.getIngredientsD2(this.ingredientsD1)
    // this.ingredientsD3 = this.getIngredientsD3(this.ingredientsD2)
    // console.log('this.ingredientsD1',  this.ingredientsD1)
    // console.log('this.ingredientsD2',  this.ingredientsD2)
    // console.log('this.ingredientsD3',  this.ingredientsD3)

    this.addIngredientDepth1(clickItem)

    // this.ingredientsByDepth.depth1 = this.ingredientsData(clickItem.ingredients)
    // console.log('----------2')
    // if(this.hasAnyIngredients(this.ingredientsByDepth.depth1)) {
    //   this.ingredientsByDepth.depth2 = this.addIngredientDepth(1)
    // }
    // console.log('----------3')
    // if(this.ingredientsByDepth.depth2 && this.hasAnyIngredients(this.ingredientsByDepth.depth2)) {
    //   this.ingredientsByDepth.depth3 = this.addIngredientDepth(2)
    // }
    // console.log('----------4')
    // if(this.ingredientsByDepth.depth3 && this.hasAnyIngredients(this.ingredientsByDepth.depth3)) {
    //   this.ingredientsByDepth.depth4 = this.addIngredientDepth(3)
    // }
    // console.log('----------5')
    // if(this.ingredientsByDepth.depth4 && this.hasAnyIngredients(this.ingredientsByDepth.depth4)) {
    //   this.ingredientsByDepth.depth5 = this.addIngredientDepth(4)
    // }
    // console.log('setIngredients > this.ingredientsByDepth',  this.ingredientsByDepth)
  },
  hasAnyIngredients: function(itemsList) {
    // console.log('hasAnyIngredients: itemsList', itemsList)
    const newItemsList = itemsList.map(items => Array.isArray(items) ? items : [items])
    // console.log('hasAnyIngredients: newItemsList', newItemsList)
    for(const items of newItemsList) {
      // console.log('hasAnyIngredients: items', items)
      if(items.filter(item => item?.ingredients).length > 0) {
          // console.log('hasAnyIngredients', true)
          return true
      } else {
        return false
      }
    }    
  },
  addIngredientDepth1: function(clickItem) {
    if(!clickItem.ingredients) return false
    clickItem.ingredients = this.ingredientsData(clickItem.ingredients)
    for(const ingredients2 of clickItem.ingredients) {
      if(ingredients2.ingredients) {
        ingredients2.ingredients = this.ingredientsData(ingredients2.ingredients)
        for(const ingredients3 of ingredients2.ingredients) {
          if(ingredients3.ingredients) {
            ingredients3.ingredients = this.ingredientsData(ingredients3.ingredients)
            for(const ingredients4 of ingredients3.ingredients) {
              if(ingredients4.ingredients) {
                ingredients4.ingredients = this.ingredientsData(ingredients4.ingredients)
              }
            }
          }
        }
      }
    }
    console.log('clickItem', clickItem)
  },
  addIngredientDepth: function(depthNum) {
    // console.log('addIngredientDepth: depthNum-----',depthNum)
    const ingredients = this.ingredientsByDepth[`depth${depthNum}`]
    
    const nextIngredientsTotal = []
    // console.log(',ingredients,',ingredients)
    for(let i = 0; i < ingredients.length; i++) {
      nextIngredientsTotal.push([])
      const ingredients1 = ingredients[i]
      // console.log(',ingredients1,',ingredients1)

      if(Array.isArray(ingredients1)) {
        for(let j = 0; j < ingredients1.length; j++) {
          const ingredients2 = ingredients1[j]

          if(Array.isArray(ingredients2)) {
            for(let j = 0; j < ingredients2.length; j++) {
              const ingredientsStr = ingredients2?.ingredients

            }
          }
          const ingredientsStr = ingredients2?.ingredients
          if(ingredientsStr) {
            const nextIngredients = this.ingredientsData(ingredientsStr)
            nextIngredientsTotal[i].push([])
            // console.log(i, nextIngredientsTotal, nextIngredients)
            for(const nextIngredient of nextIngredients) {
              // console.log('nextIngredients',  nextIngredient)
              nextIngredientsTotal[i][j].push(nextIngredient)
            }
          } else {
            nextIngredientsTotal[i].push(null)
          }

        }
      } else {
        const ingredientsStr = ingredients1?.ingredients
        if(ingredientsStr) {
          const nextIngredients = this.ingredientsData(ingredientsStr)
          // nextIngredientsTotal[i].push([])
          // console.log(i, nextIngredientsTotal, nextIngredients)
          for(const nextIngredient of nextIngredients) {
            // console.log('nextIngredients',  nextIngredient)
            nextIngredientsTotal[i].push(nextIngredient)
          }
        } else {
          nextIngredientsTotal[i].push(null)
        }
      }


    }
    console.log(nextIngredientsTotal)

    // console.log('nextIngredientsTotal', nextIngredientsTotal)

    return nextIngredientsTotal
  },
  ingredientStringToArray: function(ingredientString) {
    const ingredients = ingredientString.split(',').map(ingredient => {
      const splitStr = ingredient.split(':')
      const nameValue = getOnlyText(splitStr[0])
      return {name: nameValue, requiredNumber: splitStr[1]}
    })

    return ingredients
  },
  ingredientsData: function(ingredientStr) {
    const ingredients = this.ingredientStringToArray(ingredientStr)
    const ingredientsData = ingredients.reduce((acc, ingredient) => {
      // console.log('ingredient.name', ingredient.name)
      const fullData = this.allItem.find(item => getOnlyText(item.name) === ingredient.name)
      const dataClone = JSON.parse(JSON.stringify(fullData))
      dataClone.requiredNumber = ingredient.requiredNumber
      acc.push(dataClone)
      return acc
    }, [])
    return ingredientsData 
  },
  getIngredientsD2: function(param) {
    const ingredientsD2 = []
    const ingredientsD1 = param.filter(ingredientD1 => ingredientD1.ingredients)

    for(let i = 0; i < ingredientsD1.length; i++) {
      const ingredientD1 = ingredientsD1[i]
      const filterData = ingredientD1
        ? this.ingredientsData(ingredientD1.ingredients)
        : [null]
      if(!ingredientsD2[i]) ingredientsD2[i] = []
      ingredientsD2[i].push(...filterData)
    }
    return ingredientsD2
  },
  getIngredientsD3: function(param) {
    const ingredientsD3 = []
    const ingredientsD2 = []
    const ingredientsD1 = []
    for(let i = 0; i < param.length; i++) {
      const item = param[i]
      for(const itemItem of item) {
        if(!ingredientsD1[i]) ingredientsD1[i] = []
        if(itemItem.ingredients) ingredientsD1[i].push(itemItem)
      }
    }
    // console.log('123ingredientsD1', ingredientsD1)

    for(let i = 0; i < ingredientsD1.length; i++) {
      const ingredientD1 = ingredientsD1[i]
      for(const igr of ingredientD1) {
        const filterData = igr
          ? this.ingredientsData(igr.ingredients)
          : [null]
        if(!ingredientsD2[i]) ingredientsD2[i] = []
        ingredientsD2[i].push(...filterData)
      }
    }
    // console.log('123ingredientsD2', ingredientsD2)
    return ingredientsD2
  },
  setIngredientsTotal: function() {
    const noIngredientsD1 = this.ingredientsD1.filter(ingredientD1 => !ingredientD1.ingredients && ingredientD1)
    const total = [...noIngredientsD1, ...this.ingredientsD2]
    const totalMerged = []

    for(const item of total) {
      const done = totalMerged.map(accItem => accItem.id).includes(item.id)
      if(!done) {
        totalMerged.push(item)
      } else {
        const itemToMerge = totalMerged.find(accItem => accItem.id === item.id)
        const itemToMergeClone = JSON.parse(JSON.stringify(itemToMerge))
        itemToMergeClone.requiredNumber += item.requiredNumber
      }
    }

    console.log('totalMerged',totalMerged)
    console.log('total',total)
    // console.log('mergeCount',mergeCount)

  },
  setWrapItemInfoHTML: function(item) {
    if(this.$wrapItemInfo) this.$wrapItemInfo.innerHTML = ''
    let wrapItemInfo = null

    if(item.ingredients) {
      wrapItemInfo = this.ingredientsInfoHTML()
    } else if (item.dropMonster) {
      const p = newElement('p', null, `${item.dropMonster} 드롭`)
      wrapItemInfo = p
    } else {
      const p = newElement('p', null, '어디서 드롭되는걸까요?')
      wrapItemInfo = p
    }
    
    this.$wrapItemInfo = wrapItemInfo
  },
  ingredientsInfoHTML: function() {
    const ingredientsInfoHTML = newElement('div', 'area-item-tree')

    // for(const depth of Object.keys(this.ingredientsByDepth)) {
    //   const depthNum = depth.split('depth')[1]
    //   const ingredientsList = this.ingredientsByDepth[depth]
    //   const wrapItemInfoHTML = newElement('div', `wrap-depth depth-${depthNum}`)

    //   // console.log('ingredientsInfoHTML: ingredientsList---', ingredientsList)
    //   for(let i = 0; i < ingredientsList.length; i++) {
    //       const ingredients = ingredientsList[i]
    //       const wrapIndexHTML = newElement('div', `wrap-index index-${i}`)
    //     for(const ingredient of ingredients) {
    //       if(!ingredient) continue
    //       const itemInfo = this.itemBoxHTML(ingredient)
    //       wrapIndexHTML.appendChild(itemInfo)
    //     }
    //     wrapItemInfoHTML.appendChild(wrapIndexHTML)
    //   }

    //   ingredientsInfoHTML.appendChild(wrapItemInfoHTML)
    // }
      const ingredientsList = this.ingredientsByDepth.depth1

      // console.log('ingredientsInfoHTML: ingredientsList---', ingredientsList)
      for(let i = 0; i < ingredientsList.length; i++) {
          const wrapIndexHTML = newElement('div', `wrap-index index-${i}`)
        for(const depth of Object.keys(this.ingredientsByDepth)) {
          const depthNum = depth.split('depth')[1]
          const ingredients = this.ingredientsByDepth[depth][i]
          const wrapItemInfoHTML = newElement('div', `wrap-depth depth-${depthNum}`)
          for(const ingredient of ingredients) {
            if(!ingredient) {
              const div = newElement('div', 'box-item')
              wrapItemInfoHTML.appendChild(div)
              continue
            }
            const itemInfo = this.itemBoxHTML(ingredient)
            wrapItemInfoHTML.appendChild(itemInfo)
          }          
          wrapIndexHTML.appendChild(wrapItemInfoHTML)
        }
        ingredientsInfoHTML.appendChild(wrapIndexHTML)
      }

    return ingredientsInfoHTML
  },
  itemBoxHTML: function(item, className) {
    const itemBoxHTML = newElement('div', `box-item ${className || ''}`)

    const itemType = item.type
    if(itemType) {
      const img = newElement('img')
      // img.src = `http://1.227.192.121:8000/static/image/${itemType}/${itemType[0]}${item.id}.png`
      img.alt = ``
      itemBoxHTML.appendChild(img)
    }
      
    const nameHTML = newElement('p', 'item-name', item.name)
    const requiredNumHTML = newElement('p', 'requiredNumber', `${item.requiredNumber}개`)

    itemBoxHTML.appendChild(nameHTML)
    itemBoxHTML.appendChild(requiredNumHTML)

    return itemBoxHTML
  },
  myItems: function(bagItems) {
    // const bagItems = [
    //   {"id": "S0", "requiredNumber": 2},
    //   {"id": "S4", "requiredNumber": 1},
    //   {"id": "S10", "requiredNumber": 4},
    //   {"id": "E8", "requiredNumber": 13},
    //   {"id": "E5", "requiredNumber": 12},
    //   {"id": "E1", "requiredNumber": 9}
    // ]
    const myItems = []
    for(const bagItem of bagItems) {
      const findData = this.allItem.find(item => item.id === bagItem.id)
      findData.myCount = bagItem.requiredNumber
      myItems.push(findData)
    }
    return myItems
  },
  keyNameKor: function(key) {
    switch (key) {
      case 'name': 
        return '아이템명'
      case 'ingredients': 
        return '합성 재료'
      case 'drop': 
        return '드랍'
      default: 
        return '명칭 지정 필요'
    }
  },
}
function newElement(tagName, attribute, innerText) {
  const element = document.createElement(tagName)
  if(attribute) {
    const key = typeof(attribute) === 'string'
      ? 'class' : Object.keys(attribute)[0]

    const value = typeof(attribute) === 'string' 
      ? attribute : Object.values(attribute)

    element.setAttribute(key, value)
  }

  if(innerText) {
    element.innerText = innerText
  }
  return element
}

function getOnlyText(str) {
  const regOnlyText = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim;
  return str.replace(regOnlyText, '')
}
export default Items