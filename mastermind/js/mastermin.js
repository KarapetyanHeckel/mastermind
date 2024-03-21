$(document).ready(function(){ // exécution uniquement quand la page html a fini de charger
	//initialisation
	initialisation();
});


var codeMastermind; // Dans initialisation
var nombrebille; // Dans initialisation


function initialisation() {
	codeMastermind=['#ff0000','#00ff00','#0000ff','#ffff00']; //red, green, blue, yellow
	nombrebille=100; // nombre de bille générer aléatoirement, les bille du code ne sont pas générer aléatoirement et sont pris en compte dans le nombre de bille
	
	creationPlateau();
	creationListeBille();
}

function creationPlateau() {
	var htmlAAjouter='<table id="tableMastermind"></table>';
	$('#plateau').html(htmlAAjouter);
	ajoutNouvelleLigneMastermind();
}

function ajoutNouvelleLigneMastermind() {
	var htmlAAjouter='<tr>'
	for(var i=1; i<=4; i++) {
		htmlAAjouter+='<td class="caseLignePlateauMastermind"></td>';
	}
	htmlAAjouter+='<td class="caseValide"><img id="valideImage" src="image/valide.png" onclick="validerProposition(this);"/><img id="croixImage" src="image/croix.png" onclick="supprimerProposition(this);"/></td>';
	htmlAAjouter+='</tr>';
	$('#tableMastermind').append(htmlAAjouter);
}


function creationListeBille() {
	var listeBille=[].concat(codeMastermind);
	var couleurAlea;
	var couleurPareil=false;
	for(var i=0; i<=nombrebille-4;i++) {
		couleurAlea=couleurAleatoireHex();
		for(var j=0; j<listeBille.length; j++) {
			if(couleurAlea==listeBille[j])
				couleurPareil=true;
		}
		if(couleurPareil==false)
			listeBille.push(couleurAlea);
		else
			i=i-1;
	}
	shuffle(listeBille);
	
	var htmlAAjouter="";
	var couleurText;
	for(var i=0;i<listeBille.length;i++) {
		couleurText=hexaOpposer(listeBille[i]);
		htmlAAjouter+='<div class="billeMastermind" onclick=bouleChoisi(this); style="background: radial-gradient(circle at 25px 25px, ' + listeBille[i] + ', black);"><span class="textInfoBille" style="text-shadow: 1px 1px 2px ' + couleurText + '">' + listeBille[i] + '</span></div>';
	}
	$("#choixBille").html(htmlAAjouter);
	
	
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];
  }
}


function hexaOpposer(hex) {
	var r=parseInt(hex.slice(1, 3), 16);
	var g=parseInt(hex.slice(3, 5), 16);
	var b=parseInt(hex.slice(5, 7), 16);
	
	
	r = (255 - r);
    g = (255 - g);
    b = (255 - b);
	return rgbVersHex(r,g,b);
}

function rgbVersHex(r,g, b) { //rgb vers hex
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function couleurAleatoireHex() {
	var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function bouleChoisi(boule) {
	var ligneOuLabouleDoitEtreMis=$("#plateau tr:last")[0];
	var caseDeLaLigne=$(ligneOuLabouleDoitEtreMis).children();
	var bouleMis=false;
	var couleurTexteHover=$(boule).children()[0];
	couleurTexteHover=$(couleurTexteHover).html();
	var totalBouleMis=0;
	var bouleMis=false;
	
	for(var i=0;i<4; i++) {
		if($(caseDeLaLigne[i]).html()=="" && bouleMis==false) {
			$(caseDeLaLigne[i]).html('<div onclick="supprimerBouleMis(this)" class="billePlaceMastermind" style="' + $(boule).attr('style') + '"><span class="textInfoBille" style="text-shadow: 1px 1px 2px ' + couleurTexteHover + '">' + couleurTexteHover + '</span></div>');
			bouleMis=true;
		}
		if($(caseDeLaLigne[i]).html()!="")
			totalBouleMis++;
	}
	if(totalBouleMis==4)
		$(caseDeLaLigne[4]).css('display','table-cell');
}

function supprimerBouleMis(bouleASupprimer) {	
	var caseOuLaBouleEstMis=$(bouleASupprimer).parent()[0];
	var ligneDelaBouleSupprimer=$(caseOuLaBouleEstMis).parent()[0];
	var caseTexteValide=$(ligneDelaBouleSupprimer).children()[4];
	if($(caseTexteValide).attr('class')=="caseValide") {
		$(caseOuLaBouleEstMis).html('');
		$(caseTexteValide).css('display','none');
	}
}

function validerProposition(caseValider) {
	var caseAmodifier=$(caseValider).parent()[0];
	$(caseAmodifier).attr('class','caseIndice');
	var ligneAVerifier=$($(caseAmodifier).parent()[0]).children();
	var htmlIndice='<table id="tableIndice">';
	
	var couleurBille;
	var tabHtmlDefaut=[0,0,0,0]; // 0 mauvaiseBoule, 1 malPlacé, 2 bienPlacé 
	var nbBilleBienPlacé=0;
	var nbBonneBilleMalPlacé;
	
	
	for(var i=0; i<4; i++) {
		couleurBille=$(ligneAVerifier[i]).children()[0];
		couleurBille=$(couleurBille).children()[0];
		couleurBille=$(couleurBille).html();
		
		for(var j=0; j<4; j++) {
			if(couleurBille==codeMastermind[j] && i==j) { //Boule de bonne couleur placé au bon endroit
				tabHtmlDefaut[i]=2;
				nbBilleBienPlacé++;
			}				
		}		
	}
	nbBonneBilleMalPlacé=nbBilleBienPlacé;
	
	for(var i=0; i<4; i++) {
		couleurBille=$(ligneAVerifier[i]).children()[0];
		couleurBille=$(couleurBille).children()[0];
		couleurBille=$(couleurBille).html();
		
		for(var j=0; j<4; j++) {
				if(couleurBille==codeMastermind[j] && i!=j && tabHtmlDefaut[j]!=2) { //Boule de bonne couleur placé au bon endroit
					tabHtmlDefaut[i]=1;
					nbBonneBilleMalPlacé++;
				}				
			}		
		}
	for(var i=0;i<nbBilleBienPlacé;i++){
		if(i==0 || i==2)
			htmlIndice+='<tr>';
		htmlIndice+='<td class="bonneBouleBienPlacer">●</td>';
		if(i==1 || i==3)
			htmlIndice+='</tr>';	
	}
	for(var i=nbBilleBienPlacé; i<nbBonneBilleMalPlacé; i++) {
		if(i==0 || i==2)
			htmlIndice+='<tr>';
		htmlIndice+='<td class="bonneBouleMalPlacer">●</td>';
		if(i==1 || i==3)
			htmlIndice+='</tr>';	
	}
	for(var i=nbBonneBilleMalPlacé; i<4; i++) {
		if(i==0 || i==2)
			htmlIndice+='<tr>';
		htmlIndice+='<td class="mauvaiseBoule">✕</td>';
		if(i==1 || i==3)
			htmlIndice+='</tr>';	
	}
	htmlIndice+='</table>';
	$(caseAmodifier).html(htmlIndice);
	if(nbBilleBienPlacé!=4)
		ajoutNouvelleLigneMastermind();
	else
	{
		$("#plateau").css('display','none');
		$("#choixBille").css('display','none');
		$("#message").css('display','block');
		
	}
}

function supprimerProposition(enfantCase) {
	var ligneAVider=$($($(enfantCase).parent()[0]).parent()[0]).children();
	for(var i=0; i<4;i++)
		$(ligneAVider[i]).html('');
	$(ligneAVider[4]).css('display','none');
}