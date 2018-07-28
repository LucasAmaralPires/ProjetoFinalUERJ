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
1. Interface Gráfica
   1. Revisão Geral
   1. Funcionalidades
      1. Aluno
      1. Turma
      1. Auditoria
   1. Diagramas
1. Considerações Finais

## 1. Introdução
  O sexto andar da UERJ passou a ter (conjuntos de) salas onde um aluno necessita tocar uma campainha para poder nelas ingressar. Isso, além de claramente atrapalhar o andamento da aula, demonstra a falta de cuidado em como tratar esses pequenos problemas.  
  
  Justamente o objetivo desse sistema é realizar um controle inteligente de acesso de pessoas sobre uma área (de uma ou mais salas) a partir da validação de cartões RFID ou de um número de matrícula (nesse projeto, matrícula da UERJ) a partir de um Arduino. Tem também uma interface gráfica capaz de adicionar, editar, deletar e visualizar informações, seja de pessoas ou de turmas.
  
  A ideia é de que seja um projeto modular - não é necessário ter todas as partes para funcionar - basta utilizar o que o usuário julgar necessário para uma determinada situação.
  
## 2. O Arduino
  O Arduino é um "uma plataforma de prototipagem eletrônica de hardware livre e de placa única, projetada com um microcontrolador" (Wikipedia).  
  
  Lura é compatível tanto com o Arduino Mega 2640 quanto com o Arduino Uno. Porém, quanto a este último, ele não é compatível com todos os módulos por ter limitações físicas.
  
  __*foto Arduino Uno e Arduino Mega 2640*__
  
  Junto com sensores, faz a interação com o usuário diretamente. Ele tem o direito de tanto passar o cartão ou digitar a matrícula para acessar a Sala e tem uma tela LCD e/ou uma luz LED para alertá-lo. Além disso, a comunicação entre Arduinos pode ser cabeado ou não com o módulo *wireless* (sem fio).
  
### Módulos
O Lura é um projeto modular, ou seja, pode-se fazer o projeto de acordo com os módulos de sua preferência. Existem módulos para inserir informações (teclado matricial e leitor de cartão RFID), para notificar o usuário o que está acontecendo (Tela LCD e LED 3 cores) e outros (como o Módulo Wireless ESP8266 para os Arduinos Vassalos comunicarem com o Arduino Mestre).

Com os módulos escolhidos, basta seguir a pinagem de acordo com os seguintes mapas de cada tipo de Arduino:

![Imagem Pinagem Arduino Mega](https://github.com/LucasAmaralPIres/ProjetoFinalUERJ/blob/master/Vers%C3%A3o%201.0/Imagem%20da%20pinagem%20-%20MEGA.png)
Imagem 1 - Pinagem de cada módulo quando utilizando um Arduino Mega 2460

![Imagem Pinagem Arduino Uno](https://github.com/LucasAmaralPIres/ProjetoFinalUERJ/blob/master/Vers%C3%A3o%201.0/Imagem%20da%20pinagem.png)
Imagem 2 - Pinagem de cada módulo quando utilizando um Arduino Uno (por ser limitado alguns módulos não são compatíveis com o Arduino Uno)

#### Teclado Matricial de 12 teclas
#### Leitor de cartão RFID
#### Tela LCD
#### LED de 3 Cores
#### Módulo Wireless ESP8266

### Instalação

  __*Ainda será desenvolvido essa parte, tanto para os Arduinos Vassalos quanto para o Arduino Mestre, além do computador que terá o banco de dados.*__

### Funcionalidades
  
  No Lura, os Arduinos Vassalos e o Arduino Mestre se comunicam de uma forma bem simples para que o computador faça todo o trabalho de consulta no Banco de Dados do Sistema. O usuário irá interagir apenas com o Arduino Vassalo (seja pelo Teclado Matricial ou pelo leitor de cartão RFID para inserir informações e receberá a resposta pela tela LCD ou pelo LED de 3 cores) de forma simples e prático.
  
  No Lura existe 3 perfis diferentes: Aluno, Professor e Administrador...
  
  __*ainda sendo realizado... Os próximos parágrafos são antigos.*__
  
  De uma maneira geral, a ideia do Lura é de que fique na entrada da(s) área(s) desejada(s) um Arduino (Vassalo) que faça comunicação com um outro Arduino (Mestre) que está conectado à um computador. Esse computador fará todas as consultas nos bancos de dados para validar as informações (como por exemplo uma matrícula) que vão sendo passadas no Arduino conectado à ele e dar uma resposta (como por exemplo abrir uma porta ou transmitir uma mensagem de erro).
  
  A funcionalidade principal é fornecer acesso para os usuários quando eles fornecerem as informações necessárias, mas há também outras funcionalidades como gerenciar presença, turmas e horários de aula.
  
  Existem no total 3 perfis no sistema: Aluno, Professor e Administrador. Alunos apenas tem acesso a sala. Professor tem acesso a lista de presença e de gerenciamento das turmas (Adicionar ou remover alunos de uma turma). Administradores tem o direito de mudar informações mais sensíveis do Lura (configurações gerais como horários de aula e gerenciamento da Área).
  
  Lura também conta com uma interface gráfica onde fica fácil dos professores e administradores gerenciarem e/ou visualizarem os alunos nas turmas de uma maneira rápida e básica.
  
  Caso queira também, o Professor pode em um Arduino Vassalo incluir Alunos no sistema
  
### Diagramas
  #### Casos de Uso
  
  __*Isso não participará do manual. No manual terá um jeito mais prático para o usuário ler*__
  
  UC01 - Acessar a Área (todos os perfis)
  1. Usuário insere a informação (ou digitando ou passando o cartão no leitor) no Arduino Vassalo, passando a informação para o Arduino Mestre.
  1. O Banco de Dados no Computador realiza a consulta para validar a informação solicitada (E01).
  1. A reposta de sucesso volta para o Arduino Vassalo. A luz LED fica verde e a tela LCD fica escrito "Acesso Liberado" por 5s.
  1. O Caso de Uso é Encerrado.
  
  E01 - Não está no sistema
  1. A informação dada não é encontrada no Banco de Dados.
  1. A resposta de falha volta para o Arduino Vassalo. A luz LED fica vermelha e a tela LCD fica escrito "Acesso Negado".
  1. Vá para UC01-4.
  
  UC02 - Modo Professor
  
  __*Desconsidere essa parte de Caso de Uso.*__
  
## 3. Interface Gráfica
O computador que está conectado ao Banco de Dados tem o direito de acessar pelo navegador da Web o sistema, podendo gerir sem maiores problemas.
__*Ainda sendo desenvolvido.*__

## 4. Considerações Finais
