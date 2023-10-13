
function isUser (req, res, next) {
    if (req.user?.email) {
        return next();
    }
    return res.status(401).render('error', { error: 'error de autenticación' });
}

function isAdmin(req, res, next) {
    const isAdmin = req.user?.role;
    if (isAdmin === "admin") {
        return next();
    }
    console.log("no es isAdmin")
    // return res.status(403).render('error', { error: 'error de autorización' })
    return res.status(403).render("invalidCredentials", { msg: "Ops! No tiene privilegios -debe ser admin- 😢" });

}

function isPremium(req, res, next) {
    const userRole = req.user?.role;
    console.log("premium en middleware", userRole);
    if (userRole === "premium") {
        console.log("premium is true");
        return next();
    } else {
    return res.status(403).json({ error: 'No tiene los privilegios para realizar esta operación' });
    
}
}

function isProductCreator(req, res, next) {
        const userRole = req.user?.role;
    
        if (userRole === "premium" || userRole === "admin") {
            console.log("Usuario premium o administrador.");
            return next();
        } else {
            console.log("No es usuario premium ni administrador.");
            return res.status(403).render("invalidCredentials", { msg: "Ops! No tiene privilegios para crear productos 😢" });
        }
    }

    function isUserOrPremium(req, res, next) {
        if (req.user.role === 'user' || req.user.role === 'premium') {
            return next();
        } else {
            return res.status(403).json({ error: 'No tiene los privilegios para realizar esta operación' });
        }
    }

module.exports = {
    isUser,
    isAdmin,
    isPremium,
    isProductCreator,
    isUserOrPremium
  };
