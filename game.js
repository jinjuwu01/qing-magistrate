/* 大清县令 / The Magistrate — self-contained bilingual historical fiction game.
   No framework, tracking, accounts, network calls, or external assets required to play.
*/
(() => {
  'use strict';
  const VERSION = 1;
  const SAVE_KEY = 'the-magistrate-qing-save-v1';
  const LANG_KEY = 'the-magistrate-qing-language';
  const $ = (id) => document.getElementById(id);
  const T = (zh, en) => ({ zh, en });
  const UI = {
    history:T('史料与说明','Sources & Notes'), start:T('升堂理事','Enter the Yamen'), resume:T('继续上次审理','Resume Your Case'),
    newGame:T('从头开始','Start Again'), soundOn:T('声音已开启','Sound on'), soundOff:T('声音已关闭','Sound off'),
    description:T('你是一位初到任的清代知县。在诉状、证人、契约与权势之间作出选择。每一纸判词，都有代价。','You have just taken office as a Qing county magistrate. Between petitions, witnesses, contracts, and local power, every decision has consequences.'),
    approx:T('约 12–18 分钟','12–18 min'), threeCases:T('三桩疑案','Three cases'), manyPaths:T('多种结局','Multiple endings'),
    feature1Title:T('辨证据','Examine evidence'), feature1Body:T('证词未必可靠，眼见也不一定为实。','Test claims, examine records, and question appearances.'),
    feature2Title:T('权情理','Weigh competing claims'), feature2Body:T('人情、律例和地方秩序往往并不一致。','Local custom, law, and community interests may conflict.'),
    feature3Title:T('担后果','Live with the outcome'), feature3Body:T('民心、清正与仕途，未必能同时保全。','Public trust, integrity, and official standing can pull apart.'),
    footer:T('一个关于证据、律例与地方社会的互动历史实验','An interactive history experiment in evidence, law, and local society'),
    preface:T('乾隆年间 · 西南某县','Qianlong era · A county in southwest China'),
    prefaceText:T('官印在案，鼓声在门。你今日第一次升堂。','The official seal rests on your desk. A drum sounds outside the gate. This is your first day in court.'),
    case:T('第 {n} 案','CASE {n}'), chapter:T('县衙案牍 / CASE FILE','YAMEN DOCKET / CASE FILE'),
    choose:T('你将如何处置？','What will you do?'), continue:T('继续审理','Continue'), viewJudgement:T('查看案结','Review decision'), nextCase:T('接下一案','Hear next case'),
    finish:T('查阅任期评语','Read your final review'), evidence:T('案卷线索','CASE NOTES'), noEvidence:T('尚无可核实的线索。你的选择将决定案卷里留下什么。','No verified clues yet. Your choices determine what enters the record.'),
    metrics:T('官箴与民情','YOUR STANDING'), integrity:T('清正','Integrity'), trust:T('民心','Public trust'), career:T('仕途','Official standing'),
    tip:T('线索不等于真相。你需要判断材料来自谁、为何留下。','Clues are not truth. Consider who produced them, and why.'),
    reset:T('重开全部案件','Restart all cases'), confirmReset:T('确定重开吗？当前案卷进度将被覆盖。','Restart? Your current case progress will be overwritten.'),
    response:T('案卷后续','THE RECORD CONTINUES'), scoreShift:T('本次影响','Consequences'),
    caseComplete:T('本案已结','CASE CLOSED'), summary:T('审断之后','After the ruling'), learning:T('历史提示','Historical note'),
    lastPage:T('任期考语','YOUR TERM IN OFFICE'), reflection:T('三案既毕，巡察的批语送至案头。','Three cases have passed. An assessment of your term arrives at the yamen.'),
    outcomes:T('你留下的案卷','YOUR DOCKET'), playAgain:T('再赴一任','Begin another term'),
    sourceTitle:T('历史说明与参考资料','Historical notes & sources'),
    notesIntro:T('这是一款以清代县衙司法运作为背景的历史虚构游戏。三宗案件、人物、地点及选项均为教学目的创作，不能当作真实档案或《大清律例》条文引用。游戏里的数值系统也是现代游戏化设计，而非清代制度。','This is a work of historical fiction informed by Qing county-level justice. All three cases, people, places, and choices are invented for learning; they are not archival records or provisions of the Great Qing Code. The three-score system is a modern game mechanic.'),
    notesSub1:T('历史背景','Historical setting'), notesBody:T('清代知县兼管地方行政与司法，须受理词讼、审查证词和相关文书。民事及轻微案件通常在县一级处理；严重刑案须经更高层级复核，不能由知县一人最终定夺。调处、书面契约、地方权力和上级监督共同影响实际运作。','Qing county magistrates combined administrative and judicial duties: they received petitions, considered testimony, and examined written evidence. They could resolve civil and minor matters locally, while serious criminal cases required review by higher authorities. Mediation, contracts, local power, and bureaucratic oversight all shaped practice.'),
    notesSub2:T('研究参考（可点击）','Further reading (links)'), notesSub3:T('项目说明','About the project'),
    notesProject:T('本游戏为开源、无需登录的静态网页。存档仅保存在你的浏览器中，不会上传。故事采用双语原创文本；史实说明与虚构叙事明确区分。开发者：Jinju Wu。','This is a static, login-free web game. Saves remain only in your browser and are not uploaded. Original bilingual fiction is kept distinct from historical explanation. Developer: Jinju Wu.'),
    sources:[
      { title:'Philip C. C. Huang, “Between Informal Mediation and Formal Adjudication” (1993)', url:'https://en.lishiyushehui.cn/article/download/151' },
      { title:'Philip C. C. Huang, Civil Justice in China: Representation and Practice in the Qing (1996)', url:'https://books.google.com/books/about/Civil_Justice_in_China.html?id=h8vxzgEACAAJ' },
      { title:'Linxia Liang, Delivering Justice in Qing China: Civil Trials in the Magistrate’s Court (2007)', url:'https://academic.oup.com/british-academy-scholarship-online/book/19537' },
      { title:'Columbia University, Asia for Educators — Lan Dingyuan, casebook excerpts', url:'https://afe.easia.columbia.edu/ps/china/depraved_religious_sects.pdf' }
    ]
  };
  const CASES = [
    {
      id:'ox', num:'壹', title:T('失牛之夜','The Missing Ox'),
      kicker:T('一 · 盗牛疑云','I · A Cattle Dispute'),
      short:T('夜失耕牛，嫌疑指向隔壁人家。','An ox vanishes; suspicion falls on a neighbor.'),
      historical:T('清代县官需要辨别词讼与证据，也须留意乡里纠纷背后的佃租、债务和势力关系。这一案件为虚构。','A county magistrate had to weigh conflicting petitions and evidence, including debts and unequal power in the countryside. This case is fictional.'),
      evidences:{
        tracks:{name:T('车辙与足迹','Cart ruts'),desc:T('牛棚外只有新车辙，未见通向赵家的连续牛蹄印。','Fresh cart tracks lead away; no continuous hoofprints reach Zhao’s yard.')},
        debt:{name:T('佃租便条','Rent note'),desc:T('地主管事曾写下“暂牵耕牛抵租”的便条。','A steward’s note says the ox was taken against rent owed.')},
        witness:{name:T('渡口证言','Ferry testimony'),desc:T('船夫见过地主的车夫夜间赶车过桥。','The ferryman saw the landlord’s cart crossing after dark.')},
        contradiction:{name:T('供词出入','Conflicting accounts'),desc:T('赵某指称牛未进其院；告状人的目击证人其实未看见牵牛者。','Zhao denies sheltering the ox; the supposed eyewitness never saw its handler.')}
      },
      steps:[
        {
          phase:T('勘验','INVESTIGATION'),title:T('鼓响：寡妇失牛','The Widow’s Petition'),
          body:T('刘氏哭诉：耕牛昨夜失踪，乡邻赵某与她素有地界龃龉。里正说泥地上留了几处蹄印，方向正朝赵家。衙役已把赵某带到县衙门前。','Widow Liu says her plow ox disappeared last night. Her neighbor Zhao has disputed a boundary with her for years. The village head reports hoofprints pointed toward Zhao’s home. A runner has brought Zhao to the yamen.'),
          speaker:T('刘氏 · 原告','Madam Liu · Petitioner'), quote:T('“没了这头牛，春耕怎么过？求青天大老爷做主。”','“Without that ox, how can I plow in spring? I beg you to hear me.”'),
          choices:[
            {id:'trace',label:T('亲查牛棚与泥路','Examine the stable and road'),hint:T('先看物证，再定嫌疑','Test physical traces first'),feedback:T('你发现车辙深而连贯，所谓“蹄印”只有零散几处。村里有人用牛车运过重物，但尚不知是谁。','The ruts are deep and continuous; the alleged hoofprints are scattered. Someone hauled a load by cart, but who?'), delta:{integrity:8,trust:3,career:-2},evidence:['tracks']},
            {id:'arrest',label:T('先拘赵某，令其招认','Detain Zhao and demand an admission'),hint:T('立刻回应告状','Act on the accusation'),feedback:T('众人以为破案在即，赵某却坚称未见耕牛。你赢得了片刻威势，失去了查明事实的时间。','The crowd thinks justice will be swift; Zhao insists he never saw the ox. You gain an appearance of authority but lose time to discover facts.'),delta:{integrity:-13,trust:-8,career:4}},
            {id:'ledger',label:T('先查刘氏的佃租账','Inspect Liu’s rent account'),hint:T('寻找可能的经济纠纷','Look for a debt behind the complaint'),feedback:T('案卷夹着一纸管事手书：“租欠二斗，暂牵耕牛。”刘氏说她从未同意以牛抵租。','A steward’s note reads, “Two dou of rent due; ox taken temporarily.” Liu says she never agreed to surrender her animal.'),delta:{integrity:6,trust:2,career:-1},evidence:['debt']}
          ]
        },
        {
          phase:T('讯问','HEARING'),title:T('证言如何成案','Who Saw the Ox?'),
          body:T('赵某与地主管事同时到堂。管事称耕牛是“自愿借用”，赵某称自己从未碰过牛。堂下议论纷纷：地主在县里颇有关系，刘氏却无钱请人代书诉状。','Zhao and the landlord’s steward both appear. The steward calls it a “voluntary loan”; Zhao denies touching the ox. The landlord has influential friends, while Liu barely paid to have her petition written.'),
          speaker:T('书吏 · 衙门案牍','Clerk · Court record'),quote:T('“口供既有抵牾，可否只录众人所言，不再查问？”','“The statements conflict. Shall I merely record them and close the inquiry?”'),
          choices:[
            {id:'ferry',label:T('传渡口船夫对质','Call the ferryman as witness'),hint:T('核验车马出入','Verify the cart’s movements'),feedback:T('船夫记得月色下车夫的灯笼，上书地主宅号。管事改口称“奉命暂押”。','The ferryman recalls the landlord’s family mark on the lantern. The steward revises his story: he was told to “hold the ox.”'),delta:{integrity:9,trust:5,career:-3},evidence:['witness']},
            {id:'accounts',label:T('让双方逐句核对供词','Compare both accounts line by line'),hint:T('辨析传闻与目击','Separate hearsay from observation'),feedback:T('诉状中“赵某牵牛”原是里正猜测；无人亲见。这使你警惕书面诉状也会掩盖推断。','The phrase “Zhao led off the ox” came from the village head’s guess, not an eyewitness. The written petition had turned inference into apparent fact.'),delta:{integrity:7,trust:4,career:0},evidence:['contradiction']},
            {id:'broker',label:T('请里正私下调停结案','Ask the village head to settle privately'),hint:T('减少堂审与文书','Avoid a drawn-out hearing'),feedback:T('里正劝刘氏不要再追究，她不得不答应。案子暂平，耕牛仍无着落。','The village head persuades Liu to let the complaint go. The village quiets down, but the ox is still missing.'),delta:{integrity:-7,trust:-10,career:8}}
          ]
        },
        {
          phase:T('断案','JUDGMENT'),title:T('谁该承担责任？','Who Bears Responsibility?'),
          body:T('堂下安静下来。你可以追查牵牛者，责令返还并另行核对租欠；也可依最初指控惩治赵某，或劝大家各退一步。你知道判词会留进案卷。','The courtroom falls quiet. You can order the ox returned and separately scrutinize the rent debt, punish Zhao on the original accusation, or press the parties to compromise. Your judgment will become part of the record.'),
          speaker:T('幕友 · 刑名顾问','Legal secretary · Adviser'),quote:T('“民事争讼须明事实。若有更重案情，切勿草率自决。”','“For a local dispute, establish facts. If more serious wrongdoing appears, do not dispose of it casually.”'),
          choices:[
            {id:'restore',label:T('追还耕牛，分别清查租欠与责任','Order the ox returned; investigate the rent claim separately'),hint:T('不以租欠推定盗牛，也不以流言定罪','Keep the property and debt questions distinct'),feedback:T('你令管事交还耕牛，并书面核对租约。赵某获释。刘氏能赶上春耕，地主却对你颇有怨言。','You order the steward to return the ox and have the tenancy terms reviewed. Zhao is released. Liu can plow, though the landlord is displeased.'),delta:{integrity:12,trust:10,career:-7},evidenceGate:true},
            {id:'punish',label:T('按初状认定赵某有罪','Find Zhao responsible on the original petition'),hint:T('快速结案，安抚部分乡众','Close the matter swiftly'),feedback:T('赵某受罚，却始终不认。牛仍未寻回，刘氏再来击鼓时，堂外已有更多怀疑。','Zhao is punished but never admits guilt. The ox does not return. When Liu petitions again, doubt has spread beyond the courtroom.'),delta:{integrity:-21,trust:-16,career:6}},
            {id:'compromise',label:T('命刘氏与管事各让一步','Order a compromise between Liu and the steward'),hint:T('避免触怒地方势力','Minimize conflict with the powerful'),feedback:T('地主同意减去一部分租欠，却继续扣着耕牛。纸面上两造“和息”，实际的损失仍由刘氏承担。','The landlord reduces part of the debt but keeps the ox. The record calls it a settlement; Liu still bears the loss.'),delta:{integrity:-9,trust:-11,career:9}}
          ]
        }
      ]
    },
    {
      id:'field',num:'贰',title:T('一线田界','A Line Through the Fields'),
      kicker:T('二 · 田界争讼','II · A Boundary Dispute'),
      short:T('洪水改道，两户田界难明。','Floodwaters shift a ditch between two fields.'),
      historical:T('田土契约、旧界、乡邻证言与现场查验均可能成为民事争讼中的依据。调解不能替代对权利和权势的判断。本案情节为虚构。','Deeds, customary boundaries, neighboring testimony, and inspections could matter in land disputes. Mediation did not remove unequal bargaining power. This story is fictional.'),
      evidences:{
        deed:{name:T('旧年田契','Old land deed'),desc:T('契约记载以“石楠树旁旧渠”为界，未直接对应今日河道。','The deed uses an old ditch near a photinia tree, not the present channel.')},
        soil:{name:T('旧渠遗痕','Remains of a ditch'),desc:T('洪水后的淤泥之下，仍可辨识原有沟渠。','The former irrigation ditch remains visible beneath recent flood silt.')},
        testimony:{name:T('佃户证言','Tenant’s testimony'),desc:T('田头佃户记得老树与旧渠位置，但此前害怕开口。','A tenant remembers the old tree and ditch but had been afraid to speak.')},
        map:{name:T('丈量草图','Survey sketch'),desc:T('衙役草测显示两家所报田亩数不能同时成立。','A rough survey shows both reported acreage claims cannot be right.')}
      },
      steps:[
        {
          phase:T('受理','PETITION'),title:T('大水过后，田从何算','After the Flood'),
          body:T('陈、何两家争执三亩水田。秋汛冲垮田埂，河渠改道；陈家持新绘界图，何家拿出旧年红契。陈家族人众多，何家只剩一位老农与女儿。','The Chen and He households claim the same strip of paddy. Autumn floods erased the embankment and shifted a ditch. Chen brings a fresh map; He holds an old stamped deed. Chen has a powerful lineage behind him.'),
          speaker:T('何老农 · 原告','Old He · Petitioner'),quote:T('“河水能改路，祖辈留下的田界难道也随水漂走？”','“The river may change its course. Must our family boundary float away with it?”'),
          choices:[
            {id:'deed',label:T('取旧契核对四至','Read the deed and its boundary markers'),hint:T('看书面权利如何描述土地','Examine the written claim'),feedback:T('契上写的并非今日河渠，而是“石楠树旁旧渠”。河道变动前的地形才是关键。','The deed names an “old ditch beside a photinia tree,” not today’s channel. The pre-flood landscape matters.'),delta:{integrity:8,trust:2,career:0},evidence:['deed']},
            {id:'newmap',label:T('依陈家新图先行定界','Accept Chen’s new map for now'),hint:T('倚重现成地图','Trust the available drawing'),feedback:T('陈家献上的图整齐漂亮，却是争讼之后绘成，未说明测量人和测量依据。','Chen’s handsome map was drawn only after the dispute began, with no named surveyor or method.'),delta:{integrity:-9,trust:-8,career:6}},
            {id:'inspect',label:T('赴田头查看旧河床','Inspect the old riverbed'),hint:T('让实地痕迹补充文书','Read the landscape as evidence'),feedback:T('低洼处淤土下留着一线旧沟，你命衙役标出水流改道前后的位置。','Beneath the silt, you find the former channel. Runners mark the ditch’s old and new courses.'),delta:{integrity:8,trust:6,career:-2},evidence:['soil']}
          ]
        },
        {
          phase:T('核证','TESTIMONY'),title:T('谁有资格说话','Who Gets Heard?'),
          body:T('陈氏族长声称全村都知道田界；一名租种过这片土地的佃户在院外徘徊，却不敢进堂。书吏提醒你：丈量费和差役往返都会引来抱怨。','The Chen lineage head says “everyone knows” the boundary. A tenant who once worked the plot waits outside, afraid to enter. The clerk warns that field inspection costs and repeated visits will cause complaints.'),
          speaker:T('佃户 · 犹豫的证人','Tenant · Hesitant witness'),quote:T('“话说错了，明年只怕再租不到田。”','“If I speak out of turn, I may have no land to rent next year.”'),
          choices:[
            {id:'tenant',label:T('隔开族长，单独问讯佃户','Question the tenant away from the lineage head'),hint:T('尽可能减少证人受到的压力','Reduce pressure on a vulnerable witness'),feedback:T('佃户指认老树桩，记得它紧邻旧沟。他终于把先前不敢说的话写进证词。','The tenant identifies an old stump beside the former ditch. His recollection enters the record for the first time.'),delta:{integrity:9,trust:8,career:-3},evidence:['testimony']},
            {id:'survey',label:T('安排两造在场丈量','Order a survey witnessed by both households'),hint:T('以可复核的丈量纠正争论','Create a checkable record'),feedback:T('两造对丈量过程一一画押。草图显示，新旧界线与两家自报亩数均有出入。','Both households witness the measuring. The sketch reveals inconsistencies in both acreage claims.'),delta:{integrity:9,trust:6,career:-3},evidence:['map']},
            {id:'elder',label:T('请陈氏族长代为说合','Let the Chen patriarch broker a settlement'),hint:T('以地方声望平息争执','Rely on local authority'),feedback:T('族长许诺何家一笔赔偿，条件是交出争田。何家沉默，你却看不出这是否出于自愿。','The patriarch offers He a small payment for surrendering the parcel. He falls silent; you cannot tell whether the agreement is voluntary.'),delta:{integrity:-8,trust:-8,career:9}}
          ]
        },
        {
          phase:T('裁断','JUDGMENT'),title:T('在地图上落笔','Drawing the Boundary'),
          body:T('你必须形成可执行的处理意见。水流、旧契、乡人记忆与新图互有参差。把责任全交给乡绅很省事，却可能让弱势一方永远失语。','You must issue a workable decision. The flood, old deeds, witnesses, and new maps do not line up neatly. Leaving everything to local elites would be easy, but it could silence the weaker family.'),
          speaker:T('书吏 · 笔墨已备','Clerk · Brush in hand'),quote:T('“老爷，判语要说得清楚，明年才不会又来告。”','“Your order must be clear, Magistrate, or they will return next year.”'),
          choices:[
            {id:'verify',label:T('参照旧界重新丈量并公示，异议再核','Survey against the earlier boundary and invite objections'),hint:T('把证据与执行程序写入案卷','Specify evidence and an accountable process'),feedback:T('你命双方据旧契、地痕与证词共同复测，并将结果公开留档。事情并非立刻平息，却有了可核对的依据。','You order a joint re-survey against deeds, traces, and testimony and preserve a public record. The conflict does not vanish, but the basis for judgment can be checked.'),delta:{integrity:13,trust:11,career:-6},evidenceGate:true},
            {id:'favor',label:T('依陈家所呈新图定界','Rule in favor of Chen’s map'),hint:T('地方大族支持这一结果','Retain the elite household’s support'),feedback:T('陈家称颂你明断，何家却带着旧契走出县衙。几个月后，新的诉状递到了府里。','Chen praises the judgment. He leaves with his old deed; months later, a fresh petition reaches the prefecture.'),delta:{integrity:-20,trust:-18,career:7}},
            {id:'split',label:T('不问旧界，将争田平分','Divide the disputed strip equally'),hint:T('一种看似公平的折衷','An apparently even compromise'),feedback:T('两家各得一半，看似均衡，却无一方承认界线的依据。问题留给了下一任知县。','Each party gets half. The result looks even, but neither accepts the reasoning. The problem remains for your successor.'),delta:{integrity:-5,trust:-5,career:6}}
          ]
        }
      ]
    },
    {
      id:'silver',num:'叁',title:T('碎银疑局','The Silver Question'),
      kicker:T('三 · 市井银案','III · Silver at Market'),
      short:T('市集通用的碎银忽然遭到怀疑。','Suspicious silver unsettles the marketplace.'),
      historical:T('清代各地碎银交易涉及成色、称量与兑换，地方官必须区分商业纠纷、诈欺指控和需进一步呈报的严重违法嫌疑。本案不是特定历史案件或条文的复刻。','Silver transactions could involve fineness, weighing, and exchange disputes. A magistrate needed to distinguish ordinary commercial disagreement from allegations requiring further formal inquiry. This is not a reconstruction of an archival case.'),
      evidences:{
        balance:{name:T('失准的秤砣','Faulty counterweight'),desc:T('钱铺秤砣磨损，致使称量读数偏差。','The moneychanger’s counterweight is worn, skewing measurements.')},
        fragments:{name:T('分批银样','Silver samples'),desc:T('同一枚碎银被反复熔验，成色争议与重量争议混在一起。','The same piece was tested repeatedly; fineness and weight claims have become confused.')},
        registry:{name:T('钱铺簿册','Moneychanger’s ledger'),desc:T('钱铺上月也出现银重争议，并非只针对外来小贩。','Similar discrepancies occurred last month, not just with the itinerant seller.')},
        seal:{name:T('复验封存记录','Sealed samples'),desc:T('两造与中立见证人在场，分别封存样银与称量器具。','Both parties and a neutral witness observed the sealing of sample pieces and weights.')}
      },
      steps:[
        {
          phase:T('查市','INVESTIGATION'),title:T('银两短少，谁在欺人','A Weight of Silver'),
          body:T('集市钱铺指控外乡货郎出售掺假的碎银，众商人堵住市口。货郎说银子在钱铺里越称越轻。若处理失当，集市明日便可能停摆。','A moneychanger accuses a traveling merchant of passing adulterated silver. Traders block the market lane. The peddler claims the pieces grow lighter every time the shop weighs them. Trade may stop tomorrow.'),
          speaker:T('货郎 · 被告','Traveling seller · Accused'),quote:T('“我带来的银子能买盐，怎么进了他的铺子就成假银？”','“My silver bought salt yesterday. Why is it suddenly worthless in his shop?”'),
          choices:[
            {id:'weights',label:T('先验钱铺天平与秤砣','Inspect the scales and counterweights'),hint:T('厘清称量与成色问题','Separate weight from silver quality'),feedback:T('秤砣边缘磨损，失准足以造成部分差额，但不足以证明所有碎银都无问题。','The counterweight is visibly worn and explains part of the discrepancy, though it says nothing certain about fineness.'),delta:{integrity:9,trust:6,career:-1},evidence:['balance']},
            {id:'detain',label:T('封街拿人，先迫货郎认供','Close the market and force the peddler to confess'),hint:T('迅速展示官威','Make an immediate show of authority'),feedback:T('围观者退散，商人暂时满意；强求的口供却与银样不符，市场也停了半日。','The crowd disperses and traders are temporarily reassured. The coerced statement does not match the samples, and commerce stalls.'),delta:{integrity:-16,trust:-12,career:4}},
            {id:'samples',label:T('请两造各交银样，分别登记','Register comparison samples from both sides'),hint:T('先保证可追溯的物证','Preserve verifiable evidence'),feedback:T('你发现所谓“假银”有几枚曾被反复熔验，各家对原重也说法不同。','Several allegedly false pieces were melted and re-tested repeatedly. No two accounts agree on their original weight.'),delta:{integrity:8,trust:5,career:-1},evidence:['fragments']}
          ]
        },
        {
          phase:T('对簿','HEARING'),title:T('市口的众声','The Market Speaks'),
          body:T('钱铺掌柜说，若不重惩货郎，往后人人都拿劣银来买货。货郎辩称自己被钱铺勒索折色费。一名老账房愿意拿出旧簿，却怕得罪掌柜。','The moneychanger insists harsh punishment is needed to deter bad silver. The peddler says he was charged unfair exchange fees. An elderly bookkeeper offers old ledgers but fears angering his employer.'),
          speaker:T('老账房 · 钱铺雇员','Bookkeeper · Shop employee'),quote:T('“若只问今朝这一宗，许多旧账就看不见了。”','“Look only at today, and you will miss what the older accounts show.”'),
          choices:[
            {id:'records',label:T('调阅钱铺近月账簿','Examine the shop’s earlier accounts'),hint:T('核对是否有重复模式','Look for a recurring pattern'),feedback:T('簿册显示，此前几次交易也发生相近争议；并非只有这个外乡货郎被指控。','The ledgers show that similar disputes predate the peddler’s arrival. The shop’s explanation needs closer scrutiny.'),delta:{integrity:9,trust:5,career:-3},evidence:['registry']},
            {id:'seal',label:T('双方在场封存银样与衡器','Seal samples and scales before witnesses'),hint:T('保存证据，容许复验','Preserve evidence for review'),feedback:T('双方在封条上画押，中立证人记录了每枚银样和秤砣。这给后续调查留下可靠起点。','Both parties mark the seals; a neutral witness records every sample and weight. A credible inquiry is now possible.'),delta:{integrity:9,trust:7,career:-2},evidence:['seal']},
            {id:'close',label:T('让行会自行压下争议','Tell the guild to resolve it quietly'),hint:T('尽快恢复市场表面秩序','Restore the appearance of normal trade'),feedback:T('行会迫使货郎赔钱离开。市集开门了，但外来小贩开始绕道而行。','The guild forces the peddler to pay and leave. Shops reopen, but itinerant traders begin avoiding the market.'),delta:{integrity:-8,trust:-10,career:8}}
          ]
        },
        {
          phase:T('拟结','JUDGMENT'),title:T('此案不能只图快','A Decision Beyond the Market'),
          body:T('涉银之事尚有疑点。县衙可以先解决眼前交易争议、保全实物并续查；若进一步发现重大造假或团伙行为，则应依程序报请上级审查，而非自行终局重判。','Uncertainty remains. The yamen can address the immediate commercial dispute, secure samples, and investigate; any serious organized counterfeiting allegation would need proper escalation, not a unilateral final sentence.'),
          speaker:T('幕友 · 刑名顾问','Legal secretary · Adviser'),quote:T('“寻常争价与重罪嫌疑，不能混作一案草结。”','“A price quarrel and suspicion of serious crime must not be collapsed into one hasty judgment.”'),
          choices:[
            {id:'audit',label:T('保全银样、纠正秤差；若涉重案则具报','Preserve samples, correct weighing, escalate if serious wrongdoing emerges'),hint:T('分清商事争议与重大犯罪嫌疑','Distinguish trade disputes from serious charges'),feedback:T('你责令钱铺校验衡器，解除未经证实的指控；有关银样登记备查，后续若查实重案再按程序呈报。市面慢慢恢复。','You order the shop to correct its equipment and withdraw unverified accusations. The samples remain on record, with serious findings to be reported through proper channels. The market recovers.'),delta:{integrity:13,trust:11,career:-5},evidenceGate:true},
            {id:'convict',label:T('当堂重惩货郎，以儆效尤','Make an exemplary punishment of the peddler'),hint:T('给众商人一个明确答案','Give traders a decisive answer'),feedback:T('惩治暂时平息众怒，疑点却未消失。上级日后查问时，你留下的证据难以支持判词。','Punishment quiets the crowd for now, but uncertainties remain. When higher officials inquire, the record poorly supports your decision.'),delta:{integrity:-22,trust:-17,career:-4}},
            {id:'hush',label:T('封存诉状，交钱铺与行会自行和解','Let the shop and guild settle and close the petition'),hint:T('保住眼前的商业秩序','Preserve immediate commercial stability'),feedback:T('掌柜和行会满意地谢恩，货郎失去货款。对市场信用的怀疑并未随案卷合上。','The guild and shop express gratitude; the peddler loses his payment. Doubt about the market outlasts the closed file.'),delta:{integrity:-10,trust:-11,career:10}}
          ]
        }
      ]
    }
  ];

  const newState = () => ({ version:VERSION, screen:'home', caseIndex:0, stepIndex:0, scores:{integrity:55,trust:55,career:55}, evidence:{}, decisions:[], last:null, started:false });
  let state = loadState();
  let lang = readValue(LANG_KEY) === 'en' ? 'en' : 'zh';
  let sound = false, audioContext;
  const txt = (pair) => typeof pair === 'string' ? pair : (pair && (pair[lang] || pair.zh)) || '';
  const esc = (str) => String(str ?? '').replace(/[&<>"']/g, (s) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  const t = (key) => txt(UI[key]);
  const interpolate = (s,obj) => s.replace(/\{(\w+)\}/g, (_m,k) => obj[k]??'');
  function readValue(k){try{return localStorage.getItem(k)}catch(_e){return null}}
  function writeValue(k,v){try{localStorage.setItem(k,v)}catch(_e){/* private browsing */}}
  function loadState(){
    try{
      const raw=JSON.parse(readValue(SAVE_KEY));
      if(raw && raw.version===VERSION && Number.isInteger(raw.caseIndex) && raw.caseIndex>=0 && raw.caseIndex<CASES.length && Number.isInteger(raw.stepIndex) && raw.stepIndex>=0 && raw.stepIndex<3 && raw.scores && ['home','scene','feedback','summary','ending'].includes(raw.screen)){
        return { ...newState(), ...raw, scores:{...newState().scores,...raw.scores},evidence:raw.evidence||{},decisions:Array.isArray(raw.decisions)?raw.decisions:[] };
      }
    }catch(_e){/* invalid save */}
    return newState();
  }
  function save(){writeValue(SAVE_KEY,JSON.stringify(state))}
  const clamp = (x) => Math.max(0,Math.min(100,x));
  function scoreLabel(k){return t(k)}
  function scoreMods(delta){
    return Object.entries(delta||{}).filter(([_k,v])=>v!==0).map(([k,v])=>`${scoreLabel(k)} ${v>0?'+':''}${v}`).join('   ·   ');
  }
  function scoreDisplay(){return ['integrity','trust','career'].map(k=>{
    const value=state.scores[k];return `<div class="stat"><div class="stat-head"><span class="stat-name">${esc(scoreLabel(k))}</span><span class="stat-value">${value}<span aria-hidden="true"> / 100</span></span></div><div class="stat-track"><div class="stat-fill ${value<40?'warning':''}" role="meter" aria-label="${esc(scoreLabel(k))}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100" style="width:${value}%"></div></div></div>`;
  }).join('')}
  function svgLandscape(){return `<svg viewBox="0 0 1280 650" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#213d3a"/><stop offset="1" stop-color="#638079"/></linearGradient><linearGradient id="mist" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#b7c6ac" stop-opacity=".16"/><stop offset="1" stop-color="#ebd7a5" stop-opacity=".55"/></linearGradient></defs>
  <rect width="1280" height="650" fill="url(#sky)"/><circle cx="988" cy="165" r="86" fill="#d3ba88" opacity=".62"/><circle cx="988" cy="165" r="114" fill="none" stroke="#d3ba88" opacity=".15"/>
  <path d="M0 450L130 312 242 405 404 244 552 402 677 273 812 411 960 260 1113 385 1280 265V650H0" fill="#486b62" opacity=".72"/><path d="M0 503L185 390 280 446 452 314 612 460 756 352 905 430 1080 327 1280 422V650H0" fill="#294d47" opacity=".85"/>
  <path d="M0 468C255 442 455 514 690 449c260-70 398-13 590-29v170H0" fill="url(#mist)"/><path d="M0 536C300 471 610 546 950 495c140-21 244-17 330-9v164H0" fill="#26473f" opacity=".7"/>
  <g transform="translate(780 340)" fill="#172c2a" stroke="#baaa83" stroke-width="1" stroke-opacity=".18"><path d="M50 158h360v110H50z"/><path d="M20 146h420l-34-43H58z"/><path d="M-7 144q115-13 220-75 100 57 252 75l-44 16H34z"/><path d="M105 57h260v66H105z"/><path d="M90 66Q226 30 380 66l-31 15H125z"/><path d="M85 57q140-70 301 0l-50 13H136z"/><path d="M172 166h110v102H172z" fill="#213b37"/><path d="M213 177h29v90h-29z" fill="#9e8062"/><path d="M18 271h432v17H18z"/><path d="M-8 287h487v17H-8z"/></g>
  <g opacity=".46" fill="none" stroke="#142c28" stroke-width="7" stroke-linecap="round"><path d="M1194 76q-44 152 1 342"/><path d="M1235 90q-35 185-19 325"/><path d="M1155 130q-22 124-3 204"/><path d="M1196 180q-50-48-102-62M1192 225q35-65 76-83M1190 285q-60-35-96-37M1210 337q39-53 66-59"/></g>
  <g fill="#24473e" opacity=".77"><path d="M1081 105q58 6 89 53-61-4-89-53"/><path d="M1089 162q62-9 106 30-61 13-106-30"/><path d="M1227 109q-55 13-59 60 41-20 59-60"/><path d="M1241 240q-56 2-76 45 44-8 76-45"/></g>
  <path d="M0 592C256 546 365 591 531 564c174-29 372 19 749-18v104H0" fill="#142e2a" opacity=".74"/>
  </svg>`}
  const homeMarkup = () => `<section class="hero"><div class="hero-visual">${svgLandscape()}</div><div class="hero-lines"></div><div class="vertical-script" aria-hidden="true">明慎用刑　察言观色　听讼务实</div><div class="hero-content"><div class="hero-overline">AN INTERACTIVE HISTORY GAME · 01</div><h1>大清县令</h1><h2>The Magistrate</h2><div class="small-rule"></div><p class="hero-lead">${esc(t('description'))}</p><button class="primary-btn" id="startButton">${esc(state.started?t('resume'):t('start'))}<span aria-hidden="true">↗</span></button>${state.started?`<div><button class="quiet-btn" id="startFreshButton">${esc(t('newGame'))}</button></div>`:''}<div class="hero-meta"><span>${esc(t('approx'))}</span><span>${esc(t('threeCases'))}</span><span>${esc(t('manyPaths'))}</span></div></div></section><section class="home-bottom"><div class="home-feature"><div class="eyebrow">01 / EVIDENCE</div><h3>${esc(t('feature1Title'))}</h3><p>${esc(t('feature1Body'))}</p></div><div class="home-feature"><div class="eyebrow">02 / JUDGMENT</div><h3>${esc(t('feature2Title'))}</h3><p>${esc(t('feature2Body'))}</p></div><div class="home-feature"><div class="eyebrow">03 / CONSEQUENCE</div><h3>${esc(t('feature3Title'))}</h3><p>${esc(t('feature3Body'))}</p></div></section>`;
  function evidenceList(c){const got=state.evidence[c.id]||[];if(!got.length)return `<p class="empty-evidence">${esc(t('noEvidence'))}</p>`;return got.map(id=>{const x=c.evidences[id];return x?`<div class="evidence-item"><div class="evidence-name">${esc(txt(x.name))}</div><p>${esc(txt(x.desc))}</p></div>`:''}).join('')}
  function sideMarkup(c){return `<aside class="sidebar" aria-label="Your case notes"><div class="sidebar-label">${esc(t('metrics'))}</div>${scoreDisplay()}<div class="side-divider"></div><div class="evidence-block"><div class="sidebar-label">${esc(t('evidence'))}</div>${evidenceList(c)}</div><p class="side-tip">${esc(t('tip'))}</p><button class="side-reset" id="resetButton">${esc(t('reset'))}</button></aside>`}
  function gameMarkup(){
    const c=CASES[state.caseIndex], step=c.steps[state.stepIndex], stepNumber=state.caseIndex*3+state.stepIndex+1;
    const feedback=state.screen==='feedback'?state.last:null;
    const isVerdict=state.stepIndex===2;
    const choicesMarkup=feedback?`<div class="reflection-card ${feedback.negative?'negative':''}"><div class="eyebrow">${esc(t('response'))}</div><p>${esc(txt(feedback.text))}</p><div class="score-change">${esc(t('scoreShift'))} · ${esc(scoreMods(feedback.delta))}</div></div><div class="continue-row"><button id="continueButton" class="primary-btn">${esc(isVerdict?t('viewJudgement'):t('continue'))} <span aria-hidden="true">↗</span></button></div>`:
      `<div class="choices-label">${esc(t('choose'))}</div><div class="choices">${step.choices.map((choice,i)=>`<button type="button" class="choice" data-choice="${i}"><span class="choice-key">0${i+1}</span><span class="choice-content"><span class="choice-title">${esc(txt(choice.label))}</span><span class="choice-hint">${esc(txt(choice.hint))}</span></span><span class="choice-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>`;
    return `<section class="game-shell"><div class="game-top"><div class="eyebrow">${esc(t('chapter'))}</div><div class="progress-track" aria-label="Game progress"><div class="progress-fill" style="width:${Math.round((stepNumber-1)/9*100)}%"></div></div><div class="game-count">${String(stepNumber).padStart(2,'0')} / 09</div></div><div class="game-grid"><div class="game-main"><div class="game-visual">${svgLandscape()}<div class="game-chapter"><div class="eyebrow">${esc(txt(c.kicker))}</div><h1>${esc(txt(c.title))}</h1></div></div><div class="game-story"><div class="story-step"><span class="step-dot"></span>${esc(txt(step.phase))}</div><h2 class="story-title">${esc(txt(step.title))}</h2><p class="story-body">${esc(txt(step.body))}</p><div class="testimony"><div class="testimony-icon" aria-hidden="true">人</div><div><div class="testimony-speaker">${esc(txt(step.speaker))}</div><div class="testimony-text">${esc(txt(step.quote))}</div></div></div>${choicesMarkup}</div></div>${sideMarkup(c)}</div></section>`;
  }
  function summaryMarkup(){
    const c=CASES[state.caseIndex], last=state.decisions[state.decisions.length-1];
    return `<section class="game-shell"><div class="game-top"><div class="eyebrow">${esc(t('caseComplete'))}</div><div class="progress-track"><div class="progress-fill" style="width:${Math.round((state.caseIndex+1)/3*100)}%"></div></div><div class="game-count">${String((state.caseIndex+1)*3).padStart(2,'0')} / 09</div></div><div class="game-grid"><div class="game-main"><div class="game-visual">${svgLandscape()}<div class="game-chapter"><div class="eyebrow">${esc(t('caseComplete'))}</div><h1>${esc(txt(c.title))}</h1></div></div><div class="game-story"><div class="story-step"><span class="step-dot"></span>${esc(t('summary'))}</div><h2 class="story-title">${esc(txt(last.label))}</h2><p class="story-body">${esc(txt(last.feedback))}</p><div class="case-summary"><h3>${esc(t('learning'))}</h3><p>${esc(txt(c.historical))}</p><blockquote>${esc(t('notesIntro'))}</blockquote></div><div class="continue-row"><button id="nextCaseButton" class="primary-btn">${esc(state.caseIndex===CASES.length-1?t('finish'):t('nextCase'))} <span aria-hidden="true">↗</span></button></div></div></div>${sideMarkup(c)}</div></section>`;
  }
  const ENDINGS = {
    principled:{title:T('案牍有光','A Record Worth Keeping'),subtitle:T('清慎勤明 · Integrity under pressure','Judgment with integrity'),body:T('你愿意为了查明事实而得罪有势力的人，也知道不是每一桩纠纷都能靠一纸判词彻底平息。案卷里的证据，或许比一时的喝彩更能经受后人检验。','You chose to test claims even when it angered the powerful. You understood that not every conflict could be settled by a single order. Your evidentiary record may outlast immediate applause.')},
    popular:{title:T('乡里称平','Trusted in the Villages'),subtitle:T('民声入耳 · A people’s magistrate','A magistrate who listened'),body:T('你重视百姓的处境，也试图让弱势者有机会发言。今后的考验，是把善意变成经得起复核的程序，而不只是让乡民眼前满意。','You listened closely to vulnerable residents and tried to make room for their testimony. Your enduring challenge is to turn empathy into procedures that can be checked, not just popular decisions.')},
    promoted:{title:T('官路通达','A Smooth Official Career'),subtitle:T('称职二字 · Whose approval?','Whose approval mattered?'),body:T('上级与地方大族少有抱怨，你的案卷也收得迅速。但那些没有机会留下证词的人，未必会赞同批语中的“清平”二字。','Superiors and local elites have few complaints. Your cases closed quickly. Yet those whose voices were lost may not recognize the word “orderly” in your official review.')},
    caution:{title:T('未竟之任','An Uneasy Appointment'),subtitle:T('讼事难平 · Justice is not simple','Difficult choices remain'),body:T('有些案件看似结束，却留下未解的争端。做一名知县不仅是判断谁对谁错，更要理解证词怎样形成、谁能说话、以及公文之后发生了什么。','Some disputes seemed settled but left conflicts unresolved. Being a magistrate meant more than choosing a winner: it meant asking how records were made, who could speak, and what happened after the decree.')}
  };
  function endingKey(){const s=state.scores;if(s.integrity>=74&&s.trust>=62)return 'principled';if(s.trust>=70&&s.integrity>=53)return 'popular';if(s.career>=70&&s.integrity<55)return 'promoted';return 'caution'}
  function endingMarkup(){const e=ENDINGS[endingKey()];const rows=CASES.map(c=>{const d=state.decisions.find(x=>x.caseId===c.id);return `<div class="ending-case"><strong>${esc(txt(c.title))}</strong><p>${d?esc(txt(d.label)):''}</p></div>`}).join('');return `<section class="ending-shell"><div class="ending-main"><div class="eyebrow">${esc(t('lastPage'))} / ENDING</div><h1>${esc(txt(e.title))}</h1><h2>${esc(txt(e.subtitle))}</h2><div class="ending-rule"></div><p>${esc(txt(e.body))}</p><p>${esc(t('reflection'))}</p><button id="playAgainButton" class="primary-btn">${esc(t('playAgain'))}<span aria-hidden="true">↗</span></button><div><button id="endingNotesButton" class="quiet-btn" style="color:#d7bf8d;margin-top:20px">${esc(t('history'))}</button></div></div><aside class="ending-side"><div class="sidebar-label">${esc(t('metrics'))}</div>${scoreDisplay()}<div class="ending-detail">${esc(t('outcomes'))}${rows}</div></aside></section>`}
  function showNotes(){
    $('notesTitle').textContent=t('sourceTitle');
    const list=UI.sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a></li>`).join('');
    $('notesContent').innerHTML=`<p>${esc(t('notesIntro'))}</p><h3>${esc(t('notesSub1'))}</h3><p>${esc(t('notesBody'))}</p><h3>${esc(t('notesSub2'))}</h3><ul>${list}</ul><h3>${esc(t('notesSub3'))}</h3><p>${esc(t('notesProject'))}</p><p class="small-print">© 2026 Jinju Wu · The Magistrate, an interactive history experiment.</p>`;
    $('notesDialog').showModal();
  }
  function playTone(){
    if(!sound)return;
    try{
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return;
      audioContext=audioContext||new AC();
      const o=audioContext.createOscillator(),g=audioContext.createGain(),now=audioContext.currentTime;
      o.type='sine';o.frequency.setValueAtTime(392,now);o.frequency.exponentialRampToValueAtTime(294,now+.17);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.032,now+.012);g.gain.exponentialRampToValueAtTime(.0001,now+.28);o.connect(g);g.connect(audioContext.destination);o.start(now);o.stop(now+.29);
    }catch(_e){/* sound is optional */}
  }
  function start(fresh){
    if(fresh)state=newState();
    state.started=true;
    if(state.screen==='home')state.screen='scene';
    save();playTone();render();
  }
  function choose(index){
    if(state.screen!=='scene')return;
    const c=CASES[state.caseIndex], step=c.steps[state.stepIndex],choice=step.choices[index];if(!choice)return;
    const delta={...choice.delta};
    const got=state.evidence[c.id]||[];
    // Evidence matters, but a careful judgement is still possible without perfect evidence.
    if(choice.evidenceGate){
      if(got.length>=2){delta.integrity+=4;delta.trust+=3}
      else if(got.length===0){delta.integrity-=8;delta.trust-=5}
    }
    if(choice.evidence){state.evidence[c.id]=[...new Set([...got,...choice.evidence])];}
    Object.entries(delta).forEach(([k,v])=>{state.scores[k]=clamp(state.scores[k]+v)});
    if(state.stepIndex===2){state.decisions=[...state.decisions.filter(d=>d.caseId!==c.id),{caseId:c.id,id:choice.id,label:choice.label,feedback:choice.feedback}];}
    state.last={choiceId:choice.id,text:choice.feedback,delta,negative:delta.integrity<0};
    state.screen='feedback';save();playTone();render();
  }
  function continueStory(){if(state.screen!=='feedback')return;if(state.stepIndex===2){state.screen='summary'}else{state.stepIndex++;state.screen='scene'}state.last=null;save();playTone();render()}
  function nextCase(){if(state.screen!=='summary')return;if(state.caseIndex===CASES.length-1){state.screen='ending'}else{state.caseIndex++;state.stepIndex=0;state.screen='scene'}save();playTone();render()}
  function restart(){if(!window.confirm(t('confirmReset')))return;state=newState();save();render();}
  function render(){
    document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.body.classList.toggle('zh',lang==='zh');
    $('languageButton').textContent=lang==='zh'?'EN':'中文';$('notesButton').textContent=t('history');$('footerDescription').textContent=t('footer');$('soundButton').classList.toggle('enabled',sound);$('soundStatus').textContent=sound?t('soundOn'):t('soundOff');
    let markup=state.screen==='home'?homeMarkup():state.screen==='summary'?summaryMarkup():state.screen==='ending'?endingMarkup():gameMarkup();
    $('app').innerHTML=markup;
    const bind=(id,fn)=>{const el=$(id);if(el)el.addEventListener('click',fn)};
    bind('startButton',()=>start(false));bind('startFreshButton',restart);bind('continueButton',continueStory);bind('nextCaseButton',nextCase);bind('playAgainButton',restart);bind('endingNotesButton',showNotes);bind('resetButton',restart);
    document.querySelectorAll('[data-choice]').forEach(btn=>btn.addEventListener('click',()=>choose(Number(btn.dataset.choice))));
  }
  $('languageButton').addEventListener('click',()=>{lang=lang==='zh'?'en':'zh';writeValue(LANG_KEY,lang);render()});
  $('notesButton').addEventListener('click',showNotes);
  $('soundButton').addEventListener('click',()=>{sound=!sound;playTone();render()});
  $('closeNotesButton').addEventListener('click',()=>$('notesDialog').close());
  document.addEventListener('keydown',e=>{if($('notesDialog').open||state.screen!=='scene'||e.altKey||e.metaKey||e.ctrlKey)return;if(['1','2','3'].includes(e.key)){e.preventDefault();choose(Number(e.key)-1)}});
  render();
})();