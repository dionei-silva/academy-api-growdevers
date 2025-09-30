import { growdevers } from "./dados.js";

export const logMiddleware = (req, res, next) => {
      console.log("Middleware");
      
      next()
}

export const logRequestMiddleware = (req, res, next) => {
      console.log(req.query);
      console.log(req.hostname);
      console.log(req.ip);
      console.log(req.body);

      next()   
}

export const validateGrowdeverMiddleware = (req, res, next) => {
      try {
            const body = req.body

            if (!body.nome) {
                  return res.status(400).send({
                        ok:false,
                        mensagem: "O campo nome nao foi informado"
                  })                  
            }
            if (!body.email) {
                  return res.status(400).send({
                        ok:false,
                        mensagem: "O campo email nao foi informado"
                  })                  
            }
            if (!body.idade) {
                  return res.status(400).send({
                        ok:false,
                        mensagem: "O campo idade nao foi informado"
                  })                  
            }
            
            next()
      } catch (error) {
            console.log(error);
            return res.status(500).send({
                  ok:false,
                  mensage: error.toString()
            })
            
      }
}
export const showBodyMiddleware = (req, res, next) => {
      try {
            const body = req.body

      console.log(body);
      next()
      } catch (error) {
            console.log(error);
            return res.status(500).send({
                  ok:false,
                  mensage: error.toString()
            })
            
      }
      
}

export const blockGrowdeversNotRegistered = (req, res, next) => {
      try {
            const {id} = req.params

            const growdever = growdevers.find(item => item.id === id)
            if(!growdever) {
                  return next()
            }
            
            if (!growdever.matriculado) {
                  return res.status(400).send({
                        ok:false,
                        mensagem: "Growdever nao matriculado nao pode realizar atualizações"
                  })
            }
            next()
      } catch (error) {
            console.log(error);
            return res.status(500).send({
                  ok:false,
                  mensage: error.toString()
            })
      }

}