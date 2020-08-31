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
  const login = await API.login("username", "password").catch((err) => console.log(err));
  const summary = await API.MWFullMatchInfowz(matchId, platform).catch((err) => console.log(err));
  //console.log(summary.weekly.mode.br_brquads);
  
  // go over player list and find known players, print their kills
  console.log("Match ID: " + matchId + "\n");

  
  for (i = 0; i < summary.allPlayers.length; i++){
	  if (summary.allPlayers[i].player.username === "itachi" ||
		  summary.allPlayers[i].player.username === "Legacy0_o" || 
		  summary.allPlayers[i].player.username === "x3TuD3x" ||
		  summary.allPlayers[i].player.username === "LazyFlame" ||
		  summary.allPlayers[i].player.username === "FunGuy" ){
			console.log(summary.allPlayers[i].player.username + "'s kills: " + summary.allPlayers[i].playerStats.kills);
		}
  }
  
}

// use this function to get the match id 
// returns the match id 
async function getMatchId(gamertag, platform) {
  const login = await API.login("username", "password").catch((err) => console.log(err));
  const summary = await API.MWfullcombatwz(gamertag, platform).catch((err) => console.log(err));
  //console.log(summary.weekly.mode.br_brquads);

  // console.log(summary[0].matchId);
  return summary[0].matchId;
}




var matchId = getMatchId("her0#11341","battle");
matchId.then(function(res){
	// use this matchId to find stats
	getMatchInformation(res, "battle");
	
});






