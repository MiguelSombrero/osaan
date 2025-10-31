export async function tokenMiddleware(req, res, next) {
  const accessToken = req.oidc?.accessToken;

  try {
    if (accessToken?.isExpired?.()) {
      await accessToken.refresh();
    }
  } catch (err) {
    console.error('[TokenMiddleware] Token refresh failed:', err.message);
    return res.redirect('/api/login');
  }

  next();
}
