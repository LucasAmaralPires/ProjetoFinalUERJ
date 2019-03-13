# Manual do Projeto Final - Lura
Um projeto de Lucas d'Amaral (@LucasAmaralPIres) e Rafael Najjar (@kyros200).

__*O manual ainda está sendo desenvolvido. Ele tem como objetivo tirar todas as dúvidas dos usuários que usarão o Lura*__

## 0. Índice
1. Introdução
1. O Arduino
   1. Módulos
      1. Teclado Matricial de 12 teclas
      1. Leitor de cartão RFID
      1. Tela LCD
      1. LED de 3 Cores
      1. Módulo Wireless ESP8266
1. Instalação
1. Funcionalidades
1. Interface Gráfica do Lura
   1. Revisão Geral
   1. Setup
   1. Funcionalidades

## 1. Introdução
  O sexto andar da UERJ passou a ter (conjuntos de) salas onde um aluno necessita tocar uma campainha para poder nelas ingressar. Isso, além de claramente atrapalhar o andamento da aula, demonstra a falta de cuidado em como tratar esses pequenos problemas.  
  
  O objetivo desse sistema é realizar um controle inteligente de acesso de pessoas sobre uma área (de uma ou mais salas) a partir da validação de cartões RFID ou de um número de matrícula (nesse projeto, matrícula da UERJ) a partir de um Arduino. Tem também uma interface gráfica capaz de adicionar, editar, deletar e visualizar informações, seja de pessoas ou de turmas.
  
  O Manual sera separado em duas partes principais: A parte do Arduino e seus sensores e a outra parte o web server.
  
## 2. O Arduino
  O Arduino é um "uma plataforma de prototipagem eletrônica de hardware livre e de placa única, projetada com um microcontrolador" (Wikipedia).  
  
  Lura é compatível apenas com o Arduino Mega 2560 (Arduino Uno pode ser utilizado opcionalmente como Arduino Mestre).
  
  __*foto Arduino Mega 2560*__
  
  Junto com sensores, faz a interação com o usuário diretamente. Ele tem o direito de tanto passar o cartão ou digitar a matrícula para acessar a Sala e tem uma tela LCD e/ou uma luz LED para alertá-lo.
  
### Módulos
O Lura é um projeto modular, ou seja, pode-se fazer o projeto de acordo com os módulos de sua preferência. Existem módulos para inserir informações (teclado matricial e leitor de cartão RFID) e para notificar o usuário o que está acontecendo (Tela LCD e LED 3 cores). O único módulo obrigatório é o Módulo Wireless nrf24l01 para os Arduinos Vassalos comunicarem com o Arduino Mestre.

Com os módulos escolhidos, basta seguir a pinagem de acordo com os seguintes mapas de cada tipo de Arduino:

![Imagem Pinagem Arduino Mega](https://github.com/LucasAmaralPIres/ProjetoFinalUERJ/blob/master/Vers%C3%A3o%201.0/Imagem%20da%20pinagem%20-%20MEGA.png)
Imagem 1 - Pinagem de cada módulo quando utilizando um Arduino Mega 2560

__*Imagem da pinagem do Arduino Uno caso queira usar ele como Arduino Mestre*__

#### Teclado Matricial de 12 teclas

   __*Imagem do Teclado Matricial*__
   
   Com o teclado Matricial, o usuário pode colocar a matrícula manualmente para realizar as operações desejadas.
   
#### Leitor de cartão RFID
   
   __*Imagem do Leitor de cartão RFID*__
   
   Com o Leitor de cartão, com um simples passo já é possível realizar as requisições no banco de dados.
   
#### Tela LCD

   __*Imagem do Tela LCD*__
   
   Com a tela LCD, o usuário poderá ler de forma clara o que está acontecendo com o Lura.
   
#### LED de 3 Cores

   __*Imagem do LED de 3 Cores*__
   
   Com o LED de 3 cores, o usuário pode perceber com o sinal de cores o que está acontecendo.
   
#### Módulo Wireless ESP8266

   __*Imagem do Módulo Wireless ESP8266*__
   
   O único módulo obrigatório, é necessário para estabelecer a comunicação dos Arduinos Vassalos com o Arduino Mestre.
   
## 3. Instalação

  __*Ainda será desenvolvido essa parte, tanto para os Arduinos Vassalos quanto para o Arduino Mestre, além do computador que terá o banco de dados.*__

## 4. Funcionalidades
  
  No Lura, os Arduinos Vassalos e o Arduino Mestre se comunicam de uma forma bem simples para que o computador faça todo o trabalho de consulta no Banco de Dados do Sistema. O usuário irá interagir apenas com os Arduinos Vassalos (seja pelo Teclado Matricial ou pelo leitor de cartão RFID para inserir informações e receberá a resposta pela tela LCD ou pelo LED de 3 cores) de forma simples e prático.
  
  No Lura existe 3 perfis de usuários diferentes: Aluno, Professor e Administrador.
  * Aluno: São aqueles que tem o direito de entrar nas salas. Apenas inserindo a matrícula e estando na hora correta da aula, podem entrar nas salas.
  * Professor: Além de fazer tudo que os Alunos fazem, é responsável por gerenciar os alunos nas turmas (adicionando ou removendo eles). Tem acesso na Interface Gráfica para poder gerenciar com maior facilidade.
  * Administrador: Além de fazer tudo que os Professores fazem, os Administradores são capazes de gerenciar informações vitais para o sistema, como definição de salas e Professores.
  
  A seguir algumas funcionalidades que o Lura oferece com os Arduinos Vassalos (aqueles que interagem diretamente com os usuários):
  
  ### Abrir porta
  A funcionalidade principal do Lura é a permissão de entrar nas salas: ao passar a matrícula do Usuário no Arduino Vassalo, ele comunica com o Banco de Dados (a partir do Arduino Mestre) para validar se pode entrar: Alunos só entram se estiverem na turma que terá aula no horário; Professores poderão entrar nas salas que dão aula; e os Administradores tem livre acesso (além de poderem dar acesso especial a Usuários).
  
  Ao inserir a informação no Arduino, caso seja validado corretamente a tela LCD ficará escrito "ACESSO LIBERADO" e a luz LED ficará verde e acesa por cinco segundos. Caso não consiga validar, estará escrito na tela LCD "ACESSO NEGADO" e a luz LED ficará vermelha. 
  
  ### Modo Professor
  De uma maneira prática e fácil o Professor pode no Arduino Vassalo registrar ou apagar alunos na turma que ele gerencia, para que não seja necessário que ele tenha que ir na Interface Gráfica resolver a questão.
  
  Ao apertar * no teclado, o Arduino entra no "Modo Professor" e a luz LED fica Azul. Primeiro, é necessário validar que é um Professor primeiro (aparecerá a mensagem "PROFESSOR CONFIRMADO" e o LED ficará verde) para realizar as ações possíveis no Modo Professor. Depois, é necessário ou digitar a matrícula ou passar um cartão. Caso o Aluno:
  * Não exista no sistema Lura: Um novo Aluno é criado e é colocado na turma atual.
  * Exista no sistema Lura e não estiver na turma: o Aluno é inserido na turma.
  * Exista no sistema Lura e estiver na turma: o Aluno é removido da turma.
  
  __*ainda sendo realizado...*__
  
## 5. Interface Gráfica do Lura

### Revisão Geral
O computador que está conectado ao Banco de Dados tem o direito de acessar pelo navegador da Web o Sistema Lura, podendo gerir de uma forma simples e direta. O site é destinado principalmente aos professores e administradores do sistema.

### Setup
É necessário alguns passos para fazer o Site do Lura funcionar.

Primeiro é preciso instalar no computador Node.js. [(Link)](https://nodejs.org/en/download/ "Download Node.js") 

Também é preciso instalar e configurar o MySql. [(Windows)](https://dev.mysql.com/downloads/windows/ "Download Mysql no Windows") [(Linux)](https://dev.mysql.com/doc/mysql-apt-repo-quick-guide/en/ "Download Mysql no Linux")

Ao dar clone no [Repositório](https://github.com/LucasAmaralPIres/ProjetoFinalUERJ/ "Link para o Repositório do GitHub"), basta acessar o arquivo __*/ServerLura/backend/MySql/config.js*__ e mudar a configuração de usuário e senha do MySQL.

![Imagem Exemplo config.js]()

Além disso, basta no MySql executar o script __*/Diagramas/DBscript.sql*__

![Imagem Executando DBscript.sql]()

Depois disso, basta na pasta __*/ServerLura/*__ abrir o prompt de comando e escrever __*"node server.js"*__ para inicializar o Site do Lura. Irá estar escrito "Server Started. Go to 'localhost:8080' in your browser".

![Imagem Executando node server.js]()

### Telas CRUDs

O Site disponibiliza aos professores e administradores da rede a possibilidade de gerenciar as Turmas que existem no sistema, mexendo em todos os aspectos da Turma. São eles:

1. Alunos
1. Professores
1. Salas
1. Matéria
1. Horários

Para cada aspecto da Turma existe uma tela na qual o usuário pode Ver, Criar, Editar e Deletar (*chamada de CRUD: Create, Read, Update and Delete*) essas entidades.

![Imagem Exemplo CRUD de Estudante]()

Todas as telas CRUD no sistema Lura têm:
 
  * Um campo para filtrar a tabela de resultados;
  * Uma tabela com a lista de resultados da busca, com as principais informações da entidade com botões para editar, deletar e ver mais;
  * Um campo de paginação para ficar navegando entre as páginas de resultado (caso tenha mais de uma página);
  * Um botão que leva a uma nova janela para criar uma instância nova da entidade.

### Tela da Turma

A tela da Turma é uma tela CRUD, porém por ser mais complexa existe um botão que direciona para a tela da Turma, onde você pode incluir ou apagar Alunos, Professores, Salas de aula e Horários.

![Imagem Exemplo CRUD de Turma]()

![Imagem Exemplo Tela da Turma]()

Particularmente na parte dos Alunos, é possível verificar a presença deles **para as Aulas que já aconteceram**.

![Imagem Exemplo Presença de um Aluno na Turma]()

É possível na tela da Turma no botão "Criar aulas". Ao aparecer uma janela, basta dizer quando quer as aulas entre duas datas. Feito isso será criado aulas durante todo o período definido.

![Imagem Exemplo Criar Aulas para a Turma]()

### CRUD da Aula

Nessa tela mostrará todas as aulas cadastradas no Lura. Na tela da Turma é possível já criar uma massa de aulas para maior praticidade do professor, porém é possível criar uma Aula selecionando uma matéria e logo depois a turma. Perceba que só é possível criar a Aula caso a data esteja de acordo com os horários da turma (Ex: Não é possível criar uma Aula na Quinta-feira quando a turma tem aula às segundas e quartas).

![Imagem Exemplo Criando uma Aula]()

As aulas que **já passaram** têm a possibilidade de ver a Presença dos Alunos.

![Imagem Exemplo Presença dos Alunos em uma Aula]()

### Conclusão e Futuro

O Site foi feito principalmente para funcionar junto com a parte principal do Lura: Possibilitar que os alunos entrem na sala de aula de uma maneira mais conveniente e que faça a presença automaticamente.

O Site por si só tenta ser o mais direto para os usuários para poderem gerir as Turmas, porém existem melhorias possíveis que poderiam ser feitos para melhorar a consistência e facilidade do Sistema como um todo.