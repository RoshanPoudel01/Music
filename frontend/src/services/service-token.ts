export interface TokenDetails {
  token: string;
  expiresIn: number;
}

function setToken(token: TokenDetails) {
  try {
    const tokenWithExpiry = {
      token: token.token,
      expiresIn: token.expiresIn,
    };
    localStorage.setItem("token", JSON.stringify(tokenWithExpiry));
  } catch (e) {
    console.error("Error storing token", e);
  }
}

function getToken() {
  try {
    const tokenDetails = localStorage.getItem("token");
    if (!tokenDetails) return null;

    const tokenWithExpiry: TokenDetails = JSON.parse(tokenDetails);

    if (Date.now() > tokenWithExpiry.expiresIn) {
      localStorage.removeItem("token");
      return null;
    }

    return {
      token: tokenWithExpiry.token,
      expiresIn: tokenWithExpiry.expiresIn,
    } as TokenDetails;
  } catch (e) {
    console.error("Error getting token", e);
    return null;
  }
}

function isAuthenticated() {
  const tokenDetails = getToken();
  if (!tokenDetails) return false;
  if (tokenDetails?.expiresIn > Date.now()) {
    return true;
  } else {
    return false;
  }
}

function clearToken() {
  localStorage.removeItem("token");
}

const TokenService = {
  setToken,
  getToken,
  isAuthenticated,
  clearToken,
};

export default TokenService;
