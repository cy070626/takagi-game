export function interactiveRequested(text) {
 return !/(?:不要|不用|别)(?:再)?(?:生成|制作|做|写)/.test(text) && /生成|制作|做个|做一个|写个|写一个|帮我写|来个/.test(text) && /HTML|网页|页面|互动页|交互页|互动卡片|互动图|可点击|可拖动/i.test(text);
}
export const readableReplyRules = String.raw`
可读展示规则：
1. text 必须是玩家能直接阅读的自然语言。遇到公式，先说结果的含义，再给公式，补一句变量含义；不能只甩代码。例：先说“相当于六份里的五份”，再显示五除以六。
2. 行内公式用 \(...\)，独立公式用 \[...\] 或 $$...$$ 包裹。JSON 字符串中的每个反斜杠必须双写，换行必须正确转义。不要将数学公式放在代码块中，不向玩家解释 LaTeX 语法。
3. 只有玩家确实需要对照信息时才用简短 Markdown 表格。普通聊天保持原有语气，不改成报告。强调可用 **文字**，正常回应不要出现 HTML 标签。
4. 普通聊天不提供可执行页面。互动 HTML 放在独立 interactive 字段，绝不混在 text 中。
`;
export const interactiveReplyRules = String.raw`
本轮玩家明确请求简易互动页面，可以返回 interactive={"title":"短标题","html":"完整 HTML 或 HTML 片段"}。
只生成一个小功能，例如按钮答题、选项切换、滑块计算、情境分支或小图表。代码总长不超过 6000 字符，尽量在 3500 字符内完成。
可使用内联 CSS、原生 JavaScript、SVG 和 HTML；不要使用外部库、外链、字体、网络请求、图片服务、iframe、弹出窗口、下载、浏览器权限、localStorage 或 parent/top/opener。计算限于本地输入，按钮用 type=button，反馈直接写在页面中，不用 alert。
手机可点击按钮不小于 44px；布局自适应，字体至少16px。代码简洁，不用无限循环、持续动画或复杂游戏引擎。数学展示用可读的普通符号、分数文字或 MathML，不依赖外部公式库。
text 简短说明玩法和内容。JSON 代码字符串里的引号、换行和反斜杠必须正确转义。不能声称修改了本站、安装了组件或接入了真实服务。
完整输出示意：{"text":"给你做了个选择练习，点一下就能看结果。","mood":"warm","topic":"互动练习","suggestions":["再简单一点","换一道题","继续刚才的话题"],"interactive":{"title":"小练习","html":"<button type='button' onclick='this.textContent=1+1'>看答案</button>"}}。
`;
