➡️ requisitos funcionais: 
- [x] Deve ser possível criar um usuário
- [x] Deve ser possível identificar o usuário entre as requisições
- [x] Deve ser possível registrar uma refeição feita, com as seguintes informações (as refeições devem ser relacionadas a um usuário):
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta
- [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [x] Deve ser possível apagar uma refeição
- [x] Deve ser possível listar todas as refeições de um usuário
- [x] Deve ser possível visualizar uma única refeição
- [x] Deve ser possível recuperar as métricas de um usuário
    - Quantidade total de refeições registradas
    - Quantidade total de refeições dentro da dieta
    - Quantidade total de refeições fora da dieta
    - Melhor sequência por dia de refeições dentro da dieta
- [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

➡️ regras de negócio: 
- [x] se o usuário tentar criar uma conta, deve ser possível o usuário criar essa conta
- [x] ao o usuário fazer requisições, deve ser possível identificarmos o usuário entre as requisições 
- [x] se o usuário tentar listar refeições, usuário só pode visualizar refeições que ele criou
- [x] se o usuário tentar editar os dados de uma determinada refeição, deve ser possível editar uma determinada refeição pelo id dela