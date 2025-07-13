export const getLogin = (req, res) => {
    res.render("login", {
        pageTitle: "Login",
        path: "/login",
    });
};

const authUtils = { getLogin };

export default authUtils;