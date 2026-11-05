const {test,expect}=require('@playwright/test');
const fixtureKey='test-user-key-alpha'; // Deliberately not a real API credential.
const success={candidates:[{finishReason:'STOP',content:{parts:[{text:'OK'}]}}]};
const reply=(route,status,body)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});
async function ready(page){await page.goto('/index.html');await page.waitForFunction(()=>window.BandRoomReady);await expect(page.locator('#sendToBotBtn .lm-stage')).toBeAttached();}
async function open(page){await page.locator('#settingsBtn').click();await expect(page.locator('#geminiSettingsDialog')).toBeVisible();await expect(page.locator('#geminiApiKey')).toBeFocused();}
async function paste(page,key=fixtureKey){await page.locator('#geminiApiKey').dispatchEvent('paste');await page.locator('#geminiApiKey').fill(key);}
async function verify(page){await open(page);await page.locator('#geminiApiKey').fill(fixtureKey);await page.locator('#testGeminiBtn').click();await expect(page.locator('#geminiSettingsDialog')).toHaveAttribute('data-state','success');}

test('graphite workspace, readable chat boundary, microphone logo and fixed sidebar',async({page,request})=>{
 await ready(page);
 await expect(page.locator('body')).toHaveCSS('background-color','rgb(23, 25, 29)');
 await expect(page.locator('#aiPanel')).toHaveCSS('border-top-width','1px');
 await expect(page.locator('#aiPanel')).toHaveCSS('background-color','rgb(34, 38, 45)');
 await expect(page.locator('.side-brand-mark svg')).toBeVisible();
 const position=await page.locator('#sideMenu').boundingBox();await page.evaluate(()=>window.scrollTo(0,1e6));const scrolled=await page.locator('#sideMenu').boundingBox();expect(scrolled.y).toBe(position.y);
 const env=await request.get('/api/env.js');expect(env.status()).toBe(200);expect(await env.text()).toBe('window.env = Object.freeze({});');
});

test('pasted key verifies text and real WAV payload once, then enables matching client',async({page})=>{
 const calls=[];let allow;
 const wait=new Promise(resolve=>allow=resolve);
 await page.route('https://generativelanguage.googleapis.com/**',async route=>{
  const req=route.request();calls.push({url:req.url(),headers:req.headers(),body:req.postDataJSON()});if(calls.length===1)await wait;await reply(route,200,success);
 });
 await ready(page);await open(page);await paste(page);
 await expect(page.locator('#geminiSettingsDialog')).toHaveAttribute('data-state','verifying');
 expect(await page.evaluate(()=>AIExaminer.isOnline())).toBe(false);
 const box=await page.locator('#geminiSettingsDialog').boundingBox();expect(Math.abs(box.x+box.width/2-720)).toBeLessThan(2);expect(Math.abs(box.y+box.height/2-450)).toBeLessThan(2);expect(box.width).toBeLessThanOrEqual(380);
 await expect(page.locator('.gemini-spinner')).toBeVisible();allow();
 await expect(page.locator('#geminiSettingsDialog')).toHaveAttribute('data-state','success');
 expect(calls).toHaveLength(2);for(const call of calls){expect(call.url).toContain('/models/gemini-2.5-flash:generateContent');expect(call.url).not.toContain(fixtureKey);expect(call.headers['x-goog-api-key']).toBe(fixtureKey);}
 expect(calls[1].body.contents[0].parts[1].inlineData.mimeType).toBe('audio/wav');
 expect(Buffer.from(calls[1].body.contents[0].parts[1].inlineData.data,'base64').subarray(0,4).toString()).toBe('RIFF');
 await expect(page.locator('#geminiApiKey')).toHaveValue('');
 expect(await page.evaluate(()=>AIExaminer.isOnline())).toBe(true);
 expect(await page.evaluate(()=>JSON.stringify(BandRoomGeminiSettings.getSnapshot()))).not.toContain(fixtureKey);
 expect(await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}))).not.toContain(fixtureKey);
 await page.locator('#closeModalBtn').click();await expect(page.locator('#settingsBtn')).toBeFocused();
 await open(page);await expect(page.locator('#geminiApiKey')).toHaveValue('');await expect(page.locator('#geminiActiveConnection')).toContainText('gemini-2.5-flash');
 await page.locator('#disconnectGeminiBtn').click();expect(await page.evaluate(()=>AIExaminer.isOnline())).toBe(false);
});

for(const scenario of [
 {name:'invalid key',status:400,body:{error:{message:fixtureKey,details:[{reason:'API_KEY_INVALID'}]}},text:'không hợp lệ'},
 {name:'quota',status:429,body:{error:{message:fixtureKey}},text:'hết hạn mức'},
 {name:'permission',status:403,body:{error:{message:fixtureKey}},text:'chưa có quyền'},
 {name:'model',status:404,body:{error:{message:fixtureKey}},text:'Không tìm thấy model'},
 {name:'service error',status:503,body:{error:{message:fixtureKey}},text:'Chưa xác minh'},
 {name:'malformed success',status:200,body:{},text:'phản hồi kiểm tra hợp lệ'},
]){
 test(`rejects ${scenario.name} without claiming connected or reflecting key`,async({page})=>{
  await page.route('https://generativelanguage.googleapis.com/**',route=>reply(route,scenario.status,scenario.body));
  await ready(page);await open(page);await page.locator('#geminiApiKey').fill(fixtureKey);await page.locator('#testGeminiBtn').click();
  await expect(page.locator('#geminiSettingsDialog')).toHaveAttribute('data-state','error');await expect(page.locator('#serverSettingsStatus')).toContainText(scenario.text);
  expect(await page.evaluate(()=>AIExaminer.isOnline())).toBe(false);await expect(page.locator('body')).not.toContainText(fixtureKey);
 });
}

test('audio rejection does not activate a text-only connection',async({page})=>{
 await page.route('https://generativelanguage.googleapis.com/**',route=>{
  const body=route.request().postDataJSON();return body.contents[0].parts.some(p=>p.inlineData)?reply(route,400,{error:{message:fixtureKey}}):reply(route,200,success);
 });
 await ready(page);await open(page);await page.locator('#geminiApiKey').fill(fixtureKey);await page.locator('#testGeminiBtn').click();
 await expect(page.locator('#geminiSettingsDialog')).toHaveAttribute('data-state','limited');expect(await page.evaluate(()=>AIExaminer.isOnline())).toBe(false);await expect(page.locator('#serverSettingsStatus')).toContainText('âm thanh');
});

test('cancel rejects late verification and restores focus; network errors remain connectivity errors',async({page})=>{
 let allow;const gate=new Promise(resolve=>allow=resolve);
 await page.route('https://generativelanguage.googleapis.com/**',async route=>{await gate;await reply(route,200,success).catch(()=>{});});
 await ready(page);await open(page);await paste(page);await expect(page.locator('#geminiSettingsDialog')).toHaveAttribute('data-state','verifying');await page.keyboard.press('Escape');await expect(page.locator('#modalOverlay')).not.toBeVisible();await expect(page.locator('#settingsBtn')).toBeFocused();allow();await page.waitForTimeout(100);
 expect(await page.evaluate(()=>AIExaminer.isOnline())).toBe(false);await page.unroute('https://generativelanguage.googleapis.com/**');await page.route('https://generativelanguage.googleapis.com/**',route=>route.abort('failed'));
 await open(page);await page.locator('#geminiApiKey').fill(fixtureKey);await page.locator('#testGeminiBtn').click();await expect(page.locator('#geminiSettingsDialog')).toHaveAttribute('data-state','error');await expect(page.locator('#serverSettingsStatus')).toContainText('kiểm tra mạng');
});

test('failed replacement keeps verified model; refresh does not restore an owner key',async({page})=>{
 let fail=false;await page.route('https://generativelanguage.googleapis.com/**',route=>fail?reply(route,429,{error:{message:fixtureKey}}):reply(route,200,success));
 await ready(page);await verify(page);await page.locator('#closeModalBtn').click();fail=true;await open(page);await page.locator('#geminiModel').selectOption('gemini-2.5-pro');await page.locator('#geminiApiKey').fill('test-key-replacement');await page.locator('#testGeminiBtn').click();
 await expect(page.locator('#geminiSettingsDialog')).toHaveAttribute('data-state','error');await expect(page.locator('#geminiVerificationDetails')).toContainText('gemini-2.5-flash');expect(await page.evaluate(()=>BandRoomGeminiSettings.getSnapshot().model)).toBe('gemini-2.5-flash');
 await page.reload();await page.waitForFunction(()=>window.BandRoomReady);expect(await page.evaluate(()=>AIExaminer.isOnline())).toBe(false);
});

test('model discovery preserves custom selection and custom model drives verification',async({page})=>{
 const urls=[];
 await page.route('https://generativelanguage.googleapis.com/**',route=>{
  const req=route.request();urls.push(req.url());if(req.method()==='GET')return reply(route,200,{models:[{name:'models/gemini-current',displayName:'Current model',supportedGenerationMethods:['generateContent']},{name:'models/embedding',supportedGenerationMethods:['embedContent']}]});return reply(route,200,success);
 });
 await ready(page);await open(page);await page.locator('#geminiModel').selectOption('custom');await page.locator('#geminiCustomModel').fill('gemini-personal-model');await page.locator('#geminiApiKey').fill(fixtureKey);await page.locator('#loadGeminiModelsBtn').click();
 await expect(page.locator('#geminiModelListStatus')).toContainText('1 model');await expect(page.locator('#geminiModel')).toHaveValue('custom');await expect(page.locator('#geminiCustomModel')).toHaveValue('gemini-personal-model');
 await page.locator('#testGeminiBtn').click();await expect(page.locator('#geminiSettingsDialog')).toHaveAttribute('data-state','success');expect(urls.filter(url=>url.includes(':generateContent')).every(url=>url.includes('/gemini-personal-model:'))).toBe(true);
});

test('mobile overlay stays in viewport, traps keyboard focus and respects reduced motion',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 let allow;const gate=new Promise(resolve=>allow=resolve);await page.route('https://generativelanguage.googleapis.com/**',async route=>{await gate;await reply(route,200,success).catch(()=>{});});
 await ready(page);await page.locator('#menuBtn').click();await page.locator('#sideSettingsBtn').click();await expect(page.locator('#geminiApiKey')).toBeFocused();
 await page.locator('#closeModalBtn').focus();await page.keyboard.press('Tab');await expect(page.locator('#geminiApiKey')).toBeFocused();
 await paste(page);await expect(page.locator('#geminiSettingsDialog')).toHaveAttribute('data-state','verifying');await expect(page.locator('.gemini-spinner')).toHaveCSS('animation-name','none');
 const box=await page.locator('#geminiSettingsDialog').boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(390);expect(box.y+box.height).toBeLessThanOrEqual(844);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);await page.locator('#closeModalBtn').click();allow();
});
