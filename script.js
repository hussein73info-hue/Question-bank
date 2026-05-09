// ══════════════════════════════════════════════
//  CURRICULUM
// ══════════════════════════════════════════════
var CUR = {
  1:{name:'الفصل الأول',color:'#1a5276',units:[
    {id:1,name:'الدورة المحاسبية',lessons:['الدورة المحاسبية المفهوم والمراحل','نظرية القيد المزدوج والعمليات المالية','تسجيل القيود المحاسبية','دفتر اليومية','دفتر الأستاذ','ميزان المراجعة']},
    {id:2,name:'القوائم المالية',lessons:['القوائم المالية الأنواع والأهمية','إقفال الحسابات']},
    {id:3,name:'التحليل المالي',lessons:['مفهوم التحليل المالي وأهميته','تقنيات التحليل المالي','التحليل المالي والنسب','استخدامات التحليل المالي']},
    {id:4,name:'الأسواق المالية',lessons:['مفهوم الأسواق المالية وأنواعها وأهميتها','مفهوم الأصول المالية وأنواعها','مفهوم التداول وأنواعه وآلياته','دور التكنولوجيا في الأسواق المالية','بورصة عمان']},
    {id:5,name:'البنك المركزي الأردني',lessons:['البنك المركزي والسياسة النقدية','دور البنك المركزي الأردني في حماية المستهلك المالي','دور البنك المركزي الأردني في نشر الثقافة المالية المجتمعية','دور البنك المركزي الأردني في المحافظة على الاستقرار المصرفي والمالي']}
  ]},
  2:{name:'الفصل الثاني',color:'#1e6b4a',units:[
    {id:6,name:'المؤسسات المالية الدولية',lessons:['المؤسسات المالية الدولية: نشأتها، وأنواعها','صندوق النقد الدولي','البنك الدولي']},
    {id:7,name:'الاستدامة المالية',lessons:['مقدمة في الاستدامة المالية','أهداف الاستدامة المالية','الاستدامة المالية: التحديات والحلول','الاقتصاد الأخضر والاستدامة']},
    {id:8,name:'الذكاء الاصطناعي التوليدي',lessons:['الذكاء الاصطناعي التوليدي','الذكاء الاصطناعي التوليدي وعالم المال','المستشار المالي','الذكاء الاصطناعي التوليدي وخصوصية البيانات','الذكاء الاصطناعي التوليدي وأخلاقيات الأعمال']},
    {id:9,name:'السياسات الاقتصادية',lessons:['مقدمة في السياسات الاقتصادية والسياسة المالية','تأثير السياسة المالية في النشاط الاقتصادي','السياسة النقدية: أدواتها، وتأثيرها في النشاط الاقتصادي','السياسة التجارية: أدواتها وتأثيرها في النشاط الاقتصادي','السياسة الصناعية: أدواتها، وتأثيرها في النشاط الاقتصادي']}
  ]}
};

var LBL = ['أ','ب','ج','د'];
var currentMode = 'train';
var currentQuiz = [];
var userAnswers = {};
var timerInterval = null;
var timeLeft = 0;
var minCounter = 0;
// Navigation: simple stack of page IDs
var pageHistory = [];
var currentPageId = 'start';

// ══════════════════════════════════════════════
//  PAGE NAVIGATION
// ══════════════════════════════════════════════
function showPage(id) {
  document.querySelectorAll('.pg').forEach(function(p){ p.style.display='none'; });
  var el = document.getElementById('pg-'+id);
  if (!el) { console.error('Missing page: pg-'+id); return; }
  el.style.display = 'block';
  currentPageId = id;
  window.scrollTo(0,0);
  // Update navbar buttons
  var nb = document.getElementById('navbar');
  if (nb) nb.style.display = (id==='start') ? 'none' : 'flex';
  var btnBack = document.getElementById('btn-back');
  var btnHome = document.getElementById('btn-home');
  if (btnBack) btnBack.style.display = (id==='start'||id==='home') ? 'none' : 'inline-flex';
  if (btnHome) btnHome.style.display = (id==='start'||id==='home') ? 'none' : 'inline-flex';
}

function goTo(id) {
  pageHistory.push(currentPageId);
  showPage(id);
}

function goBack() {
  if (pageHistory.length > 0) {
    showPage(pageHistory.pop());
  } else {
    showPage('home');
  }
}

function goHome() {
  pageHistory = [];
  renderHome();
  showPage('home');
}

// ══════════════════════════════════════════════
//  START SCREEN
// ══════════════════════════════════════════════
function setMode(m) {
  currentMode = m;
  document.getElementById('btn-train').classList.toggle('active', m==='train');
  document.getElementById('btn-exam').classList.toggle('active', m==='exam');
}

function startApp() {
  pageHistory = [];
  renderHome();
  showPage('home');
}

// ══════════════════════════════════════════════
//  HOME PAGE
// ══════════════════════════════════════════════
function renderHome() {
  var modeLabel = currentMode==='exam' ? '📝 نمط امتحاني' : '📖 نمط تدريبي';
  var html =
    '<div class="mode-indicator">' + modeLabel +
      ' <button class="btn-change-mode" onclick="showPage(\'start\')">تغيير</button>' +
    '</div>' +
    '<div class="menu-grid">' +
      card('📖','card-blue', 'اختبار حسب الدرس',  'اختر فصلاً ثم درساً', "renderLessonPage(); goTo('lessons')") +
      card('🏛️','card-green','اختبار حسب الوحدة', '20 سؤالاً عشوائياً',  "renderUnitPage(); goTo('units')") +
      card('🌟','card-gold', 'أسئلة وزارية',       'نموذج 40 سؤالاً',     "launchMinisterial()") +
      card('📝','card-purple','أسئلة التقويم',      'امتحانات الفصلين',    "renderExamPage(); goTo('exams')") +
    '</div>';
  document.getElementById('pg-home').innerHTML = html;
}

function card(icon, cls, title, sub, onclick) {
  return '<div class="menu-card '+cls+'" onclick="'+onclick+'">' +
    '<div class="mc-icon">'+icon+'</div>' +
    '<div class="mc-title">'+title+'</div>' +
    '<div class="mc-sub">'+sub+'</div>' +
  '</div>';
}

// ══════════════════════════════════════════════
//  LESSON PAGE
// ══════════════════════════════════════════════
function renderLessonPage() {
  var html = '<div class="page-title">📖 اختبار حسب الدرس</div>' +
    '<div class="sem-cards">';
  [1,2].forEach(function(s){
    var cnt = bank.filter(function(q){return q.sem===s&&!q._examKey;}).length;
    html += '<div class="sem-card sem'+s+'" onclick="renderSemLessons('+s+')">' +
      '<div class="sc-icon">'+(s===1?'📘':'📗')+'</div>' +
      '<div class="sc-name">'+CUR[s].name+'</div>' +
      '<div class="sc-cnt">'+cnt+' سؤال</div>' +
    '</div>';
  });
  html += '</div><div id="sem-lessons-area"></div>';
  document.getElementById('pg-lessons').innerHTML = html;
}

function renderSemLessons(sem) {
  var html = '';
  CUR[sem].units.forEach(function(u){
    var unitHasQs = u.lessons.some(function(l){
      return bank.filter(function(q){return q.lesson===l&&!q._examKey;}).length > 0;
    });
    if (!unitHasQs) return;
    html += '<div class="unit-sec">' +
      '<div class="unit-sec-hdr">الوحدة '+u.id+': '+u.name+'</div>';
    u.lessons.forEach(function(l){
      var cnt = bank.filter(function(q){return q.lesson===l&&!q._examKey;}).length;
      if (!cnt) return;
      html += '<div class="lesson-row" onclick="showLessonAction(\''+esc(l)+'\',\''+esc(u.name)+'\')">' +
        '<span class="lr-icon">📄</span>' +
        '<span class="lr-name">'+l+'</span>' +
        '<span class="lr-cnt">'+cnt+'ق</span>' +
        '<span class="lr-arrow">←</span>' +
      '</div>';
    });
    html += '</div>';
  });
  document.getElementById('sem-lessons-area').innerHTML = html;
  document.getElementById('sem-lessons-area').scrollIntoView({behavior:'smooth',block:'start'});
}

function showLessonAction(lesson, unitName) {
  var cnt = bank.filter(function(q){return q.lesson===lesson&&!q._examKey;}).length;
  var existing = document.getElementById('lesson-action-box');
  if (existing) existing.remove();
  var box = document.createElement('div');
  box.id = 'lesson-action-box';
  box.className = 'action-box';
  box.innerHTML =
    '<div class="ab-lesson">📄 '+lesson+'</div>' +
    '<div class="ab-unit">'+unitName+'</div>' +
    '<div class="ab-cnt">'+cnt+' سؤال متاح</div>' +
    '<button class="btn-launch" onclick="launchQuiz(\'lesson\',{lessonName:\''+esc(lesson)+'\'},\''+esc(lesson)+'\')">🚀 ابدأ الاختبار</button>';
  document.getElementById('sem-lessons-area').appendChild(box);
  box.scrollIntoView({behavior:'smooth',block:'nearest'});
}

// ══════════════════════════════════════════════
//  UNIT PAGE
// ══════════════════════════════════════════════
function renderUnitPage() {
  var html = '<div class="page-title">🏛️ اختبار حسب الوحدة</div>' +
    '<div class="units-grid">';
  [1,2].forEach(function(s){
    CUR[s].units.forEach(function(u){
      var cnt = bank.filter(function(q){return q.unit===u.id&&!q._examKey;}).length;
      html += '<div class="unit-card-m usem'+s+'" onclick="launchQuiz(\'unit\',{unitId:'+u.id+',count:20},\''+u.name+'\')">' +
        '<div class="ucm-num">و'+u.id+'</div>' +
        '<div class="ucm-name">'+u.name+'</div>' +
        '<div class="ucm-sem">'+CUR[s].name+'</div>' +
        '<div class="ucm-cnt">'+cnt+' سؤال</div>' +
        '<div class="ucm-badge">20 سؤالاً</div>' +
      '</div>';
    });
  });
  html += '</div>';
  document.getElementById('pg-units').innerHTML = html;
}

// ══════════════════════════════════════════════
//  MINISTERIAL
// ══════════════════════════════════════════════
function launchMinisterial() {
  minCounter++;
  launchQuiz('ministerial', {}, 'النموذج الوزاري رقم ' + minCounter);
}

// ══════════════════════════════════════════════
//  EXAM PAGE
// ══════════════════════════════════════════════
function renderExamPage() {
  var html = '<div class="page-title">📝 أسئلة التقويم</div>' +
    '<div class="sem-cards">' +
    '<div class="sem-card sem1" onclick="renderSemExams(1)">'+
      '<div class="sc-icon">📘</div><div class="sc-name">الفصل الأول</div>'+
      '<div class="sc-cnt">تقويمي ١ و٢ و٣ + النهائي</div></div>'+
    '<div class="sem-card sem2" onclick="renderSemExams(2)">'+
      '<div class="sc-icon">📗</div><div class="sc-name">الفصل الثاني</div>'+
      '<div class="sc-cnt">تقويمي ١ و٢ + النهائي</div></div>'+
    '</div><div id="sem-exam-area"></div>';
  document.getElementById('pg-exams').innerHTML = html;
}

function renderSemExams(sem) {
  var list = sem===1
    ? [{k:'tq1_f1',label:'التقويم الأول'},{k:'tq2_f1',label:'التقويم الثاني'},{k:'tq3_f1',label:'التقويم الثالث'},{k:'final_f1',label:'الاختبار النهائي'}]
    : [{k:'tq1_f2',label:'التقويم الأول'},{k:'tq2_f2',label:'التقويم الثاني'},{k:'final_f2',label:'الاختبار النهائي'}];
  var html = '<div class="exam-list">';
  list.forEach(function(e){
    var qs = bank.filter(function(q){return q._examKey===e.k;});
    if (!qs.length) return;
    html += '<div class="exam-item" onclick="launchQuiz(\'exam\',{examKey:\''+e.k+'\'},\''+e.label+' — '+CUR[sem].name+'\')">' +
      '<span class="ei-icon">📋</span>' +
      '<span class="ei-name">'+e.label+'</span>' +
      '<span class="ei-cnt">'+qs.length+' سؤال</span>' +
      '<span class="ei-go">ابدأ ←</span>' +
    '</div>';
  });
  html += '</div>';
  document.getElementById('sem-exam-area').innerHTML = html;
  document.getElementById('sem-exam-area').scrollIntoView({behavior:'smooth',block:'start'});
}

// ══════════════════════════════════════════════
//  QUIZ ENGINE
// ══════════════════════════════════════════════
function selectQuestions(type, params) {
  params = params || {};
  var qs = [];
  if (type==='lesson') {
    qs = bank.filter(function(q){return q.lesson===params.lessonName&&!q._examKey;});
  } else if (type==='unit') {
    qs = shuf(bank.filter(function(q){return q.unit===params.unitId&&!q._examKey;})).slice(0,params.count||20);
  } else if (type==='ministerial') {
    var uids=[1,2,3,4,5,6,7,8,9];
    var per=Math.floor(40/uids.length);
    uids.forEach(function(uid){
      qs=qs.concat(shuf(bank.filter(function(q){return q.unit===uid&&!q._examKey;})).slice(0,per));
    });
    qs=shuf(qs).slice(0,40);
  } else if (type==='exam') {
    qs = bank.filter(function(q){return q._examKey===params.examKey;});
  }
  return qs;
}

function launchQuiz(type, params, title) {
  var qs = selectQuestions(type, params);
  if (!qs.length) { alert('لا توجد أسئلة في هذا القسم'); return; }
  currentQuiz = qs;
  userAnswers = {};
  renderQuiz(title);
  clearInterval(timerInterval);
  if (currentMode==='exam') startTimer(qs.length*60);
  goTo('quiz');
}

function renderQuiz(title) {
  var modeTxt = currentMode==='exam' ? '📝 امتحاني' : '📖 تدريبي';
  var html =
    '<div class="quiz-hdr">' +
      '<div class="qhdr-row">' +
        '<span class="qhdr-title">'+(title||'الاختبار')+'</span>' +
        '<span class="qhdr-mode">'+modeTxt+'</span>' +
        (currentMode==='exam'?'<span id="qtimer" class="qtimer"></span>':'') +
      '</div>' +
      '<div class="qprog-bar"><div class="qprog-fill" id="qpfill" style="width:0%"></div></div>' +
      '<div class="qprog-txt" id="qptxt">0 / '+currentQuiz.length+'</div>' +
    '</div>' +
    '<div id="qarea">';
  currentQuiz.forEach(function(q,i){
    var validOpts = (q.options||[]).filter(function(o){return o&&o.trim();});
    html += '<div class="qcard" id="qcard-'+i+'">' +
      '<div class="qcard-top">' +
        '<span class="qbadge">س'+(i+1)+'</span>' +
        '<span class="qmeta">'+(q.lesson||'')+'</span>' +
      '</div>' +
      '<div class="qtext">'+q.text+'</div>' +
      '<div class="qopts">';
    validOpts.forEach(function(opt,j){
      html += '<div class="qopt" id="qopt-'+i+'-'+j+'" onclick="pick('+i+','+j+')">' +
        '<span class="qoc">'+LBL[j]+'</span>' +
        '<span class="qot">'+opt+'</span>' +
      '</div>';
    });
    html += '</div>';
    if (currentMode==='train') html += '<div class="qfb" id="qfb-'+i+'" style="display:none"></div>';
    html += '</div>';
  });
  html += '</div>';
  document.getElementById('pg-quiz').innerHTML = html +
    '<button class="btn-finish" onclick="finishQuiz()">✅ إنهاء وعرض النتيجة</button>';
  updProgress(0);
}

function pick(qi, oi) {
  var q = currentQuiz[qi];
  var validOpts = (q.options||[]).filter(function(o){return o&&o.trim();});
  // Train: lock after answer. Exam: allow changing
  if (currentMode==='train' && userAnswers[qi]!==undefined) return;
  userAnswers[qi] = oi;

  // Clear all opts for this question
  for (var j=0; j<validOpts.length; j++) {
    var el = document.getElementById('qopt-'+qi+'-'+j);
    if (el) { el.className='qopt'; }
  }

  if (currentMode==='train') {
    // Show correct/wrong immediately
    for (var j=0; j<validOpts.length; j++) {
      var el = document.getElementById('qopt-'+qi+'-'+j);
      if (!el) continue;
      el.style.pointerEvents='none';
      if (j===q.answer) el.className='qopt correct';
      else if (j===oi && oi!==q.answer) el.className='qopt wrong';
    }
    var fb = document.getElementById('qfb-'+qi);
    if (fb) {
      fb.style.display='block';
      var ok = oi===q.answer;
      fb.className='qfb '+(ok?'fb-ok':'fb-err');
      fb.innerHTML = ok
        ? '✅ إجابة صحيحة! أحسنت.'
        : '❌ خطأ — الصحيح: <strong>'+LBL[q.answer]+' — '+validOpts[q.answer]+'</strong>';
    }
  } else {
    // Exam: just highlight selected
    var sel = document.getElementById('qopt-'+qi+'-'+oi);
    if (sel) sel.className='qopt exam-sel';
  }
  updProgress(Object.keys(userAnswers).length);
}

function updProgress(n) {
  var total = currentQuiz.length;
  var pct = Math.round(n/total*100);
  var f = document.getElementById('qpfill');
  var t = document.getElementById('qptxt');
  if (f) f.style.width=pct+'%';
  if (t) t.textContent=n+' / '+total;
}

function finishQuiz() {
  clearInterval(timerInterval);
  showResults();
}

// ══════════════════════════════════════════════
//  RESULTS + ANALYTICS
// ══════════════════════════════════════════════
function showResults() {
  var total=currentQuiz.length, correct=0, wrong=0, skipped=0;
  currentQuiz.forEach(function(q,i){
    if (userAnswers[i]===undefined) skipped++;
    else if (userAnswers[i]===q.answer) correct++;
    else wrong++;
  });
  var pct = Math.round(correct/total*100);
  var g = pct>=90?{t:'ممتاز 🏆',c:'#27ae60',bg:'#d4edda'}
    :pct>=80?{t:'جيد جداً ⭐',c:'#2980b9',bg:'#d4e8f5'}
    :pct>=70?{t:'جيد 👍',c:'#8e44ad',bg:'#ead7f5'}
    :pct>=60?{t:'مقبول 📖',c:'#f39c12',bg:'#fef9e7'}
    :{t:'راسب 💪',c:'#e74c3c',bg:'#f8d7da'};

  var html =
    '<div class="score-card">' +
      '<div class="sc-pct">'+pct+'%</div>' +
      '<div class="sc-frac">'+correct+' / '+total+'</div>' +
      '<div class="sc-grade" style="background:'+g.bg+';color:'+g.c+'">'+g.t+'</div>' +
    '</div>' +
    '<div class="stats3">' +
      '<div class="s3box c"><div class="s3v">'+correct+'</div><div class="s3l">✅ صحيحة</div></div>' +
      '<div class="s3box w"><div class="s3v">'+wrong+'</div><div class="s3l">❌ خاطئة</div></div>' +
      '<div class="s3box s"><div class="s3v">'+skipped+'</div><div class="s3l">⏭ متروكة</div></div>' +
    '</div>' +
    buildAnalytics() +
    (currentMode==='exam' ? buildReview() : '') +
    '<div class="res-actions">' +
      '<button class="btn-retry" onclick="retryQuiz()">🔄 إعادة الاختبار</button>' +
    '</div>';

  document.getElementById('pg-result').innerHTML = html;
  goTo('result');
}

function buildAnalytics() {
  var unitMap={};
  currentQuiz.forEach(function(q,i){
    var uid=q.unit||0; if(!uid) return;
    if(!unitMap[uid]){
      var uname='';
      [1,2].forEach(function(s){CUR[s].units.forEach(function(u){if(u.id===uid)uname=u.name;});});
      unitMap[uid]={name:uname,total:0,correct:0};
    }
    unitMap[uid].total++;
    if(userAnswers[i]===q.answer) unitMap[uid].correct++;
  });
  var keys=Object.keys(unitMap);
  if(keys.length<=1) return '';
  var weak=[];
  var rows=keys.map(function(uid){
    var u=unitMap[uid]; if(!u.total) return '';
    var pct=Math.round(u.correct/u.total*100);
    var c=pct>=80?'#27ae60':pct>=60?'#f39c12':'#e74c3c';
    if(pct<60) weak.push(u.name);
    return '<div class="arow">' +
      '<div class="arow-name">'+u.name+'</div>' +
      '<div class="arow-bar"><div style="width:'+pct+'%;background:'+c+';height:100%;border-radius:4px;transition:width .5s"></div></div>' +
      '<div class="arow-pct" style="color:'+c+'">'+pct+'%</div>' +
    '</div>';
  }).join('');
  var advice = weak.length
    ? '<div class="advice-box">💡 <strong>تحتاج مراجعة:</strong> '+weak.join(' — ')+'</div>'
    : '<div class="advice-box ok">🌟 أداء ممتاز في جميع الوحدات!</div>';
  return '<div class="analytics-box"><div class="sec-title">📊 تحليل الأداء</div>'+rows+advice+'</div>';
}

function buildReview() {
  var html='<div class="review-box"><div class="sec-title">📋 مراجعة الإجابات</div>';
  currentQuiz.forEach(function(q,i){
    var ans=userAnswers[i];
    var skip=ans===undefined;
    var ok=!skip&&ans===q.answer;
    var validOpts=(q.options||[]).filter(function(o){return o&&o.trim();});
    var sc=skip?'rs':ok?'rok':'rerr';
    var st=skip?'⏭ لم تُجب':ok?'✅ صحيحة':'❌ خاطئة';
    html+='<div class="rcard '+sc+'">' +
      '<div class="rcard-hdr"><span class="rbadge">س'+(i+1)+'</span><span class="rstatus">'+st+'</span></div>' +
      '<div class="rqtext">'+q.text+'</div>' +
      '<div class="ropts">';
    validOpts.forEach(function(o,j){
      var lc=j===q.answer?'rlbl-ok':j===ans&&!ok&&!skip?'rlbl-err':'rlbl-nor';
      var tc=j===q.answer?'color:#27ae60;font-weight:700':j===ans&&!ok?'color:#e74c3c':'';
      html+='<div class="ropt"><span class="rlbl '+lc+'">'+LBL[j]+'</span><span style="'+tc+'">'+o+'</span></div>';
    });
    html+='</div><div class="rmeta">📌 '+(q.lesson||'')+'</div></div>';
  });
  return html+'</div>';
}

function retryQuiz() {
  userAnswers={};
  currentQuiz=shuf(currentQuiz);
  renderQuiz(document.querySelector('.qhdr-title') ? document.querySelector('.qhdr-title').textContent : 'الاختبار');
  clearInterval(timerInterval);
  if (currentMode==='exam') startTimer(currentQuiz.length*60);
  pageHistory.pop(); // remove 'result' from history
  showPage('quiz');
}

// ══════════════════════════════════════════════
//  TIMER
// ══════════════════════════════════════════════
function startTimer(sec) {
  timeLeft=sec;
  var el=document.getElementById('qtimer');
  if(el) el.style.display='inline-block';
  updTimer();
  timerInterval=setInterval(function(){
    timeLeft--;updTimer();
    if(timeLeft<=0){clearInterval(timerInterval);finishQuiz();}
  },1000);
}
function updTimer() {
  var el=document.getElementById('qtimer'); if(!el) return;
  var m=Math.floor(timeLeft/60),s=timeLeft%60;
  el.textContent='⏱ '+pad(m)+':'+pad(s);
  el.style.color=timeLeft<=60?'#e74c3c':'inherit';
}
function pad(n){return n<10?'0'+n:''+n;}

// ══════════════════════════════════════════════
//  UTILS
// ══════════════════════════════════════════════
function shuf(a){
  var b=a.slice();
  for(var i=b.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=b[i];b[i]=b[j];b[j]=t;}
  return b;
}
function esc(s){return (s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");}
