const int pins[10] = {11,10,9,8,7,6,5,4,3,2};

char singleLetters[10] = {'a','b','c','d','e','f','g','h','i','j'};
char doubleLetters[10] = {'k','l','m','n','o','p','q','r','s','t'};

bool waitingSecond[10];
unsigned long firstPressTime[10];

const int doubleTime = 300;

void setup() {

  Serial.begin(9600);

  for(int i=0;i<10;i++){
    pinMode(pins[i], INPUT_PULLUP);
    waitingSecond[i] = false;
  }
}

void loop() {

  bool anyPressed = false;

  for(int i=0;i<10;i++){
    if(digitalRead(pins[i]) == LOW)
      anyPressed = true;
  }

  if(anyPressed){

    bool chord[10] = {0};

    while(true){

      bool stillPressed = false;

      for(int i=0;i<10;i++){
        if(digitalRead(pins[i]) == LOW){
          chord[i] = true;
          stillPressed = true;
        }
      }

      if(!stillPressed) break;
    }

    decodeChord(chord);
    delay(30);
  }

  for(int i=0;i<10;i++){
    if(waitingSecond[i] && millis() - firstPressTime[i] > doubleTime){
      Serial.println(singleLetters[i]);
      waitingSecond[i] = false;
    }
  }
}

void decodeChord(bool k[10]){

  int count = 0;
  int index = -1;

  for(int i=0;i<10;i++){
    if(k[i]){
      count++;
      index = i;
    }
  }

  if(count == 2){

    if((k[0] && k[1])){ Serial.println("u"); return; }
    if((k[1] && k[2])){ Serial.println("v"); return; }
    if((k[2] && k[3])){ Serial.println("w"); return; }
    if((k[6] && k[7])){ Serial.println("x"); return; }
    if((k[7] && k[8])){ Serial.println("y"); return; }
    if((k[8] && k[9])){ Serial.println("z"); return; }
    if((k[4] && k[5])){ Serial.println(" "); return; }

  }

  if(count == 1){

    unsigned long now = millis();

    if(waitingSecond[index] && now - firstPressTime[index] < doubleTime){
      Serial.println(doubleLetters[index]);
      waitingSecond[index] = false;
    }
    else{
      waitingSecond[index] = true;
      firstPressTime[index] = now;
    }
  }
}
