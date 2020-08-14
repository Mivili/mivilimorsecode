//show "." and adds morse to code[]
input.onButtonPressed(Button.A, function () {
music.playTone(Note.C, 150)
basic.showLeds(`
. . . . .
. . . . .
. . # . .
. . . . .
. . . . .
`)
code += (".")
})
//shows "-" and adds morse to code[]
input.onButtonPressed(Button.B, function () {
    music.playTone(Note.C, 400)
    basic.showString("-")     
    code += ("-")
})
/*function that sends the message and waits 
for received acknowlegement. If the sent message 
is not received in the next 0.2 seconds it will
resend the message. If the message is not succesfully
sent in two seconds it will stop resending*/ 
function sendmessage(letter:string) {
    sendserial += 1
    messagereceived = false
    let startime = input.runningTime()
    while (!messagereceived) {
    radio.sendString("msg-"+sendserial+"-"+ letter);
    if ((input.runningTime()-startime)>2000)//2 seconds
        return false;
    control.waitMicros(200000)
    }
    return true;
}
//sends message and clears characters from code[]
input.onButtonPressed(Button.AB, function () {
basic.showString(code)

for (let m=0;m<morse.length;m++) {
    if (morse[m]==code) {    
       if (sendmessage(alphabet[m]))
       {    //show checkmark message sent successfully
           basic.showLeds(`
            . . . . .
            . . . . #
            . . . # .
            # . # . .
            . # . . .
        `)
       }
       else {
           //show x send failed
         basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
        `)    

       }
        code = "";
        basic.clearScreen();
        return;
    }
    
}

    basic.showString("Not real code");
    code = ""
})
//erases characters from code[]
input.onGesture(Gesture.Shake, function () {
    code = "";
    basic.clearScreen();
})
/* Transmitter sends the data in the following format:
msg-<serial number>-<message>
ex: a typical message would be: msg-1-a

Receiver sends the data in the following format:
rmsg-<serial number of the received message>
ex: a typical response message would be: rmsg-1

Because the transmitter and receiver are written on the
same program, this program deals with both of them.
*/
radio.onReceivedString(function (receivedString: string) {
   let data = receivedString.split("-") 
    if ((data.length!=3) || (data[0]!="msg"))
   { //message is not from transmitter
    //Checks if it is from receiver
    if ((data.length!=2) || (data[0]!="rmsg"))   
        return;//message is not for transmitter
    else {
        messagereceived = true
        return;
    }
   }
   //changes serial string to number
   let rserial = parseInt(data[1]);
   if (rserial>receivedserial) {
       //receiver getting character for the first time
       receivedserial = rserial;
        radio.sendString("rmsg-"+rserial);
        basic.showString(data[2]);
   }
   else {
       //transmitter does not need to anything because receiver already received the message
   }
})
//Group ID
radio.setGroup(1)
//sets signal power to high
radio.setTransmitPower(70)

//Variables
let code = ""
let morse = [
    ".-", "-...", "-.-.", "-..", ".", 
    "..-.", "--.", "....", "..", ".---", 
    "-.-", ".-..", "--", "-.", "---", 
    ".--.", "--.-", ".-.", "...", "-", 
    "..-", "...-", ".--", "-..-", "-.--",
    "--..", ".----", "..---", "...--", "....-", 
    ".....", "-....", "--...", "---..", "----.",
    "-----"]
let alphabet = [
    "a", "b", "c", "d", "e",
    "f", "g", "h", "i", "j", 
    "k", "l", "m", "n", "o",
    "p", "q", "r", "s", "t",
    "u", "v", "w", "x", "y",
    "z", "1", "2", "3", "4",
    "5", "6", "7", "8", "9",
    "0"]
let sendserial = 0
let receivedserial = 0
let messagereceived = false