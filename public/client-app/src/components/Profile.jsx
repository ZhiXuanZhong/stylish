import styled from 'styled-components'
import PropTypes from 'prop-types'

export const Profile = (props) => {
  const { updateMenberInfo, memberInfo, fbResponse, updateFbResponse, fbTokenSignin, updateSigninToken } = props

  function handleFBLogin() {
    // Facebook login pop-up
    window.FB.login(
      (response) => {
        // token is here
        updateFbResponse(response)
        fbTokenSignin(response.authResponse.accessToken)

        fetch('https://api.appworks-school.tw/api/1.0/user/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // api required 'access_token'
          // eslint-disable-next-line camelcase
          body: JSON.stringify({ provider: 'facebook', access_token: response.authResponse.accessToken }),
        })
          .then((data) => data.json())
          .then((res) => {
            updateMenberInfo(res.data.user)
            updateSigninToken(res.data.access_token)
          })
      },
      { scope: 'public_profile,email' }
    )
  }

  const handleFBLogout = () => {
    window.FB.logout((response) => {
      updateFbResponse(response)
      updateMenberInfo({})
    })
  }

  return (
    <Section>
      <ProfileCard>
        <Avatar src={memberInfo.picture} />
        <ProfileTitle>使用者名稱</ProfileTitle>
        <ProfileBody value={memberInfo.name ? memberInfo.name : '尚未登入'} disabled></ProfileBody>
        <ProfileTitle>E-mail</ProfileTitle>
        <ProfileBody value={memberInfo.email ? memberInfo.email : '尚未登入'} disabled></ProfileBody>
      </ProfileCard>
      {fbResponse.status === 'connected' ? (
        <div style={{ backgroundColor: '#313538', color: 'ivory', padding: '10px', marginTop: '15px', cursor: 'pointer' }} onClick={handleFBLogout}>
          log out
        </div>
      ) : (
        <div style={{ backgroundColor: '#313538', color: 'ivory', padding: '10px', marginTop: '15px', cursor: 'pointer' }} onClick={handleFBLogin}>
          log in
        </div>
      )}
    </Section>
  )
}

Profile.propTypes = {
  updateMenberInfo: PropTypes.func,
  memberInfo: PropTypes.object,
  fbResponse: PropTypes.object,
  updateFbResponse: PropTypes.func,
  fbTokenSignin: PropTypes.func,
  updateSigninToken: PropTypes.func,
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  min-height: calc(100vh - 140px - 115px);
  max-width: 960px;
  width: 100%;
  margin: 0 auto;

  @media ${(props) => props.theme.media.narrowScreen} {
    width: auto;
    min-height: calc(100vh - 102px - 206px);
  }
`

const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 350px;
  width: 300px;
  padding: 20px 30px;
  border: 1px solid #979797;
`

const Avatar = styled.img`
  object-fit: cover;
  height: 150px;
  width: 150px;
  border-radius: 999px;
  background-color: grey;
`

const ProfileTitle = styled.p`
  margin-top: 15px;
  margin-bottom: 3px;
`

const ProfileBody = styled.input`
  color: ivory;
  width: 200px;
  border: none;
  padding: 10px 10px;
  text-align: center;
  background-color: #313538;
  border-radius: 4px;
`
