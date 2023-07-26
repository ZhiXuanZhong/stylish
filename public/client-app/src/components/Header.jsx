import styled, { ThemeContext } from 'styled-components'
import logo from '../assets/images/logo.png'
import searchIcon from '../assets/images/search.png'
import cart from '../assets/images/cart.png'
import cartHover from '../assets/images/cart-hover.png'
import cartMobile from '../assets/images/cart-mobile.png'
import memberIcon from '../assets/images/member.png'
import memberIconHover from '../assets/images/member-hover.png'
import memberMobileIcon from '../assets/images/member-mobile.png'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import PropTypes from 'prop-types'

export default function Header(props) {
  const theme = useContext(ThemeContext)
  const { cartQty } = props

  Header.propTypes = {
    cartQty: PropTypes.any,
  }

  const Nav = styled.nav`
    box-sizing: unset;
    display: flex;
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: white;
    justify-content: space-between;
    min-height: 100px;
    border-bottom: 40px solid #313538;

    @media ${theme.media.narrowScreen} {
      justify-content: center;
      border-bottom: none;
    }
  `

  const NavLeft = styled.div`
    display: flex;
    align-items: end;
    margin-bottom: 25px;

    @media ${theme.media.narrowScreen} {
      margin-bottom: unset;
      flex-direction: column;
      align-items: center;
      width: 100vw;
    }
  `

  const NavLogo = styled.img`
    margin-left: 60px;
    margin-right: 58px;
    width: 258px;
    height: 48px;
    vertical-align: bottom;

    @media ${theme.media.narrowScreen} {
      width: 129px;
      height: 24px;
    }
  `

  const NavLogoWrap = styled.div`
    @media ${theme.media.narrowScreen} {
      display: flex;
      height: 52px;
      justify-content: center;
      align-items: center;
    }
  `

  const NavCate = styled.div`
    display: flex;
    padding-bottom: 6px;

    @media ${theme.media.narrowScreen} {
      justify-content: center;
      width: 100%;
      height: 50px;
      color: #828282;
      background-color: #313538;
    }
  `

  const NavItem = styled.div`
    width: 150px;
    height: 20px;
    text-align: center;
    font-size: 20px;
    word-spacing: 26px;
    line-height: 20px;
    cursor: pointer;

    &:not(:first-child) {
      border-left: 1px solid #3f3a3a;
    }

    @media ${theme.media.narrowScreen} {
      width: 160px;
      height: 16px;
      font-size: 16px;
      font-weight: 300;
      word-spacing: -4px;
      margin-top: 16px;

      &:not(:first-child) {
        border-left: 1px solid #808080;
      }
    }
  `

  const NavRight = styled.div`
    position: relative;
    display: flex;
    align-items: center;
  `

  const NavSearchComp = styled.div`
    position: relative;
    right: 138px;
    @media ${theme.media.narrowScreen} {
      position: fixed;
      top: 0;
      left: 0;
      right: unset;
      padding: 6px 10px;
      width: 100%;
    }
  `

  const NavSearchIcon = styled.img`
    position: absolute;
    right: 10px;

    @media ${theme.media.narrowScreen} {
      width: 40px;
      right: 16px;
      z-index: 100;
    }
  `
  const NavSearch = styled.input`
    color: #8b572a;
    font-size: 20px;
    border: 1px solid #979797;
    border-radius: 21px;
    padding: 22px 55px 22px 20px;
    width: 216px;
    height: 15px;

    &:hover {
      color: red;
    }

    @media ${theme.media.narrowScreen} {
      display: none;
      padding: 20px;
      width: 100%;
    }
  `
  const NavMobilePanel = styled.div`
    display: flex;
    @media ${theme.media.narrowScreen} {
      position: fixed;
      bottom: 0;
      left: 0;
      height: 60px;
      width: 100vw;
      display: flex;
      justify-content: center;
      background-color: #313538;
    }
  `
  const NavCart = styled.div`
    position: relative;
    padding-top: 2px;
    right: 96px;
    @media ${theme.media.narrowScreen} {
      padding-top: unset;
      right: unset;
      width: 240px;
      display: flex;
      align-items: center;
      justify-content: end;
      color: #fff;
    }
  `
  const NavCartIcon = styled.div`
    position: relative;
    width: 44px;
    height: 44px;
    background: url(${cart}) no-repeat;

    &:hover {
      width: 44px;
      height: 44px;
      background: url(${cartHover}) no-repeat;
    }

    @media ${theme.media.narrowScreen} {
      background: url(${cartMobile}) no-repeat;

      &:hover {
        width: 44px;
        height: 44px;
        background: url(${cartMobile}) no-repeat;
      }
    }
  `
  const NavCartBadge = styled.div`
    position: absolute;
    top: 21px;
    left: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    background-color: #8b572a;
    border-radius: 999px;
    color: #fff;
    z-index: 1;
  `

  const NavCartText = styled.div`
    display: none;

    @media ${theme.media.narrowScreen} {
      display: unset;
      height: 24px;
      border-right: 1px solid #f5f5f5;
      padding-right: 73px;
    }

    @media ${theme.media.narrowScreen} {
      display: unset;
      height: 24px;
      border-right: 1px solid #f5f5f5;
      padding-right: 73px;
    }

    @media screen and (max-width: 360px) {
      padding-right: 43px;
    }
  `
  const NavMember = styled.div`
    @media ${theme.media.narrowScreen} {
      width: 240px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  `
  const NavMemberIcon = styled.div`
    width: 44px;
    height: 44px;
    position: relative;
    right: 54px;
    background: url(${memberIcon}) no-repeat;

    &:hover {
      width: 44px;
      height: 44px;
      background: url(${memberIconHover}) no-repeat;
    }

    @media ${theme.media.narrowScreen} {
      right: unset;
      background: url(${memberMobileIcon}) no-repeat;
      &:hover {
        background: url(${memberMobileIcon}) no-repeat;
      }
    }
  `
  const NavMemberText = styled.div`
    display: none;

    @media ${theme.media.narrowScreen} {
      display: unset;
    }
  `

  const SearchCheckbox = styled.input`
    display: none;
    &:checked ~ ${NavSearch} {
      display: unset;
    }
  `

  return (
    <>
      <Nav>
        <NavLeft>
          <NavLogoWrap>
            <a href="/static/index.html">
              <NavLogo src={logo} alt="logo"></NavLogo>
            </a>
          </NavLogoWrap>
          <NavCate id="nav-cate">
            <NavItem id="cate-women" cate="women">
              <a href="/static/index.html?category=women">女 裝</a>
            </NavItem>
            <NavItem id="cate-men" cate="men">
              <a href="/static/index.html?category=men">男 裝</a>
            </NavItem>
            <NavItem id="cate-accessories" cate="accessories">
              <a href="/static/index.html?category=accessories">配 件</a>
            </NavItem>
          </NavCate>
        </NavLeft>
        <NavRight>
          <NavSearchComp>
            <form id="search-form">
              <label htmlFor="search-checkbox">
                <NavSearchIcon src={searchIcon} alt="" id="search-icon" />
              </label>
              <SearchCheckbox type="checkbox" id="search-checkbox" />
              <NavSearch type="text" name="q" id="search-input" />
            </form>
          </NavSearchComp>
          <NavMobilePanel>
            <NavCart>
              <Link to="/checkout">
                <NavCartIcon>
                  <NavCartBadge>{cartQty}</NavCartBadge>
                </NavCartIcon>
                <NavCartText>購物車</NavCartText>
              </Link>
            </NavCart>
            <NavMember>
              <Link to="/profile">
                <NavMemberIcon></NavMemberIcon>
              </Link>
              <NavMemberText>會員</NavMemberText>
            </NavMember>
          </NavMobilePanel>
        </NavRight>
      </Nav>
    </>
  )
}
