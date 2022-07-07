import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import jwtDecode from 'jwt-decode';
import jose from 'node-jose'
import { useStyletron } from 'baseui';
import { useGraphQL } from 'GraphQLContext';

const AuthContext = createContext(null);

const AuthContextProvider = (props) => {
    const [authState, setAuthState] = useState(null);
    const [css] = useStyletron();
    const client = useGraphQL();
    const handleResponse = useCallback((response) => {
        console.log("Heere")
        localStorage.setItem('jwt', JSON.stringify(response.credential));
        handleJwt(response.credential);
    }, []);
    useEffect(() => {
        const localJwt = localStorage.getItem('jwt');
        if (localJwt === null) {
            console.log("Yes")
            window.onload = () => {
                window.google.accounts.id.initialize({
                    client_id: '998489893358-sgf7c6q4b74thgtp74phn8kv5dkraag3.apps.googleusercontent.com',
                    callback: handleResponse,
                });
                window.google.accounts.id.renderButton(
                    document.getElementById("google-signin-div"),
                    { theme: 'outline', size: 'large' },
                );
                window.google.accounts.id.prompt();
            };
        } else {
            handleJwt(localJwt);
        }
    }, []);
    const generateJwt = (decodedJwt) => {
        // Header
        var oHeader = { alg: 'HS256', typ: 'JWT' };
        // Payload
        var tNow = KJUR.jws.IntDate.get('now');
        var tEnd = KJUR.jws.IntDate.get('now + 1day');
        const oPayload = {
            "sub": "1234567890",
            "name": "John Doe",
            "iat": 1516239022,
            "email": decodedJwt.email,
        }
        // Sign JWT, password=616161
        var sHeader = JSON.stringify(oHeader);
        var sPayload = JSON.stringify(oPayload);
        var sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, {b64: ""});
        return sJWT;
    }
    const handleJwt = (jwt) => {
        const formattedJwt1 = jwt.replace('"', "");
        const formattedJwt = formattedJwt1.replace('"', "");
        const decodedJwt = jwtDecode(formattedJwt);
        setAuthState(decodedJwt);
        const generatedJwt = generateJwt(decodedJwt);
        client.setHeader('Authorization', `Bearer ${generatedJwt}`);
        // client.setHeader('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJlbWFpbCI6Im1hcml1cy5oYWJlcnN0b2NrQHBleG9uLWNvbnN1bHRpbmcuZGUifQ.Ef1K_T3lIA_a5CZe8eZcvxVA3-3WPCKY7i5BGFnokCU`);
    };
    const child = authState === null ? <div className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh'
    })} id="google-signin-div" /> : props.children;
    return (
        <AuthContext.Provider value={authState}>
            {child}
        </AuthContext.Provider>
    );
};

const useAuthContext = () => useContext(AuthContext);

export { AuthContextProvider, useAuthContext };
