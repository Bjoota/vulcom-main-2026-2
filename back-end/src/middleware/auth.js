import jwt from 'jsonwebtoken'

const bypassRoutes = [
 { url: '/users/login', method: 'POST' },
]

// Função do middleware
export default function(req, res, next) {
 for(let route of bypassRoutes) {
   if(route.url === req.url && route.method == req.method) {
     next()
     return
   }
 }

 let token
 const authHeader = req.headers['authorization']

 console.log({authHeader})

 if(! authHeader) {
   console.error('ERRO DE AUTORIZAÇÃO: falta de cabeçalho')
   return res.status(403).end()
 }

 token = authHeader.split(' ')[1]

 jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
   if(error) {
     console.error('ERRO DE AUTORIZAÇÃO: token inválido ou expirado')
     return res.status(403).end()
   }

   req.authUser = user
   next() 
 })
}