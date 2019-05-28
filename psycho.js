/* fichier: psycho.js
 * auteur:Ciumac Aliona matricule:20057887
 */


var Psycho = function(lexique ,minFreq) {
    
    this.minFreq=1;
    this.lexique = [];
    this.pairs = 0;
    for (var stimulusIndex in lexique) {
        var newAnswers = [];
        for(var answerIndex in lexique[stimulusIndex].answers){
            if(lexique[stimulusIndex].answers[answerIndex].freq >= minFreq){
                newAnswers.push(lexique[stimulusIndex].answers[answerIndex]);
                this.pairs ++;
            }
        }
        if(newAnswers.length > 0){
             var a = newAnswers.map(function(element){
                                return {word:element.word, freq:element.freq}                   
                              });
            this.lexique.push({stimulus:lexique[stimulusIndex].stimulus, answers: a});
                               
        }
    } 
}; 

Psycho.prototype.toString = function(level ) {
    
     level=1;
    var string = "stimuli : " + this.lexique.length + " pairs : " + this.pairs;
    switch (level) {
    case 1:
            return string;
    case 2:
            return string + "\n" + this.lexique.map(function (element) {
                return element.stimulus;
            }).join(",");
    case 3:
            return string + "\n" + this.lexique.map(function (element) {
            return element.stimulus + " -> " + element.answers.slice(0, 5).map(function (answer) {
            return answer.word + "(" + answer.freq + ")";
                });
            }).join(",");
        default:
            return "";
    }
};

Psycho.prototype.add = function (stimulus, answer, freq) {
    var notIn = true;
    this.lexique.forEach(function (stimulusObject){
        if(stimulusObject.stimulus == stimulus){
            stimulusObject.answers.forEach(function(answerObject){
                if(answerObject.word == answer){
                    notIn = false;
                    return;
                }
            });
        }
    });
   if(notIn){
        this.pairs +=1;
        this.lexique.push({stimulus:stimulus, answers: [ {word:answer, freq:freq} ]});
       return true;
   }else{
       return false;
   }
};

Psycho.prototype.getAnswers = function (stimulus, minFreq ) {
    minFreq=1;
    var string = "";
                    this.lexique.forEach(function(stimulusObject){
                        if(stimulusObject.stimulus == stimulus){
                            print(stimulusObject.answers);
                            string += stimulusObject.answers.map(function (e) {
                                if(e.freq >= minFreq) return e.word;
                                }).join(",");
                            return;
                        } 
                    })
                    return string;   
                };
Psycho.prototype.getStimuli = function (minAnswer ) {
                    minAnswer = 1;
                    return this.lexique.filter(function (e) {
                        return e.answers.length >= minAnswer;
                    }).map(function (e) {
                        return e.stimulus;
                    });
                };
Psycho.prototype.getStimuliOf = function(word,minFreq){
    minFreq=1;

    
}

Psycho.prototype.getIntersection = function (stimulus1, stimulus2) {
                    var answer1 = this.getAnswers(stimulus1);
                    var answer2 = this.getAnswers(stimulus2);
                    repCommune = [];
                    for (var i = 0; i < answer1.length; i++)
                        for (var j = 0; j < answer2.length; j++)
                            if (answer1[i] == answer2[j]) {
                                repCommune.push(answer1[i]);
                                break;
                            }
                    return repCommune;   // la fonction get similarity decoule de celle ci



};
Psycho.prototype.randomWalk = function (stimulus, steps, nb, doTrace) {
                        if(doTrace == undefined)
                          doTrace = false;
                        var resultat = {};
                        var nbChaine = 0;
                       //fonction par defaut qui ouvrele document avec lequel on fait affaire dans le meme boucle
                        sel = this;//
                        /**
                         * Choisi la prochaine réponse parmi les réponses de word en respectant les différentes probabilités
                         */
                        var prochainRes = function (word) {
                            if (word == "") //cas initial
                                word = stimulus;
                           var  position = binarySearch(sel.lexique, word);// function dans binarySearch.js
                            if (position >= 0)
                                var answer = sel.lexique[position].answers;
                            else // Si le mot recu n'est pas dans notre lexique
                                return false;
                            var totalFreq = answer.reduce(function (prev, e) {
                                return prev + e.freq;
                            }, 0)
                            var next = alea(1, totalFreq + 1); //alea dans tools.js
                            /* comme ça on peu determiner le prochain mot et on fait un echantillon entre 1 et la valeur selectionner
                            ensuite on additione jusqu'a avoir la valeur voulu. par exemple :[champ1:5, champ2:4, champ3:6]
                            */
                            for (var ans in answer) {
                                next -= answer[ans].freq;
                                if (next <= 0)
                                    return answer[ans].word;
                            }
                        };

                        do { // on continu avec chaines qui n'on pas encore le nombre fourni
                          var   oldVal = newVal = "";
                            var chaine = [];
                           var noMore = false; // condition d'arret lorsque le mot n'est plus dans le lexique
                          var  a = alea(1, 6)
                            while (!noMore && chaine.length < steps && (a != 1 || chaine.length == 0)) {
                                newVal = prochainRes(oldVal);
                                if (!newVal)
                                    noMore = true;
                                else {
                                    while (newVal == oldVal) // pour etre sur que la valeu n'est pas la meme que la precedente
                                        newVal = prochainRes(oldVal);
                                    oldVal = newVal;
                                    if (newVal != false)
                                        chaine.push(newVal);
                                    a = alea(1, 6);
                                }
                            }
                            if (doTrace) { // affiche la chaine si doTrace true
                                if (chaine.length > 0)
                                    print(stimulus + "->" + chaine.map(function (e) {
                                        return e;
                                    }).join("->"))
                                else
                                    print("");
                            }
                            // On ajoute le dernier element de la chaine dans notre dictionnaire de resultat
                            if (!resultat[chaine[chaine.length - 1]])
                                resultat[chaine[chaine.length - 1]] = 0;
                            resultat[chaine[chaine.length - 1]]++;
                            nbChaine++;
                        } while (nbChaine < nb);
                        var retour = [];
                        if (Object.keys(resultat).length > 0) // Si le dico par rapport au resultat n;est pas vide
                            retour = Object.keys(resultat).map(function (key) {
                                return {
                                    "word": key,
                                    "freq": resultat[key]
                                };
                            }) // transforme en tableau de mot/frequence
                        fusion(retour, false, "freq"); // on trie le tableau par ordre decroissant de fréquences
                        return retour.map(function (e) {
                            return e.word;
                        });
                    };

var test = function() {
  load("stimuli.js");
load("stimuli_5k.js");
load("stimuli_2k.js");
load("stimuli_413.js");
load("stimuli_176.js");
    var test_avec_lexique_vide = function() {

	print("==== test_avec_lexique_vide\n");
	var ps1 = new Psycho();
    print(ps1);
	print(ps1.toString());
	ps1.add("QUEBEC","INDEPENDANT",15);
    print(ps1.toString());
	ps1.add("QUEBEC","USA",10);
	ps1.add("QUEBEC","NEIGE",13);
	
	
	print(ps1.toString(2));
	print(ps1.toString(3));

	ps1.add("CANADA","QUEBEC",20);
	ps1.add("CANADA","ONTARIO",10);
	
	print(ps1.toString(3));
    };

    var test_que_c_est_une_copie = function() {

	print("\n==== test_que_c_est_une_copie\n");
	
	var stimuli = [{stimulus:"QUEBEC", 
			       answers: [{word:"NEIGE", freq:10}, 
				  {word:"FUN",freq:20}] }];
        
	var ps = new Psycho(stimuli);
	
	print(ps.toString(3));
	stimuli[0].answers[0].word = "SUN"; // on change le lexique
	print(ps.toString(3));              // ca ne change pas l'objet
    }; 
    
    var test_avec_lexique_existant = function(label,lexique,stimulus, response,verbose) {

	if (verbose === undefined) verbose === 0;
	
	print("\n==== test_avec_lexique_existant == " + label+'\n');

	var stimulus = stimulus || "PROFESSOR";
	var response = response || "STUPID";
	
	var ps = new Psycho(lexique);
	print(ps);
    
	print(stimulus+" -> ",ps.getAnswers(stimulus));
	print(ps.getStimuli(5));

	var l,i = 1;
	do {	    
	    if ((l = ps.getStimuli(i)).length) {
		print("getStimuli("+i+")",l.length,l.slice(0,5).join());
	++i;
	    }
	} while (l.length);
     
    	
	print("similarity("+stimulus+","+response+")="," -> ", 
	      ps.getIntersection(stimulus,response));
   
   
	var stimuli = ps.getStimuli();
	for (var i=0; i<stimuli.length; i++) {
	
	    var to = stimuli[i];
	    if (a = ps.path(stimulus,to))
		print(a);
	    else if (verbose > 2)
		print("no path between",stimulus,"and",to);
	}
    };

   test_avec_lexique_vide();
    test_que_c_est_une_copie();    
    test_avec_lexique_existant("stimuli_5k", stimuli_5k, "POSTCARD", "STUPID",1);
   test_avec_lexique_existant("stimuli_2k", stimuli_2k, "COOK", "PROFESSOR",2 );
   test_avec_lexique_existant("stimuli_413",stimuli_413, "BOYS", "GIRLS",0 );
   test_avec_lexique_existant("stimuli_176", stimuli_176, "ADAM", "FRIEND",0 );

};


test();