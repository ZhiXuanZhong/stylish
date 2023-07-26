import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    /* RESET */

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style-type: none;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    /* GENERAL STYLE */

    body {
        font-family: 'Noto Sans TC', sans-serif;
    }
`

export default GlobalStyle
