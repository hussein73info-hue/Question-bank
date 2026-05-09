// ══════════════════════════════════════════════
//  CURRICULUM
// ══════════════════════════════════════════════
var CUR = {
  1:{name:'الفصل الأول',units:[
    {id:1,name:'الدورة المحاسبية',lessons:['الدورة المحاسبية المفهوم والمراحل','نظرية القيد المزدوج والعمليات المالية','تسجيل القيود المحاسبية','دفتر اليومية','دفتر الأستاذ','ميزان المراجعة']},
    {id:2,name:'القوائم المالية',lessons:['القوائم المالية الأنواع والأهمية','إقفال الحسابات']},
    {id:3,name:'التحليل المالي',lessons:['مفهوم التحليل المالي وأهميته','تقنيات التحليل المالي','التحليل المالي والنسب','استخدامات التحليل المالي']},
    {id:4,name:'الأسواق المالية',lessons:['مفهوم الأسواق المالية وأنواعها وأهميتها','مفهوم الأصول المالية وأنواعها','مفهوم التداول وأنواعه وآلياته','دور التكنولوجيا في الأسواق المالية','بورصة عمان']},
    {id:5,name:'البنك المركزي الأردني',lessons:['البنك المركزي والسياسة النقدية','دور البنك المركزي الأردني في حماية المستهلك المالي','دور البنك المركزي الأردني في نشر الثقافة المالية المجتمعية','دور البنك المركزي الأردني في المحافظة على الاستقرار المصرفي والمالي']}
  ]},
  2:{name:'الفصل الثاني',units:[
    {id:6,name:'المؤسسات المالية الدولية',lessons:['المؤسسات المالية الدولية: نشأتها، وأنواعها','صندوق النقد الدولي','البنك الدولي']},
    {id:7,name:'الاستدامة المالية',lessons:['مقدمة في الاستدامة المالية','أهداف الاستدامة المالية','الاستدامة المالية: التحديات والحلول','الاقتصاد الأخضر والاستدامة']},
    {id:8,name:'الذكاء الاصطناعي التوليدي',lessons:['الذكاء الاصطناعي التوليدي','الذكاء الاصطناعي التوليدي وعالم المال','المستشار المالي','الذكاء الاصطناعي التوليدي وخصوصية البيانات','الذكاء الاصطناعي التوليدي وأخلاقيات الأعمال']},
    {id:9,name:'السياسات الاقتصادية',lessons:['مقدمة في السياسات الاقتصادية والسياسة المالية','تأثير السياسة المالية في النشاط الاقتصادي','السياسة النقدية: أدواتها، وتأثيرها في النشاط الاقتصادي','السياسة التجارية: أدواتها وتأثيرها في النشاط الاقتصادي','السياسة الصناعية: أدواتها، وتأثيرها في النشاط الاقتصادي']}
  ]}
};

var LBL = ['أ','ب','ج','د'];
var minCounter = 0;
var currentMode = 'train';
var currentQuiz = [];
var userAnswers = {};
var timerIv = null;
var timeLeft = 0;
// Navigation history stack — each entry is a page id string
var history = [];
// Lesson action state
var pendingLesson = null;

// ══════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════
function init() {
  buildLessonLists();
  buildUnitGrid();
  buildExamLists();
  updateCounts();
  showPage('start');
}

// ══════════════════════════════════════════════
//  PAGE NAVIGATION — single source of truth
// ══════════════════════════════════════════════
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  // Show target
  var el = document.getElementById('pg-' + pageId);
  if (!el) { console.error('Page not found: pg-' + pageId); return; }
  el.classList.add('active');
  window.scrollTo(0,0);
  updateNavBar(pageId);
}

function navigateTo(pageId) {
  // Push current page to history before going
  var current = getCurrentPage();
  if (current && current !== pageId) history.push(current);
  showPage(pageId);
}

function getCurrentPage() {
  var active = document.querySelector('.page.active');
  if (!active) return null;
  return active.id.replace('pg-','');
}

function goBack() {
  if (history.length > 0) {
    var prev = history.pop();
    showPage(prev);
  } else {
    showPage('home');
  }
}

function updateNavBar(pageId) {
  var navbar  = document.getElementById('navbar');
  var backBtn = document.getElementById('nb-back');
  var homeBtn = document.getElementById('nb-home');
  var modeEl  = document.getElementById('nb-mode');

  if (pageId === 'start') {
    navbar.style.display = 'none';
    return;
  }
  navbar.style.display = 'flex';

  // Back button: always shown except on home
  backBtn.style.display = (pageId === 'home') ? 'none' : 'flex';

  // Home button: shown on all pages except start and home
  homeBtn.style.display = (pageId === 'home') ? 'none' : 'flex';

  // Mode label
  modeEl.textContent = currentMode === 'exam' ? '📝 نمط امتحاني' : '📖 نمط تدريبي';
}

// ══════════════════════════════════════════════
//  START SCREEN
// ══════════════════════════════════════════════
function pickMode(m) {
  currentMode = m;
  document.getElementById('mc-train').classList.toggle('active', m === 'train');
  document.getElementById('mc-exam').classList.toggle('active', m === 'exam');
}

// Override showPage for start → home transition (clear history)
function goHome() {
  history = [];
  showPage('home');
}

// ══════════════════════════════════════════════
//  BUILD LESSON LISTS
// ══════════════════════════════════════════════
function buildLessonLists() {
  [1,2].forEach(function(sem) {
    var html = '';
    CUR[sem].units.forEach(function(u) {
      var hasLessons = u.lessons.some(function(l){
        return bank.filter(function(q){return q.lesson===l&&!q._examKey;}).length > 0;
      });
      if (!hasLessons) return;
      html += '<div class="unit-sec"><div class="us-title">الوحدة ' + u.id + ': ' + u.name + '</div>';
      u.lessons.forEach(function(l) {
        var cnt = bank.filter(function(q){return q.lesson===l&&!q._examKey;}).length;
        if (!cnt) return;
        html += '<div class="lesson-row" onclick="openLesson(\'' + esc(l) + '\',\'' + esc(u.name) + '\',' + sem + ')">' +
          '<div class="lr-ico">📄</div>' +
          '<div class="lr-info"><div class="lr-name">' + l + '</div><div class="lr-cnt">' + cnt + ' سؤال</div></div>' +
          '<div class="lr-arr">&#8592;</div></div>';
      });
      html += '</div>';
    });
    document.getElementById('list-f' + sem).innerHTML = html;
  });
}

function updateCounts() {
  var c1 = bank.filter(function(q){return q.sem===1&&!q._examKey;}).length;
  var c2 = bank.filter(function(q){return q.sem===2&&!q._examKey;}).length;
  document.getElementById('cnt-f1').textContent = c1 + ' سؤال';
  document.getElementById('cnt-f2').textContent = c2 + ' سؤال';
}

function openLesson(lesson, unitName, sem) {
  pendingLesson = {lesson:lesson, unitName:unitName, sem:sem};
  var cnt = bank.filter(function(q){return q.lesson===lesson&&!q._examKey;}).length;
  document.getElementById('lesson-action-content').innerHTML =
    '<div class="ac-lesson">' + lesson + '</div>' +
    '<div class="ac-unit">' + unitName + ' | ' + CUR[sem].name + '</div>' +
    '<div class="ac-cnt">' + cnt + ' سؤال متاح</div>' +
    '<button class="btn-launch" onclick="startLesson()">🚀 ابدأ الاختبار الآن</button>';
  navigateTo('lesson-action');
}

function startLesson() {
  if (!pendingLesson) return;
  var qs = bank.filter(function(q){return q.lesson===pendingLesson.lesson&&!q._examKey;});
  launchQuiz(qs, pendingLesson.lesson);
}

// ══════════════════════════════════════════════
//  BUILD UNIT GRID
// ══════════════════════════════════════════════
function buildUnitGrid() {
  var html = '';
  [1,2].forEach(function(sem) {
    CUR[sem].units.forEach(function(u) {
      var cnt = bank.filter(function(q){return q.unit===u.id&&!q._examKey;}).length;
      html += '<div class="unit-card uc-sem' + sem + '" onclick="startUnit(' + u.id + ',\'' + esc(u.name) + '\')">' +
        '<div class="uc-num">و' + u.id + '</div>' +
        '<div class="uc-name">' + u.name + '</div>' +
        '<div class="uc-sem">' + CUR[sem].name + '</div>' +
        '<div class="uc-badge">٢٠ سؤالاً | ' + cnt + ' متاح</div>' +
      '</div>';
    });
  });
  document.getElementById('units-grid').innerHTML = html;
}

function startUnit(unitId, unitName) {
  var qs = shuffle(bank.filter(function(q){return q.unit===unitId&&!q._examKey;})).slice(0,20);
  if (!qs.length) { showToast('لا توجد أسئلة','err'); return; }
  launchQuiz(qs, unitName);
}

// ══════════════════════════════════════════════
//  MINISTERIAL
// ══════════════════════════════════════════════
function doMinisterial() {
  minCounter++;
  var allUnits = [];
  [1,2].forEach(function(sem){ CUR[sem].units.forEach(function(u){ allUnits.push(u.id); }); });
  var qs = [];
  var perU = Math.floor(40/allUnits.length);
  allUnits.forEach(function(uid){
    var uqs = shuffle(bank.filter(function(q){return q.unit===uid&&!q._examKey;})).slice(0,perU);
    qs = qs.concat(uqs);
  });
  qs = shuffle(qs).slice(0,40);
  if (!qs.length) { showToast('لا توجد أسئلة','err'); return; }
  launchQuiz(qs, 'النموذج الوزاري رقم ' + minCounter);
}

// ══════════════════════════════════════════════
//  BUILD EXAM LISTS
// ══════════════════════════════════════════════
function buildExamLists() {
  var exF1 = [
    {key:'tq1_f1',label:'التقويم الأول'},
    {key:'tq2_f1',label:'التقويم الثاني'},
    {key:'tq3_f1',label:'التقويم الثالث'},
    {key:'final_f1',label:'الاختبار النهائي'}
  ];
  var exF2 = [
    {key:'tq1_f2',label:'التقويم الأول'},
    {key:'tq2_f2',label:'التقويم الثاني'},
    {key:'final_f2',label:'الاختبار النهائي'}
  ];
  document.getElementById('examlist-f1').innerHTML = buildExamListHtml(exF1);
  document.getElementById('examlist-f2').innerHTML = buildExamListHtml(exF2);
}

function buildExamListHtml(exams) {
  var html = '<div class="exam-list">';
  exams.forEach(function(e) {
    var cnt = bank.filter(function(q){return q._examKey===e.key;}).length;
    if (!cnt) return;
    html += '<div class="exam-row" onclick="startExam(\'' + e.key + '\',\'' + esc(e.label) + '\')">' +
      '<div class="er-ico">📋</div>' +
      '<div class="er-info"><div class="er-name">' + e.label + '</div><div class="er-cnt">' + cnt + ' سؤال</div></div>' +
      '<div class="er-btn">ابدأ &#8592;</div>' +
    '</div>';
  });
  return html + '</div>';
}

function startExam(key, label) {
  var qs = bank.filter(function(q){return q._examKey===key;});
  if (!qs.length) { showToast('لا توجد أسئلة','err'); return; }
  launchQuiz(qs, label);
}

// ══════════════════════════════════════════════
//  QUIZ ENGINE
// ══════════════════════════════════════════════
function launchQuiz(qs, title) {
  currentQuiz = qs;
  userAnswers = {};
  clearInterval(timerIv);

  document.getElementById('qb-title').textContent = title || 'الاختبار';
  document.getElementById('qb-mode').textContent = currentMode === 'exam' ? '📝 امتحاني' : '📖 تدريبي';

  var html = '';
  currentQuiz.forEach(function(q,i) {
    // Only show non-empty options
    var opts = (q.options||[]).filter(function(o){return o && o.trim();});
    html += '<div class="qcard" id="qc-'+i+'">'+
      '<div class="qcard-hdr">'+
        '<span class="qbadge">س'+(i+1)+'</span>'+
        '<span class="qmeta">'+(q.lesson||'')+'</span>'+
      '</div>'+
      '<div class="qtext">'+q.text+'</div>'+
      '<div class="opts-list" id="ol-'+i+'">';
    opts.forEach(function(opt,j){
      html += '<div class="opt" id="o-'+i+'-'+j+'" onclick="pick('+i+','+j+')">'+
        '<span class="ocircle">'+LBL[j]+'</span>'+
        '<span class="otext">'+opt+'</span>'+
      '</div>';
    });
    html += '</div>';
    if (currentMode==='train') html += '<div class="train-fb" id="fb-'+i+'" style="display:none"></div>';
    html += '</div>';
  });

  document.getElementById('quiz-area').innerHTML = html;
  updateProg(0);

  if (currentMode==='exam') {
    var sec = currentQuiz.length * 60;
    timeLeft = sec;
    var tel = document.getElementById('qb-timer');
    tel.style.display = 'block';
    updTimer();
    timerIv = setInterval(function(){
      timeLeft--;
      updTimer();
      if (timeLeft<=0){ clearInterval(timerIv); finishQuiz(); }
    },1000);
  } else {
    document.getElementById('qb-timer').style.display = 'none';
  }

  navigateTo('quiz');
}

function pick(qi, oi) {
  var q = currentQuiz[qi];
  var opts = (q.options||[]).filter(function(o){return o && o.trim();});
  var correctIdx = q.answer; // answer index within full options array
  // Map correct answer to filtered opts index
  var filteredCorrect = 0;
  var fullOpts = q.options||[];
  var validCount = 0;
  for (var k=0; k<fullOpts.length; k++) {
    if (!fullOpts[k] || !fullOpts[k].trim()) continue;
    if (k === correctIdx) { filteredCorrect = validCount; break; }
    validCount++;
  }

  // In train mode: lock after first answer
  if (currentMode==='train' && userAnswers[qi]!==undefined) return;

  userAnswers[qi] = oi;

  // Clear previous styling
  var allOpts = document.querySelectorAll('[id^="o-'+qi+'-"]');
  allOpts.forEach(function(el){
    el.classList.remove('exam-sel','correct','wrong');
    el.style.pointerEvents = '';
  });

  var selEl = document.getElementById('o-'+qi+'-'+oi);
  if (!selEl) return;

  if (currentMode==='exam') {
    selEl.classList.add('exam-sel');
  } else {
    // Train mode: show correct/wrong immediately, lock all
    allOpts.forEach(function(el,j){
      el.style.pointerEvents = 'none';
      if (j===filteredCorrect) el.classList.add('correct');
      else if (j===oi && oi!==filteredCorrect) el.classList.add('wrong');
    });
    var fb = document.getElementById('fb-'+qi);
    if (fb) {
      var isOk = oi===filteredCorrect;
      fb.style.display='block';
      fb.className='train-fb '+(isOk?'fb-ok':'fb-err');
      fb.innerHTML = isOk
        ? '✅ إجابة صحيحة! أحسنت.'
        : '❌ خطأ — الصحيح: <strong>'+LBL[filteredCorrect]+' — '+opts[filteredCorrect]+'</strong>';
    }
  }
  updateProg(Object.keys(userAnswers).length);
}

function updateProg(answered) {
  var total = currentQuiz.length;
  document.getElementById('prog-fill').style.width = Math.round(answered/total*100)+'%';
  document.getElementById('prog-txt').textContent = answered+' / '+total;
}

function finishQuiz() {
  clearInterval(timerIv);
  showResults();
}

// ══════════════════════════════════════════════
//  RESULTS
// ══════════════════════════════════════════════
function showResults() {
  var total=currentQuiz.length, correct=0, wrong=0, skipped=0;
  currentQuiz.forEach(function(q,i){
    var qa = userAnswers[i];
    if (qa===undefined) { skipped++; return; }
    // Map answer
    var fullOpts=q.options||[], valid=0, fc=0;
    for (var k=0;k<fullOpts.length;k++){
      if (!fullOpts[k]||!fullOpts[k].trim()) continue;
      if (k===q.answer){fc=valid;break;}
      valid++;
    }
    if (qa===fc) correct++; else wrong++;
  });
  var pct=Math.round(correct/total*100);
  var gr=pct>=90?{g:'ممتاز',c:'#27ae60',bg:'#d4edda',i:'🏆'}
        :pct>=80?{g:'جيد جداً',c:'#2980b9',bg:'#d4e8f5',i:'⭐'}
        :pct>=70?{g:'جيد',c:'#8e44ad',bg:'#ead7f5',i:'👍'}
        :pct>=60?{g:'مقبول',c:'#f39c12',bg:'#fef9e7',i:'📖'}
        :{g:'راسب',c:'#e74c3c',bg:'#f8d7da',i:'💪'};

  var html =
    '<div class="score-card" style="background:linear-gradient(135deg,#1a3a5c,#2d6096)">'+
      '<div style="font-size:52px">'+gr.i+'</div>'+
      '<div style="font-size:42px;font-weight:800;margin:6px 0">'+correct+' / '+total+'</div>'+
      '<div style="font-size:20px;font-weight:700;opacity:.9">'+pct+'%</div>'+
      '<div class="grade-pill" style="background:'+gr.bg+';color:'+gr.c+'">'+gr.g+'</div>'+
    '</div>'+
    '<div class="stats-row">'+
      '<div class="sbox c"><div class="sv">'+correct+'</div><div class="sl">✅ صحيحة</div></div>'+
      '<div class="sbox w"><div class="sv">'+wrong+'</div><div class="sl">❌ خاطئة</div></div>'+
      '<div class="sbox s"><div class="sv">'+skipped+'</div><div class="sl">⏭️ متخطاة</div></div>'+
    '</div>'+
    buildAnalytics()+
    (currentMode==='exam'?buildReview():'')+
    '<div class="result-btns">'+
      '<button class="btn-retry" onclick="retryQuiz()">🔄 إعادة الاختبار</button>'+
      '<button class="btn-home-res" onclick="goToHome()">🏠 الصفحة الرئيسية</button>'+
    '</div>';

  document.getElementById('result-content').innerHTML = html;
  navigateTo('result');
}

function goToHome() {
  history = [];
  showPage('home');
}

function retryQuiz() {
  var title = document.getElementById('qb-title').textContent;
  launchQuiz(shuffle(currentQuiz.slice()), title);
}

function buildAnalytics() {
  var umap={};
  currentQuiz.forEach(function(q,i){
    var uid=q.unit||0;
    if (!umap[uid]){
      var nm='—';
      [1,2].forEach(function(s){CUR[s].units.forEach(function(u){if(u.id===uid)nm=u.name;});});
      umap[uid]={name:nm,total:0,correct:0};
    }
    umap[uid].total++;
    var qa=userAnswers[i];
    if(qa!==undefined){
      var fo=q.options||[],v=0,fc=0;
      for(var k=0;k<fo.length;k++){if(!fo[k]||!fo[k].trim())continue;if(k===q.answer){fc=v;break;}v++;}
      if(qa===fc)umap[uid].correct++;
    }
  });
  var keys=Object.keys(umap);
  if(keys.length<=1) return '';
  var bad=[];
  var rows='';
  keys.forEach(function(uid){
    var u=umap[uid]; if(!u.total)return;
    var p=Math.round(u.correct/u.total*100);
    var c=p>=80?'#27ae60':p>=60?'#f39c12':'#e74c3c';
    var lbl=p>=80?'✅ ممتاز':p>=60?'⚠️ جيد':'❌ يحتاج مراجعة';
    if(p<60)bad.push(u.name);
    rows+='<div class="ustat">'+
      '<div class="ustat-name">'+u.name+'</div>'+
      '<div class="ustat-bar"><div class="ustat-fill" style="width:'+p+'%;background:'+c+'"></div></div>'+
      '<div class="ustat-info" style="color:'+c+';font-weight:700">'+p+'% <span style="color:var(--mu);font-weight:400">'+lbl+'</span></div>'+
    '</div>';
  });
  var advice=bad.length
    ?'<div class="advice">💡 <strong>توصية:</strong> راجع: <strong>'+bad.join(' — ')+'</strong></div>'
    :'<div class="advice ok">🌟 <strong>رائع!</strong> أداؤك ممتاز في جميع الوحدات!</div>';
  return '<div class="analytics"><div class="sec-title">📊 تحليل الأداء حسب الوحدة</div>'+rows+advice+'</div>';
}

function buildReview() {
  var html='<div class="sec-title" style="margin-top:4px">📋 مراجعة الإجابات</div>';
  currentQuiz.forEach(function(q,i){
    var qa=userAnswers[i];
    var fo=q.options||[];
    var validOpts=fo.filter(function(o){return o&&o.trim();});
    var v=0,fc=0;
    for(var k=0;k<fo.length;k++){if(!fo[k]||!fo[k].trim())continue;if(k===q.answer){fc=v;break;}v++;}
    var skip=qa===undefined;
    var ok=!skip&&qa===fc;
    var sc=skip?'rv-skip':ok?'rv-ok':'rv-err';
    var st=skip?'⏭️ لم تُجب':ok?'✅ صحيحة':'❌ خاطئة';
    html+='<div class="rev-card '+sc+'">'+
      '<div class="rv-hdr"><span class="rv-num">س'+(i+1)+'</span><span class="rv-status">'+st+'</span></div>'+
      '<div class="rv-q">'+q.text+'</div>'+
      '<div class="rv-opts">'+
        validOpts.map(function(o,j){
          var lc=j===fc?'cor':(j===qa&&!ok&&!skip?'wrg':'nor');
          var tc=j===fc?'color:var(--green);font-weight:700':(j===qa&&!ok?'color:var(--red)':'');
          return '<div class="rv-opt"><span class="rlbl '+lc+'">'+LBL[j]+'</span><span style="'+tc+'">'+o+'</span></div>';
        }).join('')+
      '</div>'+
      '<div class="rv-meta">📌 '+(q.lesson||'')+'</div>'+
    '</div>';
  });
  return html;
}

// ══════════════════════════════════════════════
//  TIMER
// ══════════════════════════════════════════════
function updTimer(){
  var el=document.getElementById('qb-timer'); if(!el)return;
  var m=Math.floor(timeLeft/60),s=timeLeft%60;
  el.textContent='⏱ '+pad(m)+':'+pad(s);
  el.className='qb-timer'+(timeLeft<=60?' urgent':'');
}
function pad(n){return n<10?'0'+n:''+n;}

// ══════════════════════════════════════════════
//  UTILS
// ══════════════════════════════════════════════
function shuffle(a){
  for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}
  return a;
}
function esc(s){return (s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");}
function showToast(msg,type){
  var t=document.getElementById('toast');
  t.textContent=msg;t.className='toast show '+(type||'');
  setTimeout(function(){t.className='toast';},3000);
}
