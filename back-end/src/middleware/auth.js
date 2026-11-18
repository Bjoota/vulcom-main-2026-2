import jwt from 'jsonwebtoken'

const bypassRoutes = [
 { url: '/users/login', method: 'POST' },
]

export default function(req, res, next) {
 for(let route of bypassRoutes) {
   if(route.url === req.url && route.method == req.method) {
     next()
     return
   }
 }

 let token
 // 1. Procura primeiro no cookie
 token = req.cookies[process.env.AUTH_COOKIE_NAME]

 if(! token) {
   // 2. Se não achar, procura no cabeçalho (para clientes HTTP)
   const authHeader = req.headers['authorization']
   console.log({authHeader})

   if(! authHeader) {
     console.error('ERRO DE AUTORIZAÇÃO: falta de cabeçalho')
     return res.status(403).end()
   }
   token = authHeader.split(' ')[1]
 }

 jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
   if(error) {
     console.error('ERRO DE AUTORIZAÇÃO: token inválido ou expirado')
     return res.status(403).end()
   }
   req.authUser = user
   next() 
 })
}