let dataTime = '';
let dataTimeObj = {
	hh: 0,
	mm: 0,
	timer: 0
};

let nowTimeObj = {
	hh: 0,
	mm: 0,
	timer: 0
};

const fnTime = function(time){
	// console.log('----------------');
	// console.log( location.href.split('hh=')[1] != undefined );
	if( location.href.split('hh=')[1] ){
		console.log('use set time');
		dataTimeObj.hh = location.href.split('hh=')[1].split('&')[0];
		dataTimeObj.mm = location.href.split('mm=')[1].split('&')[0];
		$('#times-now span').text('2021/07/01-'+dataTimeObj.hh+':'+dataTimeObj.mm);

	}else{
		// console.log('use api time');
		$('#times-now span').text(time);
		const dataBasic = time.split('-')[1].split(':');
		dataTimeObj.hh = dataBasic[0];
		dataTimeObj.mm = dataBasic[1];
	};

	dataTimeObj.timer = Number(dataTimeObj.hh * 60) + Number(dataTimeObj.mm);
	// console.log('timer is ', dataTimeObj.timer);
	
	// ----------------------------
	const nowBasic = new Date();
	nowTimeObj.hh = nowBasic.getHours();
	nowTimeObj.mm = nowBasic.getMinutes();
	nowTimeObj.timer = Number(nowTimeObj.hh * 60) + Number(nowTimeObj.mm);
	// console.log('now is ', nowTimeObj.timer);
	// ----------------------------
	// console.log('>15?', (nowTimeObj.timer - 15) >= dataTimeObj.timer  );
	if( (nowTimeObj.timer - 15) >= dataTimeObj.timer ){
		$('#times-err').show();
	}else{
		$('#times-err').hide();
	}
};