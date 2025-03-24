In **NextAuth.js**, the `callbacks` object has both `session` and `jwt` callbacks, each serving a distinct purpose.  

---

### **1️⃣ `jwt` Callback → Runs when the JWT is created or updated**
- This callback **stores** the user's data inside the JWT token.
- Runs when a user **signs in** or **refreshes the token**.
- The `user` object is only available when the user logs in. On subsequent requests, the `token` is used.

#### **Example Flow**:
1. User logs in → `user` object is returned from the database.
2. `jwt` callback adds `user` details to the JWT.
3. JWT is stored (e.g., in a cookie for session storage).

```ts
async jwt({ token, user }) {
    if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.isAcceptingMessages = user.isAcceptingMessages;
    }
    return token;  // This token is stored in the session cookie
}
```

---

### **2️⃣ `session` Callback → Runs when session data is accessed**
- This callback **modifies** the session object that is sent to the client.
- Runs **every time** `useSession()` or `getSession()` is called on the client.
- Uses data from the `token` (not `user`, since user data is only available on login).

#### **Example Flow**:
1. Client calls `useSession()` or `getSession()`.
2. NextAuth fetches the JWT, then calls `session()` callback.
3. `session()` reads the JWT and **modifies the session object** before returning it to the client.

```ts
async session({ session, user }) {
    if (user) {
        session.user._id = user._id?.toString();
        session.user.isVerified = user.isVerified;
        session.user.username = user.username;
        session.user.isAcceptingMessages = user.isAcceptingMessages;
    }
    return session; // This is sent to the client
}
```

---

### **Summary: How Are They Different?**
| Callback | When It Runs | Purpose | Input Data | Output |
|----------|------------|---------|------------|--------|
| **`jwt`** | On login & token refresh | Stores user data inside JWT | `user` (on login) or `token` | Updated JWT |
| **`session`** | Every time `useSession()` or `getSession()` is called | Modifies session object before sending to client | `token` | Updated session |

### **Key Takeaway**  
- The **JWT callback** modifies the token stored on the backend.  
- The **Session callback** modifies the session sent to the frontend.  
- **Without a session callback**, only default session data (email, name, image) would be sent to the client.

------------------------------------------------------------------------------------------
The reason you need **both** `jwt` and `session` callbacks in NextAuth.js is because they serve different roles in maintaining **secure, stateless authentication** while also providing the necessary data to the frontend.  

### **Why Do You Need Both?**
- **The `jwt` callback** ensures that the user's data is securely stored inside a JWT token (on the backend).
- **The `session` callback** extracts data from the token and sends only the necessary information to the frontend.

---

### **1️⃣ `jwt` Callback → Stores User Data in the Token (Backend)**
- Runs **when a user logs in** or **on token refresh**.
- Saves user data inside the JWT, which is stored in a cookie (or session storage).
- The frontend **does not have direct access** to the JWT token.

**Example: Storing user info in JWT**
```ts
async jwt({ token, user }) {
    if (user) {
        token._id = user._id;
        token.username = user.username;
        token.isVerified = user.isVerified;
    }
    return token;
}
```
✅ **Why?** This ensures that the user's authentication details persist across requests **without needing a database lookup**.

---

### **2️⃣ `session` Callback → Sends Data to the Frontend**
- Runs **every time** `useSession()` or `getSession()` is called in the frontend.
- Reads user data from the JWT **and modifies the session object** before sending it to the frontend.

**Example: Passing token data to the frontend session**
```ts
async session({ session, token }) {
    if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
    }
    return session;
}
```
✅ **Why?** This ensures the frontend receives only the required user data (not the full JWT), improving security and performance.

---

### **🔹 Why Not Just Use JWT?**
- The frontend **should not have direct access** to the JWT for security reasons.
- Instead, it only gets a **safe, filtered session object** via the `session` callback.

### **🔹 Why Not Just Use Session?**
- The session callback does not store data permanently. Without the JWT callback, session data would be lost after login.

---

### **🔑 TL;DR**
| Callback  | Runs When | Purpose | Stores Data? | Used By |
|-----------|----------|---------|-------------|---------|
| **`jwt`** | Login, token refresh | Saves user data inside the JWT | ✅ Yes (in JWT) | Backend |
| **`session`** | `useSession()`, `getSession()` | Extracts & sends user data to frontend | ❌ No (just modifies response) | Frontend |

### **📌 Final Answer**
You need both because:  
1. **JWT stores user data securely in a token (backend)**  
2. **Session sends only necessary user info to the frontend (safer, lighter response)**  

This makes authentication **stateless, secure, and efficient** in Next.js. 🚀
------------------------------------------------------------------------------------------
