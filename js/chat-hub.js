/* Fixed site destinations and local illustration catalog. Never execute model URLs. */
(() => {
 const images=Object.freeze({
  classroom:{src:'./assets/music-scenes/sunset-classroom-thumb.webp',label:'夕阳教室',detail:'桌沿的光慢慢移开，走廊里的脚步声渐远。'},
  morning:{src:'./assets/music-scenes/morning-classroom-thumb.webp',label:'清晨教室',detail:'窗边亮起来，课本还没有翻开。'},
  rain:{src:'./assets/music-scenes/rain-classroom-thumb.webp',label:'雨天教室',detail:'雨滴沿着玻璃往下走，话也可以慢一点。'},
  seaside:{src:'./assets/music-scenes/seaside-station-thumb.webp',label:'海边车站',detail:'海风经过站台，下一班车还没到。'},
  stars:{src:'./assets/music-scenes/starry-night-thumb.webp',label:'星空之夜',detail:'远处的灯暗了一点，抬头能看见夜空。'},
  festival:{src:'./assets/music-scenes/summer-festival-thumb.webp',label:'夏日祭典',detail:'摊位的灯亮着，第一束烟花还没有升起。'},
  library:{src:'./assets/music-scenes/library-dusk-thumb.webp',label:'图书馆夕暮',detail:'书页翻过一小角，黄昏的光留在桌边。'},
  sakura:{src:'./assets/music-scenes/sakura-path-thumb.webp',label:'樱花小路',detail:'花瓣在路边停了一会儿，可以慢慢走。'},
  winter:{src:'./assets/music-scenes/winter-window-thumb.webp',label:'冬日窗边',detail:'窗外的雪很轻，屋里还有一处暖和的位置。'}
 });
 const destinations={music:{label:'音乐小剧场',href:'./pages/music-theater.html'},games:{label:'小游戏',href:null},mind:{label:'猜心对决',href:'./games/mind-duel.html?v=98'},eraser:{label:'橡皮对决',href:'./games/eraser-duel.html?v=98'},poetry:{label:'诗集分享',href:null}};
 function intent(value){const text=String(value||'').trim();if(!text||/不要|不想|不去|别打开|不用打开|别带我|以后再|下次再|能不能不/.test(text))return null;
  const ask=/打开|带我|我们去|一起去|我想去|想进入|我要去|去听|想听|听点|听会|去玩|想玩|来一局|玩一局|做个|做一个|做点|我想做|我想写|看一看|看看|给我看|找.*图/;
  if(!ask.test(text))return null;
  if(globalThis.TakagiInteractiveCard?.requested(text))return null;
  if(/音乐小剧场|小剧场|听点音乐|听会音乐|听音乐/.test(text))return{type:'music',...destinations.music};
  if(/猜心/.test(text))return{type:'mind',...destinations.mind};
  if(/橡皮.*对决|橡皮小游戏|玩.*橡皮/.test(text))return{type:'eraser',...destinations.eraser};
  if(/小游戏|玩个游戏|玩一局游戏|游戏中心/.test(text))return{type:'games',...destinations.games};
  if(/诗集|写.*诗|创作.*诗/.test(text))return{type:'poetry',...destinations.poetry};
  if(/图片|配图|画面|照片/.test(text)){
   const key=/雨|伞/.test(text)?'rain':/烟花|夏日祭/.test(text)?'festival':/海边|车站/.test(text)?'seaside':/星|夜空/.test(text)?'stars':/樱花/.test(text)?'sakura':/图书馆|阅读/.test(text)?'library':/冬|雪/.test(text)?'winter':/清晨|早晨/.test(text)?'morning':/教室|夕阳|黄昏/.test(text)?'classroom':null;
   return key?{type:'image',key,label:images[key].label}:{type:'image-choice',label:'站内情境图库'};
  }
  return null;
 }
 const image=key=>Object.prototype.hasOwnProperty.call(images,key)?images[key]:null;
 globalThis.TakagiChatHub=Object.freeze({intent,image,images,destinations});
})();
