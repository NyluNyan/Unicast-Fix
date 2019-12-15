const brooches = [999001044, 999001045, 999001035, 999001036, 999001030, 999001029, 999001033, 999001032];
let users = [],
timer = null;

module.exports = function UnicastFix(mod) {

	mod.game.on('leave_loading_screen', () => {
		if(!timer && users.length) timer = mod.setInterval(Clear, 5000);
    });
	
	mod.hook('S_ABNORMALITY_BEGIN', 4, (event) => {
		if(brooches.includes(event.id)) users.push(event.target, Date.now());
    });
	
	mod.hook('S_SPAWN_USER', 15, (event) => 
	{
		if(users.length && users.includes(event.gameId))
		{
			var index = users.indexOf(event.gameId)+1;
			if(Date.now()-20000 > users[index]) users.splice(index-1, 2);
		}
    });
	
	mod.hook('S_UNICAST_TRANSFORM_DATA', 6, (event) => {
		if(users.includes(event.gameId))
		{
			var index = users.indexOf(event.gameId)+1;
			if(Date.now()-1000 > users[index]) users.splice(index-1, 2);
			return false;
		}
	});
	
	function Clear()
	{
		var length = users.length,
		date = Date.now();
		for(i = 0; i < length; i+=2) 
		{
			if(date-users[i+1] > 20000)
			{
				users.splice(i, 2);
				length-=2;
				i-=2;
			}
		}
		if(!length)
		{
			mod.clearInterval(timer);
			timer = null;
		}
	}
};