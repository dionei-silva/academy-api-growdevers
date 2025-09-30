import express from 'express'
import * as dotenv from 'dotenv'
import {growdevers} from "./dados.js"
import { randomUUID } from 'crypto'
import { blockGrowdeversNotRegistered, logMiddleware, logRequestMiddleware, showBodyMiddleware, validateGrowdeverMiddleware } from './middlewares.js'

import cors from 'cors'
dotenv.config()
// criar servidor do express, para criar rotas..
const app = express()
// usar json de entrada das requisições
app.use(express.json())
app.use(cors(
      /* //deixa so quem tu autoriza utilizar, protejendo a API
      origin: "",
      //e os metodos que a ela pode usar
      methods: ["GET", 'POST', 'PUT', 'PATCH'],
} */))
app.use(logMiddleware)

//Criar Rotas
//sintaxe criar rota
// GET http://localhost:3000/teste
//req > objeto que traz info de requisição, quem esta chamando a api
//res > guarda funcionalidades a responder as requisições
// GET /growdevers - Listar growdevers (api REST usa plural)
app.get("/growdevers", [logMiddleware, logRequestMiddleware] ,(req,res)=>{
      //filtro por idade por query
      const {idade, nome, email, email_includes} = req.query

      let dados = growdevers
      if(idade){
            dados = dados.filter(item => item.idade >= Number(idade))
      }
      if (nome) {
            dados = dados.filter(item => item.nome.includes(nome))
      }
      if (email_includes) {
            dados = dados.filter(item => item.email.includes(email_includes)) 
      }
      if (email) {
            dados = dados.filter(item => item.email === email) 
      }

      res.status(200).send({
            ok: true,
            mensagem: "Growdevers listados com sucesso",
            dados 
      })
})

app.post("/growdevers", [logMiddleware, validateGrowdeverMiddleware, showBodyMiddleware],(req,res)=>{
      try {
            // 1 - entrada (informações necessarias (ID nao pelo randomID)), a informação do cliente vem pelo body
            const body = req.body


            const novoGrowdever ={
                  id:randomUUID(),
                  nome: body.nome,
                  idade: body.idade,
                  email: body.email,
                  matriculado: body.matriculado
            }
            // 2 - processamento (adicionar o growdever ao final da lista)
            growdevers.push(novoGrowdever)
      
            // 3 - saida
            res.status(201).send({
                  ok: true,
                  mensagem: "Growdever criado com sucesso",
                  dados: growdevers
            }) 
      } catch (error) {
            console.log(error);
            res.status(500).send({
                  ok:false,
                  mensagem: error.toString()
            })
            
      }

})

//GET /growdevers/:id - obter growdever por id
app.get("/growdevers/:id", [logRequestMiddleware], (req, res) => {
// 1 entrada
      const {id} = req.params  
// 2 porocessamento
      const growdever = growdevers.find((item)=> item.id === id)
      if(!growdever) {
            return res.status(404).send({
                  ok:false,
                  mensagem: "Growdever nao encontrado"
            })
            
      }
      // 3 saida
      res.status(200).send({
            ok:true,
            mensagem: "Growdever buscado com sucesso",
            dados: growdever
      })
})

//PUT /growdevers/:id - atualizar um growdever especifico
app.put("/growdevers/:id", [validateGrowdeverMiddleware, blockGrowdeversNotRegistered], (req, res)=>{
      //1 entrada
      const {id} = req.params
      const {nome , email, idade, matriculado} = req.body
      
      //2 processamento
      const growdever = growdevers.find(item => item.id === id)
      if(!growdever){
            return res.status(404).send({
                  ok: false,
                  mensagem: "growdever nao encontrado"
            });
      };
      growdever.nome = nome
      growdever.email = email
      growdever.idade = idade
      growdever.matriculado = matriculado

      //3 saida
      res.status(200).send({
            ok: true,
            mensagem: "Growdever atualizado",
            dados: growdevers
      })
})

// PATCH /growdever/:id - toggle matriculado
app.patch("/growdevers/:id",(req , res)=>{
      //1 entrada
      const {id} = req.params
      //2 procesasmento
      const growdever = growdevers.find(item => item.id === id)
      if(!growdever){
            return res.status(404).send({
                  ok: false,
                  mensagem: "growdever nao encontrado (MATRICULA)"
            });
      };
      growdever.matriculado = !growdever.matriculado
      //3 saida
      res.status(200).send({
            ok: true,
            mensagem: "Growdever atualizado (matricula) com sucesso ",
            dados: growdevers
      })
})

//DELETE /growdever/:id  - deletar growdever
app.delete("/growdevers/:id", (req, res)=>{
      // entrada
      const {id} = req.params

      // processamento
      const growdeverIndex = growdevers.findIndex(item => item.id === id)
      if(growdeverIndex < 0){
            return res.status(404).send({
                  ok: false,
                  message: "Growdever nao encontrado (DELETADO)"
            })
      }
      growdevers.splice (growdeverIndex, 1)
      //saida
      res.status(200).send({
            ok: true,
            mensagem: "Growdever deletado com sucesso ",
            dados: growdevers
      })
})

//puxa a PORT da .env
const porta = process.env.PORT
//expoe a rota por uma porta do computador local
app.listen(porta, () => {
      console.log(`o Servidor esta executando na porta ${porta}`);
})
