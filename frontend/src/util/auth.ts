import jwtDecode, { JwtPayload } from "jwt-decode";    
import { refreshToken  } from "@/apicalls";
import { keys } from './localstoragekeys'
    
interface TokenProps {
  exp: number 
}

const setAccessToken = (token: string) => localStorage.setItem(keys.accessToken, token)
const getAccessToken = () => localStorage.getItem('accessToken') as string | undefined

const accessTokenIsValid = () => {
  const token = getAccessToken() 

  if (!token) {
    return false
  }

  try {
    const { exp } = jwtDecode<TokenProps>(token)
    console.log("Decoded token: ", jwtDecode<TokenProps>(token))

    if (Date.now() >= exp*1000) {
      return false
    }

    return true
  } catch (e) {
    return false
  }
}

const isGuest = () => {
  return getAccessToken() === undefined 
}


export const refreshTokens = async () => {
  if (isGuest() || accessTokenIsValid()) {
    return true
  }

  const response = (await refreshToken()).data
  const { data, ok } = response
  if (ok) {
    console.log('setting access token')
    setAccessToken(data.accessToken)
  } else {
    console.error('invalid refresh_token')
  }
  return ok
}