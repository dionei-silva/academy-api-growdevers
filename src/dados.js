// Id usar identificador unico para nao gerar riscos, usar o randomUUID que tem na biblioteca node"
import {randomUUID} from 'crypto'
export const growdevers = [
      {
            id:randomUUID(),
            nome: "Dionei",
            idade: 33,
            email: 'dionei@hotmail.com',
            matriculado: true

      },
      {
            id:randomUUID(),
            nome: "Joao",
            idade: 22,
            email: 'joao@gmail.com',
            matriculado: false

      },
]