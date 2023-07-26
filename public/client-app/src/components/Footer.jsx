import styled, { ThemeContext } from 'styled-components'

import lineIcon from '../assets/images/line.png'
import twitterIcon from '../assets/images/twitter.png'
import facebookIcon from '../assets/images/facebook.png'
import { useContext } from 'react'

export default function Footer() {

  const theme = useContext(ThemeContext)

  const FooterComp = styled.div`
    height: 115px;
    background-color: #313538;

    @media ${theme.media.narrowScreen} {
      padding-top: 23px;
      height: 206px;
    }
  `
  const FooterContainer = styled.div`
    width: 1160px;
    display: flex;
    margin: 0 auto;

    @media ${theme.media.narrowScreen} {
      display: flex;
      flex-wrap: wrap;
      width: 296px;
    }
  `

  const FooterLeft = styled.div`
    margin-right: auto;
    padding-top: 46px;

    @media ${theme.media.narrowScreen} {
      padding-top: unset;
    }
  `
  const FooterList = styled.div`
    display: flex;

    @media ${theme.media.narrowScreen} {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-wrap: wrap;
      height: 76px;
      column-gap: 36px;
      row-gap: 8px;
    }
  `
  const FooterItem = styled.div`
    width: 134px;
    height: 22px;
    text-align: center;
    color: #f5f5f5;
    font-size: 16px;
    font-weight: 100;

    & + & {
      border-left: 1px solid #828282;
    }

    @media ${theme.media.narrowScreen} {
      height: 20px;
      width: initial;
      text-align: left;
      font-size: 14px;

      &:last-child {
        flex-grow: 1;
      }

      & + & {
        border-left: unset;
      }
    }
  `
  const FooterItemTouch = styled.span`
    letter-spacing: 0.5px;
    font-weight: 300;

    @media ${theme.media.narrowScreen} {
      letter-spacing: 0.3px;
    }
  `

  const FooterRight = styled.div`
    display: flex;
    @media ${theme.media.narrowScreen} {
      width: 88px;
    }
  `
  const FooterSocial = styled.div`
    display: flex;
    justify-content: space-between;
    width: 210px;
    padding-top: 33px;
    @media ${theme.media.narrowScreen} {
      padding-top: 18px;
    }
  `
  const SocialImg = styled.img`
    width: 50px;
    height: 50px;

    @media ${theme.media.narrowScreen} {
      width: 20px;
      height: 20px;
    }
  `
  const FooterCopyright = styled.div`
    color: #828282;
    font-size: 12px;
    padding-top: 50px;
    padding-left: 30px;

    @media ${theme.media.narrowScreen} {
      display: flex;
      justify-content: center;
      align-items: end;
      padding-top: initial;
      padding-left: initial;
      height: 27px;
      flex-grow: 1;
      text-align: center;
      font-size: 10px;
    }
  `

  return (
    <>
      <FooterComp>
        <FooterContainer>
          <FooterLeft>
            <FooterList>
              <FooterItem>
              關於<FooterItemTouch> STYLiSH</FooterItemTouch>
              </FooterItem>
              <FooterItem>服務條款</FooterItem>
              <FooterItem>隱私政策</FooterItem>
              <FooterItem>聯絡我們</FooterItem>
              <FooterItem>FAQ</FooterItem>
            </FooterList>
          </FooterLeft>
          <FooterRight>
            <FooterSocial>
              <SocialImg src={lineIcon} alt="" />
              <SocialImg src={twitterIcon} alt="" />
              <SocialImg src={facebookIcon} alt="" />
            </FooterSocial>
          </FooterRight>
          <FooterCopyright>© 2018. All rights reserved.</FooterCopyright>
        </FooterContainer>

      </FooterComp>
    </>
  )
}
