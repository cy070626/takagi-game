/* Chat navigation and optional illustration UI. Loaded with the dialogue bundle. */
let lastSceneImage='';
function addSceneImage(row,key,expanded=false){
 if(!expanded&&lastSceneImage===key)return;
 const image=globalThis.TakagiChatHub.image(key);if(!image)return;lastSceneImage=key;
 const card=document.createElement('details');card.className='chat-scene-image';card.open=expanded;
 const summary=textEl('summary','▧ 站内情境配图 · '+image.label);const figure=document.createElement('figure');
 const picture=document.createElement('img');picture.alt=image.label+'，站内已有的情境配图';picture.loading='lazy';picture.decoding='async';picture.width=960;picture.height=540;
 const reveal=()=>{if(card.open&&!picture.getAttribute('src'))picture.src=image.src};card.addEventListener('toggle',reveal);
 picture.onerror=()=>{picture.hidden=true;figure.querySelector('figcaption').textContent='这张配图暂时没加载出来，可以继续按文字想象情境。'};
 figure.append(picture,textEl('figcaption',image.detail+' 本站已有配图，不是即时生成或联网检索结果。'));
 card.append(summary,figure);row.append(card);reveal();
}
async function runChatAction(action,text){
 busy=true;syncComposer();add('user',text);input.value='';let reply;
 try{
  if(action.type==='image')reply='找到一张站内已有的'+action.label+'配图。先看看，再沿着这个画面聊吧。';
  else if(action.type==='image-choice')reply='站内有雨天教室、夕阳、海边和星空这些画面。你想看哪一种，可以直接告诉我。';
  else if(action.type==='poetry'){const trigger=document.getElementById('poetry-open');if(!trigger)throw Error('诗集入口暂时未加载');trigger.click();if(!document.querySelector('.poetry-modal[open]'))throw Error('诗集窗口暂时未打开');reply='诗集给你打开了。可以先读一首，也可以留下你自己的那句。'}
  else {await loadExtras();await globalThis.TakagiSiteFeatures.loadGames();if(action.type==='music'){if(!globalThis.TakagiMusicTheater)throw Error('音乐入口暂时未加载');globalThis.TakagiMusicTheater.open();reply='音乐小剧场给你打开了。先选个场景吧，刚才没说完的，回来再接着聊。♪'}else{if(!globalThis.TakagiArcade)throw Error('游戏入口暂时未加载');globalThis.TakagiArcade.open(action.type==='games'?null:action.type);reply=action.type==='games'?'小游戏展开了。挑一局吧，难度还是由你自己选。':'给你打开'+action.label+'了。玩完回来，跟我说说这一局。'}}
  const row=add('assistant',reply,'warm');if(action.type==='image')addSceneImage(row,action.key,true);
  rememberTurn(text,reply);globalThis.TakagiVisitMemory?.record('聊天导航',text,action.label);speak(reply,'warm');
  $('#ai-status').textContent='站内操作已执行 · 对话已保留 · 未调用 AI 接口';renderSuggestions(action.type==='image-choice'?['给我看雨天教室的图片','给我看海边的图片','给我看星空的图片']:['回来接着聊','刚才的话我还没说完','我想看看雨天的配图']);
 }catch(error){reply='这次没能直接打开'+action.label+'。你可以用页面上的原入口再试一次，刚才的对话还在。';const row=add('assistant',reply,'quiet');if(action.href){const a=textEl('a','点击打开'+action.label,'chat-feature-link');a.href=action.href;a.target='_blank';a.rel='noopener noreferrer';row.append(a)}input.value=text;$('#ai-status').textContent=error.message||'站内入口暂时不可用';}
 finally{busy=false;syncComposer();document.querySelectorAll('#suggestions button').forEach(b=>b.disabled=false)}
}
