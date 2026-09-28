(() => {
  const shelf = document.querySelector('.arcade-shelf');
  if (!shelf) return;
  const make = (tag, text = '', cls = '') => { const node = document.createElement(tag); if (text) node.textContent = text; if (cls) node.className = cls; return node };
  const shuffle = values => { const out = [...values]; for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]] } return out };
  let reactionLine = null;
  const say = (text, mood = 'playful') => {
    if (reactionLine) {
      reactionLine.dataset.mood = mood;
      reactionLine.textContent = `高木：${text}`;
      reactionLine.animate?.([{ opacity:.45, transform:'translateY(3px)' }, { opacity:1, transform:'translateY(0)' }], { duration:220, easing:'ease-out' });
    }
    try { if (typeof speak === 'function') speak(text, mood) } catch {}
  };
  const read = key => { try { return localStorage.getItem(key) || '' } catch { return '' } };
  const write = (key, value) => { try { localStorage.setItem(key, value) } catch {} };
  const levels = { easy: '入门', medium: '进阶', hard: '成人挑战', expert: '高阶' };
  const levelOrder = { easy: 0, medium: 1, hard: 2, expert: 3 };
  let difficulty = read('takagi-arcade-difficulty') || (typeof profile !== 'undefined' && levels[profile.difficulty] ? profile.difficulty : 'medium');
  const info = {
    code: { name: '数字密码', icon: '0·1', mode: '本地', time: '2–5 分钟', brief: '用位置反馈排除四位密码。' },
    words: { name: '禁止词', icon: '言', mode: '本地', time: '2–4 分钟', brief: '绕开诱导词完成五轮回答。' },
    gomoku: { name: '五子棋', icon: '●', mode: '本地', time: '3–8 分钟', brief: '在 9×9 棋盘和高木对弈。' },
    harmony: { name: '默契二选一', icon: '♡', mode: '本地', time: '2–3 分钟', brief: '同时选择，看看彼此会不会想到一起。' },
    truth: { name: '真假捉弄', icon: '?', mode: '本地', time: '3–5 分钟', brief: '找出三句话中唯一不成立的一句。' },
    chain: { name: '中日词语接龙', icon: 'し', mode: '本地', time: '3–6 分钟', brief: '选择中文或日语假名，与高木轮流接词。' },
    memory: { name: '记忆翻牌', icon: '▦', mode: '本地', time: '2–5 分钟', brief: '记住校园与季节图案的位置并完成配对。' },
    lateral: { name: '一句话推理', icon: '…', mode: '本地 / DeepSeek', time: '5–10 分钟', brief: '通过是非问题还原反常情境的真相。' },
    mind: { name: '猜心对决', icon: '心', mode: '独立玩法', time: '5–10 分钟', brief: '观察选项与反应，在误导中猜中高木的想法。', external: './games/mind-duel.html?v=62' },
    eraser: { name: '橡皮对决', icon: '橡', mode: '独立玩法', time: '3–8 分钟', brief: '控制力度和方向，把橡皮弹向得分区域。', external: './games/eraser-duel.html?v=61' }
  };
  const keys = Object.keys(info);
  let scores;
  try { scores = JSON.parse(read('takagi-arcade-score-v2') || '{}') } catch { scores = {} }
  if (!scores || typeof scores !== 'object') scores = {};
  keys.forEach(key => { if (!scores[key]) scores[key] = { played: 0, wins: 0, losses: 0, draws: 0 } });
  const saveScores = () => write('takagi-arcade-score-v2', JSON.stringify(scores));
  const record = (key, result) => { const item = scores[key]; item.played++; if (result === 'win') item.wins++; else if (result === 'loss') item.losses++; else item.draws++; saveScores(); paintScore() };

  shelf.replaceChildren();
  const summary = document.createElement('summary');
  summary.append(make('strong', '和高木玩一局'), make('span', '10 个可运行游戏 · 本地玩法与 AI 推理可选'), make('em', '展开'));
  const body = make('div', '', 'arcade-body arcade-v2');
  const top = make('div', '', 'arcade-toolbar');
  const difficultyLabel = make('label', '统一难度');
  const difficultySelect = document.createElement('select');
  difficultySelect.setAttribute('aria-label', '小游戏统一难度');
  Object.entries(levels).forEach(([value, label]) => { const option = make('option', label); option.value = value; difficultySelect.append(option) });
  difficultySelect.value = difficulty;
  difficultyLabel.append(difficultySelect);
  const overviewButton = make('button', '玩法总览'); overviewButton.type = 'button';
  const statsButton = make('button', '我的战绩'); statsButton.type = 'button';
  const randomButton = make('button', '随机一局'); randomButton.type = 'button';
  const topActions = make('div', '', 'arcade-toolbar-actions'); topActions.append(randomButton, statsButton, overviewButton);
  top.append(difficultyLabel, topActions);
  const scoreLine = make('small', '', 'arcade-score'); scoreLine.setAttribute('role', 'status');
  const tabs = make('div', '', 'arcade-tabs arcade-game-grid');
  const stage = make('div', '', 'arcade-stage');
  reactionLine = make('div', '高木：选一个吧。规则我会说清楚，输赢也会认真记。', 'arcade-reaction');
  reactionLine.setAttribute('role', 'status');
  body.append(make('p', '统一难度对标准小游戏生效；猜心对决与橡皮对决保留各自设置。切换游戏会保留本次页面中的进度；AI 模式只有在你主动选择后才会调用 DeepSeek。', 'arcade-intro'), top, tabs, scoreLine, reactionLine, stage);
  shelf.append(summary, body);

  let active = keys.includes(read('takagi-arcade-last-game')) ? read('takagi-arcade-last-game') : 'harmony';
  const states = {};
  function paintScore() {
    const total = Object.values(scores).reduce((sum, item) => sum + Number(item.played || 0), 0);
    const wins = Object.values(scores).reduce((sum, item) => sum + Number(item.wins || 0), 0);
    const rate = total ? Math.round(wins / total * 100) : 0;
    scoreLine.textContent = total ? `本设备记录：${total} 局 · 获胜 ${wins} 局 · 胜率 ${rate}% · 当前难度：${levels[difficulty]}` : `本设备暂无对局记录 · 当前难度：${levels[difficulty]}`;
  }
  function button(label, fn, cls = '') { const node = make('button', label, cls); node.type = 'button'; node.onclick = fn; return node }
  function heading(key, rule) {
    const head = make('div', '', 'arcade-game-head');
    const title = make('div', '', 'arcade-title-line');
    title.append(make('h3', info[key].name), make('span', info[key].mode, info[key].mode.includes('DeepSeek') ? 'game-badge ai' : 'game-badge local'), make('span', info[key].external ? '自带设置' : levels[difficulty], 'game-badge'));
    const rules = make('details', '', 'game-rules');
    rules.append(make('summary', '查看完整规则'), make('p', rule));
    head.append(title, make('p', info[key].brief, 'game-lead'), make('small', `预计 ${info[key].time}`, 'game-subline'), rules);
    return head;
  }
  function status(text) { const node = make('p', text, 'arcade-status'); node.setAttribute('role', 'status'); return node }
  function progress(current, total, label = '') { const safe = Math.min(current,total), name = label || '本局进度'; const wrap = make('div', '', 'game-progress'); const line = make('div', '', 'game-progress-line'); line.append(make('span', name), make('b', `${safe} / ${total}`)); const track = make('div', '', 'game-progress-track'), bar = make('i'); track.setAttribute('role', 'progressbar'); track.setAttribute('aria-label', name); track.setAttribute('aria-valuemin', '0'); track.setAttribute('aria-valuemax', String(total)); track.setAttribute('aria-valuenow', String(safe)); bar.style.width = `${total ? Math.min(100, Math.round(safe / total * 100)) : 0}%`; track.append(bar); wrap.append(line, track); return wrap }
  function finishCard(title, text, actionText, action) { const box = make('div', '', 'game-finish'); const actions = make('div', '', 'arcade-actions'); actions.append(button(actionText, action, 'setting'), button('换个游戏', () => { tabs.scrollIntoView({ behavior:'smooth', block:'center' }); tabs.querySelector('button')?.focus(); say('好，这一局先记下。再挑一个。', 'warm') })); box.append(make('span', 'RESULT', 'game-finish-kicker'), make('h4', title), make('p', text), actions); return box }
  function resetActive() { delete states[active]; render(active) }
  difficultySelect.onchange = () => { difficulty = difficultySelect.value; write('takagi-arcade-difficulty', difficulty); if (!info[active].external) delete states[active]; paintScore(); render(active); say(info[active].external ? `统一难度调成${levels[difficulty]}。当前独立游戏仍使用自己的设置。` : `难度调成${levels[difficulty]}。这一局重新开始。`, 'warm') };

  function openOverview() {
    const wrap = make('div', '', 'game-overview');
    wrap.append(make('p', '八项游戏都有明确结束条件，可以随时退出或重新开始。成绩只保存在当前浏览器。'));
    keys.forEach(key => { const card = make('section', '', 'game-overview-card'); const line = make('div', '', 'arcade-title-line'); line.append(make('h3', `${info[key].icon} ${info[key].name}`), make('span', info[key].mode, info[key].mode.includes('DeepSeek') ? 'game-badge ai' : 'game-badge local')); card.append(line, make('p', info[key].brief), make('small', `预计 ${info[key].time}`)); wrap.append(card) });
    wrap.append(make('h3', '四档难度'), make('p', '入门提供更多提示和更短局数；进阶保持平衡；成人挑战增加题量和判断干扰；高阶减少提示并提高对手策略。'));
    if (typeof openDialog === 'function') openDialog('小游戏玩法总览', wrap);
  }
  overviewButton.onclick = openOverview;
  function openStats() {
    const wrap = make('div', '', 'arcade-stats');
    const total = Object.values(scores).reduce((sum, item) => sum + Number(item.played || 0), 0);
    const wins = Object.values(scores).reduce((sum, item) => sum + Number(item.wins || 0), 0);
    const hero = make('div', '', 'arcade-stats-hero');
    hero.append(make('strong', String(total)), make('span', '累计对局'), make('strong', total ? `${Math.round(wins / total * 100)}%` : '0%'), make('span', '当前胜率'));
    wrap.append(hero);
    keys.forEach(key => { const item = scores[key], card = make('section', '', 'arcade-stat-card'); card.append(make('b', `${info[key].icon} ${info[key].name}`), make('span', info[key].external ? '独立结算' : `${item.played} 局`), make('small', info[key].external ? '成绩显示在游戏内部' : `胜 ${item.wins} · 负 ${item.losses} · 平 ${item.draws}`)); wrap.append(card) });
    wrap.append(make('p', '战绩保存在当前浏览器，清理浏览器数据后会重新统计。', 'arcade-stat-note'));
    if (typeof openDialog === 'function') openDialog('我的小游戏战绩', wrap);
  }
  statsButton.onclick = openStats;
  randomButton.onclick = () => { const choices = keys.filter(key => key !== active); const key = choices[Math.floor(Math.random() * choices.length)] || 'harmony'; render(key); tabs.querySelector(`[data-game="${key}"]`)?.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' }); say(`随机抽到“${info[key].name}”。这一局就玩它。`, 'playful') };

  function renderCode() {
    if (!states.code) states.code = { secret: shuffle('0123456789'.split('')).slice(0, 4).join(''), attempts: [], over: false, recorded: false };
    const s = states.code, limit = [10, 8, 7, 6][levelOrder[difficulty]];
    stage.replaceChildren(heading('code', `四个数字互不重复，可以包含 0。输入后会显示“位置正确”和“数字正确”。本档最多猜 ${limit} 次。`));
    stage.append(status(s.over ? `答案是 ${s.secret}。` : `还可以猜 ${limit - s.attempts.length} 次。`), progress(s.attempts.length, limit, '尝试次数'));
    const form = document.createElement('form'); form.className = 'code-form';
    const input = document.createElement('input'); input.inputMode = 'numeric'; input.maxLength = 4; input.placeholder = '例如 5072'; input.disabled = s.over; input.setAttribute('aria-label', '输入四位数字密码');
    const submit = make('button', '确认猜测'); submit.type = 'submit'; submit.disabled = s.over; form.append(input, submit);
    const feedback = make('small', '', 'arcade-feedback'), history = make('div', '', 'code-history');
    s.attempts.forEach((item, index) => { const row = make('div', '', 'code-row'); row.append(make('b', String(index + 1).padStart(2, '0')), make('strong', item.guess), make('span', `位置正确 ${item.exact} · 数字正确 ${item.misplaced}`)); history.append(row) });
    form.onsubmit = event => { event.preventDefault(); const guess = input.value.trim(); if (!/^\d{4}$/.test(guess) || new Set(guess).size !== 4) { feedback.textContent = '请输入四个互不重复的数字。'; return } let exact = 0, misplaced = 0; [...guess].forEach((digit, index) => { if (digit === s.secret[index]) exact++; else if (s.secret.includes(digit)) misplaced++ }); s.attempts.push({ guess, exact, misplaced }); if (exact === 4) { s.over = true; if (!s.recorded) { s.recorded = true; record('code', 'win') } say('被你猜中了。最后一步是排除，还是直觉？') } else if (s.attempts.length >= limit) { s.over = true; if (!s.recorded) { s.recorded = true; record('code', 'loss') } say('这次密码守住了。看完答案再换一组？', 'warm') } renderCode() };
    stage.append(form, feedback, history, button(s.over ? '再来一局' : '换一组密码', () => { delete states.code; renderCode() }));
  }

  const wordPacks = [
    { min:0, ban: ['是', '不是'], questions: ['你今天已经打开这个页面了吗？', '夏日祭里最先想到的是烟花吗？', '你觉得我在故意引你回答吗？', '这轮比想象中难吗？', '最后一题，你确定不会说出禁词吗？'] },
    { min:0, ban: ['有', '没有'], questions: ['今天发生过让你记住的小事吗？', '桌边现在放着饮料吗？', '你觉得这轮还剩陷阱吗？', '刚才的回答里藏着犹豫吗？', '要承认你已经快赢了吗？'] },
    { min:1, ban: ['喜欢', '不喜欢'], questions: ['夏天和冬天，你偏向哪一个？', '雨天通常带给你什么感觉？', '怎样评价一首愿意循环的歌？', '你会怎样形容烟花升起？', '用一句话评价这轮游戏。'] },
    { min:2, ban: ['我', '你'], questions: ['今天是谁先来到这里的？', '如果有人赢了，这个人会是谁？', '怎样称呼坐在对面的人？', '这轮最难避开的字是什么？', '不使用人称结束这一局。'] }
  ];
  function renderWords() {
    if (!states.words) { const max = [4, 5, 5, 5][levelOrder[difficulty]], available = wordPacks.filter(item => item.min <= levelOrder[difficulty]); states.words = { pack: shuffle(available)[0] || wordPacks[0], max, index: 0, user: 0, takagi: 0, answers: [], over: false, recorded: false } }
    const s = states.words; stage.replaceChildren(heading('words', `连续回答 ${s.max} 个问题，同时避开本轮两个禁词。说中禁词，高木得分；成功绕开，你得分。`));
    const score = make('p', `你 ${s.user} ： ${s.takagi} 高木`, 'duel-score'), bans = make('div', '', 'ban-list'); bans.append(make('span', '本轮禁词'), ...s.pack.ban.map(word => make('b', word))); stage.append(score, progress(s.index, s.max, '问题进度'), bans);
    if (s.over) { const won = s.user > s.takagi; stage.append(finishCard(won ? '你赢了' : s.user < s.takagi ? '高木赢了' : '平局', won ? '大部分诱导都被你绕开了。' : '重新组织一句话，会比急着回答更有效。', '换一组禁词', () => { delete states.words; renderWords() })); return }
    const question = make('p', s.pack.questions[s.index], 'duel-question');
    const form = document.createElement('form'); form.className = 'duel-form'; const input = document.createElement('input'); input.maxLength = 80; input.placeholder = '换一种说法，避开禁词…'; const submit = make('button', '回答'); submit.type = 'submit'; form.append(input, submit); const feedback = make('small', '同义表达、动作描述和换角度回答都可以。', 'arcade-feedback');
    form.onsubmit = event => { event.preventDefault(); const answer = input.value.trim(); if (answer.length < 2) { feedback.textContent = '至少写两个字。'; return } const hit = s.pack.ban.find(word => answer.includes(word)); if (hit) { s.takagi++; say(`抓到了，“${hit}”。这一分归我。`) } else { s.user++; say('绕得很自然。看来你早有准备。') } s.answers.push(answer); s.index++; if (s.index >= s.max) { s.over = true; if (!s.recorded) { s.recorded = true; record('words', s.user > s.takagi ? 'win' : s.user < s.takagi ? 'loss' : 'draw') } } renderWords() };
    stage.append(question, form, feedback, button('重新抽取禁词', () => { delete states.words; renderWords() }));
  }

  function five(board, index, stone) { const row = Math.floor(index / 9), col = index % 9; return [[1,0],[0,1],[1,1],[1,-1]].some(([dr,dc]) => { let count = 1; for (const sign of [-1,1]) { let r = row + dr * sign, c = col + dc * sign; while (r >= 0 && r < 9 && c >= 0 && c < 9 && board[r * 9 + c] === stone) { count++; r += dr * sign; c += dc * sign } } return count >= 5 }) }
  function lineScore(board, index, stone) { const row = Math.floor(index / 9), col = index % 9; let score = 0; [[1,0],[0,1],[1,1],[1,-1]].forEach(([dr,dc]) => { let count = 1, open = 0; for (const sign of [-1,1]) { let r = row + dr * sign, c = col + dc * sign; while (r >= 0 && r < 9 && c >= 0 && c < 9 && board[r * 9 + c] === stone) { count++; r += dr * sign; c += dc * sign } if (r >= 0 && r < 9 && c >= 0 && c < 9 && !board[r * 9 + c]) open++ } score += count * count * (open + 1) }); return score }
  function renderGomoku() {
    if (!states.gomoku) states.gomoku = { board: Array(81).fill(''), over: false, thinking: false, recorded: false, message: '你执黑先行。' };
    const s = states.gomoku; stage.replaceChildren(heading('gomoku', '你执黑，高木执白。横、竖或斜线率先连成五子获胜；难度越高，对手越重视进攻与封堵。'), status(s.message));
    const board = make('div', '', 'gomoku-board'); board.setAttribute('role', 'grid');
    const empty = () => s.board.map((value, index) => value ? -1 : index).filter(index => index >= 0);
    const aiMove = () => { const choices = empty(); for (const stone of ['w','b']) for (const index of choices) { s.board[index] = stone; const win = five(s.board, index, stone); s.board[index] = ''; if (win) return index } if (difficulty === 'easy') return choices[Math.floor(Math.random() * choices.length)]; let best = choices[0], bestScore = -1; choices.forEach(index => { const row = Math.floor(index / 9), col = index % 9, near = s.board.some((stone, other) => stone && Math.abs(Math.floor(other / 9) - row) <= 1 && Math.abs(other % 9 - col) <= 1); const attack = difficulty === 'expert' ? 6 : 4, defend = difficulty === 'hard' || difficulty === 'expert' ? 5 : 3; const value = lineScore(s.board, index, 'w') * attack + lineScore(s.board, index, 'b') * defend + (near ? 12 : 0) - Math.abs(4 - row) - Math.abs(4 - col) + Math.random(); if (value > bestScore) { bestScore = value; best = index } }); return best };
    const finish = (result, message) => { s.over = true; s.message = message; if (!s.recorded) { s.recorded = true; record('gomoku', result) } say(result === 'win' ? '这一步我没有挡住。你埋了多久？' : result === 'loss' ? '五个连起来了。要复盘刚才的缺口吗？' : '棋盘下满了。算平局。') };
    s.board.forEach((stone, index) => { const cell = make('button', '', stone ? `stone ${stone}` : ''); cell.type = 'button'; cell.disabled = Boolean(stone) || s.over || s.thinking; cell.setAttribute('aria-label', `第${Math.floor(index / 9) + 1}行第${index % 9 + 1}列`); cell.onclick = () => { s.board[index] = 'b'; if (five(s.board, index, 'b')) { finish('win', '你连成五子，本局获胜。'); renderGomoku(); return } if (!empty().length) { finish('draw', '棋盘已满，本局平局。'); renderGomoku(); return } s.thinking = true; s.message = '高木正在看棋盘…'; renderGomoku(); setTimeout(() => { const move = aiMove(); s.board[move] = 'w'; s.thinking = false; if (five(s.board, move, 'w')) finish('loss', '高木连成五子，本局结束。'); else s.message = '轮到你落黑子。'; renderGomoku() }, 240) }; board.append(cell) });
    stage.append(board, button('重新开局', () => { delete states.gomoku; renderGomoku() }));
  }

  const harmonyQuestions = [
    ['夏日祭先做什么？','先逛摊位','先找烟花位置'],['雨天放学怎么走？','共撑一把伞','在走廊等雨小'],['收到礼物时？','当面拆开','回家再看'],['周末更想去？','安静书店','热闹商店街'],['午后饮料？','冰汽水','热茶'],['旅行留下什么？','拍很多照片','记下一句话'],['遇到难题时？','先独自想','先和人讨论'],['海边停留到？','夕阳落下','天完全黑'],['一封短消息？','直接说重点','先铺一点气氛'],['纪念品选择？','实用的小物','好看的摆件'],['考试结束后？','立刻对答案','先去吃东西'],['烟花升起时？','专心看天空','看看身边的人']
  ];
  function renderHarmony() {
    if (!states.harmony) { const count = [5,6,8,10][levelOrder[difficulty]], deck = shuffle(harmonyQuestions).slice(0, count); states.harmony = { deck, index: 0, same: 0, picks: deck.map(() => Math.random() < .5 ? 0 : 1), history: [], reveal: null, over: false, recorded: false } }
    const s = states.harmony; stage.replaceChildren(heading('harmony', `共 ${s.deck.length} 题。高木已经藏好选择；你选完才会同时揭晓。结果只表示这一轮碰巧想到一起的次数。`));
    if (s.over) { const rate = Math.round(s.same / s.deck.length * 100), title = rate >= 75 ? '很有默契' : rate >= 45 ? '想到一起不少次' : '这轮分歧更多'; stage.append(finishCard(`${title} · ${rate}%`, rate >= 75 ? '有些选择几乎不用解释。' : rate >= 45 ? '相同和不同都留下了继续聊的入口。' : '答案差得远，反而更容易发现彼此在意什么。', '再测一次', () => { delete states.harmony; renderHarmony() })); return }
    const [question, left, right] = s.deck[s.index]; stage.append(progress(s.index, s.deck.length, '默契进度'), status(`${s.index + 1} / ${s.deck.length} · ${question}`));
    if (s.reveal) {
      const reveal = make('div', '', `harmony-reveal ${s.reveal.same ? 'same' : 'different'}`);
      const mine = make('div'); mine.append(make('small', '你的选择'), make('strong', s.reveal.mine));
      const other = make('div'); other.append(make('small', '高木的选择'), make('strong', s.reveal.other));
      reveal.append(mine, make('b', s.reveal.same ? '想到一起了' : '这次不同'), other);
      stage.append(reveal, button(s.index === s.deck.length - 1 ? '查看默契结果' : '下一题', () => { s.index++; s.reveal = null; if (s.index >= s.deck.length) { s.over = true; if (!s.recorded) { s.recorded = true; record('harmony', s.same >= Math.ceil(s.deck.length * .6) ? 'win' : 'draw') } } renderHarmony() }), button('重新抽题', () => { delete states.harmony; renderHarmony() }));
      return;
    }
    const choices = make('div', '', 'harmony-choices');
    [left, right].forEach((label, index) => choices.append(button(label, () => { const otherIndex = s.picks[s.index], same = index === otherIndex, other = s.deck[s.index][otherIndex + 1]; if (same) s.same++; s.reveal = { mine:label, other, same }; s.history.push({ question, mine:label, other, same }); say(same ? '一样。被你猜中了。' : `这次不一样。我选了“${other}”。`); renderHarmony() })));
    stage.append(choices, make('small', `当前相同 ${s.same} 次。选择后会先停下来揭晓双方答案。`, 'arcade-feedback'), button('重新抽题', () => { delete states.harmony; renderHarmony() }));
  }

  const truthSets = [
    { min:0, title:'雨后走廊', statements:['湿地面会让反光更明显','同一时刻，离光源更近的物体影子一定更长','云层变化会改变画面的明暗'], false:1, why:'影子长度取决于光源角度、物体位置和投影面，距离更近并不必然更长。' },
    { min:0, title:'教室观察', statements:['声音可能被窗帘和书本吸收一部分','所有金属物体在室温下一定比木头温度更低','窗边与走廊侧的亮度可能不同'], false:1, why:'触感受导热速度影响；同处一室的物体可以接近相同温度。' },
    { min:0, title:'时间问题', statements:['一分钟等于六十秒','下午三点到五点经过两小时','23:50 再过二十分钟仍是同一天'], false:2, why:'23:50 再过二十分钟是次日 00:10。' },
    { min:1, title:'日本生活语趣', statements:['“いただきます”常在用餐前说','“おかえり”常用于迎接回家的人','“おやすみ”通常用来表示早安'], false:2, why:'“おやすみ”用于睡前道晚安；早安常说“おはよう”。' },
    { min:1, title:'概率小陷阱', statements:['掷一枚公平硬币，正反面概率相同','连续三次正面后，下一次必定更容易出现反面','两次掷硬币可能出现四种有序结果'], false:1, why:'每次独立投掷的正反面概率仍各为二分之一。' },
    { min:1, title:'语言线索', statements:['“日”和“月”可以组成“明”','“木”和“木”可以组成“林”','“人”和“人”只能组成“从”，不能出现在其他汉字结构中'], false:2, why:'两个“人”形部件还会出现在其他字形分析中，“只能”使陈述不成立。' },
    { min:2, title:'排列问题', statements:['三本不同的书排成一列共有六种次序','固定其中一本在最左侧后，另外两本仍有两种次序','三本不同的书任意排列共有九种次序'], false:2, why:'三本不同的书共有 3×2×1，也就是六种排列。' },
    { min:2, title:'平均数', statements:['一组数加入一个等于原平均数的数，平均数不变','中位数一定等于平均数','极端值通常比对中位数更影响平均数'], false:1, why:'中位数与平均数是不同统计量，只在部分分布中相等。' },
    { min:2, title:'条件推理', statements:['若 A 推出 B，且 B 为假，则 A 为假','若 A 推出 B，且 B 为真，则 A 必为真','若 A 与 B 互斥，则二者不能同时为真'], false:1, why:'B 为真可能由其他条件导致，不能据此反推 A 必然为真。' },
    { min:3, title:'信息与证据', statements:['支持假设的证据也可能支持其他解释','重复观察到相同结果必然证明因果关系','更具体的预测通常更容易被新证据检验'], false:1, why:'重复相关结果仍可能来自共同原因、选择偏差或其他机制，不能自动证明因果。' },
    { min:3, title:'选择偏差', statements:['只询问留下来的用户可能高估满意度','更大的样本可以自动消除所有系统偏差','随机抽样通常有助于降低选择偏差'], false:1, why:'扩大带有系统偏差的样本只会更精确地估计偏差后的结果。' },
    { min:3, title:'贝叶斯直觉', statements:['罕见事件的阳性结果仍需考虑基础发生率','检测准确率高就意味着阳性者几乎一定患病','假阳性率会影响阳性结果的解释'], false:1, why:'当基础发生率很低时，即使检测准确率较高，假阳性也可能占阳性结果的显著部分。' }
  ];
  function renderTruth() {
    if (!states.truth) { const pool = truthSets.filter(item => item.min <= levelOrder[difficulty]), rounds = [4,5,6,7][levelOrder[difficulty]]; states.truth = { deck: shuffle(pool).slice(0, Math.min(rounds, pool.length)), index: 0, score: 0, resolved: false, choice: -1, over: false, recorded: false } }
    const s = states.truth; stage.replaceChildren(heading('truth', '每轮三句话中只有一句不成立。选择后会锁定答案并显示理由；看完解析再进入下一题。'));
    if (s.over) { stage.append(finishCard(`答对 ${s.score} / ${s.deck.length}`, s.score === s.deck.length ? '每个限定词都被你看见了。' : '容易出错的地方通常藏在“一定”“只能”和反向推断里。', '换一组题', () => { delete states.truth; renderTruth() })); return }
    const item = s.deck[s.index]; stage.append(progress(s.index, s.deck.length, '判断进度'), status(`${s.index + 1} / ${s.deck.length} · ${item.title}`)); const list = make('div', '', 'truth-options');
    item.statements.forEach((line, index) => { const option = button(`${String.fromCharCode(65 + index)}. ${line}`, () => { if (s.resolved) return; s.choice = index; s.resolved = true; if (index === item.false) { s.score++; say('这一句里的限定被你看见了。') } else say('这句可以成立。再看看哪句话把条件说得太满。', 'warm'); renderTruth() }); if (s.resolved) { option.disabled = true; option.dataset.result = index === item.false ? 'correct' : index === s.choice ? 'wrong' : '' } list.append(option) }); stage.append(list);
    if (s.resolved) { stage.append(make('p', `不成立的是 ${String.fromCharCode(65 + item.false)}。${item.why}`, 'truth-explain'), button(s.index === s.deck.length - 1 ? '查看结果' : '下一题', () => { s.index++; s.resolved = false; s.choice = -1; if (s.index >= s.deck.length) { s.over = true; if (!s.recorded) { s.recorded = true; record('truth', s.score >= Math.ceil(s.deck.length * .65) ? 'win' : 'loss') } } renderTruth() })) }
    else stage.append(make('small', `当前得分 ${s.score}。每题只有一次选择机会。`, 'arcade-feedback'));
  }

  const chainWords = {
    zh: ['夏日','日光','光影','影子','子夜','夜空','空想','想念','念书','书桌','桌面','面包','包容','容貌','貌似','似乎','湖面','面前','前方','方向','向日葵','葵花','花火','火光','光线','线索','索引','引路','路灯','灯火','火花','花园','园林','林间','间隔','隔壁','壁画','画面','面容','容器','器材','材料','料理','理解','解答','答案','案头','头发','发现','现在','在场','场景','景色','色彩','彩虹','虹桥','桥边','边界','界面','面向','向往','往日','日期','期待','待会','会议','议题','题目','目标','标记','记忆','忆念','校园','园地','地图','图片','片段','段落','落日','日本','本子','子弹','弹琴','琴声','声音','音乐','乐园'],
    jp: ['なつ','つき','きつね','ねこ','こえ','えき','きせつ','つくえ','えがお','おと','とけい','いえ','えんぴつ','つばさ','さくら','らじお','おかし','しお','おもいで','でんしゃ','やま','まつり','りんご','ごはん','はなび','びんせん','せかい','いす','すいか','かぜ','ぜひ','ひかり','りす','すな','なみ','みち','ちず','ずこう','うみ','みせ','せんせい','いろ','ろうか','かばん','ばんごう','うた','たび','びわ','わらい']
  };
  const chainEnd = (word, lang) => { const clean = word.trim(); if (lang === 'jp') { const last = clean.slice(-1); const small = { 'ゃ':'や','ゅ':'ゆ','ょ':'よ','っ':'つ' }; return small[last] || last } return clean.slice(-1) };
  function renderChain() {
    if (!states.chain) { const lang = 'zh', bank = chainWords[lang], seed = shuffle(bank)[0]; states.chain = { lang, bank, current: seed, used: [seed], turns: 0, target: [5,7,9,12][levelOrder[difficulty]], over: false, recorded: false, message: `高木先说：${seed}` } }
    const s = states.chain; stage.replaceChildren(heading('chain', '中文使用末字接首字；日语使用平假名末音接首音。日语词以“ん”结尾立即失败，同一词不能重复。本地版检查字形与接续，请使用常见词。'));
    const language = document.createElement('select'); language.setAttribute('aria-label', '接龙语言'); [['zh','中文接龙'],['jp','日本語しりとり']].forEach(([value,label]) => { const option = make('option', label); option.value = value; language.append(option) }); language.value = s.lang; language.onchange = () => { const lang = language.value, bank = chainWords[lang], seed = shuffle(bank)[0]; states.chain = { lang, bank, current: seed, used: [seed], turns: 0, target: [5,7,9,12][levelOrder[difficulty]], over: false, recorded: false, message: `高木先说：${seed}` }; renderChain() };
    const langLine = make('div', '', 'game-mode-row'); langLine.append(make('label', '语言'), language); stage.append(langLine, progress(s.turns, s.target, '接龙轮次'), status(s.message));
    if (s.over) { stage.append(finishCard(s.result === 'win' ? '你赢了' : '这一局归高木', s.result === 'win' ? `完成 ${s.turns} 轮后，高木没有可接的词。` : '检查末字或末音，再换一条词路。', '重新开始', () => { delete states.chain; renderChain() })); return }
    const need = chainEnd(s.current, s.lang), form = document.createElement('form'); form.className = 'duel-form'; const input = document.createElement('input'); input.maxLength = 12; input.placeholder = s.lang === 'jp' ? `输入以“${need}”开头的平假名词` : `输入以“${need}”开头的词`; input.setAttribute('aria-label', '输入接龙词'); const submit = make('button', '接这个词'); submit.type = 'submit'; form.append(input, submit); const feedback = make('small', `目标完成 ${s.target} 轮 · 已完成 ${s.turns} 轮`, 'arcade-feedback');
    form.onsubmit = event => { event.preventDefault(); const value = input.value.trim(); const validChars = s.lang === 'jp' ? /^[ぁ-んー]{2,8}$/ : /^[\u3400-\u9fff]{2,6}$/; if (!validChars.test(value)) { feedback.textContent = s.lang === 'jp' ? '请输入 2 至 8 个平假名。' : '请输入 2 至 6 个汉字。'; return } if (!value.startsWith(need)) { feedback.textContent = `要从“${need}”开始。`; return } if (s.used.includes(value)) { feedback.textContent = '这个词已经用过了。'; return } if (s.lang === 'jp' && value.endsWith('ん')) { s.over = true; s.result = 'loss'; if (!s.recorded) { s.recorded = true; record('chain', 'loss') } s.message = `“${value}”以“ん”结尾。`; say('しりとり里，以“ん”结尾就输了哦。'); renderChain(); return } s.used.push(value); s.turns++; const tail = chainEnd(value, s.lang), replies = s.bank.filter(word => word.startsWith(tail) && !s.used.includes(word)); if (!replies.length || s.turns >= s.target) { s.over = true; s.result = 'win'; if (!s.recorded) { s.recorded = true; record('chain', 'win') } s.message = !replies.length ? `高木暂时接不上“${tail}”。` : `你完成了 ${s.target} 轮。`; say('这条词路被你接通了。算你赢。'); renderChain(); return } const reply = replies[Math.floor(Math.random() * replies.length)]; s.used.push(reply); if (s.lang === 'jp' && reply.endsWith('ん')) { s.over = true; s.result = 'win'; if (!s.recorded) { s.recorded = true; record('chain', 'win') } s.message = `高木说了“${reply}”，以“ん”结尾。`; renderChain(); return } s.current = reply; s.message = `你：${value}　高木：${reply}`; say(`那我接“${reply}”。下一个是“${chainEnd(reply, s.lang)}”。`); renderChain() };
    const used = make('div', '', 'chain-history'); s.used.slice(-8).forEach(word => used.append(make('span', word))); stage.append(form, feedback, used, button('认输并换词', () => { if (!s.recorded) { s.recorded = true; record('chain', 'loss') } delete states.chain; renderChain() }));
  }

  const memorySymbols = ['花火','雨伞','汽水','纸条','月亮','风铃','书本','海浪','樱花','列车','星光','团扇'];
  function renderMemory() {
    if (!states.memory) { const pairCount = [6,8,10,12][levelOrder[difficulty]], symbols = shuffle(memorySymbols).slice(0, pairCount); states.memory = { cards: shuffle([...symbols,...symbols]).map((symbol, id) => ({ symbol, id, open: false, found: false })), first: -1, lock: false, moves: 0, found: 0, pairCount, over: false, recorded: false } }
    const s = states.memory; stage.replaceChildren(heading('memory', `翻开两张卡片寻找相同图案。共 ${s.pairCount} 对；连续翻牌时，未配对的卡片会短暂停留后盖回。`), progress(s.found, s.pairCount, '配对进度'), status(`已找到 ${s.found} / ${s.pairCount} 对 · 翻牌 ${s.moves} 次`));
    if (s.over) { const target = s.pairCount * 2 + [8,10,12,14][levelOrder[difficulty]], good = s.moves <= target; stage.append(finishCard(good ? '记得很清楚' : '全部找到了', `共翻牌 ${s.moves} 次。${good ? '大部分位置只看了一两次。' : '再玩一轮时，先记住四个角会更稳。'}`, '重新洗牌', () => { delete states.memory; renderMemory() })); return }
    const grid = make('div', '', `memory-board pairs-${s.pairCount}`);
    s.cards.forEach((card, index) => { const cell = make('button', card.open || card.found ? card.symbol : '✦', `memory-card${card.open || card.found ? ' open' : ''}${card.found ? ' found' : ''}`); cell.type = 'button'; cell.disabled = s.lock || card.open || card.found; cell.setAttribute('aria-label', card.open || card.found ? card.symbol : `第 ${index + 1} 张未翻开卡片`); cell.onclick = () => { card.open = true; if (s.first < 0) { s.first = index; renderMemory(); return } const first = s.cards[s.first]; s.moves++; if (first.symbol === card.symbol) { first.found = card.found = true; first.open = card.open = false; s.found++; s.first = -1; if (s.found === s.pairCount) { s.over = true; if (!s.recorded) { s.recorded = true; record('memory', 'win') } say('最后一对也找到了。你记得比刚才说的清楚。') } renderMemory() } else { s.lock = true; renderMemory(); setTimeout(() => { first.open = card.open = false; s.first = -1; s.lock = false; renderMemory() }, difficulty === 'easy' ? 1250 : difficulty === 'medium' ? 950 : 700) } }; grid.append(cell) }); stage.append(grid, button('重新洗牌', () => { delete states.memory; renderMemory() }));
  }

  const lateralStories = [
    { id:'umbrella', title:'等雨更大', prompt:'放学后，她明明没有带伞，却故意等到雨更大才离开。为什么？', truth:'她在等同样没有带伞的朋友。雨大后，朋友会放弃独自跑回去，两个人就能一起等家人来接。', yes:['等人','朋友','一起','家人','接','没有伞'], no:['讨厌小雨','想淋湿','伞坏','忘记回家'], hints:['她关注的不是雨量本身。','这件事与另一个人有关。','两个人都没有伞。'] },
    { id:'bell', title:'没有响的铃', prompt:'教室里的铃没有响，大家却同时收起书本离开了。为什么？', truth:'这是一次安静自习，墙上的时钟已经到了约定结束的时间，铃声设备当天正在检修。', yes:['时间','时钟','约定','检修','坏','自习'], no:['老师命令','停电','考试作弊'], hints:['大家拥有同一个时间线索。','线索就在教室里。','铃声设备正在检修。'] },
    { id:'photo', title:'少一个人的合照', prompt:'四个人一起旅行，合照里每次却只有三个人。没人使用自拍杆，也没有请路人帮忙。为什么？', truth:'四个人轮流拿相机拍照，所以每张合照里都只有另外三个人。', yes:['相机','拍照','轮流','摄影'], no:['有人失踪','镜子','照片坏'], hints:['四个人都好好地在旅行。','拍摄方式是关键。','其中一人每次都在拿相机。'] },
    { id:'cocoa', title:'没有喝的热可可', prompt:'她买了两杯热可可，一杯始终没人喝，她却说目的已经达到了。为什么？', truth:'另一杯是用来给等待的人暖手的。对方不喜欢甜饮，但在寒风里需要一点温度。', yes:['暖手','取暖','冷','温度','不喜欢喝'], no:['祭奠','打翻','送错'], hints:['重点不是喝下去。','当天的气温很低。','杯子可以用来暖手。'] },
    { id:'station', title:'坐过站', prompt:'他明明看见了自己的车站，却没有下车。到下一站后，他反而松了一口气。为什么？', truth:'他在陪一位睡着的朋友回家。自己的车站先到，但朋友的目的地在下一站，他决定先把朋友安全送到。', yes:['朋友','陪','送','睡着','安全'], no:['逃票','迷路','车门坏'], hints:['他知道自己在哪里。','车上还有一个重要的人。','他在陪睡着的朋友到站。'] },
    { id:'note', title:'空白便笺', prompt:'她收到一张完全空白的便笺，却立刻知道是谁写的，也明白对方想说什么。为什么？', truth:'两人事先约定，空白便笺代表今天不方便说话，但会在老地方等对方。便笺本身就是暗号。', yes:['暗号','约定','事先','老地方','等待'], no:['隐形墨水','盲文','透光'], hints:['纸上确实什么也没有。','两个人以前谈过这件事。','空白本身就是约定的暗号。'] }
  ];
  function renderLateral() {
    if (!states.lateral) { const storyPool = difficulty === 'easy' ? lateralStories.slice(0,3) : lateralStories; states.lateral = { story: shuffle(storyPool)[0], mode: read('takagi-lateral-mode') === 'ai' ? 'ai' : 'local', asks: [], progress: 0, hints: 0, max: [15,12,10,8][levelOrder[difficulty]], over: false, loading: false, recorded: false, message: '可以开始提问。' } }
    const s = states.lateral; stage.replaceChildren(heading('lateral', '通过只能用“是、否、关系不大”回答的问题还原真相。你可以随时查看提示或揭晓；智能模式会调用 DeepSeek。'));
    const mode = document.createElement('select'); [['local','本地题库'],['ai','DeepSeek 智能判断']].forEach(([value,label]) => { const option = make('option', label); option.value = value; mode.append(option) }); mode.value = s.mode; mode.onchange = () => { s.mode = mode.value; write('takagi-lateral-mode', s.mode); s.message = s.mode === 'ai' ? '智能模式会把你的问题发送给 DeepSeek，仅用于本局判断。' : '本地模式按题库关键词判断，不发送网络请求。'; renderLateral() };
    const modeRow = make('div', '', 'game-mode-row'); const badge = make('span', s.mode === 'ai' ? '调用 API' : '不调用 API', s.mode === 'ai' ? 'game-badge ai' : 'game-badge local'); modeRow.append(make('label', '判断方式'), mode, badge); stage.append(modeRow, progress(s.asks.length, s.max, '提问次数'), make('div', '', 'lateral-prompt')); stage.lastElementChild.append(make('small', s.story.title), make('p', s.story.prompt)); stage.append(status(`${s.message} · 剩余 ${Math.max(0, s.max - s.asks.length)} 问`));
    if (s.over) { stage.append(finishCard('真相', s.story.truth, '换一个情境', () => { delete states.lateral; renderLateral() })); return }
    const form = document.createElement('form'); form.className = 'duel-form'; const input = document.createElement('input'); input.maxLength = 180; input.placeholder = '例如：她是在等人吗？'; input.disabled = s.loading; const submit = make('button', s.loading ? '判断中…' : '提问'); submit.type = 'submit'; submit.disabled = s.loading; form.append(input, submit);
    const localJudge = question => { const yes = s.story.yes.find(word => question.includes(word)), no = s.story.no.find(word => question.includes(word)); if (yes) { s.progress = Math.min(95, s.progress + 18); return { answer: s.progress >= 72 ? '接近了' : '是', reply: s.progress >= 72 ? '接近了，沿着这个方向把关系说完整。' : '是，这个方向有关。' } } if (no) return { answer: '否', reply: '否，这不是造成反常情境的原因。' }; return { answer: '关系不大', reply: '关系不大。可以问人物、时间或目的。' } };
    form.onsubmit = async event => { event.preventDefault(); const question = input.value.trim(); if (question.length < 2) { s.message = '请写出一个完整问题。'; renderLateral(); return } s.loading = true; s.message = '正在判断…'; renderLateral(); let result; if (s.mode === 'ai') { try { const response = await fetch('/api/game', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ game:'lateral', storyId:s.story.id, question, history:s.asks.map(item => `问：${item.q} 答：${item.a}`) }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'AI 判断失败'); result = { answer:data.answer, reply:data.reply }; s.progress = Math.max(s.progress, Number(data.progress) || 0) } catch (error) { result = localJudge(question); result.reply = `${error.message || 'AI 暂不可用'} 已使用本地判断：${result.reply}` } } else result = localJudge(question); s.asks.push({ q:question, a:result.answer }); s.loading = false; s.message = `${result.answer}。${result.reply}`; if (s.asks.length >= s.max) { s.over = true; if (!s.recorded) { s.recorded = true; record('lateral', 'loss') } } say(s.message, result.answer === '接近了' ? 'playful' : 'warm'); renderLateral() };
    const actions = make('div', '', 'arcade-actions'); actions.append(button('给一点提示', () => { s.message = `提示：${s.story.hints[Math.min(s.hints, s.story.hints.length - 1)]}`; s.hints++; renderLateral() }), button('我猜到了，揭晓', () => { s.over = true; if (!s.recorded) { s.recorded = true; record('lateral', s.progress >= 55 || s.asks.length >= 3 ? 'win' : 'draw') } renderLateral() }), button('换一题', () => { delete states.lateral; renderLateral() }));
    const history = make('div', '', 'lateral-history'); s.asks.slice(-6).forEach((item, index) => history.append(make('p', `${s.asks.length - Math.min(6,s.asks.length) + index + 1}. ${item.q}　${item.a}`))); stage.append(form, actions, history);
  }

  function openStandalone(key) {
    const item = info[key], modal = make('dialog', '', 'arcade-game-modal');
    const shell = make('div', '', 'arcade-game-modal-shell'), bar = make('div', '', 'arcade-game-modal-bar');
    const title = make('div'); title.append(make('strong', item.name), make('small', '独立游戏 · 原版界面'));
    const close = button('×', () => modal.close(), 'arcade-game-modal-close'); close.setAttribute('aria-label', `关闭${item.name}`);
    const frame = document.createElement('iframe'); frame.src = item.external; frame.title = item.name; frame.loading = 'eager'; frame.allow = 'fullscreen'; frame.setAttribute('allowfullscreen', '');
    bar.append(title, close); shell.append(bar, frame); modal.append(shell); document.body.append(modal); document.body.classList.add('arcade-game-open');
    const cleanup = () => { frame.src = 'about:blank'; document.body.classList.remove('arcade-game-open'); modal.remove() };
    modal.addEventListener('close', cleanup, { once:true });
    modal.addEventListener('cancel', event => { event.preventDefault(); modal.close() });
    modal.showModal(); close.focus();
  }
  function renderStandalone(key) {
    const item = info[key], card = make('div', '', 'standalone-game-card');
    card.append(make('span', item.icon, 'standalone-game-mark'), make('h4', item.name), make('p', `${item.brief} 游戏会在独立窗口中运行，保留原有规则、设置和结算。`), make('small', '点击下方按钮进入完整游戏。', 'standalone-game-hint'), button(`▶ 点击进入${item.name}`, () => openStandalone(key), 'standalone-game-launch'));
    stage.replaceChildren(heading(key, '此游戏保留提交版本的原有玩法和界面。打开后可使用游戏内部的规则与设置；关闭窗口即可回到小游戏中心。'), card);
  }

  const renders = { code:renderCode, words:renderWords, gomoku:renderGomoku, harmony:renderHarmony, truth:renderTruth, chain:renderChain, memory:renderMemory, lateral:renderLateral, mind:()=>renderStandalone('mind'), eraser:()=>renderStandalone('eraser') };
  function render(key = active) { active = key; write('takagi-arcade-last-game', key); shelf.dataset.activeGame = key; tabs.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.game === key))); renders[key](); stage.animate?.([{ opacity:.55, transform:'translateY(5px)' }, { opacity:1, transform:'translateY(0)' }], { duration:180, easing:'ease-out' }) }
  keys.forEach(key => { const item = info[key], tab = button('', () => render(key), 'arcade-tab-card'); tab.dataset.game = key; tab.setAttribute('aria-pressed', String(key === active)); tab.append(make('b', item.icon), make('span', item.name), make('small', item.mode)); tabs.append(tab) });
  shelf.addEventListener('toggle', () => { summary.querySelector('em').textContent = shelf.open ? '收起' : '展开'; if (shelf.open && !stage.childElementCount) render() });
  paintScore();
})();
