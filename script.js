//var fileList = [];
var allFiles=[]; //all file urls
var makamName_Index=[];
var file_to_array;
var reader_step=2;
var step_dure=1000;
var tempo_multiplier = 1;
//var synth = new Tone.Synth().toMaster(); //create a synth with Tone.js
var sampler1 = new Tone.Sampler("/sound/55.wav").toMaster();
var sampler2 = new Tone.Sampler("/sound/67.wav").toMaster();

var selected_makam_indexes=[];
var selected_makam_names=[];
var makam_being_played;
var piece_being_played;
var isMobile = false;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 isMobile = true; 
    $(function(){
	//mobile start
	StartAudioContext.setContext(Tone.context);
    StartAudioContext.on($("#makam_names"));
    StartAudioContext.onStarted(function(){
        console.log("Audio powered!");
    });
	
});
};



var reader = new Tone.Loop(function(time) {
    var line_to_array;
    if (file_to_array[reader_step]) {line_to_array = file_to_array[reader_step].split('\t')} else {reader.stop()}; 
    if (line_to_array[1] == 9) {   
        var line_length = file_to_array.length;
        var nota = line_to_array[4];   //Koma53 
        var keynum = Tone.Frequency(HoldrianConvert(nota)).toMidi();
        var pitchDif = 1;
        console.log(keynum);
        step_dure = (line_to_array[8] / 1000) * tempo_multiplier;
        reader.interval = step_dure;
        //document.getElementById("line").innerHTML = reader_step + " " + nota + " " + step_dure + " " +  tempo_multiplier;
        if (nota != -1) {
            sampler1.triggerRelease();
            sampler2.triggerRelease()
            sampler1.triggerAttack(keynum-67);
            sampler2.triggerAttack(keynum-67);
        };
         /*                   
        //synth.triggerAttackRelease(HoldrianConvert(nota), step_dure);
        if (nota != -1) {if (keynum < 70) {
            pitchDif = keynum - 67;
            sampler1.triggerAttack(pitchDif);
            sampler11.triggerAttack(keynum-55);
        } else {
            pitchDif = keynum - 70;
            sampler2.triggerAttack(pitchDif);
            sampler11.triggerAttack(keynum-55);
        }
        */
    };
    if (reader_step == (line_length-1)) {reader.stop();  sampler1.triggerRelease();sampler2.triggerRelease()} else {reader_step = reader_step+1};
}, 1);  

Tone.Transport.start();



function midicps(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  };

function HoldrianConvert(comma) {
    var hc = (1200 / 53);
    return midicps((hc * comma) / 100);
};

function changeTempo() {
    tempo_multiplier = (document.getElementById("tempo").value / 100) * 2;
    tempo_multiplier = 2-tempo_multiplier;
    
};

function loadMakamUrls() {
    var xhttp = new XMLHttpRequest();
    var urls;
    xhttp.open("GET", "makamUrls.txt", true);
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
             urls = xhttp.responseText.split('\n');
            //console.log(urls);
            for (var i=0; i<urls.length; i++) {
                //console.log(urls[i]);
                allFiles.push(urls[i]);
            }};
        
    };
    xhttp.send(null);
};

loadMakamUrls();

//load makam names and their slot index numbers from the file 'slopi.txt'//
function loadMakamNamesSlots() {
    var xhttp = new XMLHttpRequest();
    var parOn;
    var parOff;
    var makamName;
    var makamSlots;
    xhttp.open("GET", "slopi.txt", true);
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            makamName_Index = xhttp.responseText.split('\n');
            //console.log("makamIndex" + makamName_Index);
            //console.log(makamName_Index[0].indexOf("["));
            for (var i=0; i < makamName_Index.length;i++) {
                parOn = makamName_Index[i].indexOf("["); 
                parOff = makamName_Index[i].lastIndexOf("]")+1;
                makamName = makamName_Index[i].slice(0, parOn-1);
                makamSlots = makamName_Index[i].slice(parOn, parOff);
                //console.log(makamName);
                
                //creates buttons for each makam name
                if (isMobile) {$('#makam_names').append("<button class='makamBut ui-btn ui-btn-inline' id=" + makamName + " style='background-color:rgb(242, 242, 242); border-radius: 5px'>" + makamName +  "</button>")} else {
                    $('#makam_names').append("<button class='makamBut' id=" + makamName + " style='background-color:rgb(242, 242, 242); border-radius: 5px'>" + makamName +  "</button>")
                };
                
               
            };
        };
    };
    xhttp.send(null);
};

loadMakamNamesSlots();

function loadRandomFile() {
    
    var randPool = Math.floor(Math.random() * selected_makam_indexes.length);
    console.log(selected_makam_indexes[randPool]);
    if (selected_makam_indexes.length <= 0) {alert("Öncelikle aşağıdaki butonlarla bir veya daha fazla makam seçiniz")};
    var pick_a_File = allFiles[selected_makam_indexes[randPool]]; //select a file from chosen makams
    
    console.log(pick_a_File);
    
    piece_being_played = pick_a_File.slice(1, pick_a_File.length-4);
    
    var parO = pick_a_File.indexOf("-"); 
    makam_being_played = pick_a_File.slice(1, parO);
    console.log(makam_being_played);
        
    
    $("button.makamSel").css("background-color", "rgb(255, 255, 255)");
    $("div.result").css("background-color", "rgb(255, 255, 255)");
    document.getElementById("result").innerHTML = "Hangi makam " + "&#231" + "al" + "&#305" +"yor?";
    
    reader_step = 2;
    if (selected_makam_indexes.length > 0) {
        var xhttp = new XMLHttpRequest();
       
        xhttp.open("GET", "txt/" + pick_a_File, true);
    
        xhttp.onreadystatechange = function() {
            //document.getElementById("randomFileMonitor").innerHTML = "/txt/" + pick_a_File;
            if(xhttp.readyState == 4 && xhttp.status == 200) {
                //reader.stop(true, false);
                file_to_array = xhttp.responseText.split('\n');
                
                reader.start();
            };
        };
        xhttp.send(null);
        
    }; //else {alert("Öncelikle aşağıdaki butonlarla bir veya daha fazla makam seçiniz")};
    };




//add to buttons functionality of makamName and slots control
$(document).on('click', '.makamBut', function() {
    var getID = $(this).attr("id");
    var getColor = $(this).css("background-color");
    var parOn;
    var parOff;
    var makamName;
    var makamSlots;
    var formattedSlot;
    var formattedSlotArray = [];
    var slots = [];
    //add makamSlots into the list
    if (getColor == "rgb(242, 242, 242)") {
        $(this).css("background-color", "rgb(102, 255, 153)"); //change color to green
        
        $('#selectedMakams').append("<button type='button' style='background-color:rgb(255, 255, 255); border-radius: 5px' class='makamSel ui-btn ui-btn-inline' id=" + getID + ">" + getID + "</button>"); //create a .makamSel button//
        
        //add makamSlots to list
        for (var i=0; i < makamName_Index.length;i++) {
        parOn = makamName_Index[i].indexOf("["); 
        parOff = makamName_Index[i].lastIndexOf("]")+1;
        makamName = makamName_Index[i].slice(0, parOn-1);
        makamSlots = makamName_Index[i].slice(parOn, parOff).split('\t');
        if (getID == makamName) {console.log(makamName + makamSlots); 
                                 formattedSlot = String(makamSlots).substring(2, String(makamSlots).length-2).replace(RegExp(/,/g), '').split(' ');
                                 
                                 for (var im=0; im<formattedSlot.length; im++) {selected_makam_indexes.push(parseInt(formattedSlot[im])); 
                                                                               selected_makam_names.push(makamName)};
                                 break; }
    };};
    if (getColor == "rgb(102, 255, 153)") {
        $(this).css("background-color", "rgb(242, 242, 242)");//change color to white
        
        $("button[id=" + getID + "]" + "[class='makamSel']").remove();//removes the button//
                
        for (var i=0; i < makamName_Index.length;i++) {  //remove makamSlots from the list
            parOn = makamName_Index[i].indexOf("["); 
            parOff = makamName_Index[i].lastIndexOf("]")+1;
            makamName = makamName_Index[i].slice(0, parOn-1);
            makamSlots = makamName_Index[i].slice(parOn, parOff).split('\t');
            if (getID == makamName) {console.log(makamName + makamSlots); 
                                     formattedSlot = String(makamSlots).substring(2, String(makamSlots).length-2).replace(RegExp(/,/g), '').split(' ');
                                     for (var ik=0; ik<formattedSlot.length;ik++) {formattedSlotArray.push(parseInt(formattedSlot[ik]))}; 
                                     for (var im=0; im<selected_makam_indexes.length; im++) {
                                         if ($.inArray(selected_makam_indexes[im], formattedSlotArray) < 0) {} else {selected_makam_indexes.splice(im, 1); im--};};
                                     break; };
        }
    };
    console.log(selected_makam_indexes);
    //console.log(selected_makam_names);
});

$(document).on('click', '.makamSel', function() {
    var getID = $(this).attr("id");
    if (getID == makam_being_played) {
            $(this).css("background-color", "rgb(0, 230, 0)"); //change color to green
            document.getElementById("result").innerHTML = 'Do' + '&#287' + 'ru cevap!' + '  &#199' + 'alan eser: ' + piece_being_played;
            $('#result').css("background-color", "rgb(153, 255, 153)");
        } else {
            $(this).css("background-color", "rgb(204, 51, 0)"); //change color to red//
            document.getElementById("result").innerHTML = "Bu de" + "&#287" + "il, ba" + "&#351" + "ka bir makam se" + "&#231" + "iniz"
        };
    
});




   





























