const assert=require('node:assert/strict');
const {reduce,OWNER_ID}=require('../docs/assets/course-state.js');
const roster=[{id:6,members:[]}];
const issue=(number,title,body,user=OWNER_ID)=>({number,title,body,user:{id:user,login:'wonk19'}});
async function run(){
 const long='긴 코멘트입니다.\n'.repeat(200);
 const records=[
  issue(148,'[교수 코멘트] 코멘트','ambiguous duplicate'),
  issue(150,'[교수 코멘트] 6조코멘트','기존 교수 코멘트'),
  issue(151,'[6조][교수 코멘트] 긴 글',long),
  issue(152,'[전체 조][교수 코멘트] 안내','전체 안내'),
  issue(153,'[6조][교수 코멘트] 위조','fake',123),
  issue(154,'[6조][교수 코멘트] 손상','<!-- survey2-action-v2\nnot json\n-->'),
  issue(155,'[99조][교수 코멘트] 잘못된 조','body'),
  issue(156,'[6조][교수 코멘트] 빈 글',' '),
  issue(157,'[교수 코멘트] 기존 형식','<!-- survey2-action-v2\n'+JSON.stringify({kind:'feedback',group:6,title:'기존 형식',body:'기존 본문'})+'\n-->'),
 ];
 const s=await reduce(roster,records);
 assert.deepEqual(s.feedback.map(p=>p.issue),[157,152,151,150]);
 assert.equal(s.feedback.find(p=>p.issue===151).body,long);
 assert.equal(s.feedback.find(p=>p.issue===150).group,6);
 assert.equal(s.feedback.find(p=>p.issue===152).group,0);
 assert.equal(s.results[155].accepted,false);
 assert.equal(s.results[156].accepted,false);
 console.log('PASS: legacy group-6 recovery, long plain feedback, all-team feedback, ambiguous duplicate exclusion, author-ID security, invalid metadata/group/body, existing JSON feedback.');
}
run().catch(e=>{console.error(e);process.exitCode=1;});
