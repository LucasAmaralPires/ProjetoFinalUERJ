# Manual de Instruções: Sistema de Controle de Acesso
## Projeto Final de Sistemas Reativos
### Professor: Fransisco Santanna
### Alunos: Rafael Najjar (201420504111) e Lucas d’Amaral (201420507811)

## Objetivo
O objetivo desse sistema é realizar um controle de acesso de
pessoas sobre uma área (uma ou mais salas) a partir da validação de
cartões RFID ou de um número de matrícula (nesse projeto, matrícula da
UERJ). As pessoas podem ser Alunos ou Professores. É possível nesse
projeto validar, adicionar ou remover pessoas, onde apenas Professores
podem realizar essas últimas duas ações.

## Componentes
- **Arduino Uno**
- **Leitor cartao RFID** para reconhecer o cartão da Pessoa.
- **Teclado Matricial de Membrana 12 Teclas** para a Pessoa ter a opção de colocar a Matrícula invés de passar o Cartão RFID.
- **LED RGB** para sinalização do sistema.
- **Computador** com Banco de Dados MySQL

## Fluxo de Atividades
Quando o Arduino é ligado, o LED ficará vermelho, sinalizando que
está a funcionando e espera alguma informação (seja lendo um cartão ou
inserindo números no teclado).
Se passar o cartão ou inserir o número, vá para “Validar Cartão”; Se
simplesmente apertar ‘#’, vá para “Modo Professor”.

## Validar Cartão (Cartão RFID)
1. Passe o Cartão RFID
2. Se o LED ficou Vermelho, não foi validado (Vá para 1). Se o LED ficou
Verde, a porta foi aberta (Volta para o Estado Inicial).
## Validar Cartão (Inserir Matrícula)
1. Insira a matrícula no teclado. Pode apertar ‘*’ para reiniciar a
inserção.
2. Confirme com ‘#’. Se o LED continuar Vermelho, não foi validado
(Vá para 1). Se o LED ficou Verde, a porta foi aberta (Volta para o
Estado Inicial).
## Modo Professor
1. Para acessar o Modo Professor, só é necessário apertar ‘#’.
2. O LED ficará azul. Passe um cartão ou insira uma Matrícula.
3. Se for um Professor, piscará Verde no LED (Vá para 4). Caso
contrário, o Arduino sai do Modo Professor (Volta para o Estado
Inicial).
4. Passe outro Cartão. Se for um cartão vinculado a uma Pessoa, vá
para 5 (Remover Pessoa). Se for um cartão novo, vá para a 6
(Adicionar Pessoa).
5. A Pessoa sai do banco de dados (Consequentemente o cartão fica
invalidado).
6. Insira uma Matrícula, de 12 dígitos.
7. Defina se a nova pessoa é ou não um Professor (1 para ‘Sim’ e 0
para ‘Não).
8. A Pessoa foi adicionada com sucesso! O Arduino sai do Modo
Professor (Volta para o Estado Inicial).

## Como Funciona?
O Arduino basicamente manda para o computador o que ele recebe
de informação (seja pelo cartão RFID ou inserindo números no teclado). O
computador faz uma busca no banco de dados baseado no que recebeu e
manda informações simples para o Arduino de volta (Qual a cor o LED
deve mostrar? Abre ou não a porta?).

O Arduino por si só não sabe o que está acontecendo – ele apenas é
utilizado para dar e receber informações para a Pessoa que está utilizando
o Sistema.

Esse projeto utilizou o MySQL, e ele usa uma simples tabela
chamada “Pessoa”, que contém Nome, Matrícula e Número do Cartão
(Valor Hexadecimal).

## Como expandir o projeto
Esse projeto tem muito a expandir. Diversas ideias foram
consideradas ao longo do desenvolvimento do projeto, porém houve
limitações quanto ao Arduino (Todas as portas foram utilizadas). Aqui
alguns exemplos:

Um belo exemplo seria tornar o controle de acesso mais rigoroso –
Aproveitar do relógio do sistema (por exemplo o relógio do Banco de
Dados) e perguntar se o Aluno pode entrar na área se está na hora da aula
dele. Para isso, criaria uma nova tabela do Banco de Dados que
relacionaria cada Aluno com um (ou mais) Horário(s). Como não há uma
boa forma de representar isso ao adicionar aluno no “Modo Professor”, a
ideia foi descartada.

Uma simples tela que mostram alguns caracteres iria ajudar
imensamente o projeto, porém ele ocupa muitos pinos do Arduino (além
do grupo não ter a peça). Sem ele, simplificamos o máximo possível o
“Modo Professor”, limitando-o sem muito espaço para expandir.

Uma simples buzina para alertar com mais ênfase em algumas
situações seria muito útil, mas o grupo não teve tempo para utilizá-lo de
forma efetiva (nem planejá-lo de forma prévia).

O projeto poderia ser muito mais complexo e ter objetivos mais
ousados, como marcar presença de alunos; poderia ser adaptado para
diversos fins (Não só Alunos e Professores, pode haver outro conjunto de
perfis), para ser reutilizável.

## Bibliografia e Agradecimento Especial
[http://blog.filipeflop.com/arduino/teclado-matricial-4x4-arduino.html#_ga=2.60498094.24410729.1499822434-483943275.1499822434](http://blog.filipeflop.com/arduino/teclado-matricial-4x4-arduino.html#_ga=2.60498094.24410729.1499822434-483943275.1499822434)

[http://blog.filipeflop.com/wireless/controle-acesso-leitor-rfidarduino.html](http://blog.filipeflop.com/wireless/controle-acesso-leitor-rfidarduino.html)

[https://www.arduino.cc/en/Reference/Serial](https://www.arduino.cc/en/Reference/Serial)

[https://playground.arduino.cc/Interfacing/Java](https://playground.arduino.cc/Interfacing/Java)

[http://www.guj.com.br/t/java-arduino/140576/3](http://www.guj.com.br/t/java-arduino/140576/3)

Agradecimento especial: Rafael Teixeira por ter permitido usar o trabalho
de Banco de Dados 1 com a Professora Ana Carolina.
