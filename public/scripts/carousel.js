async function runCarousel() {
  //Generate slides
  const genSlides = () => {
    mktMsg.forEach((msg) => {
      // split data
      const { id, product_id, picture, story } = msg

      const wordSplit = story.split('\r\n')
      let bodyText = ''

      // generate carousel body text
      wordSplit.forEach((word, index) => {
        if (index + 1 === wordSplit.length) {
          bodyText += `<div class="carousel__text carousel__text--desc">${word}</div>`
        } else {
          bodyText += `<div class="carousel__text carousel__text--main">${word}</div>`
        }
      })

      const html = `
            <a href="/client-app/dist/?id=${product_id}">
                <div class="carousel__item">
                    <img class="carousel__img" src="${picture}"
                        alt="banner">
                    <div class="carousel__frame">
                        <span class="carousel__text-comp">
                            ${bodyText}
                        </span>
                    </div>
                </div> 
            </a>
            `
      _carouselContainer.insertAdjacentHTML('beforeend', html)
    })
  }

  // Generate dots base on data length
  const genDots = () => {
    mktMsg.forEach(() => {
      _dotNav.insertAdjacentHTML('beforeend', '<div class="carousel__dot"></div>')
    })
  }

  // Get currerent index
  const getCurIndex = () => {
    let curIndex = 0

    _slides.forEach((slide, index) => {
      if (slide.classList.contains('carousel__item--active')) {
        curIndex = index
      }
    })

    return curIndex
  }

  // Change image to target index
  const setActiveSliderIndex = (activeIndex) => {
    // Change slider
    document.querySelector('.carousel__item--active').classList.remove('carousel__item--active')
    _slides[activeIndex].classList.add('carousel__item--active')

    // Change nav dot
    document.querySelector('.carousel__dot--active').classList.remove('carousel__dot--active')
    _dots[activeIndex].classList.add('carousel__dot--active')
  }

  // Control next slide logic
  const showNextSlide = () => {
    let curIndex = getCurIndex()
    let nextIndex = curIndex + 1 > mktMsg.length - 1 ? 0 : curIndex + 1
    setActiveSliderIndex(nextIndex)
  }

  const _carouselContainer = document.getElementById('carousel_container')
  const _dotNav = document.getElementById('dot_nav')
  let mktMsg = {}

  // fetch data
  try {
    let res = await fetch('https://api.appworks-school.tw/api/1.0/marketing/campaigns')

    if (res.status === 200) {
      mktMsg = (await res.json())['data']
      genSlides()
      genDots()
    } else {
      throw new Error(`Something went WRONG! ${res.status} ${res.statusText}`)
    }
  } catch (err) {
    alert(err)
  }

  const _slides = document.querySelectorAll('.carousel__item')
  const _dots = document.querySelectorAll('.carousel__dot')

  // Initial first card
  _slides[0].classList.add('carousel__item--active')
  _dots[0].classList.add('carousel__dot--active')

  // Add event listener to dots
  _dots.forEach((item, index) => {
    item.addEventListener('click', () => {
      setActiveSliderIndex(index)
    })
  })

  const _autoChangeSec = 5000

  let timer = setInterval(showNextSlide, _autoChangeSec)

  let resetTimer = () => {
    clearInterval(timer)
    timer = setInterval(showNextSlide, _autoChangeSec)
  }

  _carouselContainer.parentElement.addEventListener('mouseover', () => {
    clearInterval(timer)
  })

  _carouselContainer.parentElement.addEventListener('mouseout', () => {
    resetTimer()
  })
}

export default runCarousel
