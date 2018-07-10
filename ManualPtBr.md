# Manual do Projeto Final - Lura
Um projeto de Lucas d'Amaral (@LucasAmaralPIres) e Rafael Najjar (@kyros200).

__*O manual ainda está sendo desenvolvido.*__

## 0. Conteúdo
1. Introdução
1. O Arduino
   1. Componentes
   1. Funcionalidades
   1. Diagramas
1. Interface Gráfica
   1. Revisão Geral
   1. Funcionalidades
      1. Aluno
      1. Turma
      1. Auditoria
   1. Diagramas
1. Considerações Finais

## 1. Introdução
  O sexto andar da UERJ começou a ter (conjuntos de) salas onde o aluno tinha que tocar uma campainha para obter acesso à sala. Isso, além de claramente atrapalhar o andamento da aula, demonstra a falta de atenção em ter salas como essa.  
  
  O objetivo desse sistema é realizar um controle inteligente de acesso de pessoas sobre uma área (uma ou mais salas) a partir da validação de cartões RFID ou de um número de matrícula (nesse projeto, matrícula da UERJ) a partir de um Arduino. Tem também uma interface gráfica capaz de adicionar, editar, deletar e visualizar informações, seja de pessoas ou de turmas.
  
  A ideia é de que seja um projeto modular - não é necessário ter todas as partes para funcionar - basta utilizar o que julgar necessário para a situação.
  
## 2. O Arduino
  O Arduino é um "uma plataforma de prototipagem eletrônica de hardware livre e de placa única, projetada com um microcontrolador" (Wikipedia).  
  
  __*foto Arduino*__
  
  Junto com sensores, faz a interação com o usuário diretamente. Ele tem o direito de tanto passar o cartão ou digitar a matrícula para acessar a Sala e tem uma tela LCD e/ou uma luz LED para alertá-lo. Além disso, a comunicação entre Arduinos pode ser cabeado ou não com o módulo *wireless* (sem fio).
  
### Componentes
Esta lista conta com todos os componentes de todos os módulos do projeto.  
- Arduino Mega 2640 ou Arduino Uno
- Teclado Matricial de 12 teclas
- Leitor de Cartão RFID
- Tela LCD
- LED de 3 cores
- Módulo Wireless ESP8266

![Imagem Pinagem Arduino Mega](https://github.com/LucasAmaralPIres/ProjetoFinalUERJ/blob/master/Vers%C3%A3o%201.0/Imagem%20da%20pinagem%20-%20MEGA.png)
Imagem 1 - Pinagem de cada módulo quando utilizando um Arduino Mega 2460

![Imagem Pinagem Arduino Uno](https://github.com/LucasAmaralPIres/ProjetoFinalUERJ/blob/master/Vers%C3%A3o%201.0/Imagem%20da%20pinagem.png)
Imagem 2 - Pinagem de cada módulo quando utilizando um Arduino Uno (por ser limitado alguns módulos não são compatíveis com o Arduino Uno)

### Funcionalidades
  De uma maneira geral, a ideia do Lura é de que fique na entrada da(s) área(s) desejada(s) um Arduino (Vassalo) que faça comunicação com um outro Arduino (Mestre) que está conectado à um computador. Esse computador fará todas as consultas nos bancos de dados para validar as informações (como por exemplo uma matrícula) que vão sendo passadas no Arduino conectado à ele e dar uma resposta (como por exemplo abrir uma porta ou transmitir uma mensagem de erro).
  
  A funcionalidade principal é fornecer acesso para o usuário quando ele fornece as informações necessárias, mas há também outras funcionalidades como gerenciar presença, turmas e horários.
  
  Existem no total 3 perfis para uma pessoa: Aluno, Professor e Administrador. Alunos apenas tem acesso a sala. Professor tem acesso a lista de presença e de gerenciamento das turmas (Adicionar ou remover alunos de uma turma). Administradores tem o direito de mudar informações mais sensíveis do Lura (configurações gerais como horário e definição da Área).
  
  Lura também conta com uma interface gráfica onde fica fácil dos professores/administradores gerenciarem e/ou visualizarem os alunos nas turmas. 
  
  Acessar a sala, modo professor, ...
  
### Diagramas
  Casos de Uso
  
  Acessar a Área (todos os perfis)
  - Usuário insere informação (ou digitando a informação ou passando o cartão no leitor)
  - ...
  
  Modo Professor...
  
  __*Ainda será feito.*__
  
## 3. Interface Gráfica
O computador que está conectado ao Banco de Dados tem o direito de acessar pelo navegador da Web o sistema, podendo gerir sem maiores problemas.
_Não tem o que falar aqui ainda_

## 4. Considerações Finais
