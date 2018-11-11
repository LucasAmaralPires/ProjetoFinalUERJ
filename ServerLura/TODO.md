# ToDo WebServer do Lura
Esse arquivo tem o intuito de mostrar o que falta para ser realizado no Web server do Lura. Todas as pendencias sao de responsabilidade do Rafael Najjar(@kyros200).

### Minimamente importante
* [X] Colocar toastr.js e toastr.css no projeto (foi colocado tmb iconic, blockUI e bootbox.js)
* [X] Adaptar no banco de dados as tabelas de Student e Teacher para colocar ***Exclusão Lógica***

### Entidades
* Student
  * StudentController.js - Fazer e implementar as requests
    * [X] /getAll - (GET) Pegar todos ***(Adaptar a Exlusão Lógica)***
    * [ ] /getByFilter - (POST) Pegar todos de acordo com o filtro
    * [X] /get/:id - (GET) Pegar um unico de acordo com id
    * [ ] /save - (POST) A partir da form preenchida salvar (ou realizar update) no banco
    * [X] /delete/:id - (POST) A partir de id, deletar ***(Exclusão lógica!!!)***
  * Static
    * main.html
      * [ ] div do filtro com ambos os campos (nome, matricula)
      * [X] Table mostrando todos (ou paginado?) os Estudantes (Nome, Matricula, cartao(boolean), editar, deletar)
      * [X] Botao para inserir (abrir a modal)
      * [ ] Modal com a form para inserir/editar
    * Student.js
      * [X] Funcao de abrir a modal que recebe o id. caso nao receba nada esta inserindo, senao esta editando.
      * [ ] Funcao de apagar todos os campos da modal toda vez que abrir a modal
      * [ ] Colocar um toastr para qualquer ação realizada (inserir, editar, deletar, erro)
      * [ ] Funcao de validacao para certificar que nao pode ter dois Students com mesma matricula/cartao
  * Outros
    * [ ] Uma tela para dizer todas as turmas (Class) na qual ele participa, alem de ver a presenca dele (Attendence). Seria acessavel no proprio CRUD. Isso so seria feito depois de ter feito todos os outros CRUDs, claro.

* Teacher
  * TeacherController.js - Fazer e implementar as requests
    * [ ] /getAll - (GET) Pegar todos ***(Não esquecer a Exlusão Lógica)***
    * [ ] /getByFilter - (POST) Pegar todos de acordo com o filtro
    * [ ] /get/:id - (GET) Pegar um unico de acordo com id
    * [ ] /save - (POST) A partir da form preenchida salvar no banco
    * [ ] /delete/:id - (POST) A partir de id, deletar ***(Exclusão lógica!!!)***
  * Static
    * .html
      * [ ] div do filtro com ambos os campos (nome, matricula)
      * [ ] Table mostrando todos (ou paginado?) os Estudantes (Nome, Matricula, cartao, editar, deletar)
      * [ ] Botao para inserir
      * [ ] Modal com a form para inserir/editar
    * .js
      * [ ] Funcao de abrir a modal que recebe o id. caso nao receba nada esta inserindo, senao esta editando.
      * [ ] Funcao de apagar todos os campos da modal toda vez que abrir a modal
      * [ ] Colocar um toastr para qualquer ação realizada (inserir, editar, deletar, erro)

* Subject
  * Esperar fazer Student e Teacher

* Classroom
  * Esperar fazer Student e Teacher
  
* Schedule
  * Esperar fazer Student e Teacher
  
* Class
  * Esperar fazer todos os anteriores
  
* Lecture
  * Esperar fazer Class
  
* Attendence
  * Esperar fazer Lecture

### Backend
* [ ] Deixar mais claro e mais direto o arquivo config.js na pasta MySQL para o usuário poder editar
