import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeModelReply } from '../netlify/functions/reply-parser.js';
import handler from '../netlify/functions/chat.js';

test('合法 JSON 公式、换行、引号、中文与表情保留', () => {
 const text = '先算这一项。\n\\(\\frac{1}{2}+\\sqrt{4}\\) 😊 "继续"';
 assert.equal(decodeModelReply(JSON.stringify({text})).text, text);
});
test('修复单反斜杠公式，避免 frac/text/begin 被 JSON 解释成控制字符', () => {
 const raw = String.raw`{"text":"结果是 \(\frac{1}{2}\)，\[\text{面积}=2\times3\]","mood":"warm"}`;
 assert.equal(decodeModelReply(raw).text, String.raw`结果是 \(\frac{1}{2}\)，\[\text{面积}=2\times3\]`);
});
test('即使 JSON 本来能解析，frac、theta、nabla 也保留公式语义', () => {
 const raw = String.raw`{"text":"$$\frac{1}{2}+\theta+\nabla f$$"}`;
 assert.equal(decodeModelReply(raw).text, String.raw`$$\frac{1}{2}+\theta+\nabla f$$`);
});
test('普通文本和 fenced JSON 均可显示', () => {
 assert.equal(decodeModelReply('今天好。').text, '今天好。');
 assert.equal(decodeModelReply('```json\n{"text":"你好"}\n```').text,'你好');
});
test('未闭合 JSON 保留原文，不丢失消息', () => {
 const raw = '{"text":"尚未结束';
 assert.equal(decodeModelReply(raw).text,raw);
});
test('函数实际返回正确公式文本，密码及引擎路线保持', async () => {
 process.env.ADMIN_PASSWORD='test-secret';process.env.QWEN_API_KEY='test-key';
 const previous = globalThis.fetch;
 globalThis.fetch=async()=>Response.json({choices:[{message:{content:String.raw`{"text":"答案是 \(\frac{3}{4}\)。","mood":"warm"}`}}]});
 try {
 const response=await handler(new Request('https://example.netlify.app/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'计算',password:'test-secret',modelPreference:'qwen-flash'})}));
 assert.equal(response.status,200);assert.equal((await response.json()).text,String.raw`答案是 \(\frac{3}{4}\)。`);
 } finally {globalThis.fetch=previous;}
});
