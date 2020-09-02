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
  
  let statDict = {'itachi' : 0,
				  'Legacy0_o' : 0,
				  'x3TuD3x' : 0,
				  'FunGuy' : 0,
				  'LazyFlame' : 0,
				  'Simon_SaysHi' : 0,
				  'BlankFrog' : 0,
				  'CrispyCahl' : 0,
				  'DanKo' : 0,
				  'ElCapitan306' : 0,
				  'Nickmercs' : 0,
				  'SypherPk' : 0,
				  'Trash_Fue' : 0,
				  'Doozy' : 0,
				  'K3' : 0};
  
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
		  summary.allPlayers[i].player.username === "ElCapitan306" ||
		  // some pros: 
		  summary.allPlayers[i].player.username === "Nickmercs" ||
		  summary.allPlayers[i].player.username === "SypherPk" ||
		  summary.allPlayers[i].player.username === "Trash_Fue" ||
		  summary.allPlayers[i].player.username === "Doozy" ||
		  summary.allPlayers[i].player.username === "K3" ){
			statDict[summary.allPlayers[i].player.username] = summary.allPlayers[i].playerStats.kills;
		}
  }
  
  return statDict;
    
  
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

// find info on the entire team, and info on pros if there are any
async function inspectForEvents(){
	
}


// this will return info on itachi's most recent match
async function getRecentMatchStats(matchID, platform){
	const login = await API.login("", "").catch((err) => console.log(err));
	const summary = await API.MWFullMatchInfowz(matchID, platform).catch((err) => console.log(err));
	let avgKills = 0;
	let avgDeaths = 0;
	let avgDmg = 0;
	let avgKdr = 0;
	let allStats = [];
	var matchStats = {'username' : '',
					  'kills' : 0,
					  'deaths' : 0,
					  'damage_done' : 0,
					  'kdr' : 0,
					  'team_placement' : 0
					 };
	// use matchID to find stats on itachi
	for (x = 0; x < summary.allPlayers.length; x++){
		if(summary.allPlayers[x].player.username === 'itachi'){
			//console.log("itachi's kills: " + summary.allPlayers[x].playerStats.kills);
			//console.log("itachi's placement: " + summary.allPlayers[x].playerStats.teamPlacement);
			matchStats['username'] = summary.allPlayers[x].player.username;
			matchStats['kills'] = summary.allPlayers[x].playerStats.kills;
			matchStats['deaths'] = summary.allPlayers[x].playerStats.deaths;
			matchStats['damage_done'] = summary.allPlayers[x].playerStats.damageDone;
			matchStats['kdr'] = summary.allPlayers[x].playerStats.kdRatio;
			matchStats['team_placement'] = summary.allPlayers[x].playerStats.teamPlacement;

			allStats.push(matchStats);
		}
		avgKills = avgKills + summary.allPlayers[x].playerStats.kills;
		avgDeaths = avgDeaths + summary.allPlayers[x].playerStats.deaths;
		avgDmg = avgDmg + summary.allPlayers[x].playerStats.damageDone;
		avgKdr = avgKdr + summary.allPlayers[x].playerStats.kdRatio;
	}
	
	avgKills = avgKills / summary.allPlayers.length;
	avgDeaths = avgDeaths / summary.allPlayers.length;
	avgKdr = avgKdr / summary.allPlayers.length;
	avgDmg = avgDmg / summary.allPlayers.length;
	

	let lobbyStats = {'avg_kills' : avgKills.toFixed(2),
					  'avg_deaths' : avgDeaths.toFixed(2),
					  'avg_kdr' : avgKdr.toFixed(2),
					  'avg_dmg' : avgDmg.toFixed(2)};
					  
	allStats.push(lobbyStats);
	//console.log(allStats);
	
	return allStats;
}





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


let gamesPlayed = checkGames("x3TuD3x","xbl");
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
			// client.channels.cache.find(x => x.name === 'test').send("this is just a test of interval. don't panic!");
			// now look for games
			gamesPlayed.then(function(res){
				let newGameChecker = checkGames("x3TuD3x", "xbl");
				newGameChecker.then(function(result){
					if (result > res){
						// new game found
						console.log("new game found. fetching information...");
						gamesPlayed = gamesPlayed + 1;
						inspectForEvents();
					}else{
						console.log("no new games found.");
						client.channels.cache.find(x => x.name === 'test').send("No new games yet.");
					}
				});
			});	
		},60000);
	}
	
	// ask bot for information on last game
	if (message.content === '!recentMatch'){
		let matchId = getMatchId("her0#11341","battle");
		matchId.then(function(res){
			let recentStats = getRecentMatchStats(res,"battle");
			recentStats.then(function(results){
				//console.log(results);
				let itachi = {};
				if (results.length == 2){
					itachi = results[0];
				}
				
				var comparedKills = (function(){
					var temp = itachi['kills'] - results[1]['avg_kills']; 
					if (temp > 0){
						return "+" + temp.toFixed(2).toString();
					} else {
						return temp.toFixed(2).toString();
					}
				})();
				var comparedDeaths = (function(){
					var temp = itachi['deaths'] - results[1]['avg_deaths'];
					if (temp > 0){
						return "+" + temp.toFixed(2).toString();
					} else {
						return temp.toFixed(2).toString();
					}
				})();
				var comparedKdr = (function(){
					var temp = itachi['kdr'] - results[1]['avg_kdr'];  
					if (temp > 0){
						return "+" + temp.toFixed(2).toString();
					} else {
						return temp.toFixed(2).toString();
					}
				})();
				var comparedDmg = (function(){
					var temp = itachi['damage_done'] - results[1]['avg_dmg'];
					if (temp > 0){
						return "+" + temp.toFixed(2).toString();
					} else {
						return temp.toFixed(2).toString();
					}
				})();
				const embed = new Discord.MessageEmbed()
				    .setTitle(itachi['username'] + '\'s Recent Match: ' + res)
					.setThumbnail('https://www.chicagomag.com/images/2019/0419/C201904-F-I-Got-a-Guy-Spice-Adams.jpg')
					.addFields(
							   {name: 'Kills: ', value: "`" + itachi['kills'] + "` *(" + comparedKills + ")*",inline: true},
					           {name: 'Deaths:', value: "`" + itachi['deaths']  + "` *(" + comparedDeaths + ")*", inline: true},
							   {name: 'DMG: ', value: "`" + itachi['damage_done']  + "` *(" + comparedDmg + ")*",inline: true},
							   {name: 'KDR:', value: "`" + itachi['kdr'].toFixed(2) + "` *(" + comparedKdr + ")*", inline: true},
							   {name: 'Placement:', value: "`" + itachi['team_placement'] + "`",inline:true},
							   {name: '\u200B', value: '\u200B',inline:false},
							   {name: 'Lobby Avg Kills:', value: "`" + results[1]['avg_kills'] + "`",inline:true},
							   {name: 'Lobby Avg Deaths:', value: "`" + results[1]['avg_deaths']+ "`",inline:true},
							   {name: 'Lobby Avg DMG:', value: "`" + results[1]['avg_dmg']+ "`",inline:true},
							   {name: 'Lobby Avg KDR:', value: "`" + results[1]['avg_kdr'] + "`",inline:true}
							   
							   )
					.setColor('#f50057')
					.setFooter('Bot by kristiantud using call-of-duty-api','https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fblogs-images.forbes.com%2Frusselldorsey%2Ffiles%2F2019%2F01%2FCreme-Biggums-1200x675.jpg')
					.setTimestamp();
					message.channel.send(embed);
			});
		});
		
	}
	
	// disconnect the bot completely
	if (message.content === '!stop'){
		client.destroy();

	}
	
	
});
















