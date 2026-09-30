(() => {
  const ORDER = {
    'qwen-max': ['qwen-max','qwen-flash','deepseek-flash','deepseek-pro'],
    'qwen-flash': ['qwen-flash','qwen-max','deepseek-flash','deepseek-pro'],
    'deepseek-pro': ['deepseek-pro','deepseek-flash','qwen-max','qwen-flash'],
    'deepseek-flash': ['deepseek-flash','deepseek-pro','qwen-max','qwen-flash'],
  };
  const FATAL = new Set(['INVALID_ADMIN_PASSWORD','PASSWORD_NOT_CONFIGURED']);
  const TERMINAL = new Set(['ENGINE_NOT_CONFIGURED','QWEN_BASE_URL_REQUIRED','ENGINE_ACCOUNT_UNAVAILABLE','ENGINE_ACCESS_DENIED','ENGINE_KEY_INVALID','ENGINE_QUOTA_EXHAUSTED','ENGINE_MODEL_UNAVAILABLE','VISION_UNSUPPORTED']);
  const names = { 'qwen-max':'千问 3.8 Max','qwen-flash':'千问 3.8 Flash','deepseek-pro':'DeepSeek Pro','deepseek-flash':'DeepSeek Flash' };
  const delay = ms => new Promise(resolve=>setTimeout(resolve,ms));
  async function run(body,{onProgress=()=>{},signal,fetchImpl=fetch,sleep=delay,now=Date.now,budgetMs=240000}={}) {
    const preferred=ORDER[body.modelPreference]?body.modelPreference:'qwen-flash';
    const engines=ORDER[preferred].filter(engine=>!body.image||engine!=='deepseek-pro');
    const deadline=now()+budgetMs,failures=[];
    for(const engine of engines){
      const limit=3;
      for(let attempt=1;attempt<=limit;attempt++){
        if(signal?.aborted)throw Object.assign(new Error('已停止等待，原消息可以重试'),{code:'CLIENT_CANCELLED',attempts:failures});
        const remaining=deadline-now();
        if(remaining<2000)throw Object.assign(new Error('本轮等待已达到上限，请重试原消息'),{code:'CLIENT_TIMEOUT',status:504,attempts:failures});
        onProgress({engine,engineName:names[engine],attempt,limit,image:Boolean(body.image)});
        const controller=new AbortController();
        const abort=()=>controller.abort();signal?.addEventListener('abort',abort,{once:true});
        const timer=setTimeout(()=>controller.abort(),Math.min(remaining,20000));
        let data,response;
        try{
          response=await fetchImpl('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,modelPreference:engine,allowFallback:false,clientManagedRetries:true}),signal:controller.signal});
          const raw=await response.text();try{data=JSON.parse(raw)}catch{data={}}
          if(response.ok&&typeof data.text==='string'&&data.text.trim()){
            return {...data,fallbacks:failures,connectionAttempts:failures.length+1,retryCount:attempt-1};
          }
          const detail=data.details||{};
          const failure={engine,engineName:data.engineName||names[engine],status:detail.status??response.status,code:data.code||(response.ok?'INVALID_RESPONSE':'GATEWAY_ERROR'),message:data.error||'服务器未完成回复',detail:detail.message||'',requestId:data.requestId||response.headers.get('x-nf-request-id')||'',attempt,retryCount:attempt-1};
          failures.push(failure);
          if(FATAL.has(failure.code)||[400,413,415].includes(response.status)&&!data.engine)throw Object.assign(new Error(failure.message),{...failure,attempts:failures});
          if(TERMINAL.has(failure.code))break;
        }catch(error){
          if(signal?.aborted)throw Object.assign(new Error('已停止等待，原消息可以重试'),{code:'CLIENT_CANCELLED',attempts:failures});
          if(error.attempts)throw error;
          failures.push({engine,engineName:names[engine],code:controller.signal.aborted?'CLIENT_TIMEOUT':'CLIENT_NETWORK_ERROR',status:controller.signal.aborted?504:0,message:controller.signal.aborted?'本次连接等待超时':error.message||'网络连接失败',attempt,retryCount:attempt-1});
        }finally{clearTimeout(timer);signal?.removeEventListener('abort',abort)}
        if(attempt<limit)await sleep(attempt*350);
      }
    }
    const last=failures.at(-1)||{};
    throw Object.assign(new Error(body.image?'可用视觉引擎均未完成图片识别':'已完成千问和 DeepSeek 的重试，请稍后重试原消息'),{code:'ALL_ENGINES_FAILED',status:502,engineName:last.engineName,requestId:last.requestId||'',upstreamMessage:last.detail||last.message,attempts:failures,reminder:'原消息已保留，点击“重试这条消息”可以再次发送。'});
  }
  globalThis.TakagiChatChain=Object.freeze({run});
})();
