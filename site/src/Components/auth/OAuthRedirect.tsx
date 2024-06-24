import {useNavigate, useSearchParams} from "react-router-dom";

import {fetchRestEndpoint} from "../../support/FetchEndpoint.ts";
import {Credentials} from "google-auth-library";
import {getUserData} from "../../services/auth/google-auth-service.ts";
import {useEffect, useState} from "react";
import config from "../../config.ts";

const OAuthRedirect = () => {
  const [queryParameters] = useSearchParams()
  const [code,setCode] = useState( queryParameters.get('code'))

  useEffect(() => {
    setCode(queryParameters.get('code'));
  }, [queryParameters]);
  const navigate=useNavigate()
  async function redirect () {
    console.log('code in redirect', code);
    if (code) {
      
      const tokens = await fetchRestEndpoint<Credentials>(`${config.externalAddress}/auth/google-auth/token?code=${code}`, "GET")
      console.log('tokens in redirect', tokens)
      if (!tokens || !tokens.access_token || !tokens.refresh_token || !tokens.id_token) {
        navigate("/Unauthorized");
      }
      console.log("setting tokens in redirect")
      sessionStorage.setItem('access_token', tokens!.access_token!);
      sessionStorage.setItem('id_token', tokens!.id_token!);
      localStorage.setItem('refresh_token', tokens!.refresh_token!);
      const userData = await getUserData(tokens!.access_token!);
      sessionStorage.setItem('username', userData!.name!)
      console.log('userData in redirect', userData)
      if (!userData) {

        navigate("/Unauthorized");
      }
      navigate("/profile")

    }
  }
    
  useEffect(() => {
      console.log('code', code);
      console.log('redirect', redirect);
      redirect();
    }, [code]);

  return (
      <div>Redirecting...</div>
  );
}
export default OAuthRedirect;