import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import GlobalStyle from './globalStyles'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
  {/* <React.StrictMode> */}
    <GlobalStyle />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  {/* </React.StrictMode> */}
  </>,
)
