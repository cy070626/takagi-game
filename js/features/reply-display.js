/* Safe text formatting: all model prose starts as DOM text, never HTML. */
(() => {
 function inline(parent,text) {
  const pattern=/(`[^`\n]+`|\*\*[^*\n]+\*\*)/g;let start=0;
  for(const match of text.matchAll(pattern)) {
   parent.append(document.createTextNode(text.slice(start,match.index)));
   const code=match[0].startsWith('`'),el=document.createElement(code?'code':'strong');
   el.textContent=match[0].slice(code?1:2,code?-1:-2);parent.append(el);start=match.index+match[0].length;
  }
  parent.append(document.createTextNode(text.slice(start)));
 }
 function cells(line){return line.trim().replace(/^\||\|$/g,'').split('|').map(s=>s.trim())}
 async function render(node) {
  const raw=node.dataset.rawText||node.textContent;node.dataset.rawText=raw;
  const lines=raw.split('\n');node.replaceChildren();
  for(let i=0;i<lines.length;i++) {
   if(lines[i].trim().startsWith('```')) {
    const code=document.createElement('code');code.className='reply-code';const content=[];
    while(++i<lines.length&&!lines[i].trim().startsWith('```'))content.push(lines[i]);
    code.textContent=content.join('\n');node.append(code);continue;
   }
   if(lines[i].includes('|')&&i+1<lines.length&&/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[i+1])) {
    const wrapper=document.createElement('span');wrapper.className='reply-table-scroll';
    const table=document.createElement('span');table.className='reply-table';table.setAttribute('role','table');
    const heads=cells(lines[i]);const rows=[heads];i+=2;
    while(i<lines.length&&lines[i].includes('|')&&lines[i].trim()){rows.push(cells(lines[i]));i++}i--;
    rows.forEach((values,n)=>{const row=document.createElement('span');row.setAttribute('role','row');row.className='reply-table-row';
     heads.forEach((_,j)=>{const cell=document.createElement('span');cell.setAttribute('role',n?'cell':'columnheader');inline(cell,values[j]||'');row.append(cell)});table.append(row)});
    wrapper.append(table);node.append(wrapper);continue;
   }
   const line=lines[i],heading=line.match(/^#{1,3}\s+(.+)$/);
   if(heading){const title=document.createElement('strong');title.className='reply-heading';inline(title,heading[1]);node.append(title)}
   else inline(node,line);
   if(i<lines.length-1)node.append(document.createTextNode('\n'));
  }
  await TakagiMathDisplay.render(node);
 }
 function summary(text) {
  const plain=String(text||'').replace(/```[\s\S]*?```/g,'').replace(/\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$[^$\n]+\$/g,'（公式在聊天框里）').replace(/\*\*|`/g,'');
  const line=plain.split('\n').find(line=>line.trim()&&!/^\s*[|#]/.test(line))?.trim()||'这部分写在聊天框里了，一起看。';
  const first=line.match(/^.*?[。？！]/)?.[0]||line;
  const chars=Array.from(first);return chars.length>58?chars.slice(0,58).join('')+'…':first;
 }
 globalThis.TakagiReplyDisplay=Object.freeze({render,summary});
})();
