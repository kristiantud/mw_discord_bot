// more docs: https://www.npmjs.com/package/call-of-duty-api
// psn, steam, xbl, battle, uno


// discord init
const Discord = require("discord.js");
const client = new Discord.Client();

// the bot token
const token = ""; 

// init cod-api module
const API = require('call-of-duty-api')();


// use this function to get full information on a match based on match id 
async function getMatchInformation(matchId, platform) {
  const login = await API.login("", "").catch((err) => console.log(err));
  const summary = await API.MWFullMatchInfowz(matchId, platform).catch((err) => console.log(err));
  //console.log(summary.weekly.mode.br_brquads);
  
  
  // go over player list and find known players, print their kills
  console.log("Match ID: " + matchId + "\n");

  // check if anyone got over 10 kills 
  for (i = 0; i < summary.allPlayers.length; i++){
	  if (summary.allPlayers[i].player.username === "itachi" ||
		  summary.allPlayers[i].player.username === "Legacy0_o" || 
		  summary.allPlayers[i].player.username === "x3TuD3x" ||
		  summary.allPlayers[i].player.username === "LazyFlame" ||
		  summary.allPlayers[i].player.username === "FunGuy" ||
		  summary.allPlayers[i].player.username === "Simon_SaysHi" ||
		  summary.allPlayers[i].player.username === "BlankFrog" ||
		  summary.allPlayers[i].player.username === "CrispyCahl" ||
		  summary.allPlayers[i].player.username === "DanKo" ||
		  summary.allPlayers[i].player.username === "ElCapitan306" ){
			client.channels.cache.find( channel => channel.name === 'test').send(summary.allPlayers[i].player.username + " got " + summary.allPlayers[i].playerStats.kills + " kills!" );
			
		}
  }
    
  
  /*
  for (i = 0; i < summary.allPlayers.length; i++){
	  console.log(summary.allPlayers[i].player.username + "'s kills: " + summary.allPlayers[i].playerStats.kills);
	
	  
  }
  */
  
  
  
  
  
}

// use this function to get the match id 
// returns the match id 
async function getMatchId(gamertag, platform) {
  const login = await API.login("", "").catch((err) => console.log(err));
  const summary = await API.MWfullcombatwz(gamertag, platform).catch((err) => console.log(err));
  //console.log(summary.weekly.mode.br_brquads);

  // console.log(summary[0].matchId);
  return summary[0].matchId;
}

// use this function to get games played count
async function checkGames(gamertag, plataform){
    const login = await API.login("", "").catch((err) => console.log(err));
    const summary = await API.MWBattleData(gamertag, plataform).catch((err) => console.log(err));
	
	// console.log(summary.br.gamesPlayed);
	
	return summary.br.gamesPlayed;
}

// this function will be used to inspect the most recent match for important information
async function inspectForEvents(){
	var matchid = getMatchId("her0#11341", "battle");
	matchid.then(function(res){
		
		
	});
}



let gamesPlayed = checkGames("her0#11341","battle");

/*
gamesPlayed.then(function(res){
	// show how many current games have been played so far
	console.log("Current games: " + res);
	
	
	setInterval(function(){
		var intervalCount = checkGames("her0#11341","battle");
		intervalCount.then(function(result){
			
			if (result > res){
				gamesPlayed = gamesPlayed + 1;
				// call function that checks the game stats for important information 
			}
		});
		
	
	},10000);
	// this is the baseline, so now, set interval to check for a new game
	// when this new game is found (by checking if )
	
	
	
});
*/

/*
var matchId = getMatchId("her0#11341","battle");
//var matchId = getMatchId("Legacy0_o", "psn");
matchId.then(function(res){
	// use this matchId to find stats
	getMatchInformation(res, "battle");
	
});
*/

//client.channels.cache.find(channel => channel.name === 'test').send("you just finished a match. will inspect...");
client.login(token);


// tell the console that the bot is working
client.on('ready',function (){
	console.log(client.user.username + " is functional.");
	
});

// handle message from the user
client.on('message',function(message){
	// tell the console the command given
	if (message.author.tag != client.user.username + "#9514"){
		console.log(`command given by ${message.author.tag}: ` + message.content);
	}
	
	// tell the bot to start looking for new matches
	if (message.content === '!start'){
		var interval = setInterval(function(){
			client.channels.cache.find(x => x.name === 'test').send("this is just a test of interval. don't panic!");
			
			
		},5000);
	}
	
	// disconnect the bot completely
	if (message.content === '!stop'){
		client.destroy();

	}
	
	
});
















