#include <SPI.h>
#include <RF24.h>
#include <RF24Network.h>
#include <MFRC522.h>
#include <LiquidCrystal.h>
#include <EEPROM.h>
#define red 45
#define blue 47
#define green 46
#define SS_PIN 53
#define RST_PIN 38
#define tranca 10

LiquidCrystal lcd(48, 49, 50, 51, 52, 53);
MFRC522 mfrc522(SS_PIN, RST_PIN);
RF24 radio(12, 11);
RF24Network network(radio);

//////////////////////////////////////////////////////////////////////////
//This String is the Classroom Number. Its unique for the Lura_Master!!!//
//////////////////////////////////////////////////////////////////////////
String classroom = "6000";
//////////////////////////////////////////////////////////////////////////

const uint16_t node01 = 01;
const uint16_t this_node = 00;
char st[20];
char digt[15];
int cont_di;
long old_time, new_time;
bool ins_cartao, dig_mat;

void setup()
{
  lcd.begin(16, 2);
  cont_di = 0;
  ins_cartao = false;
  dig_mat = false;
  changeLED(1,0,0);
  changeScreen(6,"LURA",0,"");
  //Pinos ligados aos pinos 1, 2, 3 e 4 do teclado - Linhas
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
  //Pinos ligados aos pinos 5, 6, 7 e 8 do teclado - Colunas
  pinMode(7, INPUT);
  pinMode(2, INPUT);
  pinMode(8, INPUT);
  mfrc522.PCD_Init();   // Inicia MFRC522
  pinMode(tranca, OUTPUT);
  Serial.begin(9600);
  radio.begin();
  network.begin(90, this_node);
  digitalWrite(tranca, LOW);
  Serial.println("Aguardando acionamento das teclas ou leitura de cartão...");
  Serial.println();
 
}

void changeLED(int r, int g, int b)
{
  if(r) pinMode(red,INPUT);
  else pinMode(red,OUTPUT);
  if(g) pinMode(green,INPUT);
  else pinMode(green,OUTPUT);
  if(b) pinMode(blue,INPUT);
  else pinMode(blue,OUTPUT);
  digitalWrite(red, r);
  digitalWrite(green, g);
  digitalWrite(blue, b);
}

void changeScreen(int start0, String text0, int start1, String text1)
{
  lcd.clear();
  lcd.setCursor(start0, 0);
  lcd.print(text0);
  lcd.setCursor(start1, 1);
  lcd.print(text1);
}

void check_code(char rec)
{
  SPI.end();
  if (rec == '1') // Stand-by Mode. Stay Red until an action occurs
  {
    changeLED(1, 0, 0);
  }
  if (rec == '2')
  {
    digitalWrite(tranca, HIGH);
    changeScreen(5, "ACESSO", 4, "LIBERADO");
    changeLED(0, 1, 0);
    old_time = millis();  
  }
  if (rec == '3')
  {
    changeScreen(6, "MODO", 4, "PROFESSOR");
    changeLED(0, 0, 1);
    delay(3000);
    lcd.clear();
  }
  if (rec == '4')
  {
    changeScreen(6, "CARTAO", 5, "INSERIDO");
    changeLED(0, 1, 0);
    delay(2000);
    changeLED(0, 0, 1);
    ins_cartao = false;
    dig_mat = true;
    lcd.clear();
  }
  if (rec == '5')
  {
    changeScreen(6, "ALUNO", 5, "APAGADO");
    changeLED(0, 1, 0);
    delay(2000);
    changeLED(1, 0, 0);
    lcd.clear();
  }
  if (rec == '6')
  {
    changeScreen(6, "ALUNO", 5, "INSERIDO");
    changeLED(0, 1, 0);
    delay(2000);
    changeLED(1, 0, 0);
    dig_mat = false;
    lcd.clear();
  }
  if (rec == '7')
  {
    ins_cartao = true;
    changeScreen(6, "PROFESSOR", 4, "CONFIRMADO");
    changeLED(0, 1, 0);
    delay(2000);
    changeLED(0, 0, 1);
    lcd.clear();
  }
  if (rec == '8')
  {
    digitalWrite(tranca, LOW);
    ins_cartao = true;
    changeScreen(6, "ACESSO", 5, "NEGADO");
    delay(2000);
    lcd.clear();
  }
}

void wireless_write(String env)
{
  char send_t[24];
  String text = classroom + env;
  text.toCharArray(send_t, 24);
  SPI.begin();
  network.update();
  RF24NetworkHeader header(node01);
  Serial.println("Sending message.");
  bool ok = network.write(header, send_t, 24);
  Serial.println("Message sent.");
  delay(100);
  SPI.end();
}

void wireless_read()
{
  SPI.begin();
  network.update();
  char text[32] = "";
  while (network.available())
  {
    RF24NetworkHeader header;
    network.read(header, &text, sizeof(text));
    Serial.println(text[4]);
  }
  SPI.end();
  check_code(text[4]);
}

void imprime_linha_coluna(int x, int y)
{
  switch (x)
  {
    case 1:
      switch (y)
      {
        case 1:
          digt[cont_di++] = '1';
          break;
        case 2:
          digt[cont_di++] = '2';
          break;
        case 3:
          digt[cont_di++] = '3';
          break;
      }
      break;
    case 2:
      switch (y)
      {
        case 1:
          digt[cont_di++] = '4';
          break;
        case 2:
          digt[cont_di++] = '5';
          break;
        case 3:
          digt[cont_di++] = '6';
          break;
      }
      break;
    case 3:
      switch (y)
      {
        case 1:
          digt[cont_di++] = '7';
          break;
        case 2:
          digt[cont_di++] = '8';
          break;
        case 3:
          digt[cont_di++] = '9';
          break;
      }
      break;
    case 4:
      switch (y)
      {
        case 1:
          for (int i = 0; i < cont_di; i++)
          {
            digt[i] = 0;
          }
          cont_di = 0;
          break;
        case 2:
          digt[cont_di++] = '0';
          break;
        case 3:
          if (cont_di != 0)
          {
            Serial.println(digt);
            wireless_write(String(digt));
            delay(1000);
            for (int i = 0; i < cont_di; i++)
            {
              digt[i] = 0;
            }
            cont_di = 0;
          }
          else
          {
            Serial.println("!");
          }
          break;
      }
      break;
  }
}

void read_matrix(int ti)
{
  //Alterna o estado dos pinos das linhas
  digitalWrite(3, LOW);
  digitalWrite(4, LOW);
  digitalWrite(5, LOW);
  digitalWrite(6, LOW);
  digitalWrite(ti, HIGH);
  //Verifica se alguma tecla da coluna 1 foi pressionada
  if (digitalRead(7) == HIGH)
  {
    imprime_linha_coluna(ti - 2, 1);
    while (digitalRead(7) == HIGH) {}
  }
  //Verifica se alguma tecla da coluna 2 foi pressionada
  if (digitalRead(2) == HIGH)
  {
    imprime_linha_coluna(ti - 2, 2);
    while (digitalRead(2) == HIGH) {};
  }
  //Verifica se alguma tecla da coluna 3 foi pressionada
  if (digitalRead(8) == HIGH)
  {
    imprime_linha_coluna(ti - 2, 3);
    while (digitalRead(8) == HIGH) {}
  }
}

void read_card()
{
  SPI.begin();      // Inicia  SPI bus
  if (mfrc522.PICC_IsNewCardPresent())
  {
    if (mfrc522.PICC_ReadCardSerial())
    {
      String conteudo = "";
      //          char cont[24];
      byte letra, j = 0;
      for (byte i = 0; i < mfrc522.uid.size; i++)
      {
        //  Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : "");
        //  Serial.print(mfrc522.uid.uidByte[i], HEX);
        conteudo.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : ""));
        conteudo.concat(String(mfrc522.uid.uidByte[i], HEX));
      }
      //            conteudo.toCharArray(cont,24);
      wireless_write(conteudo);
      Serial.println(conteudo);
      //Serial.println();
    }
    delay(1000);
  }
  SPI.end();
}

void loop()
{
  new_time = millis();
  wireless_read();
  for (int ti = 3; ti < 7; ti++)
  {
    if (dig_mat == false)
    {
      read_card();
    }
    if (ins_cartao == false)
    {
      read_matrix(ti);
    }
  }
  delay(10);
  /*      if((!digitalRead(red)) && (digitalRead(green)) && ((new_time - old_time)>5000))
        {
          digitalWrite(10,LOW);
          digitalWrite(red,HIGH);
          digitalWrite(green,LOW);
        }
        if(digitalRead(red))
        {
          ins_cartao = false;
          dig_mat = false;
          lcd.clear();
        }*/
}
