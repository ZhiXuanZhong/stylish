import binIcon from '../assets/images/cart-remove.png'
import dropDownIcon from '../assets/images/dropdown_icon.svg'

import { useImmer } from 'use-immer'
import { styled } from 'styled-components'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'


const Cart = (props) => {
  const { signinToken } = props

  Cart.propTypes = {
    signinToken: PropTypes.string,
    updateCart: PropTypes.func
  }

  let cart

  if (localStorage && localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'))
    // handleUpdateCart()
  } else {
    cart = {}
  }

  const [cartData, setCartData] = useImmer(cart)
  const [shipInfo, setShipInfo] = useImmer({ name: '', phone: '', email: '', address: '', time: '' })
  const [orderNum, setOrderNum] = useImmer(null)
  const [isSubmit, setIsSubmit] = useImmer(false)

  useEffect(() => {
    // return () => {

      const fields = {
        number: {
          // css selector
          element: '#card-number',
          placeholder: '**** **** **** ****',
        },
        expirationDate: {
          // DOM object
          element: document.getElementById('card-expiration-date'),
          placeholder: 'MM / YY',
        },
        ccv: {
          element: '#card-ccv',
          placeholder: '後三碼',
        },
      } 

      window.TPDirect.card.setup({
        fields,
        styles: {
          // Style all elements
          input: {
            color: 'black',
            height: '32px',
          },
          // Styling ccv field
          'input.ccv': {
            // 'font-size': '16px'
          },
          // Styling expiration-date field
          'input.expiration-date': {
            // 'font-size': '16px'
          },
          // Styling card-number field
          'input.card-number': {
            // 'font-size': '16px'
          },
          // style focus state
          ':focus': {
            // 'color': 'black'
          },
          // style valid state
          '.valid': {
            color: 'green',
          },
          // style invalid state
          '.invalid': {
            color: 'red',
          },
          // Media queries
          // Note that these apply to the iframe, not the root window.
          '@media screen and (max-width: 400px)': {
            input: {
              color: 'orange',
            },
          },
        },
        // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
        isMaskCreditCardNumber: true,
        maskCreditCardNumberRange: {
          beginIndex: 6,
          endIndex: 11,
        },
      })
    // }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartData))
    // Refresh data everytime
    // eslint-disable-next-line react-hooks/exhaustive-deps
    cart = JSON.parse(localStorage.getItem('cart'))
    // handleUpdateCart()
  }, [cartData])

  function onSubmit(event) {
    event.preventDefault()

    // 取得 TapPay Fields 的 status
    const tappayStatus = window.TPDirect.card.getTappayFieldsStatus()

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
      alert('信用卡資料錯誤')
      return
    }

    // Get prime
    window.TPDirect.card.getPrime((result) => {
      if (result.status !== 0) {
        alert(`get prime error ${result.msg}`)
        return
      }

      // console.log('get prime 成功，prime: ' + result.card.prime)

      const orderData = {
        shipping: 'delivery',
        payment: 'credit_card',
        subtotal: handleTotal(),
        freight: 30,
        total: handleTotal() + 30,
        recipient: shipInfo,
        list: [],
      }

      for (const pid in cartData) {
        if (Object.hasOwnProperty.call(cartData, pid)) {
          const product = cartData[pid]

          for (const spec in product.cartItems) {
            if (Object.hasOwnProperty.call(product.cartItems, spec)) {
              const target = product.cartItems[spec]

              const orderObj = {
                id: product.pid,
                name: product.productName,
                price: product.price,
                color: {
                  code: target.colorCode,
                  name: target.colorName,
                },
                size: target.size,
                qty: target.qty,
              }

              orderData.list.push(orderObj)
            }
          }
        }
      }

      const headersList = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${signinToken}`,
      }

      const bodyContent = JSON.stringify({
        prime: `${result.card.prime}`,
        order: orderData,
      })

      setIsSubmit(true)

      fetch('https://api.appworks-school.tw/api/1.0/order/checkout', {
        method: 'POST',
        body: bodyContent,
        headers: headersList,
      })
        .then(data => data.json())
        .then(order => {
          localStorage.clear()
          props.updateCart(0)
          setOrderNum(order.data.number)
        })
    })
  }

  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)

  const handleDelete = (pid, spec) => {
    setCartData((draft) => {
      delete draft[pid].cartItems[spec]
    })
  }

  const handleQtyUpdate = (pid, spec, targetQty) => {
    setCartData((draft) => {
      draft[pid].cartItems[spec].qty = targetQty
    })
  }

  const handleShipInfoUpdate = (e) => {
    const name = e.target.name
    const value = e.target.value
    setShipInfo((draft) => {
      draft[name] = value
    })
  }

  const handleTotal = () => {
    let totalAmount = 0

    for (const productId in cartData) {
      const cartItems = cartData[productId].cartItems
      const price = cartData[productId].price
      for (const productSpec in cartItems) {
        const qty = parseInt(cartItems[productSpec].qty)

        totalAmount += qty * price
      }
    }

    return totalAmount
  }

  return (
    <Container>
      {orderNum && <Navigate to={`/order?on=${orderNum}`} replace/>}
      <CartList>
        <CartSectionLable>
          <div>購物車</div>
          <CartDesktopHeader>
            <div style={{ paddingRight: '160px' }}>數量</div>
            <div style={{ paddingRight: '160px' }}>單價</div>
            <div style={{ paddingRight: '206px' }}>小計</div>
          </CartDesktopHeader>
        </CartSectionLable>
        <ProductListingComp>
          {Object.keys(cartData).map((pid, index) => {
            return Object.keys(cartData[pid].cartItems).map((spec) => {
              return (
                <CartItem key={index}>
                  <ListingInfo>
                    <MainImg src={cartData[pid].mainImageURL} />
                    <DescComp>
                      <Desc marginbtm={17} marginbtmmobile={20}>
                        {cartData[pid].productName}
                      </Desc>
                      <Desc marginbtm={22} marginbtmmobile={24}>
                        {pid}
                      </Desc>
                      <Desc marginbtm={10} marginbtmmobile={12}>
                        顏色｜{cartData[pid].cartItems[spec].colorName}
                      </Desc>
                      <Desc paddingleft={1}>尺寸｜{cartData[pid].cartItems[spec].size}</Desc>
                    </DescComp>
                  </ListingInfo>
                  <QtyPrice>
                    <FieldWrapper fieldtype={'qtycomp'}>
                      <FieldTitle paddingbtm={12}>數量</FieldTitle>
                      <QtyDropdown onChange={(e) => handleQtyUpdate(pid, spec, e.target.value)} defaultValue={cartData[pid].cartItems[spec].qty}>
                        {range(1, cartData[pid].cartItems[spec].allStock, 1).map((num, qtyIndex) => {
                          return (
                            <option key={qtyIndex} value={num}>
                              {num}
                            </option>
                          )
                        })}
                      </QtyDropdown>
                    </FieldWrapper>
                    <FieldWrapper fieldtype={'pricecomp'} paddingrightmobile={12}>
                      <FieldTitle paddingbtm={18}>單價</FieldTitle>
                      <FieldText>TWD.{cartData[pid].price}</FieldText>
                    </FieldWrapper>
                    <FieldWrapper fieldtype={'pricecomp'} paddingrightmobile={23}>
                      <FieldTitle paddingbtm={18}>小計</FieldTitle>
                      <FieldText>TWD.{cartData[pid].price * cartData[pid].cartItems[spec].qty}</FieldText>
                    </FieldWrapper>
                  </QtyPrice>
                  <RemoveItem>
                    <img src={binIcon} onClick={() => handleDelete(pid, spec)} />
                  </RemoveItem>
                </CartItem>
              )
            })
          })}
        </ProductListingComp>
      </CartList>
      <ShipInfo>
        <SectionLable>訂購資料</SectionLable>

        <InputSecContainer>
          <InputRow marginbtm={0} marginbtmmobile={0}>
            <InputLabel>收件人姓名</InputLabel>
            <InputField name={'name'} value={shipInfo.name} onChange={handleShipInfoUpdate} />
          </InputRow>
          <NameReminder>務必填寫完整收件人姓名，避免包裹無法順利簽收</NameReminder>
          <InputRow>
            <InputLabel>手機</InputLabel>
            <InputField name={'phone'} value={shipInfo.phone} onChange={handleShipInfoUpdate} />
          </InputRow>

          <InputRow>
            <InputLabel>地址</InputLabel>
            <InputField name={'address'} value={shipInfo.address} onChange={handleShipInfoUpdate} />
          </InputRow>

          <InputRow marginbtm={27} marginbtmmobile={21}>
            <InputLabel>Email</InputLabel>
            <InputField name={'email'} value={shipInfo.email} onChange={handleShipInfoUpdate} />
          </InputRow>

          <InputRow>
            <InputLabel>配送時間</InputLabel>
            <RadioWrapper onChange={handleShipInfoUpdate}>
              <ShipLabel>
                <ShipRadio name={'time'} value="morning" defaultChecked={shipInfo.time === 'morning'} />
                08:00-12:00
              </ShipLabel>
              <ShipLabel>
                <ShipRadio name={'time'} value="afternoon" defaultChecked={shipInfo.time === 'afternoon'} />
                14:00-18:00
              </ShipLabel>
              <ShipLabel>
                <ShipRadio name={'time'} value="anytime" defaultChecked={shipInfo.time === 'anytime'} />
                不指定
              </ShipLabel>
            </RadioWrapper>
          </InputRow>
        </InputSecContainer>
      </ShipInfo>

      <PaymentInto>
        <SectionLable>付款資料</SectionLable>
        <InputSecContainer>
          <InputRow>
            <InputLabel>信用卡號碼</InputLabel>
            <Tpfield className="tpfield" id="card-number"></Tpfield>
          </InputRow>
          <InputRow>
            <InputLabel>有效期限</InputLabel>
            <Tpfield className="tpfield" id="card-expiration-date"></Tpfield>
          </InputRow>
          <InputRow marginbtm={0}>
            <InputLabel>安全碼</InputLabel>
            <Tpfield className="tpfield" id="card-ccv"></Tpfield>
          </InputRow>
        </InputSecContainer>
      </PaymentInto>

      <OrderTotal>
        <TotalComp>
          <TotalPrice>
            <div style={{ paddingTop: '9px', fontSize: '16px', lineHeight: '19px' }}>總金額</div>
            <div style={{ paddingTop: '9px', marginLeft: 'auto', fontSize: '16px', lineHeight: '19px' }}>NT.</div>
            <div style={{ fontSize: '30px', lineHeight: '36px', paddinglefteft: '8px', paddingRight: '4px' }}>{handleTotal()}</div>
          </TotalPrice>
          <TotalShipping>
            <div style={{ paddingTop: '9px', fontSize: '16px', lineHeight: '19px' }}>運費</div>
            <div style={{ paddingTop: '9px', marginLeft: 'auto', fontSize: '16px', lineHeight: '19px' }}>NT.</div>
            <div style={{ fontSize: '30px', lineHeight: '36px', paddinglefteft: '8px', paddingRight: '2px' }}>{handleTotal() > 0 ? 30 : 0}</div>
          </TotalShipping>
          <Total>
            <div style={{ paddingBottom: '8px', fontSize: '16px', lineHeight: '19px' }}>應付金額</div>
            <div style={{ paddingBottom: '8px', marginLeft: 'auto', fontSize: '16px', lineHeight: '19px' }}>NT.</div>
            <div style={{ fontSize: '30px', lineHeight: '36px', paddinglefteft: '8px' }}>{handleTotal() > 0 ? handleTotal() + 30 : 0}</div>
          </Total>
        </TotalComp>
      </OrderTotal>

      <PayBtnSection>
        <CheckoutBtn onClick={onSubmit} value={isSubmit ? '交易處理中...' : '確認付款' }/>
      </PayBtnSection>
    </Container>
  )
}

export default Cart

// General components start

const Container = styled.div`
  padding-top: 51px;
  max-width: 1160px;
  width: 100vw;
  margin: 0 auto;
  @media ${(props) => props.theme.media.narrowScreen} {
    padding: 20px 24px 0;
  }
`

const InputSecContainer = styled.div`
  max-width: 696px;
  width: 100%;

  .tpfield {
        height: 32px;
        width: 100%;
        border: 1px solid #979797;
        margin: 5px 0;
        padding: 5px;
        border-radius: 8px;
    }
`

// TabPay style

const Tpfield = styled.div`
  margin: '5px 0';
  padding: '5px';

  font-family: "'Noto Sans TC', sans-serif";

  height: '32px';
  width: '100%';
  max-width: '576px';
  border-radius: '8px';
  border: '1px solid #979797';

  font-size: '16px';
  line-height: '32px';
`

// Block components start

const CartList = styled.div`
  width: 100%;
  margin-bottom: 50px;
  @media ${(props) => props.theme.media.narrowScreen} {
    margin-bottom: 1px;
  }
`

const ProductListingComp = styled.div`
  width: 100%;
  min-height: 596px;
  padding: 39px 30px;
  border: 1px solid #979797;
  @media ${(props) => props.theme.media.narrowScreen} {
    border: none;
    padding: 0;
  }
`

const CartItem = styled.div`
  display: flex;
  margin: 0 auto 30px;
  width: 100%;
  min-height: 152px;

  &:last-child {
    margin-bottom: unset;
  }

  @media ${(props) => props.theme.media.narrowScreen} {
    flex-wrap: wrap;
    margin-top: 20px;
    margin-bottom: unset;
    padding-bottom: 19px;
    border-bottom: 1px solid #000;

    &:last-child {
      border-bottom: unset;
    }
  }
`
const ListingInfo = styled.div`
  display: flex;
  width: 484px;
  @media ${(props) => props.theme.media.narrowScreen} {
    order: 1;
    flex-basis: 80%;
  }
`

const MainImg = styled.img`
  height: 152px;
  width: 114px;
  object-fit: cover;
`
const DescComp = styled.div`
  max-width: 370px;
  width: 100%;
  padding-left: 15px;
  @media ${(props) => props.theme.media.narrowScreen} {
    padding-left: 10px;
  }
`

const Desc = styled.div`
  margin-bottom: ${(props) => `${props.marginbtm}px`};
  padding-left: ${(props) => `${props.paddingleft}px`};
  font-size: 16px;
  line-height: 19px;

  @media ${(props) => props.theme.media.narrowScreen} {
    font-size: 14px;
    line-height: 17px;

    margin-bottom: ${(props) => `${props.marginbtmmobile}px`};
  }
`

const QtyPrice = styled.div`
  display: flex;
  width: 520px;
  @media ${(props) => props.theme.media.narrowScreen} {
    order: 3;
    flex-basis: 100%;
    height: 79px;
    justify-content: space-between;
  }
`

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-right: ${(props) => (props.fieldtype === 'qtycomp' ? 'auto' : null)};

  @media ${(props) => props.theme.media.narrowScreen} {
    justify-content: end;
    padding-left: ${(props) => (props.fieldtype === 'qtycomp' ? '12px' : null)};
    margin-right: ${(props) => (props.fieldtype === 'qtycomp' ? 'unset' : null)};
    min-width: ${(props) => (props.fieldtype === 'pricecomp' ? '58px' : null)};
    padding-right: ${(props) => (props.fieldtype === 'pricecomp' ? `${props.paddingrightmobile}px` : null)};
  }
`

const FieldTitle = styled.div`
  display: none;
  @media ${(props) => props.theme.media.narrowScreen} {
    display: unset;
    text-align: center;

    padding-bottom: ${(props) => `${props.paddingbtm}px`};

    font-size: 14px;
    line-height: 17px;
  }
`
const FieldText = styled.div`
  width: 192px;
  text-align: center;

  @media ${(props) => props.theme.media.narrowScreen} {
    width: auto;
    font-size: 14px;
    line-height: 17px;
    padding-bottom: 7px;
  }
`

const QtyDropdown = styled.select.attrs({
  name: 'qtySelect',
})`
  width: 80px;
  height: 32px;
  border-radius: 8px;
  padding-left: 14px;
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 14px;
  line-height: 16px;
  appearance: none;
  background-image: url(${dropDownIcon});
  background-repeat: no-repeat;
  background-position: 88% 50%;
  background-color: #f3f3f3;

  @media ${(props) => props.theme.media.narrowScreen} {
    height: 30px;
  }
`

const RemoveItem = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  flex-grow: 1;
  @media ${(props) => props.theme.media.narrowScreen} {
    order: 2;
    flex-basis: 20%;
    align-items: start;
  }
`

const ShipInfo = styled.div`
  height: 363px;
  /* FIXME above */
  min-height: 363px;
  width: 100%;
  margin-bottom: 50px;

  @media ${(props) => props.theme.media.narrowScreen} {
    height: unset;
    margin-bottom: 20px;
  }
`

const RadioWrapper = styled.div`
  @media ${(props) => props.theme.media.narrowScreen} {
    margin-top: -1px;
  }
`

const PaymentInto = styled.div`
  min-height: 216px;
  width: 100%;
  margin-bottom: 40px;

  @media ${(props) => props.theme.media.narrowScreen} {
    margin-bottom: 24px;
  }
`
const OrderTotal = styled.div`
  display: flex;
  justify-content: end;
  height: 168px;
  width: 100%;
  margin-bottom: 50px;

  @media ${(props) => props.theme.media.narrowScreen} {
    margin-bottom: 36px;
  }
`

const TotalComp = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
`

const PayBtnSection = styled.div`
  display: flex;
  justify-content: end;
  max-height: 64px;
  width: 100%;
  margin-bottom: 148px;
  @media ${(props) => props.theme.media.narrowScreen} {
    margin-bottom: 28px;
  }
`

// Section element components start

const SectionLable = styled.div`
  margin-bottom: 25px;

  width: 100%;
  height: 35px;

  font-size: 16px;
  line-height: 19px;
  font-weight: 700;

  border-bottom: 1px solid #3f3a3a;

  @media ${(props) => props.theme.media.narrowScreen} {
    height: 29px;
    margin-bottom: 20px;
  }
`

const CartSectionLable = styled.div`
  display: flex;
  justify-content: space-between;

  width: 100%;
  height: 35px;

  font-size: 16px;
  line-height: 19px;
  font-weight: 700;
  @media ${(props) => props.theme.media.narrowScreen} {
    height: 29px;
    border-bottom: 1px solid #3f3a3a;
  }
`

const CartDesktopHeader = styled.div`
  display: flex;
  font-size: 16px;
  line-height: 16px;
  font-weight: 400;
  color: #3f3a3a;

  @media ${(props) => props.theme.media.narrowScreen} {
    display: none;
  }
`

const InputRow = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  width: 100%;
  margin-bottom: ${(props) => (props.marginbtm >= 0 ? `${props.marginbtm}px` : '30px')};

  @media ${(props) => props.theme.media.narrowScreen} {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 10px;

    min-height: 32px;
    height: auto;
    margin-bottom: ${(props) => (props.marginbtmmobile >= 0 ? `${props.marginbtmmobile}px` : '20px')};
  }
`

const InputLabel = styled.label`
  width: 120px;
  font-size: 16px;
  line-height: 19px;

  @media ${(props) => props.theme.media.narrowScreen} {
    font-size: 14px;
    line-height: 17px;
  }
`

const InputField = styled.input.attrs({
  type: 'text',
})`
  font-family: 'Noto Sans TC', sans-serif;

  padding-left: 6px;
  height: 32px;
  width: 100%;
  max-width: 576px;
  border-radius: 8px;
  border: 1px solid #979797;

  font-size: 16px;
  line-height: 32px;

  &::placeholder {
    color: #d3d3d3;
  }
`
const NameReminder = styled.div`
  margin-top: 10px;
  margin-bottom: 30px;
  text-align: right;
  font-size: 16px;
  line-height: 19px;
  color: #8b572a;

  @media ${(props) => props.theme.media.narrowScreen} {
    margin: unset;
    padding-top: 6px;
    margin-bottom: 20px;
    text-align: left;

    font-size: 14px;
    line-height: 17px;
  }
`

const ShipLabel = styled.label`
  margin-right: 33px;
  font-size: 16px;
  line-height: 26px;

  @media ${(props) => props.theme.media.narrowScreen} {
    font-size: 14px;
    margin-right: 26px;
    vertical-align: bottom;
    &:last-child {
      margin-right: 0;
    }
  }
`
const ShipRadio = styled.input.attrs({
  type: 'radio',
})`
  margin-right: 8px;
  height: 16px;
  width: 16px;

  @media ${(props) => props.theme.media.narrowScreen} {
    margin-right: 6px;
    vertical-align: middle;
    margin-top: -5px;
  }
`

const TotalPrice = styled.div`
  display: flex;
  width: 100%;
  height: 56px;
`

const TotalShipping = styled.div`
  display: flex;
  width: 100%;
  height: 56px;
  border-bottom: 1px solid #3f3a3a;
`
const Total = styled.div`
  display: flex;
  align-items: end;
  width: 100%;
  height: 56px;
  @media ${(props) => props.theme.media.narrowScreen} {
    > * {
      &:first-child {
        padding-left: 4px;
      }
    }
  }
`

const CheckoutBtn = styled.input.attrs({
  type: 'submit',
})`
  font-family: 'Noto Sans TC', sans-serif;
  background-color: black;
  height: 64px;
  width: 240px;
  text-decoration: none;
  color: #fff;
  font-size: 20px;
  letter-spacing: 4px;
  line-height: 30px;
  padding-left: 4px;
  border: 1px solid #979797;

  @media ${(props) => props.theme.media.narrowScreen} {
    height: 44px;
    width: 100%;
    font-size: 16px;
  }
`
