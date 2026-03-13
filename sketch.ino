const int pins[10] = {11,10,9,8,7,6,5,4,3,2};

char singleLetters[10] = {'a','b','c','d','e','f','g','h','i','j'};
char doubleLetters[10] = {'k','l','m','n','o','p','q','r','s','t'};

unsigned long firstPressTime[10];
bool waitingSecond[10];

const int doubleTime = 300;

void setup() {
  Serial.begin(9600);

  for(int i=0;i<10;i++){
    pinMode(pins[i], INPUT_PULLUP);
    waitingSecond[i] = false;
  }
}

void loop() {

  for(int i=0;i<10;i++){

    if(digitalRead(pins[i]) == LOW){

      delay(20); // debounce

      if(digitalRead(pins[i]) == LOW){

        unsigned long now = millis();

        if(waitingSecond[i] && (now - firstPressTime[i] < doubleTime)){
          Serial.println(doubleLetters[i]);
          waitingSecond[i] = false;
        }
        else{
          waitingSecond[i] = true;
          firstPressTime[i] = now;
        }

        while(digitalRead(pins[i]) == LOW);
      }
    }

    if(waitingSecond[i] && (millis() - firstPressTime[i] > doubleTime)){
      Serial.println(singleLetters[i]);
      waitingSecond[i] = false;
    }
  }
}
