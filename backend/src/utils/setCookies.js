const setCookies = (res, accessToken, accessTokenExp) => {
    const accessTokenMaxAge = (accessTokenExp - Math.floor(Date.now() / 1000)) * 1000;

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: accessTokenMaxAge,
        secure: true
    });

    res.cookie('isAuthenticated', true, {
        maxAge: accessTokenMaxAge,
        secure: false,
        httpOnly: false
    });
};

export default setCookies;