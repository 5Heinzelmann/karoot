1. **Use Server Components by default.**
2. **Only use Client Components when necessary.**
3. **Use a Client Component if you need `useState`, `useEffect`, or `useContext`.**
4. **Mark a file with `'use client'` at the top if it is a Client Component.**
5. **Client Components can import only other Client Components or shared code.**
6. **Do not use server-only functions (e.g. `fetch` or server actions) in Client Components.**
7. **Use Server Components for data fetching.**
8. **Server Components can import both Server and Client Components.**
9. **Avoid passing large data from Server to Client if not needed.**
10. **Put `'use client'` at the top of a file to mark it as a Client Component.**
11. **Do not mix `'use client'` and `'use server'` in the same file.**
12. **Files without `'use client'` are treated as Server Components.**
13. **Minimize the number of Client Components.**
14. **Avoid lifting state to Client Components unless necessary.**
15. **Use context only in Client Components if needed.**