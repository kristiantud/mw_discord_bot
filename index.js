// more docs: https://www.npmjs.com/package/call-of-duty-api
// psn, steam, xbl, battle, uno


// discord init
const Discord = require("discord.js");
const client = new Discord.Client();

// the bot token
const token = ""; 
const username = "";
const pswrd = "";

// init cod-api module
const API = require('call-of-duty-api')();



// use this function to get the match id 
// returns the match id 
async function getMatchId(gamertag, platform,gameNumber) {
  const login = await API.login(username, pswrd ).catch((err) => console.log(err));
  const summary = await API.MWfullcombatwz(gamertag, platform).catch((err) => console.log(err));
  //console.log(summary.weekly.mode.br_brquads);

  // console.log(summary[0].matchId);
  return summary[gameNumber].matchId;
}


// finds stats on multiple entities
// only takes the latest match
// will have: teammate stats, pro stats, etc
// 0 - lobby
// 1 - myStats
// 2 - teamStats
// 3 - proStats
async function getMatchStatsById(matchId, platform){
	const login = await API.login(username, pswrd).catch((err) => console.log(err));
    const summary = await API.MWFullMatchInfowz(matchId, platform).catch((err) => console.log(err));
	
	let teamCount = summary.allPlayers[0].teamCount; // total teams
	let playerCount = summary.allPlayers[0].playerCount; // total players
	let allPlayers = summary.allPlayers.sort((a, b) => Number(a.playerStats.teamPlacement) - Number(b.playerStats.teamPlacement));
	
	//console.log(allPlayers[0]);

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
				  
				  
	// lobby's stats
	let lobbyStats = {
					  'lobby_winners' : [],
					  'lobbyScore' : 0,
					  'totalPlayers' : playerCount,
					  'totalTeams' : teamCount,
					  'damage_leader' : '',
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
					  'total_kdr_team' : [],
					  'last_10_team_avg_kills' : 0,
					  'last_10_team_avg_deaths' : 0,
					  'last_10_team_avg_kdr' : 0,
					  'last_10_team_avg_damage' : 0
					};
	
	
	// holds stats of other players not me or teammates
	var otherPlayers = {};
	
	// holds total kills of a team
	let teamTotalKills = [];
	let teamKillHolder = 0;
	
	// holds total deaths of a team
	let teamTotalDeaths = [];
	let teamDeathHolder = 0;
	
	// holds total kdr of a team
	let teamTotalKdr = [];
	let teamKdrHolder = 0;
	
	// holds total damage of a team
	let teamTotalDmg = [];
	let teamDmgHolder = 0;
	
	
	// calculate the lobby's total score
	let lobbyScore = 0;

	// looks at every player in a match
	for (x = 0 ; x < allPlayers.length; x++)
	{
		if (allPlayers[x].playerStats.teamPlacement == 1)
		{	
			var temp = {};	 
			temp['username'] = allPlayers[x].player.username;
			temp['kills'] = allPlayers[x].playerStats.kills;
			temp['damage_done'] =  allPlayers[x].playerStats.damageDone;
			lobbyStats['lobby_winners'].push(temp);
			temp = {};
		}
	
				
		
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
		
		// getting average of all the players
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
			myStats['acti'] = allPlayers[x].player.uno;
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
			otherPlayers['acti'] = allPlayers[x].player.uno;
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
		  allPlayers[x].player.username === "Symfuhny" || 
		  allPlayers[x].player.username === "AydaN" ||
		  allPlayers[x].player.username === "shroud" ||
		  allPlayers[x].player.username === "jackfragss")
		{
			otherPlayers['username'] = allPlayers[x].player.username;
			otherPlayers['clantag'] = allPlayers[x].player.clantag;
			otherPlayers['acti'] = allPlayers[x].player.uno;
			otherPlayers['kills'] = allPlayers[x].playerStats.kills;
			otherPlayers['deaths'] = allPlayers[x].playerStats.deaths;
			otherPlayers['damage_done'] = allPlayers[x].playerStats.damageDone;
			otherPlayers['kdr'] = allPlayers[x].playerStats.kdRatio;
			otherPlayers['team_placement'] = allPlayers[x].playerStats.teamPlacement;
			
			proStats.push(otherPlayers);
			otherPlayers = {};
		}
		

		// adds stats of a player 
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
	
	// assigning the killLeader and dmgLeader
	lobbyStats['kill_leader'] = killLeader;
	lobbyStats['kill_leader_kills'] = killLeaderKills;
	lobbyStats['damage_leader'] = dmgLeader;
	lobbyStats['damage_leader_dmg'] = dmgLeaderDmg;
	
	
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
	
	var lastTenKills = 0;
	var lastTenDeaths = 0;
	var lastTenKdr = 0;
	var lastTenDamage = 0;
	
	// put last 10 team stats into allStats
	for (x = 0; x < 10; x++)
	{
		lastTenKills += teamTotalKills[x];
		lastTenDeaths += teamTotalDeaths[x];
		lastTenKdr += teamTotalKdr[x];
		lastTenDamage += teamTotalDmg[x];
	}
	lobbyStats['last_10_team_avg_kills'] = lastTenKills / 10;
	lobbyStats['last_10_team_avg_deaths'] = lastTenDeaths / 10;
	lobbyStats['last_10_team_avg_kdr'] = lastTenKdr / 10;
	lobbyStats['last_10_team_avg_damage'] = lastTenDamage / 10;
	
	
	
	// put all data of match into allStats 
	allStats.push(lobbyStats);
	allStats.push(myStats);
	allStats.push(teamStats);
	allStats.push(proStats);
	
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

// returns string of +/- for kills
function comparedKillsToString(kills, lobbyStats){
	var temp = kills - lobbyStats['avg_kills_player']; 
	if (temp > 0){
		return "+" + temp.toFixed(2).toString();
	} else {
		return temp.toFixed(2).toString();
	}
}

// returns string of +/- for deaths
function comparedDeathsToString(deaths,lobbyStats){
	var temp = deaths - lobbyStats['avg_deaths_player']; 
	if (temp > 0){
		return "+" + temp.toFixed(2).toString();
	} else {
		return temp.toFixed(2).toString();
	}
}
// returns string of +/- for kdr							
function comparedKdrToString(kdr, lobbyStats){
	var temp = kdr - lobbyStats['avg_kdr_player'];  
	if (temp > 0){
		return "+" + temp.toFixed(2).toString();
	} else {
		return temp.toFixed(2).toString();
	}
}
// returns string of +/- for damage					
function comparedDamageToString(damageDone, lobbyStats){
	var temp = damageDone - lobbyStats['avg_dmg_player']; 
	if (temp > 0){
		return "+" + temp.toFixed(2).toString();
	} else {
		return temp.toFixed(2).toString();
	}
}

// makes the embed to give to discord
function makeEmbed(myStats, lobbyStats, teamStats){
	let mostKills = findMax(lobbyStats['total_kills_team']);
	let mostDmg = findMax(lobbyStats['total_dmg_team']);
	let winners = "--------------------------------------------\n";
	
	
	for (x = 0; x < lobbyStats.lobby_winners.length; x++)
	{
		winners = winners + "**" + lobbyStats.lobby_winners[x].username + "**'s kills: " + "`" + lobbyStats.lobby_winners[x].kills + "` | Damage: `" + lobbyStats.lobby_winners[x].damage_done + "`\n";
	}
	
	const embed = new Discord.MessageEmbed()
	.setDescription("--------------------------------------------")
	.addField("🏆 Your team placed " + myStats['team_placement'] + " out of " + lobbyStats['totalTeams'] + " 🏆","--------------------------------------------",false)
	.addField("Lobby Winner(s)", winners + "--------------------------------------------", false)
	.addField(myStats['username'] + '\'s stats:',' 🔪 Kills: ' + "`" + myStats['kills'] + ' (' + comparedKillsToString(myStats['kills'], lobbyStats) + ')`' + 
												 ' | ☠️ Deaths: ' + "`" + myStats['deaths'] + ' (' + comparedDeathsToString(myStats['deaths'], lobbyStats) + ')`' + 
												 ' | 📊 KDR: ' + "`" + myStats['kdr'].toFixed(2) + ' (' + comparedKdrToString(myStats['kdr'], lobbyStats) + ')`' + 
												 ' | 🔥 Damage: ' + "`" + myStats['damage_done'] + ' (' + comparedDamageToString(myStats['damage_done'], lobbyStats) + ')`' ,false);
	
	for (x = 0; x < teamStats.length; x++)
	{
		if (x == teamStats.length - 1) 
		{
			embed.addField(teamStats[x].username + "'s stats", '🔪 Kills: ' + "`" + teamStats[x]['kills'] + ' (' + comparedKillsToString(teamStats[x]['kills'], lobbyStats) + ')`' + 
												 ' | ☠️ Deaths: ' + "`" + teamStats[x]['deaths'] + ' (' + comparedDeathsToString(teamStats[x]['deaths'], lobbyStats) + ')`' + 
												 ' | 📊 KDR: ' + "`" + teamStats[x]['kdr'].toFixed(2) + ' (' + comparedKdrToString(teamStats[x]['kdr'], lobbyStats) + ')`' + 
												 ' | 🔥 Damage: ' + "`" + teamStats[x]['damage_done'] + ' (' + comparedDamageToString(teamStats[x]['damage_done'], lobbyStats) + ')`' +
												 "\n--------------------------------------------",false);
		} else {
			embed.addField(teamStats[x].username + "'s stats", '🔪 Kills: ' + "`" + teamStats[x]['kills'] + ' (' + comparedKillsToString(teamStats[x]['kills'], lobbyStats) + ')`' + 
												 ' | ☠️ Deaths: ' + "`" + teamStats[x]['deaths'] + ' (' + comparedDeathsToString(teamStats[x]['deaths'], lobbyStats) + ')`' + 
												 ' | 📊 KDR: ' + "`" + teamStats[x]['kdr'].toFixed(2) + ' (' + comparedKdrToString(teamStats[x]['kdr'], lobbyStats) + ')`' + 
												 ' | 🔥 Damage: ' + "`" + teamStats[x]['damage_done'] + ' (' + comparedDamageToString(teamStats[x]['damage_done'], lobbyStats) + ')`',false);
		}
	}
												 
	embed.addField("Decimator" , "- The lobby's __kill leader(s)__: " + "**" + lobbyStats['kill_leader'] + "**" + " with " + "**" + lobbyStats['kill_leader_kills'] + "**" + " kills.")
	.addField("The Feared" , "- " + "**" + lobbyStats['damage_leader'] + "**" + " dealt the __most damage__ with " + "**" + lobbyStats['damage_leader_dmg'] + "**" + " damage done.")
	.addField("Us vs. Them","- Your team __clapped__ a total of " + "**" + lobbyStats['total_kills_team'][myStats['team_placement'] - 1] + "**" + " cheeks -- " + 
								"the average kills of the last 10 teams is  " + "**" + lobbyStats['last_10_team_avg_kills'] + "**"  + "." + 
													"\n- Your team __dealt__ a total of " + "**" + lobbyStats['total_dmg_team'][myStats['team_placement']-1] + "**" + " damage -- " + 
								"the average damage dealt by the last 10 teams is " + "**" + lobbyStats['last_10_team_avg_damage'] + "**" + "." + 
													"\n- The __most total kills__ by a team in the lobby is " + "**" + mostKills + "**" + "." +
													"\n- The __most total damage done__ by a team in the lobby is " + "**" + mostDmg + "**" + "."
													,false)
	
	.setColor('#00bfff')
	.setFooter('Bot by kristiantud using call-of-duty-api','https://image-aws-us-west-2.vsco.co/db219f/140039794/5e602b5d92794d00422bd0b8/vsco5e602b5d3bf87.jpg')
	.setTimestamp();
	
	return embed;
}

// make embed for pros
function makeEmbedPro(proStats){
	const msgEmbed = new Discord.MessageEmbed()
							.setTitle("Twitch streamer(s) in lobby")
							.setDescription("**Note:** *Some players are known to copy streamer usernames. Check the clantag for more verification.*");
					for (x = 0; x < proStats.length; x++) 
					{
						msgEmbed.addField("[" + proStats[x].clantag + "] " + proStats[x].username + "'s stats", '🔪 Kills: ' + "`" + proStats[x]['kills'] + "`" + 
																 ' | ☠️ Deaths: ' + "`" + proStats[x]['deaths'] + "`" +
																 ' | 📊 KDR: ' + "`" + proStats[x]['kdr'].toFixed(2) + "`" + 
																 ' | 🔥 Damage: ' + "`" + proStats[x]['damage_done'] + "`" + 
																 ' | 🏆 Placement: ' + "`" + proStats[x]['team_placement'] + "`",false);
					}
					msgEmbed.setColor('#00bfff')
					.setFooter('Bot by kristiantud using call-of-duty-api','https://image-aws-us-west-2.vsco.co/db219f/140039794/5e602b5d92794d00422bd0b8/vsco5e602b5d3bf87.jpg')
					.setTimestamp();
					
	return msgEmbed;
}

async function getIds(n){
	// loop n times and get the matchIds
	var nMatchIds = [];
	// return the array that holds all n matchIds
	for (x = 0; x < n; x++)
	{
		var currMatchId = await getMatchId("her0#11341", "battle", x);
		nMatchIds.push(currMatchId);
	}
	
	return nMatchIds;
}


async function getWarzoneStats(gamertag, platform){
	const login = await API.login(username, pswrd).catch((err) => console.log(err));
    const summary = await API.MWBattleData(gamertag, platform).catch((err) => console.log(err));
	
	console.log(summary);
}



// ================================ discord stuff ======================================= //
var interval;
const prefix = "!";

// discord bot goes online
client.login(token);


// tell the console that the bot is working
client.on('ready',function (){
	console.log(client.user.username + " is functional.");
	
});

// handle message from the user
client.on('message',function(message){
	if (!message.content.startsWith(prefix)){
		return;
	}
	
	const args = message.content.trim().split(/ +/g);
	const command = args[0].slice(prefix.length).toLowerCase();
	
	var time = new Date();
	var hour = (time.getHours()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
	var minutes = (time.getMinutes()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
	var seconds = time.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
	var currentTime = hour + ":" + minutes + ":" + seconds + " ";
	
	// tell the console the command given
	if (message.author.tag != client.user.username + "#9514"){
		console.log(currentTime + `command given by ${message.author.tag}: ` + message.content);
	}
	
	// tell the bot to start looking for new matches
	if (command === 'start'){
		
		message.channel.send("`" + client.user.username + " is searching for new matches to analyze... `");
		interval = setInterval(function(){

		},10000);	
	}
	
	// tell the bot tos top looking for new matches
	if (command === 'stop'){
		clearInterval(interval);
		message.channel.send("`" + client.user.username + " stopped looking for new matches.`");
	}
	
	
	// 0 - lobby
	// 1 - myStats
	// 2 - teamStats
	// 3 - proStats
	if (command === 'recent')
	{
		let matchid;
		if (args[1] == null){
			matchid = getMatchId("her0#11341","battle", 0);
			message.channel.send("`Analyzing itachi's most recent match...`");
			
			matchid.then(function (result) {
				let gameStats = getMatchStatsById(result, "battle");
				gameStats.then(function(allStats){
					let mode = "";
					let lobbyStats = allStats[0];
					let myStats = allStats[1];
					let teamStats = allStats[2];
					let proStats = allStats[3];
					//console.log("lobby score: " + lobbyStats.lobbyScore);

		
					if (teamStats.length == 0){
						mode = "Solos";
					} else if (teamStats.length == 1){
						mode = "Duos";
					} else if (teamStats.length == 2){
						mode = "Trios";
					} else {
						mode = "Quads";
					}
				
					// var discordColor = "```diff\n" + comparedKills + "\n```";
		
					// this is the message being sent to discord
					const embed = makeEmbed(myStats,lobbyStats,teamStats);
					embed.setTitle(myStats['username'] + '\'s Recent ' + mode + ' Match: ' + result)

					message.channel.send(embed);
		
					
					// if pro player is found in the lobby, send it to discord
					if (proStats.length != 0)
					{
						const proEmbed = makeEmbedPro(proStats);
						message.channel.send(proEmbed);
					}
				});
			});	
		} else if (isNaN(args[1])){
			message.channel.send("`Argument given must be a number.`");
		} else if (args[1] == 0) {
			message.channel.send("`Argument given must be greater than 1.`");
		} else {
			let suffix = '';
			if (args[1] == 1)
			{
				suffix = "st";
			} else if (args[1] == 2) {
				suffix = "nd";
			} else if (args[1] == 3) {
				suffix = "rd";
			} else {
				suffix = "th";
			}
			
			
			matchid = getMatchId("her0#11341","battle", args[1] - 1);
			message.channel.send("`" + `Analyzing itachi's ${args[1]}${suffix} recent match...` + "`");

			matchid.then(function (result) {
				let gameStats = getMatchStatsById(result, "battle");
				gameStats.then(function(allStats){
					let mode = "";
					let lobbyStats = allStats[0];
					let myStats = allStats[1];
					let teamStats = allStats[2];
					let proStats = allStats[3];

					if (teamStats.length == 0){
						mode = "Solos";
					} else if (teamStats.length == 1){
						mode = "Duos";
					} else if (teamStats.length == 2){
						mode = "Trios";
					} else {
						mode = "Quads";
					}
				
					// var discordColor = "```diff\n" + comparedKills + "\n```";
		
					// this is the message being sent to discord
					const embed = makeEmbed(myStats,lobbyStats,teamStats);
					embed.setTitle(myStats['username'] + `\'s ${args[1]}${suffix} Recent ` + mode + ' Match: ' + result)

					message.channel.send(embed);
		
					
					// if pro player is found in the lobby, send it to discord
					if (proStats.length != 0)
					{
						const proEmbed = makeEmbedPro(proStats);
						message.channel.send(proEmbed);
					}
				});
			});				
		}
	}
});











