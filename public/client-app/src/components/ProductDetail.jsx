import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import PropTypes from 'prop-types'

ProductDetail.propTypes = {
  productData: PropTypes.object,
  updateCart: PropTypes.func,
}

export default function ProductDetail(props) {
  // Deconstruct incoming data
  const { data } = props.productData

  // Initial localStorage, restore history or create new cart
  let cart

  if (localStorage && localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'))
    handleUpdateCart()
  } else {
    cart = {}
  }

  useEffect(() => {
    handleStockUpdate()
    // Empty dependency for initial run
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Initial states
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [allVariant, setAllVariant] = useState([])
  const [curVariant, setCurVariant] = useState([])
  const [curStock, setCurStock] = useState(null)

  // Event handlers
  function handleUpdateCart() {
    let totalQty = 0
    for (const productId in cart) {
      const cartItems = cart[productId].cartItems
      for (const cartItemId in cartItems) {
        totalQty += parseInt(cartItems[cartItemId].qty)
      }
    }
    props.updateCart(totalQty)
  }

  //
  function handleStockUpdate() {
    setAllVariant(() => {
      return data.variants.map((item) => {
        if (Object.hasOwn(cart, data.id)) {
          if (Object.hasOwn(cart[data.id].cartItems, `${item.color_code}${item.size}`)) {
            return { ...item, stock: item.stock - cart[data.id].cartItems[`${item.color_code}${item.size}`].qty }
          }
        }
        return item
      })
    })
  }

  // Set color then get corresponding variant data set
  // qty set to 1 when change color
  function handleColorPick(hex) {
    setSelectedColor(hex)
    setSelectedSize(null)
    setQty(1)
    setCurVariant(allVariant.filter((item) => item.color_code === hex))
  }

  // Qty set to 1 when change size
  function handleSizePick(size) {
    if (curVariant.filter((item) => item.size === size)[0].stock !== 0) {
      setSelectedSize(size)
      setQty(1)
      setCurStock(() => curVariant.filter((item) => item.size === size)[0].stock)
    }
  }

  // Set new qty if condition is true, otherwise return latest state
  function handleQtyClick(opr) {
    setQty((prevQty) => {
      if (opr === 'minus' && prevQty > 1) {
        return prevQty - 1
      }

      if (opr === 'plus' && prevQty < curStock) {
        return prevQty + 1
      }

      return prevQty
    })
  }

  // 1. Build new cart item
  // 2. Push into cart history
  // 3. Restore history
  // 4. Reset to product page initial state
  function handleAddToCart() {
    if (selectedColor !== null && selectedSize !== null) {
      if (Object.keys(cart).includes(`${data.id}`)) {
        if (Object.keys(cart[data.id].cartItems).includes(`${selectedColor}${selectedSize}`)) {
          cart[data.id].cartItems[`${selectedColor}${selectedSize}`].qty += qty
        } else {
          cart[data.id].cartItems = {
            ...cart[data.id].cartItems,
            [`${selectedColor}${selectedSize}`]: {
              colorCode: selectedColor,
              colorName: data.colors.filter((color) => color.code === selectedColor)[0].name,
              qty,
              size: selectedSize,
              allStock: allVariant.filter((item) => item.color_code === selectedColor && item.size === selectedSize)[0].stock,
            },
          }
        }
      } else {
        cart = {
          ...cart,
          [data.id]: {
            pid: data.id,
            productName: data.title,
            price: data.price,
            mainImageURL: data.main_image,
            cartItems: {
              [`${selectedColor}${selectedSize}`]: {
                colorCode: selectedColor,
                colorName: data.colors.filter((color) => color.code === selectedColor)[0].name,
                qty,
                size: selectedSize,
                allStock: allVariant.filter((item) => item.color_code === selectedColor && item.size === selectedSize)[0].stock,
              },
            },
          },
        }
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      handleUpdateCart()
      handleStockUpdate()
      // rest to initial state
      setSelectedColor(null)
      setSelectedSize(null)
      setCurVariant([])
      setQty(1)
    }
  }

  return (
    <Section>
      <Container>
        <DetailInfo>
          <MainImage src={data.main_image} />
          <Specs>
            <SpecTitle>{data.title}</SpecTitle>
            <SpecPID>{data.id}</SpecPID>
            <SpecPrice>TWD.{data.price}</SpecPrice>
            <SpecVariants>
              <VariantsColor>
                <ColorLabel>顏色｜</ColorLabel>
                {data.colors.map((color, index) => {
                  return <ColorOption hex={`#${color.code}`} active={color.code && selectedColor} key={index} index={index} onClick={() => handleColorPick(color.code)}></ColorOption>
                })}
              </VariantsColor>
              <VariantsSize>
                <SizeLabel>尺寸｜</SizeLabel>
                {data.sizes.map((size, index) => {
                  return (
                    <SizeOption
                      key={index}
                      active={selectedSize && size}
                      available={selectedColor && curVariant.filter((item) => item.size === size)[0].stock !== 0}
                      onClick={() => handleSizePick(size)}
                    >
                      {size}
                    </SizeOption>
                  )
                })}
              </VariantsSize>
              <VariantsStock>
                <StockLabel>數量｜</StockLabel>
                <StockComp>
                  <StockMinus onClick={() => handleQtyClick('minus')}></StockMinus>
                  <StockQty value={qty} min={1} max={curStock} disabled></StockQty>
                  <StockPlus onClick={() => handleQtyClick('plus')}></StockPlus>
                </StockComp>
              </VariantsStock>
              {/* FIXME checking useState default value */}
              {/* initial is null , is it crucial????? why?? */}
              {selectedColor !== null && selectedSize !== null && <div style={{ textAlign: 'center' }}> available stock: {curVariant.filter((item) => item.size === selectedSize)[0].stock} </div>}
            </SpecVariants>
            <AddToCart onClick={() => handleAddToCart()} />
            <SpecMisc>
              {/* FIXME */}
              <DescritionTextContent>
                {data.note}
                {<br />}
                {<br />}
                {data.texture}
                {<br />}
                {data.description.split('\r\n').map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
                {<br />}
                {`清洗：${data.wash}`}
                {<br />}
                {`產地：${data.place}`}
              </DescritionTextContent>
            </SpecMisc>
          </Specs>
        </DetailInfo>
        <Story>
          <StoryTitleComp>
            <StoryTitleText>更多產品資訊</StoryTitleText>
            <StoryDecoLine />
          </StoryTitleComp>
          <StoryBody>{data.story}</StoryBody>
        </Story>

        {data.images.map((item, index) => {
          return <DescritionImage src={item} key={index} />
        })}
      </Container>
    </Section>
  )
}

const Section = styled.section`
  min-height: calc(100vh - 140px - 115px);
  max-width: 960px;
  width: 100%;
  margin: 0 auto;

  @media ${(props) => props.theme.media.narrowScreen} {
    width: auto;
    min-height: calc(100vh - 102px - 206px);
    /* margin-bottom: 20px; */
  }
`

const Container = styled.div`
  max-width: 960px;
  width: 100%;
  padding-top: 65px;
  padding-bottom: 19px;

  @media ${(props) => props.theme.media.narrowScreen} {
    /* Limit content display width for better readability. */
    max-width: calc(480px + 24px + 24px);
    margin: 0 auto;
    padding-top: unset;
    padding-bottom: 32px;
  }
`

const DetailInfo = styled.div`
  margin-bottom: 50px;
  display: flex;
  gap: 40px;
  width: auto;
  height: 747px;

  @media ${(props) => props.theme.media.narrowScreen} {
    margin-bottom: unset;
    flex-wrap: wrap;
    gap: 17px;
    justify-content: center;
    height: unset;
  }
`

const MainImage = styled.img`
  max-width: 560px;

  @media ${(props) => props.theme.media.narrowScreen} {
    width: 100%;
    object-fit: contain;
  }
`

const Specs = styled.div`
  width: 100%;
  @media ${(props) => props.theme.media.narrowScreen} {
    padding: 0 24px;
  }
`

const SpecTitle = styled.div`
  height: 54px;
  font-size: 32px;
  color: #3f3a3a;
  letter-spacing: 6.4px;
  line-height: 38px;
  @media ${(props) => props.theme.media.narrowScreen} {
    padding-bottom: 10px;
    height: auto;
    font-size: 20px;
    letter-spacing: 4px;
    line-height: 24px;
  }
`

const SpecPID = styled.div`
  height: 64px;
  font-size: 20px;
  color: #bababa;
  letter-spacing: 4px;
  line-height: 24px;
  @media ${(props) => props.theme.media.narrowScreen} {
    height: auto;
    font-size: 16px;
    letter-spacing: 3.2px;
    line-height: 19px;
  }
`

const SpecPrice = styled.div`
  height: 56px;
  font-size: 30px;
  color: #3f3a3a;
  line-height: 36px;
  border-bottom: 1px solid #3f3a3a;
  @media ${(props) => props.theme.media.narrowScreen} {
    padding-top: 20px;
    padding-bottom: 10px;
    height: auto;
    font-size: 20px;
    line-height: 24px;
  }
`

const SpecVariants = styled.div`
  height: 224px;
  padding-top: 30px;
  @media ${(props) => props.theme.media.narrowScreen} {
    height: unset;
  }
`

const VariantsColor = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  height: 36px;
  width: 100%;

  @media ${(props) => props.theme.media.narrowScreen} {
    gap: 18px;
  }
`

const ColorLabel = styled.div`
  font-size: 20px;
  color: #3f3a3a;
  letter-spacing: 4px;
  line-height: 24px;
  @media ${(props) => props.theme.media.narrowScreen} {
    font-size: 14px;
    letter-spacing: 2.8px;
    line-height: 17px;
  }
`

const ColorOption = styled.div`
  background-color: ${(props) => props.hex};
  margin-right: 8px;
  width: 24px;
  height: 24px;
  border: 1px solid #d3d3d3;
  outline: ${(props) => (props.active ? '1px solid #838383' : null)};
  outline-offset: 5px;
  cursor: pointer;
  @media ${(props) => props.theme.media.narrowScreen} {
    margin-right: 9px;
  }
`

const VariantsSize = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  height: 36px;
  width: 100%;
  @media ${(props) => props.theme.media.narrowScreen} {
    margin-top: 28px;
    gap: 12px;
  }
`
const SizeLabel = styled.div`
  font-size: 20px;
  color: #3f3a3a;
  letter-spacing: 4px;
  line-height: 24px;
  @media ${(props) => props.theme.media.narrowScreen} {
    font-size: 14px;
    letter-spacing: 2.8px;
    line-height: 17px;
  }
`

const SizeOption = styled.div`
  ${(props) => {
    if (props.active) {
      return 'background-color:#000; color:#FFF;'
    }
    if (props.available) {
      return 'background-color:rgba(236, 236, 236, 1); color:#3F3A3A;'
    }
    return 'background-color:rgba(236, 236, 236, 0.25); color:rgba(63, 58, 58, 0.25);'
  }};

  display: flex;
  justify-content: center;
  align-items: center;

  width: 36px;
  height: 36px;
  border-radius: 9999px;

  font-size: 20px;
  line-height: 36px;
  cursor: pointer;
  @media ${(props) => props.theme.media.narrowScreen} {
    margin-right: 3px;
  }
`

const VariantsStock = styled.div`
  /* outline: 1px solid red;
  background-color: rgba(0, 0, 255, 0.5); */

  display: flex;
  align-items: center;
  gap: 20px;

  margin-top: 22px;
  height: 42px;
  width: 100%;
  @media ${(props) => props.theme.media.narrowScreen} {
    margin-top: 30px;
  }
`

const StockLabel = styled.div`
  font-size: 20px;
  color: #3f3a3a;
  letter-spacing: 4px;
  line-height: 24px;
  @media ${(props) => props.theme.media.narrowScreen} {
    display: none;
  }
`

const StockComp = styled.div`
  border: 1px solid #979797;
  @media ${(props) => props.theme.media.narrowScreen} {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`

const StockMinus = styled.input.attrs({
  type: 'button',
  value: '-   ',
})`
  font-family: 'Noto Sans TC', sans-serif;
  color: #000;
  background-color: #fff;
  height: 42px;
  width: 44px;
  text-decoration: none;
  font-size: 16px;
  line-height: 32px;
  border: none;
  @media ${(props) => props.theme.media.narrowScreen} {
    width: 110px;
  }
`

const StockQty = styled.input.attrs({
  type: 'number',
})`
  background-color: #fff;
  font-family: 'Noto Sans TC', sans-serif;
  text-align: center;
  color: #8b572a;
  padding-left: 15px;
  height: 42px;
  width: 70px;
  text-decoration: none;
  font-size: 16px;
  line-height: 32px;
  border: none;

  @media ${(props) => props.theme.media.narrowScreen} {
    padding-left: 6px;
    font-size: 20px;
    line-height: 22px;
  }
`

const StockPlus = styled.input.attrs({
  type: 'button',
  value: '  +',
})`
  font-family: 'Noto Sans TC', sans-serif;
  color: #000;
  background-color: #fff;
  height: 42px;
  width: 44px;
  text-decoration: none;
  font-size: 16px;
  line-height: 32px;
  border: none;
  @media ${(props) => props.theme.media.narrowScreen} {
    width: 117px;
  }
`

const AddToCart = styled.input.attrs({
  type: 'submit',
  value: '加入購物車',
})`
  font-family: 'Noto Sans TC', sans-serif;
  background-color: black;
  height: 64px;
  width: 360px;
  text-decoration: none;
  color: #fff;
  font-size: 20px;
  letter-spacing: 4px;
  line-height: 30px;
  padding-left: 4px;
  border: 1px solid #979797;
  @media ${(props) => props.theme.media.narrowScreen} {
    margin-top: 10px;
    width: 100%;
    height: 44px;
    font-size: 16px;
    letter-spacing: 3.2px;
    line-height: 30px;
  }
`

const SpecMisc = styled.div`
  height: 285px;
  @media ${(props) => props.theme.media.narrowScreen} {
    height: unset;
  }
`

const DescritionTextContent = styled.p`
  width: 100%;
  padding-left: 6px;
  padding-top: 40px;

  font-size: 20px;
  color: #3f3a3a;
  line-height: 30px;
  @media ${(props) => props.theme.media.narrowScreen} {
    padding-left: unset;
    padding-top: 28px;
    font-size: 14px;
    line-height: 24px;
  }
`

const Story = styled.div`
  padding-bottom: 30px;
  width: 100%;
  @media ${(props) => props.theme.media.narrowScreen} {
    padding: 0 24px;
    margin-top: 28px;
  }
`

const StoryTitleComp = styled.div`
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media ${(props) => props.theme.media.narrowScreen} {
    width: 100%;
    margin-bottom: 14px;
  }
`

const StoryTitleText = styled.div`
  width: 150px;
  font-size: 20px;
  color: #8b572a;
  letter-spacing: 3px;
  line-height: 30px;
  @media ${(props) => props.theme.media.narrowScreen} {
    font-size: 16px;
    letter-spacing: 3.2px;
    line-height: 30px;
  }
`

const StoryDecoLine = styled.div`
  margin-bottom: 1px;
  width: 761px;
  height: 1px;
  background-color: #3f3a3a;
  @media ${(props) => props.theme.media.narrowScreen} {
    margin-bottom: unset;
    width: calc(100% - 145px);
  }
`

const StoryBody = styled.div`
  font-size: 20px;
  color: #3f3a3a;
  line-height: 30px;
  @media ${(props) => props.theme.media.narrowScreen} {
    font-size: 14px;
    line-height: 25px;
  }
`

const DescritionImage = styled.img`
  vertical-align: top;
  margin-bottom: 30px;
  width: 100%;
  height: 540px;
  object-fit: cover;

  @media ${(props) => props.theme.media.narrowScreen} {
    padding: 0 24px;
    height: auto;
    margin-top: 20px;
    margin-bottom: unset;
  }
`
