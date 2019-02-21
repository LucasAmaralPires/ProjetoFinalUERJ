# ToDo WebServer do Lura
Esse arquivo tem o intuito de mostrar o que falta para ser realizado no Web server do Lura (tanto BackEnd quanto FrontEnd). Todas as pendencias sao de responsabilidade do Rafael Najjar(@kyros200).

### Minimamente importante
* [X] Colocar toastr.js e toastr.css no projeto (foi colocado tmb iconic, blockUI e bootbox.js)
* [X] Adaptar no banco de dados as tabelas de Student e Teacher para colocar ***Exclusão Lógica***
* [X] Error Handling no Back End e nao so se basear no front.
* [ ] Fazer um arquivo css para estilizar a base toda do server (lura.css). Ja coloquei algumas classes vazias nas div's
* [X] Apenas aparecer a div de paginacao quando tiver mais de uma pagina
* [ ] Praticamente todos os campos serem apenas alfanumericos (nao deixar caracteres especiais)
* [ ] Mudar a imagem do Layout do DB que se encontra na pasta /Diagramas na root do repositorio. Esta errada na parte do Attendence e Lecture.
* [X] Certificar que ao deletar uma entidade (Student, Teacher, Classroom e Schedule) deletar ela em todas as Class ligadas.
* [X] Certificar que ao deletar uma Materia (Subject) deletar ela em todas as Turmas (Class) ligadas (uma nest de mysql.execute())
* [X] Ao deletar uma entidade (Student, Teacher, Classroom, Schedule, Subject) deixar bem claro ao usuario que ao apagar ira apagar todas as turmas referentes a essa entidade.

### Entidades
* Student
  * StudentController.js - Fazer e implementar as requests
    * [X] /getAll - (GET) Pegar todos ***(Adaptar a Exlusão Lógica)***
    * [X] /getFilter - (POST) Pegar todos de acordo com o filtro
    * [X] /get/:id - (GET) Pegar um unico de acordo com id
    * [X] /save - (POST) A partir da form preenchida salvar/atualizar um (novo) registro no banco
    * [X] /delete/:id - (POST) A partir de id, deletar ***(Exclusão lógica!!!)***
  * Static
    * main.html
      * [X] div do filtro com ambos os campos (nome, matricula e card)
      * [X] Table mostrando todos (ou paginado?) os Estudantes (Nome, Matricula, cartao(boolean), editar, deletar)
      * [X] Botao para inserir (abrir a modal)
      * [X] Modal com a form para inserir/editar
	  * [X] Paginacao de maneira facil e intuitiva (alem de bonita).
	  * [X] Titulo da Modal diferente ao estar inserindo e ao estar editando.
    * Student.js
      * [X] Funcao de abrir a modal que recebe o id. caso nao receba nada esta inserindo, senao esta editando.
      * [X] Funcao de apagar todos os campos da modal toda vez que abrir a modal
      * [X] Colocar um toastr para qualquer ação realizada (inserir, editar, deletar, erro)
      * [X] Funcao de validacao para certificar que nao pode ter dois Students com mesma matricula/cartao
	  * [X] Paginacao Funcional. Para isso tem que adaptar todo resultado.
  * Outros
    * [X] Uma tela para dizer todas as turmas (Class) na qual ele participa.
	* [	] Conseguir ver a presenca de um Student (Attendence).

* Teacher
  * [X] Replicar Student e adaptar
  * [X] Uma tela (modal provavelmente) para ver quais turmas o professor participa

* Subject
  * [X] Replicar CRUD generico e adaptar
  * [X] Uma tela (modal provavelmente) para ver quais turmas sao da materia (acho que isso nao faz sentido...)

* Classroom
  * [X] Replicar CRUD generico e adaptar
  * [X] Uma tela (modal provavelmente) para ver as proximas aulas (lectures) que tera na sala de aula
  
* Schedule
  * [X] Replicar CRUD generico e adaptar
  * [X] Na busca, inves de ser especifico a hora inicio e hora fim, tem que ser numa range (De...Ate).
  
* Class
  * [X] Esperar fazer todos os anteriores (para conseguir fazer os selects de cada entidade)
  * [X] Fazer um select para cada entidade para conseguir fazer o CRUD (talvez o /getAll finalmente seja utilizado assim)
  * [X] Fazer uma tela separada para ver a Class (ou fazer numa modal mesmo?)
  * [ ] Colocar validacao do CRUD no comeco. Esta dando para fazer duas Class iguais.
  * [ ] Depois de Lecture criado, colocar na modal de insert uma data inicio e fim para criar Lectures ao criar uma turma.
  
* Lecture
  * [ ] Replicar CRUD generico e adaptar
  * [ ] No filtro ir colocando passo a passo: primeiro pergunta a materia (Subject) e depois se quiser pode filtrar por Num Class. Independente disso pode filtrar por pegar coisas passadas ou nao.
  * [ ] (VERY HARD) Ao criar uma turma (Class), criar no banco todas as aulas (Lecture) do semestre (seria dito provavelmente na modal da Class uma data inicio e uma data fim. Depois iria criar de acordo com a schedule.)
  
* Attendence
  * Esperar fazer Lecture
  * [ ] Botar na tela das aulas (Lecture) as attendences de todos os alunos nas aulas PASSADAS.

### Backend
* [ ] Deixar mais claro e mais direto o arquivo config.js na pasta MySQL para o usuário poder editar
