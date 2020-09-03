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
/*
async function getMatchInformation(matchId, platform) {
  const login = await API.login("username", "password").catch((err) => console.log(err));
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
    
  

}
*/

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

// finds stats on multiple entities
// only takes the latest match
// will have: teammate stats, pro stats, etc

// 0 - lobby
// 1 - myStats
// 2 - teamStats
// 3 - proStats
async function inspectForEvents(matchId, platform){
	const login = await API.login("", "").catch((err) => console.log(err));
    const summary = await API.MWFullMatchInfowz(matchId, platform).catch((err) => console.log(err));
	
	let teamCount = summary.allPlayers[0].teamCount; // total teams
	let playerCount = summary.allPlayers[0].playerCount; // total players
	let allPlayers = summary.allPlayers.sort((a, b) => Number(a.playerStats.teamPlacement) - Number(b.playerStats.teamPlacement));

	let killLeader = "";
	let killLeaderKills = 0;
	let dmgLeader = "";
	let dmgLeaderDmg = 0;
	
	// for player lobby average
	let totalKillsPlayer = 0; 
	let totalDeathsPlayer = 0;
	let totalKdrPlayer = 0;
	let totalDmgPlayer = 0;
	
	let allStats = []; // will hold all stats gathered
	let teamStats = []; // will hold stats of my team
	let proStats = []; // will hold stats of pros
	
	// my stats
	let myStats = {   'clantag' : '',
					  'kills' : 0,
					  'deaths' : 0,
					  'damage_done' : 0,
					  'kdr' : 0,
					  'team_placement' : 0
				  };
				  
	let lobbyStats = {'damage_leader' : '',
					  'damage_leader_dmg':0,
					  'kill_leader' : '',
					  'kill_leader_kills' : 0,
					  'avg_kills_player' : 0,
					  'avg_deaths_player' : 0,
					  'avg_kdr_player' : 0,
					  'avg_dmg_player' : 0,
					  'avg_kills_team' : 0,
					  'avg_deaths_team' : 0, 
					  'avg_kdr_team' : 0,
					  'avg_dmg_team' : 0,
					  'total_kills_team' : [],
					  'total_deaths_team' : [],
					  'total_dmg_team' : [],
					  'total_kdr_team' : []
					};
				  
	var otherPlayers = {};
					  
	let teamTotalKills = [];
	let teamKillHolder = 0;
	
	let teamTotalDeaths = [];
	let teamDeathHolder = 0;
	
	let teamTotalKdr = [];
	let teamKdrHolder = 0;
	
	let teamTotalDmg = [];
	let teamDmgHolder = 0;
	

	for (x = 0 ; x < allPlayers.length; x++)
	{
		
		
		// current player becomes kill leader if they meet the criteria
		if (allPlayers[x].playerStats.kills > killLeaderKills)
		{
			killLeader = allPlayers[x].player.username;
			killLeaderKills = allPlayers[x].playerStats.kills;
		} else if (allPlayers[x].playerStats.kills == killLeaderKills) {
			killLeader = killLeader + ", " + allPlayers[x].player.username; 
		}
		
		// current player becomes damage leader if they meet the criteria
		if (allPlayers[x].playerStats.damageDone > dmgLeaderDmg)
		{
			dmgLeader = allPlayers[x].player.username;
			dmgLeaderDmg = allPlayers[x].playerStats.damageDone;
		} else if (allPlayers[x].playerStats.damageDone == dmgLeaderDmg) {
			dmgLeader = dmgLeader + ", " + allPlayers[x].player.username; 
		}
		
		// getting average of all the teams
		totalKillsPlayer += allPlayers[x].playerStats.kills;
		totalDeathsPlayer += allPlayers[x].playerStats.deaths;
		totalKdrPlayer += allPlayers[x].playerStats.kdRatio;
		totalDmgPlayer += allPlayers[x].playerStats.damageDone;
		
		// getting my stats
		if (allPlayers[x].player.username === 'itachi' )
		{
			myStats['username'] = allPlayers[x].player.username;
			myStats['clantag'] = allPlayers[x].player.clantag;
			myStats['kills'] = allPlayers[x].playerStats.kills;
			myStats['deaths'] = allPlayers[x].playerStats.deaths;
			myStats['damage_done'] = allPlayers[x].playerStats.damageDone;
			myStats['kdr'] = allPlayers[x].playerStats.kdRatio;
			myStats['team_placement'] = allPlayers[x].playerStats.teamPlacement;
		}
		
		// getting stats of teammates
		if (allPlayers[x].player.username === "Legacy0_o" || 
		  allPlayers[x].player.username === "x3TuD3x" ||
		  allPlayers[x].player.username === "LazyFlame" ||
		  allPlayers[x].player.username === "FunGuy" ||
		  allPlayers[x].player.username === "Simon_SaysHi" ||
		  allPlayers[x].player.username === "BlankFrog" ||
		  allPlayers[x].player.username === "CrispyCahl" ||
		  allPlayers[x].player.username === "DanKo" ||
		  allPlayers[x].player.username === "ElCapitan306")
		{
			
		
			
			otherPlayers['username'] = allPlayers[x].player.username;
			otherPlayers['clantag'] = allPlayers[x].player.clantag;
			otherPlayers['kills'] = allPlayers[x].playerStats.kills;
			otherPlayers['deaths'] = allPlayers[x].playerStats.deaths;
			otherPlayers['damage_done'] = allPlayers[x].playerStats.damageDone;
			otherPlayers['kdr'] = allPlayers[x].playerStats.kdRatio;
			otherPlayers['team_placement'] = allPlayers[x].playerStats.teamPlacement;
						
			teamStats.push(otherPlayers);
			otherPlayers = {};
				
		}
		
		// getting stats of potential pro players
		if (allPlayers[x].player.username === "Nickmercs" || 
		  allPlayers[x].player.username === "SypherPk" ||
		  allPlayers[x].player.username === "Trash_Fue" ||
		  allPlayers[x].player.username === "Doozy" ||
		  allPlayers[x].player.username === "K3" ||
		  allPlayers[x].player.username === "Vikkstar123" || 
		  allPlayers[x].player.username === "timthetatman" ||
		  allPlayers[x].player.username === "cloakzy" || 
		  allPlayers[x].player.username === "Daequan" || 
		  allPlayers[x].player.username === "HusKerrs" || 
		  allPlayers[x].player.username === "Symfuhny")
		{
			otherPlayers['username'] = allPlayers[x].player.username;
			otherPlayers['clantag'] = allPlayers[x].player.clantag;
			otherPlayers['kills'] = allPlayers[x].playerStats.kills;
			otherPlayers['deaths'] = allPlayers[x].playerStats.deaths;
			otherPlayers['damage_done'] = allPlayers[x].playerStats.damageDone;
			otherPlayers['kdr'] = allPlayers[x].playerStats.kdRatio;
			otherPlayers['team_placement'] = allPlayers[x].playerStats.teamPlacement;
			
			proStats.push(otherPlayers);
			otherPlayers = {};
		}
		

		
		if (teamTotalKills.length == allPlayers[x].playerStats.teamPlacement - 1){
			teamKillHolder += allPlayers[x].playerStats.kills;
			teamDeathHolder += allPlayers[x].playerStats.deaths;
			teamKdrHolder += allPlayers[x].playerStats.kdRatio;
			teamDmgHolder += allPlayers[x].playerStats.damageDone;
		} else {
			teamTotalKills.push(teamKillHolder);
			teamTotalDeaths.push(teamDeathHolder);
			teamTotalKdr.push(teamKdrHolder);
			teamTotalDmg.push(teamDmgHolder);
			
			
			teamKillHolder = 0;
			teamDeathHolder = 0;
			teamKdrHolder = 0;
			teamDmgHolder = 0;
			
			teamKillHolder += allPlayers[x].playerStats.kills;
			teamDeathHolder += allPlayers[x].playerStats.deaths;
			teamKdrHolder += allPlayers[x].playerStats.kdRatio;
			teamDmgHolder += allPlayers[x].playerStats.damageDone;
		}
	}
	
	lobbyStats['kill_leader'] = killLeader;
	lobbyStats['kill_leader_kills'] = killLeaderKills;
	lobbyStats['damage_leader'] = dmgLeader;
	lobbyStats['damage_leader_dmg'] = dmgLeaderDmg;
	
	//console.log(teamTotalKills);
	//console.log("average kills per team: " + totalKillsPlayer / teamCount);
	//console.log("average deaths per team: " + totalDeathsPlayer / teamCount);
	//console.log("average dmg done per team: " + totalDmgPlayer / teamCount);
	//console.log("average kdr per team: " + totalKdrPlayer / teamCount);
	
	// for avg player stats
	lobbyStats['avg_kills_player'] = (totalKillsPlayer / playerCount).toFixed(2);
	lobbyStats['avg_deaths_player'] = (totalDeathsPlayer / playerCount).toFixed(2);
	lobbyStats['avg_kdr_player'] = (totalKdrPlayer / playerCount).toFixed(2);
	lobbyStats['avg_dmg_player'] = (totalDmgPlayer / playerCount).toFixed(2);
	
	// for avg team stats
	lobbyStats['avg_kills_team'] = (totalKillsPlayer / teamCount).toFixed(2);
	lobbyStats['avg_deaths_team'] = (totalDeathsPlayer / teamCount).toFixed(2);
	lobbyStats['avg_kdr_team'] = (totalKdrPlayer / teamCount).toFixed(2);
	lobbyStats['avg_dmg_team'] = (totalDmgPlayer / teamCount).toFixed(2);
	
	// totals by team
	lobbyStats['total_kills_team'] = teamTotalKills;
	lobbyStats['total_deaths_team'] = teamTotalDeaths;
	lobbyStats['total_kdr_team'] =  teamTotalKdr;
	lobbyStats['total_dmg_team'] = teamTotalDmg;
	
	//console.log(myStats);
	//console.log(teamStats);
	
	allStats.push(lobbyStats);
	allStats.push(myStats);
	allStats.push(teamStats);
	allStats.push(proStats);
	
	
	
	//console.log(allStats);
	return allStats;

}

// TODO: remove this and use the inspect function instead
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
		if(summary.allPlayers[x].player.username === 'itachi')
		{
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


// finds the max value in an array
function findMax(anArray){
	var maxValue = 0;
	for (x = 0; x < anArray.length; x++)
	{
		if (anArray[x] > maxValue)
		{
			maxValue = anArray[x];
		}
	}
	return maxValue;
	
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
						
						
					}else{
						console.log("no new games found.");
						//client.channels.cache.find(x => x.name === 'test').send("No new games yet.");
					}
				});
			});	
		},1000);
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
	
	
	// 0 - lobby
	// 1 - myStats
	// 2 - teamStats
	// 3 - proStats
	if (message.content === '!recentMatchTeam')
	{
		let matchid = getMatchId("her0#11341","battle");
		
		matchid.then(function (result) {
			let gameStats = inspectForEvents(result, "battle");
			gameStats.then(function(allStats){
				//console.log(allStats);
				
				let lobbyStats = allStats[0];
				let myStats = allStats[1];
				let teamStats = allStats[2];
				let proStats = allStats[3];
				let mostKills = findMax(lobbyStats['total_kills_team']);
				let mostDmg = findMax(lobbyStats['total_dmg_team']);
				
				/*
				const embed = new Discord.MessageEmbed()
				    .setTitle(myStats['username'] + '\'s Recent Match: ' + result)
					.setThumbnail('https://www.chicagomag.com/images/2019/0419/C201904-F-I-Got-a-Guy-Spice-Adams.jpg')
					.setDescription('---------------------\nYour Placement: ' + myStats['team_placement'] + "\n---------------------")
					.addFields({name: 'Player: ', value: myStats['username'], inline:true},
							   {name: 'Kills: ', value:  myStats['kills'] ,inline: true},
					           {name: 'Deaths:', value:  myStats['deaths']  , inline: true},
							   {name: 'DMG: ', value: myStats['damage_done'] ,inline: true},
							   {name: 'KDR:', value: myStats['kdr'].toFixed(2), inline: true},
							   {name: '\u200B', value: '---------------------',inline:false}
							   )
					.addFields(
							   {name: 'Player: ', value: teamStats[0]['username'] , inline:true},
							   {name: 'Kills: ', value: teamStats[0]['kills'] ,inline: true},
					           {name: 'Deaths:', value: teamStats[0]['deaths']  , inline: true},
							   {name: 'DMG: ', value: teamStats[0]['damage_done']  ,inline: true},
							   {name: 'KDR:', value: teamStats[0]['kdr'].toFixed(2) , inline: true},
							   {name: '\u200B', value: '---------------------',inline:false}
							   )
					.addFields(
							   {name: 'Player: ', value: teamStats[1]['username'], inline:true},
							   {name: 'Kills: ', value: teamStats[1]['kills'] ,inline: true},
					           {name: 'Deaths:', value: teamStats[1]['deaths'] , inline: true},
							   {name: 'DMG: ', value:  teamStats[1]['damage_done']  ,inline: true},
							   {name: 'KDR:', value: teamStats[1]['kdr'].toFixed(2) , inline: true},
							   {name: '\u200B', value: '---------------------',inline:false}
							   )
					.addFields(
							   {name: 'Player: ', value: teamStats[2]['username'], inline:true},
							   {name: 'Kills: ', value: teamStats[2]['kills'],inline: true},
					           {name: 'Deaths:', value: teamStats[2]['deaths'] , inline: true},
							   {name: 'DMG: ', value: teamStats[2]['damage_done'] ,inline: true},
							   {name: 'KDR:', value: teamStats[2]['kdr'].toFixed(2) , inline: true},
							   {name: '\u200B', value: '---------------------',inline:false}
							   )
					.setColor('#f50057')
					.setFooter('Bot by kristiantud using call-of-duty-api','https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fblogs-images.forbes.com%2Frusselldorsey%2Ffiles%2F2019%2F01%2FCreme-Biggums-1200x675.jpg')
					.setTimestamp();
					message.channel.send(embed);
					*/
					
					const embed = new Discord.MessageEmbed()
				    .setTitle(myStats['username'] + '\'s Recent Match: ' + result)
					.setThumbnail('https://qph.fs.quoracdn.net/main-qimg-f693b62575b6609c1c863424122e5ff9')
					//.setDescription('---------------------\n🏆🏆🏆🏆🏆🏆\nYour Placement: ' + "`" + myStats['team_placement'] + "`"+ "\n🏆🏆🏆🏆🏆🏆\n---------------------")
					.setDescription("--------------------------------------------")
					.addField("🏆 Your Team Placed @ Top " + myStats['team_placement'] + " 🏆","--------------------------------------------",false)
					.addField(myStats['username'] + '\'s stats:','🔪 Kills: ' + "`" + myStats['kills'] + "`" + 
																 ' | ☠️ Deaths: ' + "`" + myStats['deaths'] + "`" +
																 ' | 📊 KDR: ' + "`" + myStats['kdr'].toFixed(2) + "`" + 
																 ' | 🔥 Damage: ' + "`" + myStats['damage_done'] + "`",false)
																 
					.addField(teamStats[0]['username'] + '\'s stats:','🔪 Kills: ' + "`" + teamStats[0]['kills'] + "`" + 
																 ' | ☠️ Deaths: ' + "`" + teamStats[0]['deaths'] + "`" +
																 ' | 📊 KDR: ' + "`" + teamStats[0]['kdr'].toFixed(2) + "`" + 
																 ' | 🔥 Damage: ' + "`" + teamStats[0]['damage_done'] + "`" ,false)
																 
					.addField(teamStats[1]['username'] + '\'s stats:','🔪 Kills: ' + "`" + teamStats[1]['kills'] + "`" + 
																 ' | ☠️ Deaths: ' + "`" + teamStats[1]['deaths'] + "`" +
																 ' | 📊 KDR: ' + "`" + teamStats[1]['kdr'].toFixed(2) + "`" + 
																 ' | 🔥 Damage: ' + "`" + teamStats[1]['damage_done'] + "`" ,false)
																 
					.addField(teamStats[2]['username'] + '\'s stats:','🔪 Kills: ' + "`" + teamStats[2]['kills'] + "`" + 
																 ' | ☠️ Deaths: ' + "`" + teamStats[2]['deaths'] + "`" +
																 ' | 📊 KDR: ' + "`" + teamStats[2]['kdr'].toFixed(2) + "`" + 
																 ' | 🔥 Damage: ' + "`" + teamStats[2]['damage_done'] + "`" +
																 "\n--------------------------------------------",false)

					.addField("Decimator" , "- The lobby's __kill leader(s)__: " + "**" + lobbyStats['kill_leader'] + "**" + " with " + "**" + lobbyStats['kill_leader_kills'] + "**" + " kills.")
					.addField("The Feared" , "- " + "**" + lobbyStats['damage_leader'] + "**" + " dealt the __most damage__ with " + "**" + lobbyStats['damage_leader_dmg'] + "**" + " damage done.")
					.addField("Us vs. Them","- Your team __clapped a total of__ " + "**" + lobbyStats['total_kills_team'][myStats['team_placement'] - 1] + "**" + " *cheeks* -- " + 
												"the lobby average for team kills is  " + "**" + lobbyStats['avg_kills_team'] + "**"  + "." + 
																	"\n- Your team __dealt__ a total of " + "**" + lobbyStats['total_dmg_team'][myStats['team_placement']-1] + "**" + " __damage__ -- " + 
												"the lobby average for team damage dealt is " + "**" + lobbyStats['avg_dmg_team'] + "**" + "." + 
																	"\n- The __most total kills__ by a team in the lobby is " + "**" + mostKills + "**" + "." +
																	"\n- The __most total damage done__ by a team in the lobby is " + "**" + mostDmg + "**" + "."
																	,false)
					
					.setColor('#00bfff')
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


/*
let matchid = getMatchId("her0#11341", "battle");
						matchid.then(function(resultId){
							
							inspectForEvents(resultId,"battle");
							
						});
*/















