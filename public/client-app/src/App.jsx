// import './App.css'
// import './styles_test.css'
import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { narrowScreen } from './media'

import Header from './components/Header'
import Footer from './components/Footer'
import ProductDetail from './components/ProductDetail'
import Cart from './components/cart'
import { Profile } from './components/Profile'
import { Order } from './components/order'

// FIXME: for dev ease of testing
const VersionText = styled.div`
  position: fixed;
  font-size: 9px;
  color: red;
  z-index: 1000;
  width: 100vw;
  text-align: center;
`

function App() {
  // FIXME: for dev ease of testing
  // const buildTime = new Date().toString()
  const buildTime = 'Fri May 19 2023 14:51:09 GMT+0800 (Taipei Standard Time)'

  const [resData, setresData] = useState(null)
  const [cartQty, setCartQty] = useState(0)
  const [fbResponse, setFbResponse] = useState({})
  const [memberInfo, setMemberInfo] = useState({})
  const [signinToken, setSignToken] = useState('')

  function updateCart(sum) {
    setCartQty(sum)
  }

  function updateFbResponse(res) {
    setFbResponse(res)
  }

  function updateMenberInfo(info) {
    setMemberInfo(info)
  }

  function updateSigninToken(token){
    setSignToken(token)
  }

  function fbTokenSignin(token) {
    const headersList = {
      "Content-Type": "application/json"
     }
     
     const bodyContent = JSON.stringify({
       "provider":"facebook",
       "access_token": `${token}`
     }
     );
     
     fetch("https://api.appworks-school.tw/api/1.0/user/signin", { 
       method: "POST",
       body: bodyContent,
       headers: headersList
     }).then((data) => data.json())
     .then((res) => {
       setMemberInfo(res.data.user)
       updateSigninToken(res.data.access_token)
     })
  }

  useEffect(() => {
    // Product details section
    let params = {}
    const queryString = window.location.search
    const searchParams = new URLSearchParams(queryString)
    for (const [key, value] of searchParams.entries()) {
      params = { ...params, [key]: value }
    }
    if (params.id) {
      fetch(`https://api.appworks-school.tw/api/1.0/products/details?id=${params.id}`)
        .then((res) => res.json())
        .then((data) => setresData(data))
    }

    // update cart num section
    let cart

    if (localStorage && localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'))
      handleUpdateCart()
    } else {
      cart = {}
    }
  
    function handleUpdateCart() {
      let totalQty = 0
      for (const productId in cart) {
        const cartItems = cart[productId].cartItems
        for (const cartItemId in cartItems) {
          totalQty += parseInt(cartItems[cartItemId].qty)
        }
      }
  
      updateCart(totalQty)
    }

    // Facebook login section
    window.fbAsyncInit = function () {
      // Init Facebook SDK
      window.FB.init({
        appId: '640240184616356',
        cookie: true,
        xfbml: true,
        version: 'v16.0',
      })

      // Get user login status
      window.FB.getLoginStatus((response) => {
        setFbResponse(response)
        fbTokenSignin(response.authResponse.accessToken)

      })

      window.FB.AppEvents.logPageView()
    }

    // Load Facebook SDK
    ;((d, s, id) => {
      const js = d.createElement(s)
      const fjs = d.getElementsByTagName(s)[0]
      
      if (d.getElementById(id)) {
        return
      }
      
      js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
  return (
    <>
      <ThemeProvider theme={theme}>
        <VersionText>Build on {buildTime}</VersionText>
        <div
          onClick={() => {
            localStorage.clear()
            location.reload()
          }}
          style={{ backgroundColor: 'rgba(219, 110, 51, 0.79)', color: 'white', padding: '5px 10px', verticalAlign: 'middle', position: 'fixed', top: '20%', cursor: 'pointer' }}
        >
          Clear localStorage
        </div>
        {/* FIXME above */}

        <Header cartQty={cartQty}></Header>
        <Routes>
          <Route path="product" element={resData !== null && <ProductDetail productData={resData} updateCart={updateCart}></ProductDetail>} />
          <Route path="checkout" element={<Cart updateCart={updateCart} signinToken={signinToken}/>} />
          <Route path="profile" element={<Profile updateMenberInfo={updateMenberInfo} memberInfo={memberInfo} updateFbResponse={updateFbResponse} fbResponse={fbResponse} fbTokenSignin={fbTokenSignin} updateSigninToken={updateSigninToken} />} />
          <Route path="order" element={<Order />} />
        </Routes>
        {/* {resData && <ProductDetail productData={resData} updateCart={updateCart}></ProductDetail>} */}
        <Footer></Footer>
      </ThemeProvider>
    </>
  )
}

const theme = {
  media: {
    narrowScreen,
  },
}

export default App
