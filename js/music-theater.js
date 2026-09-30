(() => {
  const track = (title, artist, spotifyPath = '') => ({ title, artist, spotifyPath });
  const scenes = [
    { id:'sunset-classroom', title:'夕阳教室', subtitle:'放学后的温柔时光', line:'放学后的光，好像总会慢一点。', jp:'もう少しだけ、ここにいよう。', tags:['放学','黄昏','教室','温柔'], image:'../assets/music-scenes/sunset-classroom-thumb.webp', thumb:'../assets/music-scenes/sunset-classroom-thumb.webp', tracks:[track('言わないけどね。· 轻音乐版','Healing Energy','track/73i0sZghaTn3pTstAojS4h'),track('CHE.R.RY','YUI','track/6NwbLKUMofh30fW7ulukPa'),track('点描の唄','Mrs. GREEN APPLE、井上苑子','track/1sIIlVrnPhrvmTrHtzM7tV'),track('花束','back number','track/3wGesqRt3l2D4ZmYCv9A11')] },
    { id:'morning-classroom', title:'清晨教室', subtitle:'新一天的开始', line:'新的一天开始以前，先听一会儿窗边的风。', jp:'今日も、ゆっくり始めよう。', tags:['清晨','教室','晴天','轻盈'], image:'../assets/music-scenes/morning-classroom-thumb.webp', thumb:'../assets/music-scenes/morning-classroom-thumb.webp', tracks:[track('晴る','ヨルシカ','track/5pjIPylCGX0aa3rKKGjY9l'),track('青と夏','Mrs. GREEN APPLE','track/5BC6kr6etk2Y9J62AyI4i3'),track('青春ライン','いきものがかり','track/1QOEiN1xHnub1zTWFZsqsz'),track('Summer','久石譲','track/23HUlzt20YuALl5Q2gWsKu')] },
    { id:'sakura-path', title:'樱花小路', subtitle:'春风里的绕路', line:'花落得很慢，所以绕一点路也来得及。', jp:'桜の道を、もう少し。', tags:['樱花','春日','散步','相遇'], image:'../assets/music-scenes/sakura-path-thumb.webp', thumb:'../assets/music-scenes/sakura-path-thumb.webp', tracks:[track('マリーゴールド','あいみょん','track/2cKiHG16JBiqHdi7Llq0r7'),track('花束','back number','track/3wGesqRt3l2D4ZmYCv9A11'),track('点描の唄','Mrs. GREEN APPLE、井上苑子','track/1sIIlVrnPhrvmTrHtzM7tV'),track('CHE.R.RY','YUI','track/6NwbLKUMofh30fW7ulukPa')] },
    { id:'seaside-station', title:'海边车站', subtitle:'海风经过的瞬间', line:'海风经过站台，下一班车还没有来。', jp:'次の電車まで、ここにいよう。', tags:['海边','车站','暑假','青春'], image:'../assets/music-scenes/seaside-station-thumb.webp', thumb:'../assets/music-scenes/seaside-station-thumb.webp', tracks:[track('海の見える街','久石譲','track/2ZJ28Rm7OXMYJshLtp5uff'),track('夏色','ゆず','track/6pcpDyQ7V9UZznOCRYdDzk'),track('ただ君に晴れ','ヨルシカ','track/3wJHCry960drNlAUGrJLmz'),track('Summer','久石譲','track/23HUlzt20YuALl5Q2gWsKu')] },
    { id:'rain-classroom', title:'雨天教室', subtitle:'雨声中的小小心事', line:'雨还没有停，今天可以晚一点回去。', jp:'雨が止むまで、話そう。', tags:['雨天','窗边','等待','回忆'], image:'../assets/music-scenes/rain-classroom-thumb.webp', thumb:'../assets/music-scenes/rain-classroom-thumb.webp', tracks:[track('花に亡霊','ヨルシカ','track/3FUqp10RhCmMjyyB9extmo'),track('雨愛','杨丞琳','track/553GNiNqcudWfsF55RBDqz'),track('One more time, One more chance','山崎まさよし','track/5YRDGgdOshUPA17m7yzY7p'),track('The Truth That You Leave','PianoBoy 高至豪','track/7jacBMxZycfjN8XF9ByJdk')] },
    { id:'starry-night', title:'星空之夜', subtitle:'一起看星星', line:'抬头的时候，刚好有一颗星经过。', jp:'同じ星を、君と見ている。', tags:['星空','流星','未来','陪伴'], image:'../assets/music-scenes/starry-night-thumb.webp', thumb:'../assets/music-scenes/starry-night-thumb.webp', tracks:[track('天体観測','BUMP OF CHICKEN','track/2eBIaTAW8i8Q7GMotWojdH'),track('secret base · 翻唱版','Silent Siren','track/3be6Zn0YgK7sZnfLwbO2SA'),track('Sparkle','RADWIMPS','track/0iFtzXn8VM0pfJ2szdVV4p'),track('あの夏へ','久石譲','track/3gFQOMoUwlR6aUZj81gCzu')] },
    { id:'summer-festival', title:'夏日祭典', subtitle:'最特别的夏夜', line:'烟花升起以后，别忘了看看身边的人。', jp:'花火より、君を見ていた。', tags:['夏日祭','烟花','浴衣','心动'], image:'../assets/music-scenes/summer-festival-thumb.webp', thumb:'../assets/music-scenes/summer-festival-thumb.webp', tracks:[track('打上花火','DAOKO、米津玄師','track/4IouQaO9GkaHC7AtMErdSa'),track('すずめ','RADWIMPS、十明','track/7LHAKF7pBqHch8o6Yo0ad5'),track('点描の唄','Mrs. GREEN APPLE、井上苑子','track/1sIIlVrnPhrvmTrHtzM7tV'),track('青と夏','Mrs. GREEN APPLE','track/5BC6kr6etk2Y9J62AyI4i3')] },
    { id:'library-dusk', title:'图书馆夕暮', subtitle:'安静的阅读时光', line:'翻页的声音很轻，黄昏也没有催促。', jp:'この頁の続きは、また明日。', tags:['图书馆','黄昏','阅读','安静'], image:'../assets/music-scenes/library-dusk-thumb.webp', thumb:'../assets/music-scenes/library-dusk-thumb.webp', tracks:[track('The Truth That You Leave','PianoBoy 高至豪','track/7jacBMxZycfjN8XF9ByJdk'),track('花束','back number','track/3wGesqRt3l2D4ZmYCv9A11'),track('小半','陈粒','track/3QxWTqyIT4O9bokIZlNDpo'),track('心墙','郭静','track/0FjrLvldGA3kiwLBxv2PSD')] },
    { id:'winter-window', title:'冬日窗边', subtitle:'有你在的冬天', line:'外面正在下雪，窗边的位置还空着。', jp:'寒い日は、少し近くに。', tags:['冬日','窗边','雪景','陪伴'], image:'../assets/music-scenes/winter-window-thumb.webp', thumb:'../assets/music-scenes/winter-window-thumb.webp', tracks:[track('水平線','back number','track/3RvdkNMcSy71m0aT6UF9Uf'),track('花束','back number','track/3wGesqRt3l2D4ZmYCv9A11'),track('Lemon','米津玄師','album/4Ezkdjk13wY1bdXc5kDJHG'),track('夜曲','周杰伦','album/6rRydp9XlVoLfTtA3qpWcn')] }
  ];

  const supplementTracks = [
    {title:'高木同学相关歌曲合集',artist:'Spotify 播放列表',group:'takagi',spotifyPath:'playlist/1TMUPfOkFt14T4Oooms47Y',kind:'playlist'},
    {title:'言わないけどね。',artist:'大原ゆい子',group:'takagi'},
    {title:'奏（かなで）',artist:'高木さん CV：高橋李依',group:'takagi'},
    {title:'まっすぐ',artist:'大原ゆい子',group:'takagi',spotifyPath:'album/5tevxwcyqvOsB9POVTXCCx',kind:'album'},
    {title:'secret base ～君がくれたもの～',artist:'ZONE',group:'japan'},
    {title:'夜に駆ける',artist:'YOASOBI',group:'japan',spotifyPath:'track/6MCjmGYlw6mQVWRFVgBRvB'},
    {title:'青のすみか',artist:'キタニタツヤ',group:'japan',spotifyPath:'album/4QjNVlIw8Rx6jItSZtn2VS',kind:'album'},
    {title:'Sparkle',artist:'RADWIMPS',group:'japan',spotifyPath:'track/0iFtzXn8VM0pfJ2szdVV4p'},
    {title:'ただ君に晴れ',artist:'ヨルシカ',group:'japan',spotifyPath:'track/3wJHCry960drNlAUGrJLmz'},
    {title:'夏色',artist:'ゆず',group:'japan',spotifyPath:'track/6pcpDyQ7V9UZznOCRYdDzk'},
    {title:'夏色 · 音乐盒版',artist:'オルゴール',group:'japan',spotifyPath:'track/1aM670OV3H7hMynLI0oOwC'},
    {title:'One more time, One more chance',artist:'山崎まさよし',group:'japan',spotifyPath:'track/5YRDGgdOshUPA17m7yzY7p'},
    {title:'晴る',artist:'ヨルシカ',group:'japan',spotifyPath:'track/5pjIPylCGX0aa3rKKGjY9l'},
    {title:'花に亡霊',artist:'ヨルシカ',group:'japan',spotifyPath:'track/3FUqp10RhCmMjyyB9extmo'},
    {title:'打上花火',artist:'DAOKO、米津玄師',group:'japan',spotifyPath:'track/4IouQaO9GkaHC7AtMErdSa'},
    {title:'Lemon',artist:'米津玄師',group:'japan',spotifyPath:'album/4Ezkdjk13wY1bdXc5kDJHG',kind:'album'},
    {title:'すずめ',artist:'RADWIMPS、十明',group:'japan',spotifyPath:'track/7LHAKF7pBqHch8o6Yo0ad5'},
    {title:'天体観測',artist:'BUMP OF CHICKEN',group:'japan',spotifyPath:'track/2eBIaTAW8i8Q7GMotWojdH'},
    {title:'青春ライン',artist:'いきものがかり',group:'japan',spotifyPath:'track/1QOEiN1xHnub1zTWFZsqsz'},
    {title:'マリーゴールド',artist:'あいみょん',group:'japan',spotifyPath:'track/2cKiHG16JBiqHdi7Llq0r7'},
    {title:'CHE.R.RY',artist:'YUI',group:'japan',spotifyPath:'track/6NwbLKUMofh30fW7ulukPa'},
    {title:'青と夏',artist:'Mrs. GREEN APPLE',group:'japan',spotifyPath:'track/5BC6kr6etk2Y9J62AyI4i3'},
    {title:'点描の唄',artist:'Mrs. GREEN APPLE、井上苑子',group:'japan',spotifyPath:'track/1sIIlVrnPhrvmTrHtzM7tV'},
    {title:'あの夏へ',artist:'久石譲',group:'instrumental',spotifyPath:'track/3gFQOMoUwlR6aUZj81gCzu'},
    {title:'海の見える街',artist:'久石譲',group:'instrumental',spotifyPath:'track/2ZJ28Rm7OXMYJshLtp5uff'},
    {title:'Summer',artist:'久石譲',group:'instrumental',spotifyPath:'track/23HUlzt20YuALl5Q2gWsKu'},
    {title:'The Truth That You Leave',artist:'PianoBoy 高至豪',group:'instrumental',spotifyPath:'track/7jacBMxZycfjN8XF9ByJdk'},
    {title:'所念皆星河 · 钢琴版',artist:'CMJ',group:'instrumental'},
    {title:'雨愛',artist:'杨丞琳',group:'china',spotifyPath:'track/553GNiNqcudWfsF55RBDqz'},
    {title:'夜曲',artist:'周杰伦',group:'china',spotifyPath:'album/6rRydp9XlVoLfTtA3qpWcn',kind:'album'},
    {title:'心墙',artist:'郭静',group:'china',spotifyPath:'track/0FjrLvldGA3kiwLBxv2PSD'},
    {title:'演员',artist:'薛之谦',group:'china',spotifyPath:'track/6LunoYd3xpZ19sICOXS8Xd'},
    {title:'小半',artist:'陈粒',group:'china',spotifyPath:'track/3QxWTqyIT4O9bokIZlNDpo'},
    {title:'红色高跟鞋',artist:'蔡健雅',group:'china',spotifyPath:'track/5DSF1VTSaaAFIesJLlltuM'},
    {title:'南山南',artist:'马頔',group:'china',spotifyPath:'track/2cLDcQZ9ahJsYIcawKHezi'},
    {title:'夜，萤火虫和你',artist:'北北昼',group:'china'},
    {title:'所念皆星河',artist:'CMJ',group:'china'},
    {title:'葬花',artist:'THT',group:'china'},
    {title:'鸟之诗',artist:'Strictlyviolin 荀博',group:'china'},
    {title:'第57次取消发送',artist:'菲菲公主',group:'china'},
    {title:'如果时光倒流回到过去',artist:'YuZi',group:'china'},
    {title:'其实',artist:'薛之谦',group:'china'}
  ];

  const directTracks = [];

  const $ = selector => document.querySelector(selector);
  const theater = $('#theater'), current = $('#scene-current'), next = $('#scene-next');
  const savedId = localStorage.getItem('takagi-music-scene');
  let sceneIndex = Math.max(0, scenes.findIndex(scene => scene.id === savedId));
  let trackIndex = 0, transitionTimer = 0, localUrl = '';

  function spotifyUrl(item, embed = false) {
    if (item.spotifyPath) return `https://open.spotify.com/${embed ? 'embed/' : ''}${item.spotifyPath}${embed ? '?utm_source=generator&theme=0' : ''}`;
    return `https://open.spotify.com/search/${encodeURIComponent(`${item.title} ${item.artist}`)}`;
  }

  function notify(action) {
    const scene = scenes[sceneIndex], item = scene.tracks[trackIndex];
    window.parent?.postMessage({ type:'takagi-music-theater', action, sceneId:scene.id, sceneTitle:scene.title, thumb:scene.thumb, trackTitle:item.title, artist:item.artist }, location.origin);
  }

  function renderTrack() {
    const scene = scenes[sceneIndex], item = scene.tracks[trackIndex];
    $('#track-title').textContent = item.title; $('#peek-title').textContent = item.title; $('#track-artist').textContent = item.artist;
    const frame = $('#player-frame'); frame.replaceChildren();
    if (item.spotifyPath) {
      const iframe = document.createElement('iframe'); iframe.title = `Spotify 播放器：${item.title}`; iframe.src = spotifyUrl(item, true); iframe.loading = 'eager'; iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'; iframe.setAttribute('allowfullscreen',''); frame.append(iframe);
      $('#player-note').textContent = 'Spotify 音量请在播放器或设备中调节。本地音乐不会上传。';
    } else {
      const note = document.createElement('div'); note.className = 'spotify-search'; note.textContent = 'Spotify 暂未提供可确认的嵌入地址。可以使用下方按钮搜索这首歌。'; frame.append(note);
      $('#player-note').textContent = '搜索结果会在 Spotify 官方页面打开，请核对歌手名称。';
    }
    $('#open-spotify').href = spotifyUrl(item);
    $('#track-list').querySelectorAll('button').forEach((button, index) => button.setAttribute('aria-pressed', String(index === trackIndex)));
    notify('state');
  }

  function renderTrackList() {
    const list = $('#track-list'); list.replaceChildren();
    scenes[sceneIndex].tracks.forEach((item, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.setAttribute('aria-pressed', String(index === trackIndex));
      const title = document.createElement('b'), artist = document.createElement('small'); title.textContent = item.title; artist.textContent = item.artist; button.append(title, artist);
      button.onclick = () => { trackIndex = index; $('#local-player').pause(); $('#local-player').hidden = true; renderTrack(); };
      list.append(button);
    });
  }

  function renderScene(first = false) {
    const scene = scenes[sceneIndex]; localStorage.setItem('takagi-music-scene', scene.id); theater.dataset.scene = scene.id;
    $('#scene-number').textContent = `${String(sceneIndex + 1).padStart(2,'0')} / ${String(scenes.length).padStart(2,'0')}`;
    $('#scene-title').textContent = scene.title; $('#scene-subtitle').textContent = scene.subtitle; $('#scene-line').textContent = scene.line; $('#scene-jp').textContent = scene.jp;
    $('#scene-tags').replaceChildren(...scene.tags.map(value => { const tag = document.createElement('span'); tag.textContent = value; return tag; }));
    if (first) current.style.backgroundImage = `url("${scene.image}")`;
    else {
      clearTimeout(transitionTimer); next.style.backgroundImage = `url("${scene.image}")`; next.style.opacity = '1';
      transitionTimer = window.setTimeout(() => { current.style.backgroundImage = next.style.backgroundImage; next.style.opacity = '0'; }, 820);
    }
    $('#scene-rail').querySelectorAll('button').forEach((button, index) => button.setAttribute('aria-pressed', String(index === sceneIndex)));
    trackIndex = 0; renderTrackList(); renderTrack();
  }

  function makeRail() {
    scenes.forEach((scene, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'scene-card'; button.setAttribute('aria-label', `切换到${scene.title}`); button.setAttribute('aria-pressed', String(index === sceneIndex));
      const image = document.createElement('img'); image.src = scene.thumb; image.alt = ''; image.loading = index < 3 ? 'eager' : 'lazy';
      const label = document.createElement('span'); label.textContent = `${String(index + 1).padStart(2,'0')} ${scene.title}`; button.append(image, label);
      button.onclick = () => { if (index === sceneIndex) return; sceneIndex = index; renderScene(); };
      $('#scene-rail').append(button);
    });
  }

  const supplementFilters = [
    ['all','全部收藏'],['playable','可直接播放'],['takagi','高木相关'],['japan','日语歌曲'],['china','中文歌曲'],['instrumental','轻音乐'],['direct','免登录播放']
  ];
  let supplementFilter = 'all';

  function supplementSearchUrl(item) {
    return `https://open.spotify.com/search/${encodeURIComponent(`${item.title} ${item.artist}`)}`;
  }

  function showSupplementTrack(item) {
    const player = $('#supplement-player'); player.replaceChildren();
    const heading = document.createElement('div'); heading.className = 'supplement-now';
    const text = document.createElement('div');
    const eyebrow = document.createElement('small'); eyebrow.textContent = item.audio ? '免登录播放' : item.kind === 'playlist' ? '官方播放列表' : item.kind === 'album' ? '专辑入口' : 'Spotify 官方播放器';
    const title = document.createElement('h3'); title.textContent = item.title;
    const artist = document.createElement('p'); artist.textContent = item.artist;
    text.append(eyebrow,title,artist); heading.append(text); player.append(heading);
    if (item.audio) {
      const audio = document.createElement('audio'); audio.controls = true; audio.autoplay = true; audio.src = item.audio; player.append(audio);
      const credit = document.createElement('p'); credit.className = 'supplement-credit'; credit.textContent = '来自 Wikimedia Commons 的公版录音。可直接播放，音量由此播放器控制。'; player.append(credit);
    } else if (item.spotifyPath) {
      const iframe = document.createElement('iframe'); iframe.title = `Spotify 播放器：${item.title}`; iframe.src = spotifyUrl(item,true); iframe.loading = 'eager'; iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'; iframe.setAttribute('allowfullscreen',''); player.append(iframe);
      const link = document.createElement('a'); link.href = spotifyUrl(item); link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = '在 Spotify 中打开'; player.append(link);
    } else {
      const message = document.createElement('div'); message.className = 'supplement-search-message'; message.innerHTML = '<strong>暂未找到可确认的嵌入版本</strong><p>这首歌仍保留在收藏中。点击下方按钮后，请在 Spotify 核对歌名和歌手。</p>';
      const link = document.createElement('a'); link.href = supplementSearchUrl(item); link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = '去 Spotify 查找'; message.append(link); player.append(message);
    }
  }

  function renderSupplement() {
    const all = [...directTracks,...supplementTracks];
    const visible = all.filter(item => supplementFilter === 'all' || supplementFilter === 'playable' ? supplementFilter === 'all' || Boolean(item.spotifyPath || item.audio) : item.group === supplementFilter);
    const list = $('#supplement-list'); list.replaceChildren();
    visible.forEach(item => {
      const card = document.createElement('button'); card.type = 'button'; card.className = 'supplement-card';
      const state = document.createElement('span'); state.className = item.spotifyPath || item.audio ? 'can-play' : 'search-only'; state.textContent = item.audio ? '免登录' : item.spotifyPath ? '可播放' : '需搜索';
      const copy = document.createElement('span'); const title = document.createElement('b'), artist = document.createElement('small'); title.textContent = item.title; artist.textContent = item.artist; copy.append(title,artist); card.append(state,copy);
      card.onclick = () => { list.querySelectorAll('button').forEach(node => node.removeAttribute('aria-current')); card.setAttribute('aria-current','true'); showSupplementTrack(item); };
      list.append(card);
    });
    $('#supplement-tabs').querySelectorAll('button').forEach(button => button.setAttribute('aria-selected',String(button.dataset.filter === supplementFilter)));
  }

  function setupSupplement() {
    const tabs = $('#supplement-tabs');
    supplementFilters.forEach(([value,label]) => {
      const button = document.createElement('button'); button.type = 'button'; button.role = 'tab'; button.dataset.filter = value; button.textContent = label;
      button.onclick = () => { supplementFilter = value; renderSupplement(); };
      tabs.append(button);
    });
    renderSupplement();
  }

  $('#collapse-player').onclick = () => { $('#player-panel').hidden = true; $('#player-peek').hidden = false; };
  $('#player-peek').onclick = () => { $('#player-panel').hidden = false; $('#player-peek').hidden = true; };
  $('#fit-toggle').onclick = event => { const complete = theater.dataset.fit === 'complete'; theater.dataset.fit = complete ? 'immersive' : 'complete'; event.currentTarget.textContent = `画面：${complete ? '沉浸' : '完整'}`; localStorage.setItem('takagi-music-fit', theater.dataset.fit); };
  $('#minimize').onclick = () => notify('minimize');
  function openSupplement() {
    $('#local-player').pause();
    $('#player-frame').replaceChildren();
    $('#supplement-dialog').showModal();
  }
  function closeSupplement() {
    $('#supplement-player').querySelector('audio')?.pause();
    $('#supplement-dialog').close();
    renderTrack();
  }
  $('#supplement-open').onclick = openSupplement;
  $('#supplement-close').onclick = closeSupplement;
  $('#supplement-dialog').addEventListener('click', event => { if (event.target === $('#supplement-dialog')) closeSupplement(); });
  $('#supplement-dialog').addEventListener('cancel', event => { event.preventDefault(); closeSupplement(); });
  $('#stop-close').onclick = () => { $('#local-player').pause(); $('#player-frame').replaceChildren(); notify('stop-close'); };
  $('#import-local').onclick = () => $('#local-file').click();
  $('#local-file').onchange = event => {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if ((!file.type.startsWith('audio/') && !['mp3','m4a','ogg','wav'].includes(extension)) || file.size > 200 * 1024 * 1024) { $('#player-note').textContent = '请选择不超过 200 MB 的 MP3、M4A、OGG 或 WAV 文件。'; return; }
    if (localUrl) URL.revokeObjectURL(localUrl); localUrl = URL.createObjectURL(file);
    const audio = $('#local-player'); audio.src = localUrl; audio.hidden = false; audio.play().catch(() => {});
    $('#track-title').textContent = file.name; $('#track-artist').textContent = '本地音乐'; $('#peek-title').textContent = file.name; $('#player-note').textContent = '本地文件只在当前页面播放，不会上传。';
  };

  theater.dataset.fit = localStorage.getItem('takagi-music-fit') || 'complete';
  $('#fit-toggle').textContent = `画面：${theater.dataset.fit === 'complete' ? '完整' : '沉浸'}`;
  makeRail(); setupSupplement(); renderScene(true); notify('ready');
  window.addEventListener('pagehide', () => { if (localUrl) URL.revokeObjectURL(localUrl); });
})();
