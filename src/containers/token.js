import { useState, useCallback } from 'react';

function useToken() {

  const safeParse = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  };

  const getToken = useCallback(() => {
    const tokenString = localStorage.getItem('token');
    const userToken = safeParse(tokenString);
    return userToken?.token || null
  }, []);

  const getSecretID = useCallback(() => {
    const SecretIDString = localStorage.getItem('secretID');
    const adminSecretID = safeParse(SecretIDString);
    return adminSecretID?.secretID || null
  }, []);

  const getOtpToken = useCallback(() => {
    const OtpTokenString = localStorage.getItem('OtpToken');
    const OtpTokenNO = safeParse(OtpTokenString);
    return OtpTokenNO?.OtpToken || null
  }, []);

  const getOtpExpire = useCallback(() => {
    const otpExpirationTime = localStorage.getItem('otpExpirationTime');
    const otpExpire = safeParse(otpExpirationTime);
    return otpExpire?.otpExpirationTime || null
  }, [])

  const [otpToken, setOtpToken] = useState(getOtpToken());
  const [token, setToken] = useState(getToken());
  const [secretID, setSecretID] = useState(getSecretID());
  const [otpExpirationTime, setOtpExpirationTime] = useState(getOtpExpire());

  const saveToken = useCallback((userToken, expiresIn = 600) => {
    const expiresAt = Date.now() + expiresIn * 1000;
    const tokenData = { token: userToken, expiresAt };
    localStorage.setItem('token', JSON.stringify(tokenData));
    setToken(userToken);
  }, []);

  const saveSecretID = useCallback(adminSecretID => {
    localStorage.setItem('secretID', JSON.stringify(adminSecretID));
    setSecretID(adminSecretID);
  }, []);

  const saveOtpToken = useCallback(userOtpToken => {
    localStorage.setItem('OtpToken', JSON.stringify(userOtpToken));
    setOtpToken(userOtpToken);
  }, []);

  const saveotpExpirationTime = useCallback(userotpExpirationTime => {
    localStorage.setItem('otpExpirationTime', JSON.stringify(userotpExpirationTime));
    setOtpExpirationTime(userotpExpirationTime);
  }, []);

  return {
    setToken: saveToken,
    token,
    setSecretID: saveSecretID,
    secretID,
    setOtpToken: saveOtpToken,
    otpToken,
    setOtpExpirationTime: saveotpExpirationTime,
    otpExpirationTime
  }
}

export default useToken