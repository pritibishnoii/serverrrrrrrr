<!-- @format -->

REGISTRATION/LOGIN
↓
Token Generate (JWT)
↓
Cookie me Store
↓
User ko Response

---

Protected Route Access
↓
Middleware (auth) Check
↓
Token Valid? → YES → req.user add → Next()
↓
NO → 401 Unauthorized
