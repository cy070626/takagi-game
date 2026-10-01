(() => {
 const fx=TakagiSubtleEffects, status=document.getElementById('preview-status');
 fx.bindToggle(document.getElementById('chat-mode'),'chat-demo');fx.bindToggle(document.getElementById('music-mode'),'music');
 document.querySelectorAll('[data-effect]').forEach(button=>button.onclick=()=>{const kind=button.dataset.effect;document.getElementById('preview-message').textContent={cake:'生日快乐。这块小蛋糕，先留给你。🎂',firework:'看，烟花亮起来了。别只顾着看我呀。',petal:'花瓣落在你肩上了。先别动，我帮你拿下来。',snow:'外面开始下雪了。回去的时候慢一点呀。',confetti:'新年快乐。今年，也一起走回去吧。'}[kind];const played=fx.trigger(document.getElementById('chat-preview'),kind,'chat-demo',true);status.textContent=played?'正在播放，随后自动清理。':'已关闭、系统减少动态效果。';});
 document.querySelectorAll('[data-scene]').forEach(button=>button.onclick=()=>{const played=fx.trigger(document.getElementById(button.dataset.scene),button.dataset.scene,'music');document.getElementById('scene-status').textContent=played?'正在播放 '+button.textContent+'，播放结束后自动清理。':'场景特效已关闭或系统已减少动态效果，请检查上方开关。';});
})();
