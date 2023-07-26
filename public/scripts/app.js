import runCarousel from "./carousel.js"

const hostName = 'api.appworks-school.tw'
const apiVer = '1.0'
const host = `https://${hostName}/api/${apiVer}/`

const navCate = document.getElementById('nav-cate')
const searchForm = document.getElementById('search-form')
const searchIcon = document.getElementById('search-icon')
const searchInput = document.getElementById('search-input')
const productGrid = document.getElementById('product-grid')


// Parse url params
function getParams() {
  const queryString = window.location.search
  const searchParams = new URLSearchParams(queryString)
  for (const [key, value] of searchParams.entries()) {
    viewState = {...viewState, [key]:value}
  }
}

// Set url params
function setParams(param, value){
  viewState={}
  const url = window.location
  const searchParams = new URLSearchParams({[param]: value})
  const newUrl = new URL(`${url.origin}${url.pathname}?${searchParams}`)
  history.pushState({}, '', newUrl)
}

// Set category style
function updateCateStyle() {
  const allCate = document.querySelectorAll('.nav__item')
  allCate.forEach((item) => item.classList.remove('nav__item--active'))

  // update category style
  if (viewState.category) {
    document.getElementById(`cate-${viewState.category}`).classList.add('nav__item--active')
  }

  // update input value
  if(viewState.q){
    searchInput.value = viewState.q
  }
}

// Fetch data from different API base on user activities
async function dataFetcher(endpoint) {
  productGrid.parentElement.insertAdjacentHTML('beforeend', '<img id="load-gif" src="images/loading.gif" style="margin: 0 auto;display: block; padding-bottom: 20px;" >')
  try {
    let res = await fetch(endpoint)

    if (res.status === 200) {
      lastFetch = await res.json()
      document.getElementById('load-gif').remove()
      return lastFetch
    } else {
      throw new Error(`Something went WRONG! ${res.status} ${res.statusText}`)
    }
  } catch (err) {
    // productGrid.insertAdjacentHTML('beforeend', `<h1>${err}</h1>`)
    alert(err)
  }
}

// Generate product cards base on returned data
function genListing(listingData) {
  const { data } = listingData

  data.forEach((item) => {
    const { main_image, colors, title, price ,id } = item

    let colorsHTML = ''
    colors.forEach((colors) => (colorsHTML += `<span class="item__color" style="background-color:#${colors.code};"></span>`))

    const html = `
    <a href="/client-app/dist/?id=${id}">
    <div class="procuct__item">
        <img class="item__image" src="${main_image}"
            alt="${title}">
        <div class="item__selection">
            ${colorsHTML}
        </div>
        <div class="item__name">${title}</div>
        <div class="item__price">TWD.${price}</div>
    </div>
    </a>
    `
    productGrid.insertAdjacentHTML('beforeend', html)
  })

  isActive = false
}

// Render data base on parameter
function renderData(){

  if (Object.hasOwn(viewState, 'q')) {
    //Update data to reflex on UI style
    updateCateStyle()

    dataFetcher(genEndpoint('q', viewState.q, lastFetch.next_paging))
    .then((newListing) => { 
      if (newListing.data.length === 0) {
        productGrid.innerText = `沒有與 ‘${searchInput.value}’ 相符的商品`
      } else {
        genListing(newListing)
      }
     })
     return

  }
  
  if (Object.hasOwn(viewState, 'category')){
    //Update data to reflex on UI style
    dataFetcher(genEndpoint('category', viewState.category, lastFetch.next_paging))
    .then((newListing) => { genListing(newListing) })
    updateCateStyle()
    delete viewState.q
    return
  }

  dataFetcher(genEndpoint('category', viewState.category, lastFetch.next_paging))
  .then((newListing) => { genListing(newListing) })
  updateCateStyle()

}

// Generate API endpoint base on parameter
function genEndpoint(param, value, page=0) {
  if (param === 'q') {
    return `${host}products/search?keyword=${value}&paging=${page}`
  }

  if (param === 'category') {
    switch (value) {
      case 'women':
        return `${host}products/women?paging=${page}`
      case 'men':
        return `${host}/products/men?paging=${page}`
      case 'accessories':
        return `${host}/products/accessories?paging=${page}`
      default:
        return `${host}/products/all?paging=${page}`
    }
  }
}

//---------- Initial  ----------

// 1-1. User's initial view state
let viewState = {}
let isActive = false

// 1-2. Store last fetch to keep page data
let lastFetch = {}

// 2. initial process
runCarousel()
getParams()
updateCateStyle()

// 3. Pick api then fetch
renderData()
//---------- Initial  ----------


// Change category
navCate.addEventListener('click', (e) => {

  const targetCate = e.target.getAttribute('cate')

  if (viewState.category !== targetCate) {
    
    // Update state
    viewState.category = targetCate
    // Cleanup search input
    searchInput.value = ''

    // Make browser history
    setParams('category', viewState.category)
    // Update catetogory state
    viewState = {}
    getParams()
    // Change currerent UI style
    updateCateStyle()

    // Cleanup
    productGrid.innerHTML = ''

    // gen
    renderData()
  }
})
  
  
// Performe search
searchForm.addEventListener('submit', (e) => {
  e.preventDefault()
  
  // reset lastFetch
  lastFetch = {}
  // Make browser history
  setParams('q', e.target.q.value)
  // set viewState
  getParams()
  // Update catetogory to change currerentUI style
  updateCateStyle()

  //Cleanup
  productGrid.innerHTML = ''

  // gen
  renderData()
})

searchForm.addEventListener('click', (e) => {
  const inputStatus = window.getComputedStyle(searchInput).getPropertyValue('display')
  if (e.target.id === 'search-icon' && inputStatus !== 'none') {

  // reset lastFetch
  lastFetch = {}
  // Make browser history
  setParams('q', searchInput.value)
  // set viewState
  getParams()
  // Update catetogory to change currerentUI style
  updateCateStyle()

  //Cleanup
  productGrid.innerHTML = ''

  // gen
  renderData()
    
  }
})

// Re-fetch data when useing page nav
window.addEventListener('popstate', function (e) {
  // reset lastFetch
  lastFetch = {}
  viewState={}
  getParams()
  updateCateStyle()
  productGrid.innerHTML = ''
  renderData()
})



// Infinite Scroll
window.addEventListener('scroll',() => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement

  if (scrollTop + clientHeight >= scrollHeight - 100 && !isActive) {
    if(lastFetch.next_paging){
      isActive = true
      renderData()
    }
  }
},
{
  passive: true,
})