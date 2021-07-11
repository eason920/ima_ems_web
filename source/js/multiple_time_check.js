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

const fnTime = function(build_index, time){
	const target = $('.build:eq('+build_index+')');
	let text = '';
	if( location.href.split('hh=')[1] ){
		// console.log('use set time');
		dataTimeObj.hh = location.href.split('hh=')[1].split('&')[0];
		dataTimeObj.mm = location.href.split('mm=')[1].split('&')[0];
		text = '2021/07/01-'+dataTimeObj.hh+':'+dataTimeObj.mm

	}else{
		// console.log('use api time');
		const dataBasic = time.split('-')[1].split(':');
		dataTimeObj.hh = dataBasic[0];
		dataTimeObj.mm = dataBasic[1];
		text = time;
	};
	
	dataTimeObj.timer = Number(dataTimeObj.hh * 60) + Number(dataTimeObj.mm);
	
	// ----------------------------
	const nowBasic = new Date();
	nowTimeObj.hh = nowBasic.getHours();
	nowTimeObj.mm = nowBasic.getMinutes();
	nowTimeObj.timer = Number(nowTimeObj.hh * 60) + Number(nowTimeObj.mm);
	
	const check = nowTimeObj.timer - 15 >= dataTimeObj.timer ? 'true' : 'false';
	target.find('.build-time-date span').text(text);
	target.find('.build-time').attr('data-err', check);
};