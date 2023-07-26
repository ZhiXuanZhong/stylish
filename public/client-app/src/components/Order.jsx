import { styled } from 'styled-components'

export const Order = () => {

    let params = {}
    const queryString = window.location.search
    const searchParams = new URLSearchParams(queryString)
    for (const [key, value] of searchParams.entries()) {
      params = { ...params, [key]: value }
    }

  return (
    <>
            <Container>
            <Content>
            <h1>Thanks for shopping with us!</h1>
            <h3>Order number: {params.on}</h3>
            </Content>
            </Container>
    </>
  )
}

const Container = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
min-height: calc(100vh - 140px - 115px);
background-image: url(https://images.pexels.com/photos/3762927/pexels-photo-3762927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1);
background-size: cover;
`

const Content = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
width: 90vw;
height: 50vh;
text-align: center;

background-color: rgba(255,255,255,0.7);
`