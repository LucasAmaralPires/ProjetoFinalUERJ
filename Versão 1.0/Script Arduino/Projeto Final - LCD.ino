#include <LiquidCrystal.h>
 
LiquidCrystal lcd(48, 49, 50, 51, 52, 53);

void setup()
{
  lcd.begin(16, 2);
}

void loop()
{
  lcd.clear();
  lcd.setCursor(6, 0);
  lcd.print("ESTA");
  lcd.setCursor(2, 1);
  lcd.print("FUNCIONANDO!");
  delay(5000);
  for (int posicao = 0; posicao < 2; posicao++)
  {
    lcd.scrollDisplayLeft();
    delay(1000);
  }  
  for (int posicao = 0; posicao < 4; posicao++)
  {
    lcd.scrollDisplayRight();
    delay(1000);
  }
  for (int posicao = 0; posicao < 2; posicao++)
  {
    lcd.scrollDisplayLeft();
    delay(1000);
  }  
}
