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
async function getMatchId(gamertag, platform) {
  const login = await API.login(username, pswrd ).catch((err) => console.log(err));
  const summary = await API.MWfullcombatwz(gamertag, platform).catch((err) => console.log(err));
  //console.log(summary.weekly.mode.br_brquads);

  // console.log(summary[0].matchId);
  return summary[0].matchId;
}

// use this function to get games played count
async function checkGames(gamertag, plataform){
    const login = await API.login(username, pswrd).catch((err) => console.log(err));
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
	const login = await API.login(username, pswrd).catch((err) => console.log(err));
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
				  
	let lobbyStats = {
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
	
	//console.log(myStats);
	//console.log(teamStats);
	
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



let gamesPlayed = checkGames("her0#11341","battle");
var interval;



client.login(token);


// tell the console that the bot is working
client.on('ready',function (){
	console.log(client.user.username + " is functional.");
	
});

// handle message from the user
client.on('message',function(message){
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
	if (message.content === '!start'){
		
		message.channel.send(client.user.username + " is searching for new matches to analyze... ");
		interval = setInterval(function(){
			var time = new Date();
			var hour = (time.getHours()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
			var minutes = (time.getMinutes()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
			var seconds = time.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
			var currentTime = hour + ":" + minutes + ":" + seconds + " " ;


			// now look for games
			gamesPlayed.then(function(res){
				let newGameChecker = checkGames("her0#11341", "battle");
				newGameChecker.then(function(result){
					if (result > res){
						// new game found
						console.log(currentTime + "new game found. fetching information...");
						res = res + 1;
						
						let matchid = getMatchId("her0#11341","battle");
		
						matchid.then(function (result) {
							
							
							let gameStats = inspectForEvents(result, "battle");
							gameStats.then(function(allStats){
								var mode = "";
								let lobbyStats = allStats[0];
								let myStats = allStats[1];
								let teamStats = allStats[2];
								let proStats = allStats[3];
								let mostKills = findMax(lobbyStats['total_kills_team']);
								let mostDmg = findMax(lobbyStats['total_dmg_team']);
								
								if (teamStats.length == 0){
									mode = "Solos";
								} else if (teamStats.length == 1){
									mode = "Duos";
								} else if (teamStats.length == 2){
									mode = "Trios";
								} else {
									mode = "Quads";
								}
					
						
								const embed = new Discord.MessageEmbed()
									.setTitle(myStats['username'] + '\'s Recent ' + mode + ' Match: ' + result)
									.setDescription("--------------------------------------------")
									.addField("🏆 Your team placed " + myStats['team_placement'] + " out of " + lobbyStats['totalTeams'] + " 🏆","--------------------------------------------",false)
									.addField(myStats['username'] + '\'s stats:','🔪 Kills: ' + "`" + myStats['kills'] + "`" + 
																				 ' | ☠️ Deaths: ' + "`" + myStats['deaths'] + "`" +
																				 ' | 📊 KDR: ' + "`" + myStats['kdr'].toFixed(2) + "`" + 
																				 ' | 🔥 Damage: ' + "`" + myStats['damage_done'] + "`",false);
									
									for (x = 0; x < teamStats.length; x++)
									{
										embed.addField(teamStats[x].username + "'s stats", '🔪 Kills: ' + "`" + teamStats[x]['kills'] + "`" + 
																				 ' | ☠️ Deaths: ' + "`" + teamStats[x]['deaths'] + "`" +
																				 ' | 📊 KDR: ' + "`" + teamStats[x]['kdr'].toFixed(2) + "`" + 
																				 ' | 🔥 Damage: ' + "`" + teamStats[x]['damage_done'] + "`",false);
									}
																				 
									embed.addField("Decimator" , "- The lobby's __kill leader(s)__: " + "**" + lobbyStats['kill_leader'] + "**" + " with " + "**" + lobbyStats['kill_leader_kills'] + "**" + " kills.")
									.addField("The Feared" , "- " + "**" + lobbyStats['damage_leader'] + "**" + " dealt the __most damage__ with " + "**" + lobbyStats['damage_leader_dmg'] + "**" + " damage done.")
									.addField("Us vs. Them","- Your team __clapped__ a total of " + "**" + lobbyStats['total_kills_team'][myStats['team_placement'] - 1] + "**" + " cheeks -- " + 
																"the lobby average for team kills is  " + "**" + lobbyStats['avg_kills_team'] + "**"  + "." + 
																					"\n- Your team __dealt__ a total of " + "**" + lobbyStats['total_dmg_team'][myStats['team_placement']-1] + "**" + " damage -- " + 
																"the lobby average for team damage dealt is " + "**" + lobbyStats['avg_dmg_team'] + "**" + "." + 
																					"\n- The __most total kills__ by a team in the lobby is " + "**" + mostKills + "**" + "." +
																					"\n- The __most total damage done__ by a team in the lobby is " + "**" + mostDmg + "**" + "."
																					,false)
									
									.setColor('#00bfff')
									.setFooter('Bot by kristiantud using call-of-duty-api','https://image-aws-us-west-2.vsco.co/db219f/140039794/5e602b5d92794d00422bd0b8/vsco5e602b5d3bf87.jpg')
									.setTimestamp();
									message.channel.send(embed);
					
								
								if (proStats.length != 0)
								{
									const msgEmbed = new Discord.MessageEmbed()
											.setTitle("Twitch streamer(s) in lobby");
									for (x = 0; x < proStats.length; x++) 
									{
										msgEmbed.addField(proStats[x].username + "'s stats", '🔪 Kills: ' + "`" + proStats[x]['kills'] + "`" + 
																				 ' | ☠️ Deaths: ' + "`" + proStats[x]['deaths'] + "`" +
																				 ' | 📊 KDR: ' + "`" + proStats[x]['kdr'].toFixed(2) + "`" + 
																				 ' | 🔥 Damage: ' + "`" + proStats[x]['damage_done'] ,false);
									}
									msgEmbed.setColor('#00bfff')
									.setFooter('Bot by kristiantud using call-of-duty-api','https://image-aws-us-west-2.vsco.co/db219f/140039794/5e602b5d92794d00422bd0b8/vsco5e602b5d3bf87.jpg')
									.setTimestamp();
									message.channel.send(msgEmbed);
								}
							});
							
						});	
					}else{
						console.log(currentTime + "no new games found.");
						//client.channels.cache.find(x => x.name === 'test').send("No new games yet.");
					}
				});
			});	
		},60000);	
	}
	
	
	
	// 0 - lobby
	// 1 - myStats
	// 2 - teamStats
	// 3 - proStats
	if (message.content === '!recent')
	{
		let matchid = getMatchId("her0#11341","battle");
		
						matchid.then(function (result) {
							let gameStats = inspectForEvents(result, "battle");
							gameStats.then(function(allStats){
				
								let mode = "";
								let lobbyStats = allStats[0];
								let myStats = allStats[1];
								let teamStats = allStats[2];
								let proStats = allStats[3];
								let mostKills = findMax(lobbyStats['total_kills_team']);
								let mostDmg = findMax(lobbyStats['total_dmg_team']);
					
								if (teamStats.length == 0){
									mode = "Solos";
								} else if (teamStats.length == 1){
									mode = "Duos";
								} else if (teamStats.length == 2){
									mode = "Trios";
								} else {
									mode = "Quads";
								}
					
						
								const embed = new Discord.MessageEmbed()
									.setTitle(myStats['username'] + '\'s Recent ' + mode + ' Match: ' + result)
									.setDescription("--------------------------------------------")
									.addField("🏆 Your team placed " + myStats['team_placement'] + " out of " + lobbyStats['totalTeams'] + " 🏆","--------------------------------------------",false)
									.addField(myStats['username'] + '\'s stats:','🔪 Kills: ' + "`" + myStats['kills'] + "`" + 
																				 ' | ☠️ Deaths: ' + "`" + myStats['deaths'] + "`" +
																				 ' | 📊 KDR: ' + "`" + myStats['kdr'].toFixed(2) + "`" + 
																				 ' | 🔥 Damage: ' + "`" + myStats['damage_done'] + "`",false);
									
									for (x = 0; x < teamStats.length; x++)
									{
										embed.addField(teamStats[x].username + "'s stats", '🔪 Kills: ' + "`" + teamStats[x]['kills'] + "`" + 
																				 ' | ☠️ Deaths: ' + "`" + teamStats[x]['deaths'] + "`" +
																				 ' | 📊 KDR: ' + "`" + teamStats[x]['kdr'].toFixed(2) + "`" + 
																				 ' | 🔥 Damage: ' + "`" + teamStats[x]['damage_done'] + "`",false);
									}
																				 
									embed.addField("Decimator" , "- The lobby's __kill leader(s)__: " + "**" + lobbyStats['kill_leader'] + "**" + " with " + "**" + lobbyStats['kill_leader_kills'] + "**" + " kills.")
									.addField("The Feared" , "- " + "**" + lobbyStats['damage_leader'] + "**" + " dealt the __most damage__ with " + "**" + lobbyStats['damage_leader_dmg'] + "**" + " damage done.")
									.addField("Us vs. Them","- Your team __clapped__ a total of " + "**" + lobbyStats['total_kills_team'][myStats['team_placement'] - 1] + "**" + " cheeks -- " + 
																"the lobby average for team kills is  " + "**" + lobbyStats['avg_kills_team'] + "**"  + "." + 
																					"\n- Your team __dealt__ a total of " + "**" + lobbyStats['total_dmg_team'][myStats['team_placement']-1] + "**" + " damage -- " + 
																"the lobby average for team damage dealt is " + "**" + lobbyStats['avg_dmg_team'] + "**" + "." + 
																					"\n- The __most total kills__ by a team in the lobby is " + "**" + mostKills + "**" + "." +
																					"\n- The __most total damage done__ by a team in the lobby is " + "**" + mostDmg + "**" + "."
																					,false)
									
									.setColor('#00bfff')
									.setFooter('Bot by kristiantud using call-of-duty-api','https://image-aws-us-west-2.vsco.co/db219f/140039794/5e602b5d92794d00422bd0b8/vsco5e602b5d3bf87.jpg')
									.setTimestamp();
									message.channel.send(embed);
					
								
								if (proStats.length != 0)
								{
									const msgEmbed = new Discord.MessageEmbed()
											.setTitle("Twitch streamer(s) in lobby");
									for (x = 0; x < proStats.length; x++) 
									{
										msgEmbed.addField(proStats[x].username + "'s stats", '🔪 Kills: ' + "`" + proStats[x]['kills'] + "`" + 
																				 ' | ☠️ Deaths: ' + "`" + proStats[x]['deaths'] + "`" +
																				 ' | 📊 KDR: ' + "`" + proStats[x]['kdr'].toFixed(2) + "`" + 
																				 ' | 🔥 Damage: ' + "`" + proStats[x]['damage_done'] + 
																				 ' | 🏆 Placement: ' + "`" + proStats[x]['team_placement'],false);
									}
									msgEmbed.setColor('#00bfff')
									.setFooter('Bot by kristiantud using call-of-duty-api','https://image-aws-us-west-2.vsco.co/db219f/140039794/5e602b5d92794d00422bd0b8/vsco5e602b5d3bf87.jpg')
									.setTimestamp();
									message.channel.send(msgEmbed);
								}
							});
						});	
	}
	
	// disconnect the bot completely
	if (message.content === '!stop'){
		clearInterval(interval);
		message.channel.send(client.user.username + " stopped looking for new matches.");
	}
	
	
});











