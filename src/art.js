'use strict';
// All sprite art lives here as pixel strings, authored facing RIGHT.
// Char legend:  . transparent  K near-black  P suit color  D dark cloth
//               S skin  G belt/gear  W white
// Each frame: { a: anchor column (feet center), r: rows top->bottom }.
// Rows may be short (padded right) and frames may be short (anchored at feet).
// Art pixels are baked at 2x, so a 21-row frame stands ~42 screen px tall.

const NINJA_FRAMES = {

  idle_a: { a: 7, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDDDDD.SS',
    '.SDDDDDD.SS',
    '.S..DPPPDS',
    '.SS.DPPPD',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPP',
    '...PPP.PPP',
    '..PPP...PPP',
    '..PPP...PPP',
    '..PP.....PP',
    '..PP.....PP',
    '..PP.....PP',
    '..DD.....DD',
    '.KKK.....KKK',
  ]},

  idle_b: { a: 7, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDDDDD',
    '.SDDDDDD.SS',
    '.S..DPPPDSS',
    '.SS.DPPPDS',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPP',
    '...PPP.PPP',
    '..PPP...PPP',
    '..PPP...PPP',
    '..PP.....PP',
    '..PP.....PP',
    '..PP.....PP',
    '..DD.....DD',
    '.KKK.....KKK',
  ]},

  walk_a: { a: 7, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDDDDD.SS',
    '.SDDDDDD.SS',
    '.S..DPPPDS',
    '.SS.DPPPD',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPP',
    '..PPPP.PPP',
    '.PPP....PPP',
    '.PPP.....PPP',
    '.PP.......PP',
    '.PP.......PP',
    '.DD.......DD',
    'KKK.......KKK',
  ]},

  walk_b: { a: 7, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDDDDD.SS',
    '.SDDDDDD.SS',
    '.S..DPPPDS',
    '.SS.DPPPD',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPP',
    '...PPPPPP',
    '...PPPPPP',
    '...PPP.PP',
    '...PPP.PP',
    '...PP..PP',
    '...PP..PP',
    '...DD..DD',
    '..KKK..KKK',
  ]},

  walk_c: { a: 7, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDDDDD.SS',
    '.SDDDDDD.SS',
    '.S..DPPPDS',
    '.SS.DPPPD',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPP',
    '..PPPP.PPP',
    '.PPPP...PPP',
    '.PPP.....PPP',
    '.PP.......PP',
    '.PPP......PP',
    '..DD......DD',
    '.KKK.....KKK',
  ]},

  walk_d: { a: 7, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDDDDD.SS',
    '.SDDDDDD.SS',
    '.S..DPPPDS',
    '.SS.DPPPD',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPP',
    '...PPPPPP',
    '...PP.PPPP',
    '...PP.PPPP',
    '...PP..KKK',
    '...PP',
    '...DD',
    '..KKK',
  ]},

  jump: { a: 6, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '..DDDDDD.SS',
    '.SDDDDDDSS',
    '.S.DPPPD',
    '.SSDPPPD',
    '...GGGG',
    '...PPPPPP',
    '..PPPPPPPP',
    '..PPP..PPP',
    '..DD....DD',
    '.KKK...KKK',
  ]},

  jump_kick: { a: 6, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '..DDDDDD.SS',
    '.SDDDDDDSS',
    '.S.DPPPD',
    '.SSDPPPD',
    '...GGGG.PPP',
    '...PPPPPPPPPP',
    '..PPP.....PPKKK',
    '..KKK......KKK',
  ]},

  crouch: { a: 6, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '..DDDDDD.SS',
    '.SDDDDDD.SS',
    '.S.DPPPPDS',
    '.SS.DPPPD',
    '..GGGGGG',
    '.PPPPPPPPP',
    '.PPP....PPP',
    'KKK......KKK',
  ]},

  crouch_punch: { a: 6, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '..DDDDDD',
    '.SDDDDDDSSSSSS',
    '.S.DPPPPD...SS',
    '.SS.DPPPD',
    '..GGGGGG',
    '.PPPPPPPPP',
    '.PPP....PPP',
    'KKK......KKK',
  ]},

  crouch_kick: { a: 6, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '..DDDDDD.SS',
    '.SDDDDDD.SS',
    '.S.DPPPPDS',
    '.SS.DPPPD',
    '..GGGGGG',
    '.PPPP..PPPPPPPKK',
    '.PPPP',
    'KKKK',
  ]},

  block: { a: 7, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDSSSS',
    '..DSSSSS',
    '..DDSSSS',
    '...DPPPD',
    '....DDDD',
    '....GGGG',
    '...PPPPPP',
    '...PPP.PPP',
    '..PPP...PPP',
    '..PPP...PPP',
    '..PP.....PP',
    '..PP.....PP',
    '..PP.....PP',
    '..DD.....DD',
    '.KKK.....KKK',
  ]},

  block_crouch: { a: 6, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '..DSSSSS',
    '..DSSSSS',
    '..DDPPPD',
    '..GGGGGG',
    '.PPPPPPPPP',
    '.PPP....PPP',
    'KKK......KKK',
  ]},

  punch_wind: { a: 7, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDDDDD',
    '.SDDDDDDSS',
    '.S.DPPPDSS',
    '.SS.DPPPD',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPP',
    '...PPP.PPP',
    '..PPP...PPP',
    '..PPP...PPP',
    '..PP.....PP',
    '..PP.....PP',
    '..PP.....PP',
    '..DD.....DD',
    '.KKK.....KKK',
  ]},

  hpunch: { a: 7, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDDDDDSSSSSSSS',
    '.SDDDDDD',
    '.S..DPPPD',
    '.SS.DPPPD',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPP',
    '..PPPP.PPP',
    '.PPP....PPP',
    '.PPP.....PPP',
    '.PP.......PP',
    '.PP.......PP',
    '.DD.......DD',
    'KKK.......KKK',
  ]},

  lpunch: { a: 7, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDDDDD',
    '.SDDDDDD',
    '.S..DPPPDSSSSSS',
    '.SS.DPPPD',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPP',
    '...PPP.PPP',
    '..PPP...PPP',
    '..PPP...PPP',
    '..PP.....PP',
    '..PP.....PP',
    '..PP.....PP',
    '..DD.....DD',
    '.KKK.....KKK',
  ]},

  kick_wind: { a: 6, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDDDDD.SS',
    '.SDDDDDD.SS',
    '.S..DPPPDS',
    '.SS.DPPPD',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPP',
    '...PPP.PPPP',
    '...PPP..KKK',
    '...PP',
    '...PP',
    '...PP',
    '...PP',
    '...DD',
    '..KKK',
  ]},

  hkick: { a: 6, r: [
    '..PPPP',
    '.PPPPPP',
    '.PSSSKP',
    '.PPPPPP',
    '..DDDD.........KK',
    '.SDDDDD......PPKK',
    '.S.DPPPD...PPP',
    '.SS.DPPPD.PPP',
    '....DPPPDPPP',
    '....DDDDDPP',
    '....GGGGG',
    '....PPPPP',
    '....PPP',
    '....PPP',
    '....PP',
    '....PP',
    '....PP',
    '....DD',
    '...KKK',
  ]},

  lkick: { a: 6, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDDDDD.SS',
    '.SDDDDDD.SS',
    '.S..DPPPDS',
    '.SS.DPPPD',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPPPPPPPKKK',
    '...PPP',
    '...PPP',
    '...PP',
    '...PP',
    '...PP',
    '...DD',
    '..KKK',
  ]},

  sweep: { a: 5, r: [
    '..PPPP',
    '.PPPPPP',
    '.PSSSKP',
    '.PPPPPP',
    '.SDDDDD',
    '.S.DPPPD',
    '..DPPPD',
    '.GGGGG',
    '.PPPP..PPPPPPPPKKK',
    '.PPPP',
    'KKKK',
  ]},

  upc_wind: { a: 6, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '..DDDDDD',
    '.SDDDDDD',
    '.S.DPPPPD',
    '.SSDPPPPD',
    '..GGGGGG',
    '.PPPPPPPPP',
    '.PPP....PPP',
    'KKK......KKK',
  ]},

  upc_hit: { a: 7, r: [
    '.........SS',
    '.........SS',
    '....PPPP.S',
    '...PPPPPPS',
    '...PSSSKPS',
    '...PPPPPPS',
    '....DDDDSS',
    '...DDDDDDD',
    '..SDDDDDD',
    '..S.DPPPD',
    '..SSDPPPD',
    '.....GGGG',
    '....PPPPPP',
    '....PPP.PPP',
    '...PPP...PPP',
    '...PPP....PPP',
    '...PP......PP',
    '...PP......PP',
    '...DD......DD',
    '..KKK.....KKK',
  ]},

  hit: { a: 7, r: [
    '.PPPP',
    'PPPPPP',
    'PSKSSP',
    'PPPPPP',
    '.DDDDD',
    'SSDDDDDD.SS',
    '..DDDDDD.S',
    '...DPPPDS',
    '...DPPPD',
    '...DDDDD',
    '...GGGG',
    '...PPPPPP',
    '..PPP.PPP',
    '..PPP..PPP',
    '..PP....PP',
    '..PP....PPP',
    '..DD.....DD',
    '.KKK....KKK',
  ]},

  juggle: { a: 8, r: [
    '...SS...PPP..KK',
    '....DDDDPPP..KK',
    '.PPPPDDDDDPPPPP',
    '.PSSSPPPPDDD',
    '.PPPP.SS.GG',
  ]},

  down: { a: 9, r: [
    '.PPPP',
    'PPSSPP.DDDDPPPPPKK',
    'PPPPPPGGDDDPPPPPKK',
  ]},

  win: { a: 7, r: [
    '.SS.......SS',
    '.S.........S',
    '.S..PPPP...S',
    '.S.PPPPPP..S',
    '.S.PSSSSP..S',
    '.SDPPPPPPDS',
    '..DDDDDDDD',
    '...DPPPPD',
    '...DPPPPD',
    '...DDDDD',
    '...GGGG',
    '..PPPPPP',
    '..PPP.PPP',
    '.PPP...PPP',
    '.PPP...PPP',
    '.PP.....PP',
    '.PP.....PP',
    '.PP.....PP',
    '.DD.....DD',
    'KKK.....KKK',
  ]},

  // breathing idle: chest rises, guard lifts (third frame of the idle loop)
  idle_c: { a: 7, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD..SS',
    '..DDDDDD.SS',
    '.SDDDDDD.S',
    '.S..DPPPDS',
    '.SS.DPPPD',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPP',
    '...PPP.PPP',
    '..PPP...PPP',
    '..PPP...PPP',
    '..PP.....PP',
    '..PP.....PP',
    '..PP.....PP',
    '..DD.....DD',
    '.KKK.....KKK',
  ]},

  // punch followthrough: arm dropping back through guard height
  punch_follow: { a: 7, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDDDDD',
    '.SDDDDDDSSS',
    '.S..DPPPD..SS',
    '.SS.DPPPD',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPP',
    '...PPP.PPP',
    '..PPP...PPP',
    '..PPP...PPP',
    '..PP.....PP',
    '..PP.....PP',
    '..PP.....PP',
    '..DD.....DD',
    '.KKK.....KKK',
  ]},

  // kick followthrough: leg retracting, knee still bent
  kick_follow: { a: 6, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDDDDD.SS',
    '.SDDDDDD.SS',
    '.S..DPPPDS',
    '.SS.DPPPD',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPP',
    '...PPP.PPPP',
    '...PPP...PPP',
    '...PP....KKK',
    '...PP',
    '...PP',
    '...DD',
    '..KKK',
  ]},

  // uppercut followthrough: arm sweeping down out of the rising punch
  upc_follow: { a: 7, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDDSS',
    '..DDDDDDSS',
    '.SDDDDDD',
    '.S..DPPPD',
    '.SS.DPPPD',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPP',
    '...PPP.PPP',
    '..PPP...PPP',
    '..PPP...PPP',
    '..PP.....PP',
    '..PP.....PP',
    '..PP.....PP',
    '..DD.....DD',
    '.KKK.....KKK',
  ]},

  // second win frame: arms pumping down to shoulder height
  win_b: { a: 7, r: [
    '.S.........S',
    '.SS.......SS',
    '..S.PPPP..S',
    '..SPPPPPPS',
    '..SPSSSSPS',
    '..DPPPPPPD',
    '..DDDDDDDD',
    '...DPPPPD',
    '...DPPPPD',
    '...DDDDD',
    '...GGGG',
    '..PPPPPP',
    '..PPP.PPP',
    '.PPP...PPP',
    '.PPP...PPP',
    '.PP.....PP',
    '.PP.....PP',
    '.PP.....PP',
    '.DD.....DD',
    'KKK.....KKK',
  ]},

  // horizontal flying dash (VOLTAN's torpedo) -- body floats above the ground
  torpedo: { a: 8, r: [
    '...........PPPP',
    'KKPPPP.DDDDPPSKP',
    '.KKPPPDDDDDPPPPPSS',
    '......GGG.PPPP',
    '.',
    '.',
    '.',
    '.',
    '.',
  ]},

  // FINISH THEM stance: slumped, arms hanging, crossed-out eyes
  dazed: { a: 6, r: [
    '...PPPP',
    '..PPPPPP',
    '..PKSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDDDDD',
    '.SDDDDDDS',
    '.S.DPPPD.S',
    '.S.DPPPD.S',
    '...DPPPD',
    '...DDDDD',
    '...GGGG',
    '...PPPPP',
    '...PPP.PP',
    '..PPP..PP',
    '..PPP..PPP',
    '..PP....PP',
    '..PP....PP',
    '..DD....DD',
    '.KKK...KKK',
  ]},

  throw_proj: { a: 7, r: [
    '...PPPP',
    '..PPPPPP',
    '..PSSSKP',
    '..PPPPPP',
    '...DDDD',
    '..DDDDDDSSSSS',
    '..DDDDDDSSSSS',
    '....DPPPD',
    '....DPPPD',
    '....DDDDD',
    '....GGGG',
    '...PPPPPP',
    '..PPPP.PPP',
    '.PPP....PPP',
    '.PPP.....PPP',
    '.PP.......PP',
    '.PP.......PP',
    '.DD.......DD',
    'KKK.......KKK',
  ]},
};

// ---- GORRUK: the four-armed boss. Bigger grid (<=26 wide), own frame set.
// Upper arm pair hangs from the huge shoulders; lower pair guards the waist.
const GORRUK_FRAMES = {

  idle_a: { a: 12, r: [
    '...........SSSS',
    '..........SSSSSS',
    '..........SKSSKS',
    '..........SWSSWS',
    '...........SSSS',
    '...SSSSSSSSSSSSSSSSSS',
    '..SSSSSSSSSSSSSSSSSSSS',
    '..SSSS.PPPPPPPPPP.SSSS',
    '..SSSS.PPPPPPPPPP.SSSS',
    '..SSS..PPPPPPPPPP..SSS',
    '..SSS..PPPPPPPPPP..SSS',
    '.SSSS..PPPPPPPPPP..SSSS',
    '.SSSS.SSPPPPPPPPSS.SSSS',
    '..SS..SSSPPPPPPSSS..SS',
    '......SSS.PPPP.SSS',
    '.....SSSS.GGGG.SSSS',
    '........GGGGGGGG',
    '.......PPPPPPPPPP',
    '.......PPPP..PPPP',
    '......PPPP....PPPP',
    '......PPPP....PPPP',
    '......PPP......PPP',
    '......PPP......PPP',
    '......PPP......PPP',
    '......DDD......DDD',
    '.....KKKK......KKKK',
  ]},

  idle_b: { a: 12, r: [
    '...........SSSS',
    '..........SSSSSS',
    '..........SKSSKS',
    '..........SWSSWS',
    '...........SSSS',
    '....SSSSSSSSSSSSSSSS',
    '..SSSSSSSSSSSSSSSSSSSS',
    '..SSSS.PPPPPPPPPP.SSSS',
    '..SSSS.PPPPPPPPPP.SSSS',
    '..SSS..PPPPPPPPPP..SSS',
    '.SSSS..PPPPPPPPPP..SSSS',
    '.SSSS..PPPPPPPPPP..SSSS',
    '..SS..SSPPPPPPPPSS..SS',
    '......SSSPPPPPPSSS',
    '......SSS.PPPP.SSS',
    '.....SSSS.GGGG.SSSS',
    '........GGGGGGGG',
    '.......PPPPPPPPPP',
    '.......PPPP..PPPP',
    '......PPPP....PPPP',
    '......PPPP....PPPP',
    '......PPP......PPP',
    '......PPP......PPP',
    '......PPP......PPP',
    '......DDD......DDD',
    '.....KKKK......KKKK',
  ]},

  walk_a: { a: 12, r: [
    '...........SSSS',
    '..........SSSSSS',
    '..........SKSSKS',
    '..........SWSSWS',
    '...........SSSS',
    '...SSSSSSSSSSSSSSSSSS',
    '..SSSSSSSSSSSSSSSSSSSS',
    '..SSSS.PPPPPPPPPP.SSSS',
    '..SSSS.PPPPPPPPPP.SSSS',
    '..SSS..PPPPPPPPPP..SSS',
    '..SSS..PPPPPPPPPP..SSS',
    '.SSSS..PPPPPPPPPP..SSSS',
    '.SSSS.SSPPPPPPPPSS.SSSS',
    '..SS..SSSPPPPPPSSS..SS',
    '......SSS.PPPP.SSS',
    '.....SSSS.GGGG.SSSS',
    '........GGGGGGGG',
    '.......PPPPPPPPPP',
    '......PPPPP..PPPPP',
    '.....PPPP......PPPP',
    '....PPPP........PPPP',
    '....PPP..........PPP',
    '....PPP..........PPP',
    '....PPP..........PPP',
    '....DDD..........DDD',
    '...KKKK..........KKKK',
  ]},

  walk_b: { a: 12, r: [
    '...........SSSS',
    '..........SSSSSS',
    '..........SKSSKS',
    '..........SWSSWS',
    '...........SSSS',
    '...SSSSSSSSSSSSSSSSSS',
    '..SSSSSSSSSSSSSSSSSSSS',
    '..SSSS.PPPPPPPPPP.SSSS',
    '..SSSS.PPPPPPPPPP.SSSS',
    '..SSS..PPPPPPPPPP..SSS',
    '..SSS..PPPPPPPPPP..SSS',
    '.SSSS..PPPPPPPPPP..SSSS',
    '.SSSS.SSPPPPPPPPSS.SSSS',
    '..SS..SSSPPPPPPSSS..SS',
    '......SSS.PPPP.SSS',
    '.....SSSS.GGGG.SSSS',
    '........GGGGGGGG',
    '.......PPPPPPPPPP',
    '.......PPPP..PPPP',
    '.......PPPP..PPPP',
    '.......PPP....PPP',
    '.......PPP....PPP',
    '.......PPP....PPP',
    '.......PPP....PPP',
    '.......DDD....DDD',
    '......KKKK....KKKK',
  ]},

  punch_wind: { a: 12, r: [
    '...........SSSS',
    '..........SSSSSS',
    '..........SKSSKS',
    '..........SWSSWS',
    '...........SSSS',
    '...SSSSSSSSSSSSSSSS',
    '..SSSSSSSSSSSSSSSSSSSS',
    '..SSSS.PPPPPPPPPP.SSSS',
    '..SSSS.PPPPPPPPPPSSSS',
    '..SSS..PPPPPPPPPPSSS',
    '..SSS..PPPPPPPPPP',
    '.SSSS..PPPPPPPPPP',
    '.SSSS.SSPPPPPPPPSS',
    '..SS..SSSPPPPPPSSS',
    '......SSS.PPPP.SSS',
    '.....SSSS.GGGG.SSSS',
    '........GGGGGGGG',
    '.......PPPPPPPPPP',
    '.......PPPP..PPPP',
    '......PPPP....PPPP',
    '......PPPP....PPPP',
    '......PPP......PPP',
    '......PPP......PPP',
    '......PPP......PPP',
    '......DDD......DDD',
    '.....KKKK......KKKK',
  ]},

  punch: { a: 12, r: [
    '...........SSSS',
    '..........SSSSSS',
    '..........SKSSKS',
    '..........SWSSWS',
    '...........SSSS',
    '...SSSSSSSSSSSSSSSSSS',
    '..SSSSSSSSSSSSSSSSSSSSSSSS',
    '..SSSS.PPPPPPPPPPSSSSSSSS',
    '..SSSS.PPPPPPPPPP',
    '..SSS..PPPPPPPPPP',
    '..SSS..PPPPPPPPPP',
    '.SSSS..PPPPPPPPPP',
    '.SSSS.SSPPPPPPPPSS',
    '..SS..SSSPPPPPPSSS',
    '......SSS.PPPP.SSS',
    '.....SSSS.GGGG.SSSS',
    '........GGGGGGGG',
    '.......PPPPPPPPPP',
    '......PPPPP..PPPPP',
    '.....PPPP......PPPP',
    '.....PPPP......PPPP',
    '.....PPP........PPP',
    '.....PPP........PPP',
    '.....PPP........PPP',
    '.....DDD........DDD',
    '....KKKK........KKKK',
  ]},

  slam_wind: { a: 12, r: [
    '...SSS............SSS',
    '...SSSS..........SSSS',
    '....SSS..........SSS',
    '....SSS...SSSS...SSS',
    '....SSS..SSSSSS..SSS',
    '....SSSS.SKSSKS.SSSS',
    '.....SSS.SWSSWS.SSS',
    '......SSS.SSSS.SSS',
    '...SSSSSSSSSSSSSSSSSS',
    '..SSSSSSSSSSSSSSSSSSSS',
    '..SSSS.PPPPPPPPPP.SSSS',
    '.......PPPPPPPPPP',
    '.......PPPPPPPPPP',
    '......SSPPPPPPPPSS',
    '......SSSPPPPPPSSS',
    '......SSS.PPPP.SSS',
    '.....SSSS.GGGG.SSSS',
    '........GGGGGGGG',
    '.......PPPPPPPPPP',
    '.......PPPP..PPPP',
    '......PPPP....PPPP',
    '......PPPP....PPPP',
    '......PPP......PPP',
    '......PPP......PPP',
    '......PPP......PPP',
    '......DDD......DDD',
    '.....KKKK......KKKK',
  ]},

  slam: { a: 12, r: [
    '...........SSSS',
    '..........SSSSSS',
    '..........SKSSKS',
    '..........SWSSWS',
    '...........SSSS',
    '....SSSSSSSSSSSSSSSS',
    '...SSSSSSSSSSSSSSSSSS',
    '...SSS.PPPPPPPPPP.SSS',
    '.......PPPPPPPPPPSSSS',
    '.......PPPPPPPPPP.SSSS',
    '.......PPPPPPPPPP..SSSS',
    '......SSPPPPPPPPSS..SSSS',
    '......SSSPPPPPPSSS..SSSS',
    '......SSS.PPPP.SSSS.SSSS',
    '.....SSSS.GGGG..SSSSSSS',
    '........GGGGGGGG..SSSS',
    '.......PPPPPPPPPP',
    '......PPPPP..PPPPP',
    '.....PPPP......PPPP',
    '.....PPPP......PPPP',
    '.....PPP........PPP',
    '.....PPP........PPP',
    '.....PPP........PPP',
    '.....DDD........DDD',
    '....KKKK........KKKK',
  ]},

  block: { a: 12, r: [
    '...........SSSS',
    '..........SSSSSS',
    '..........SKSSKS',
    '..........SWSSWS',
    '...........SSSS',
    '...SSSSSSSSSSSSSSSSSS',
    '..SSSSSSSSSSSSSSSSSSSS',
    '..SSSS.SSSSSSSSSS.SSSS',
    '..SSSS.SSSSSSSSSS.SSSS',
    '..SSS..PSSSSSSSSP..SSS',
    '..SSS..PPSSSSSSPP..SSS',
    '.SSSS..PPPPPPPPPP..SSSS',
    '.SSSS.SSPPPPPPPPSS.SSSS',
    '..SS..SSSPPPPPPSSS..SS',
    '......SSS.PPPP.SSS',
    '.....SSSS.GGGG.SSSS',
    '........GGGGGGGG',
    '.......PPPPPPPPPP',
    '.......PPPP..PPPP',
    '......PPPP....PPPP',
    '......PPPP....PPPP',
    '......PPP......PPP',
    '......PPP......PPP',
    '......PPP......PPP',
    '......DDD......DDD',
    '.....KKKK......KKKK',
  ]},

  hit: { a: 12, r: [
    '........SSSS',
    '.......SSSSSS',
    '.......SKSKSS',
    '.......SWSSWS',
    '........SSSS',
    '..SSSSSSSSSSSSSSSSS',
    '.SSSSSSSSSSSSSSSSSSSS',
    '.SSSS.PPPPPPPPPP.SSSS',
    '.SSSS.PPPPPPPPPP.SSSS',
    '.SSS..PPPPPPPPPP..SSS',
    '.SSS..PPPPPPPPPP..SSS',
    'SSSS..PPPPPPPPPP..SSSS',
    'SSSS.SSPPPPPPPPSS.SSSS',
    '.SS..SSSPPPPPPSSS..SS',
    '.....SSS.PPPP.SSS',
    '....SSSS.GGGG.SSSS',
    '.......GGGGGGGG',
    '......PPPPPPPPPP',
    '......PPPP..PPPP',
    '.....PPPP....PPPPP',
    '.....PPPP.....PPPP',
    '.....PPP.......PPP',
    '.....PPP.......PPP',
    '.....PPP.......PPP',
    '.....DDD.......DDD',
    '....KKKK......KKKKK',
  ]},

  down: { a: 13, r: [
    '....SSSS',
    '...SSSSSS..SSSSSSSSSSS',
    '..SSSSSSSSPPPPPPPPPPPPPPKK',
    '.SSSSSSSSSPPPPPPPPPPPPPKKK',
    '...SSSS.GGGGGG.SSSSSS',
  ]},

  win: { a: 12, r: [
    '.SSS.................SSS',
    '.SSSS...............SSSS',
    '..SSS....SSSS.......SSS',
    '..SSS...SSSSSS......SSS',
    'SS.SSS..SKSSKS..SSS.SS',
    'SS..SSS.SWSSWS.SSS..SS',
    '.SS..SSS.SSSS.SSS..SS',
    '..SS..SSSSSSSSSS..SS',
    '...SSSSSSSSSSSSSSSS',
    '..SSSSSSSSSSSSSSSSSS',
    '..SS...PPPPPPPPPP...SS',
    '.......PPPPPPPPPP',
    '.......PPPPPPPPPP',
    '.......PPPPPPPPPP',
    '........PPPPPPPP',
    '.....SSSS.GGGG.SSSS',
    '........GGGGGGGG',
    '.......PPPPPPPPPP',
    '.......PPPP..PPPP',
    '......PPPP....PPPP',
    '......PPPP....PPPP',
    '......PPP......PPP',
    '......PPP......PPP',
    '......PPP......PPP',
    '......DDD......DDD',
    '.....KKKK......KKKK',
  ]},
};

// ---- portraits (select + ladder screens) ----
// The original 10x10 set: EPX bakes them to 20x20, drawn at 2x in the cells.
const PORTRAIT_ART = {
  kiro: {
    palette: { P: '#3e6fa8', S: '#d6a273', K: '#10101a', D: '#23232e' },
    frame: { a: 0, r: [
      '..PPPPPP..',
      '.PPPPPPPP.',
      '.PPPPPPPP.',
      '.PSSSSSSP.',
      '.PSKSSKSP.',
      '.PSSSSSSP.',
      '.PPPPPPPP.',
      '.PPPPPPPP.',
      '.DDPPPPDD.',
      '.DDDDDDDD.',
    ]},
  },
  ashkar: {
    palette: { P: '#c07a1e', S: '#d6a273', K: '#10101a', D: '#2e2326' },
    frame: { a: 0, r: [
      '..PPPPPP..',
      '.PPPPPPPP.',
      '.PPPPPPPP.',
      '.PSSSSSSP.',
      '.PSKSSKSP.',
      '.PSSSSSSP.',
      '.PPPPPPPP.',
      '.PPPPPPPP.',
      '.DDPPPPDD.',
      '.DDDDDDDD.',
    ]},
  },
  // thunder god: wide hat brim, glowing white eyes
  voltan: {
    palette: { P: '#c8c8d8', S: '#d6a273', W: '#ffffff', D: '#28283a' },
    frame: { a: 0, r: [
      '....PP....',
      '..PPPPPP..',
      'PPPPPPPPPP',
      '..SSSSSS..',
      '..SWSSWS..',
      '..SSSSSS..',
      '..SSSSSS..',
      '..DDDDDD..',
      '.DDDDDDDD.',
      '.DDDDDDDD.',
    ]},
  },
  // soldier: buzz cut + headband (head narrower than shoulders, like voltan)
  striker: {
    palette: { K: '#10101a', P: '#4a7a3a', S: '#d6a273', D: '#2a2a22' },
    frame: { a: 0, r: [
      '...KKKK...',
      '..KKKKKK..',
      '..PPPPPP..',
      '..SSSSSS..',
      '..SKSSKS..',
      '..SSSSSS..',
      '..SSSSSS..',
      '..DDDDDD..',
      '.DDDDDDDD.',
      '.DDDDDDDD.',
    ]},
  },
  // venom assassin: green hood, fang marks painted on the mask
  vipra: {
    palette: { P: '#55aa32', S: '#d6a273', K: '#10101a', W: '#e8ecf4', D: '#1e2a1a' },
    frame: { a: 0, r: [
      '..PPPPPP..',
      '.PPPPPPPP.',
      '.PPPPPPPP.',
      '.PSSSSSSP.',
      '.PSKSSKSP.',
      '.PSSSSSSP.',
      '.PPWPPWPP.',
      '.PPPPPPPP.',
      '.DDPPPPDD.',
      '.DDDDDDDD.',
    ]},
  },
  // shadow ninja: fully masked, glowing eyes
  nyx: {
    palette: { P: '#4a3a78', W: '#e8e0ff', D: '#1c1830' },
    frame: { a: 0, r: [
      '..PPPPPP..',
      '.PPPPPPPP.',
      '.PPPPPPPP.',
      '.PPPPPPPP.',
      '.PPWPPWPP.',
      '.PPPPPPPP.',
      '.PPPPPPPP.',
      '.PPPPPPPP.',
      '.DDPPPPDD.',
      '.DDDDDDDD.',
    ]},
  },
  // mountain monk: bald, heavy brow, dark beard, geared shoulders
  rokkan: {
    palette: { S: '#d6a273', K: '#10101a', D: '#3a342c', G: '#b08030' },
    frame: { a: 0, r: [
      '...SSSS...',
      '..SSSSSS..',
      '..SSSSSS..',
      '..KSSSSK..',
      '..SKSSKS..',
      '..SSSSSS..',
      '..SDDDDS..',
      '..DDDDDD..',
      '.GDDDDDDG.',
      '.DDDDDDDD.',
    ]},
  },
  // wind dancer: pale hair framing the face, gold band
  sura: {
    palette: { P: '#8ed0d8', S: '#d6a273', K: '#10101a', G: '#c8a030', D: '#2a3438' },
    frame: { a: 0, r: [
      '..PPPPPP..',
      '.PGGGGGGP.',
      '.PPSSSSPP.',
      '.PSSSSSSP.',
      '.PSKSSKSP.',
      '.PSSSSSSP.',
      '..SSSSSS..',
      '..DDDDDD..',
      '.DDDDDDDD.',
      '.DDDDDDDD.',
    ]},
  },
  // clockwork golem: riveted brass head, glowing eye lights, vent grill
  kogg: {
    palette: { P: '#7a8694', G: '#c8a030', W: '#9ae8ff', D: '#2a3038' },
    frame: { a: 0, r: [
      '..PPPPPP..',
      '..PPPPPP..',
      '..GPPPPG..',
      '..PPPPPP..',
      '..PWPPWP..',
      '..PPPPPP..',
      '..PGGGGP..',
      '..DDDDDD..',
      '.GDDDDDDG.',
      '.DDDDDDDD.',
    ]},
  },
  // bog witch: pointed hood, sickly skin, one glowing eye
  shulga: {
    palette: { P: '#3a5a52', S: '#b8c89a', K: '#10141a', W: '#d8e8b0', D: '#22302c' },
    frame: { a: 0, r: [
      '....PP....',
      '...PPPP...',
      '..PPPPPP..',
      '.PPPPPPPP.',
      '..SSSSSS..',
      '..SKSSWS..',
      '..SSSSSS..',
      '..SDDDDS..',
      '.DDDDDDDD.',
      '.DDDDDDDD.',
    ]},
  },
  // temple colossus: golden helm and pauldrons, stern face
  magra: {
    palette: { G: '#d8b848', S: '#c08858', K: '#10101a', D: '#4a3a20' },
    frame: { a: 0, r: [
      '...GGGG...',
      '..GGGGGG..',
      '..GGGGGG..',
      '..SSSSSS..',
      '..SKSSKS..',
      '..SSSSSS..',
      '..SSSSSS..',
      '..GGGGGG..',
      '.GGDDDDGG.',
      '.DGGGGGGD.',
    ]},
  },
  // faceless mirage: blank ivory mask under a magenta cowl
  miraj: {
    palette: { P: '#b84a98', S: '#e8e0d0', D: '#3a2434' },
    frame: { a: 0, r: [
      '..PPPPPP..',
      '.PPPPPPPP.',
      '.PPPPPPPP.',
      '.PSSSSSSP.',
      '.PSSSSSSP.',
      '.PSSSSSSP.',
      '.PPPPPPPP.',
      '.PPPPPPPP.',
      '.DDPPPPDD.',
      '.DDDDDDDD.',
    ]},
  },
  // the boss: heavy brow, tusks
  gorruk: {
    palette: { S: '#b87848', K: '#140e0e', W: '#e8e8f0', P: '#7a2424' },
    frame: { a: 0, r: [
      '..SSSSSS..',
      '.SSSSSSSS.',
      'SSKSSSSKSS',
      'SSWSSSSWSS',
      'SSSSSSSSSS',
      'SWSSSSSSWS',
      '.SSSSSSSS.',
      '.SSSSSSSS.',
      '.SPPPPPPS.',
      '.PPPPPPPP.',
    ]},
  },
};

// ---- projectiles ----
const PROJ_FRAMES = {
  iceball_a: { a: 2, r: [
    '.CC.',
    'CWWC',
    'CWWB',
    '.CB.',
  ]},
  iceball_b: { a: 2, r: [
    '.CB.',
    'BWWC',
    'CWWC',
    '.CC.',
  ]},
  spear: { a: 5, r: [
    '........W.',
    'GGGGGGGGWW',
    '........W.',
  ]},
  ring_a: { a: 3, r: [
    '.RRRR.',
    'RY..YR',
    'RY..YR',
    '.RRRR.',
  ]},
  ring_b: { a: 3, r: [
    '.RYRR.',
    'RR..RR',
    'RR..RR',
    '.RRYR.',
  ]},
  venom_a: { a: 2, r: [
    '.VV.',
    'VvvV',
    'VvvV',
    '.VV.',
  ]},
  venom_b: { a: 2, r: [
    '.VV.',
    'VvvV',
    '.VV.',
    '..v.',
  ]},
  dart_a: { a: 2, r: [
    'N..N',
    '.nn.',
    '.nn.',
    'N..N',
  ]},
  dart_b: { a: 2, r: [
    '..N.',
    'Nnn.',
    '.nnN',
    '.N..',
  ]},
  wave_a: { a: 3, r: [
    '..Q...',
    '.QQ.Q.',
    'QQQQQQ',
  ]},
  wave_b: { a: 3, r: [
    '....Q.',
    '.Q.QQ.',
    'QQQQQQ',
  ]},
  fan_a: { a: 2, r: [
    '.ZZZ.',
    'Zz.zZ',
    '.ZZZ.',
  ]},
  fan_b: { a: 2, r: [
    '.ZzZ.',
    'ZZ.ZZ',
    '.ZzZ.',
  ]},
  gear_a: { a: 2, r: [
    'O.O.O',
    '.OOO.',
    'OOoOO',
    '.OOO.',
    'O.O.O',
  ]},
  gear_b: { a: 2, r: [
    '.O.O.',
    'OOOOO',
    '.OoO.',
    'OOOOO',
    '.O.O.',
  ]},
  hex_a: { a: 2, r: [
    '.VV.',
    'VWWV',
    'VvvV',
    '.VV.',
  ]},
  hex_b: { a: 2, r: [
    '.VV.',
    'VvvV',
    'VWWV',
    '.VV.',
  ]},
  mine_a: { a: 3, r: [
    '..VV..',
    '.VvvV.',
    'VvmmvV',
    'mmmmmm',
  ]},
  mine_b: { a: 3, r: [
    '.W.V..',
    '.VvvV.',
    'VvmmvV',
    'mmmmmm',
  ]},
  prism_a: { a: 1, r: [
    '.I.',
    'IiI',
    '.I.',
  ]},
  prism_b: { a: 1, r: [
    '.i.',
    'iIi',
    '.i.',
  ]},
};

const PROJ_PALETTE = {
  C: '#7ce0f8', W: '#f0fbff', B: '#2e8cc8', G: '#8a6a3a',
  R: '#48c048', Y: '#d8f8b0',
  V: '#6cc83a', v: '#357a1e', N: '#b09ae8', n: '#5a3a98',
  Q: '#c8a050', q: '#8a6a30', Z: '#d8f8f4', z: '#6ab8c0',
  O: '#c89838', o: '#7a5c20', I: '#f8d0ec', i: '#c050a0',
  m: '#2a4438',
};

// ---- fighter palettes ----
// Body chars: S P p D G b K. Head chars per character: H M m T d B C c W k.
const PALETTES = {
  kiro: {
    S: '#d6a273', P: '#3e6fa8', p: '#35608f', D: '#23232e', G: '#6f6f7a',
    b: '#16161e', K: '#10101a', H: '#3e6fa8', M: '#2c4f78',
    W: '#e8ecf4', k: '#161620',
  },
  kiro_alt: {
    S: '#d6a273', P: '#2e8c84', p: '#27776f', D: '#23232e', G: '#6f6f7a',
    b: '#16161e', K: '#10101a', H: '#2e8c84', M: '#1f6a62',
    W: '#e8ecf4', k: '#161620',
  },
  ashkar: {
    S: '#d6a273', P: '#c07a1e', p: '#a3661a', D: '#2e2326', G: '#6f6f7a',
    b: '#1c1410', K: '#10101a', H: '#c07a1e', M: '#8a5414', m: '#a3661a',
    W: '#e8ecf4', k: '#161620',
  },
  ashkar_alt: {
    S: '#d6a273', P: '#a83a2e', p: '#8f3127', D: '#2e2326', G: '#6f6f7a',
    b: '#1c1410', K: '#10101a', H: '#a83a2e', M: '#7a2a20', m: '#8f352a',
    W: '#e8ecf4', k: '#161620',
  },
  voltan: {
    S: '#d6a273', P: '#c8c8d8', p: '#b2b2c6', D: '#28283a', G: '#c8a030',
    b: '#23283c', K: '#10101a', H: '#a89858', T: '#a89858', d: '#8a6a4e',
    B: '#d8d8e0', W: '#ffffff', k: '#161620',
  },
  voltan_alt: {
    S: '#d6a273', P: '#8888c8', p: '#7878b4', D: '#28283a', G: '#c8a030',
    b: '#23283c', K: '#10101a', H: '#a89858', T: '#a89858', d: '#8a6a4e',
    B: '#d8d8e0', W: '#ffffff', k: '#161620',
  },
  striker: {
    S: '#d6a273', P: '#4a7a3a', p: '#3c6530', D: '#3a3a2c', G: '#7a6a4a',
    b: '#26261e', K: '#262620', H: '#262620', B: '#5d8c4a',
    C: '#3a5230', c: '#55663a', W: '#e8ecf4', k: '#161620',
  },
  striker_alt: {
    S: '#d6a273', P: '#8a8a4a', p: '#74743c', D: '#3a3a2c', G: '#7a6a4a',
    b: '#26261e', K: '#262620', H: '#262620', B: '#9aa45a',
    C: '#55663a', c: '#6f7f4a', W: '#e8ecf4', k: '#161620',
  },
  vipra: {
    S: '#d6a273', P: '#55aa32', p: '#479028', D: '#1e2a1a', G: '#6f6f7a',
    b: '#141c12', K: '#10101a', H: '#55aa32', M: '#3f8224',
    W: '#e8ecf4', k: '#161620',
  },
  vipra_alt: {
    S: '#d6a273', P: '#a8a02e', p: '#8f8826', D: '#1e2a1a', G: '#6f6f7a',
    b: '#141c12', K: '#10101a', H: '#a8a02e', M: '#787220',
    W: '#e8ecf4', k: '#161620',
  },
  nyx: {
    S: '#d6a273', P: '#4a3a78', p: '#3e3164', D: '#1c1830', G: '#6f6f7a',
    b: '#14101e', K: '#0c0a14', H: '#4a3a78', M: '#352a56',
    W: '#e8e0ff', k: '#100d18',
  },
  nyx_alt: {
    S: '#d6a273', P: '#8c3a6a', p: '#783158', D: '#1c1830', G: '#6f6f7a',
    b: '#14101e', K: '#0c0a14', H: '#8c3a6a', M: '#642a4c',
    W: '#e8e0ff', k: '#100d18',
  },
  rokkan: {
    S: '#d6a273', P: '#8c8478', p: '#787264', D: '#3a342c', G: '#b08030',
    b: '#26221c', K: '#10101a', H: '#8c8478', M: '#6a6458',
    W: '#e8ecf4', k: '#161620',
  },
  rokkan_alt: {
    S: '#d6a273', P: '#6a7a8c', p: '#5a6878', D: '#3a342c', G: '#b08030',
    b: '#26221c', K: '#10101a', H: '#6a7a8c', M: '#4e5a68',
    W: '#e8ecf4', k: '#161620',
  },
  sura: {
    S: '#d6a273', P: '#8ed0d8', p: '#79b8c0', D: '#2a3438', G: '#c8a030',
    b: '#1c2426', K: '#10101a', H: '#8ed0d8', M: '#68a4ac',
    W: '#ffffff', k: '#161620',
  },
  sura_alt: {
    S: '#d6a273', P: '#d89ab8', p: '#c084a2', D: '#2a3438', G: '#c8a030',
    b: '#1c2426', K: '#10101a', H: '#d89ab8', M: '#b06e8c',
    W: '#ffffff', k: '#161620',
  },
  kogg: {
    S: '#9aa4ae', P: '#7a8694', p: '#68737f', D: '#2a3038', G: '#c8a030',
    b: '#1e242a', K: '#10141a', H: '#7a8694', M: '#5c6670',
    W: '#9ae8ff', k: '#161a20',
  },
  kogg_alt: {
    S: '#c09a78', P: '#a86a3a', p: '#925a30', D: '#2a3038', G: '#c8a030',
    b: '#1e242a', K: '#10141a', H: '#a86a3a', M: '#7c4e2a',
    W: '#9ae8ff', k: '#161a20',
  },
  shulga: {
    S: '#b8c89a', P: '#3a5a52', p: '#314d46', D: '#22302c', G: '#7a6a4a',
    b: '#182220', K: '#10141a', H: '#3a5a52', M: '#2a423c',
    W: '#d8e8b0', k: '#12181a',
  },
  shulga_alt: {
    S: '#b8c89a', P: '#6a4a7a', p: '#5a3e68', D: '#22302c', G: '#7a6a4a',
    b: '#182220', K: '#10141a', H: '#6a4a7a', M: '#4c3458',
    W: '#d8e8b0', k: '#12181a',
  },
  magra: {
    S: '#c08858', P: '#d8b848', p: '#c0a23c', D: '#4a3a20', G: '#8a6a2a',
    b: '#2e2412', K: '#10101a', H: '#d8b848', M: '#b09030',
    W: '#e8ecf4', k: '#161620',
  },
  magra_alt: {
    S: '#c08858', P: '#b0b8c0', p: '#9aa2ac', D: '#4a3a20', G: '#8a6a2a',
    b: '#2e2412', K: '#10101a', H: '#b0b8c0', M: '#888f98',
    W: '#e8ecf4', k: '#161620',
  },
  miraj: {
    S: '#e8e0d0', P: '#b84a98', p: '#a13f85', D: '#3a2434', G: '#6f6f7a',
    b: '#281824', K: '#10101a', H: '#b84a98', M: '#8c3673',
    W: '#ffffff', k: '#161620',
  },
  miraj_alt: {
    S: '#e8e0d0', P: '#4ab8b0', p: '#3fa29a', D: '#243a38', G: '#6f6f7a',
    b: '#182826', K: '#10101a', H: '#4ab8b0', M: '#368c85',
    W: '#ffffff', k: '#161620',
  },
  gorruk: {
    P: '#7a2424', D: '#2a2020', S: '#b87848', K: '#140e0e',
    G: '#c8a030', W: '#e8e8f0',
  },
  // frozen overlay palette: everything goes icy (covers all fighter chars)
  ice: {
    S: '#c4ecf8', P: '#a8e0f4', p: '#90d4ec', D: '#5a9cc4', G: '#7cc0dc',
    b: '#4a8cb4', K: '#3a7ca8', H: '#a8e0f4', M: '#7cc0dc', m: '#90d4ec',
    T: '#a8e0f4', d: '#90d4ec', B: '#d8f4fc', C: '#7cc0dc', c: '#90d4ec',
    W: '#ffffff', k: '#3a7ca8',
  },
};

// ---- impact sparks (drawn at the contact point of hits and blocks) ----
const SPARK_FRAMES = {
  spark_a: { a: 2, r: [
    '..W..',
    '.WYW.',
    'WY.YW',
    '.WYW.',
    '..W..',
  ]},
  spark_b: { a: 3, r: [
    '...W...',
    '..Y.Y..',
    '.Y...Y.',
    'W.....W',
    '.Y...Y.',
    '..Y.Y..',
    '...W...',
  ]},
};
const SPARK_HIT_PALETTE = { W: '#fff6c8', Y: '#ffd23c' };
const SPARK_BLOCK_PALETTE = { W: '#cfe2ff', Y: '#6f9fdf' };

// ---- animated stage decorations ----
const FLAME_FRAMES = {
  a: { a: 2, r: [
    '..R..',
    '..O..',
    '.OYO.',
    '.OYO.',
    '.YYY.',
    'OYYYO',
    '.OOO.',
  ]},
  b: { a: 2, r: [
    '...R.',
    '..O..',
    '..YO.',
    '.OYO.',
    '.YYO.',
    'OYYYO',
    '.OOO.',
  ]},
};
const FLAME_PALETTE = { R: '#c8402a', O: '#e8762a', Y: '#ffd23c' };

const GLOW_FRAMES = {
  a: { a: 1, r: ['.Y.', 'YWY', '.Y.'] },
  b: { a: 1, r: ['...', '.Y.', '...'] },
};
const GLOW_PALETTE = { W: '#fff2b0', Y: '#e8c050' };

const TWINKLE_FRAMES = {
  a: { a: 0, r: ['W'] },
  b: { a: 0, r: ['.'] },
};
const TWINKLE_PALETTE = { W: '#e8e4f4' };
const FIREFLY_PALETTE = { W: '#d8e87a' };
const GLINT_PALETTE = { W: '#cfe6ff' };

const BOLT_FRAMES = {
  a: { a: 0, r: [
    '......W',
    '.....WW',
    '....WW.',
    '...WW..',
    '...W...',
    '..WWW..',
    '....W..',
    '...W...',
    '..WW...',
    '..W....',
    '.W.....',
    'WW.....',
  ]},
  b: { a: 0, r: ['.'] },
};
const BOLT_PALETTE = { W: '#e8e4ff' };

// ---- stage backdrops ----
// Painted on an 80x50 grid (every char is a color; '.' is the sky base) and
// EPX-upscaled at bake to fill 320x200. Built with small paint helpers so
// big areas stay readable; detail rows are placed explicitly.
const BG_W = 80, BG_H = 50;

function bgMake(fill) {
  return Array.from({ length: BG_H }, () => Array(BG_W).fill(fill));
}
function bgRect(g, x, y, w, h, ch) {
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) {
      if (yy >= 0 && yy < BG_H && xx >= 0 && xx < BG_W) g[yy][xx] = ch;
    }
  }
}
function bgRow(g, y, x, str) {
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== ' ' && x + i < BG_W) g[y][x + i] = str[i];
  }
}
function bgDisc(g, cx, cy, radius, ch) {
  for (let yy = -radius; yy <= radius; yy++) {
    for (let xx = -radius; xx <= radius; xx++) {
      if (xx * xx + yy * yy <= radius * radius) {
        const X = cx + xx, Y = cy + yy;
        if (Y >= 0 && Y < BG_H && X >= 0 && X < BG_W) g[Y][X] = ch;
      }
    }
  }
}
function bgDone(g) { return g.map(r => r.join('')); }

function buildCourtyard() {
  const g = bgMake('.');
  // night sky bands deepening toward the horizon
  bgRect(g, 0, 26, BG_W, 4, 'a');
  bgRect(g, 0, 30, BG_W, 14, 'b');
  // stars
  for (const [x, y] of [[8, 3], [20, 7], [33, 2], [47, 5], [70, 9], [14, 12], [62, 14], [40, 10]]) g[y][x] = '*';
  // moon with craters
  bgDisc(g, 62, 9, 5, 'M');
  g[8][60] = 'm'; g[8][61] = 'm'; g[10][64] = 'm'; g[7][63] = 'm';
  // distant pagoda, center
  bgRow(g, 21, 39, 'K');
  bgRow(g, 22, 38, 'KKK');
  bgRect(g, 36, 23, 7, 1, 'K');
  bgRow(g, 24, 33, 'K.........K');     // upturned roof tips
  bgRect(g, 34, 24, 11, 1, 'K');
  bgRect(g, 37, 25, 5, 3, 'P');
  bgRect(g, 32, 28, 15, 1, 'K');
  bgRow(g, 29, 30, 'K...............K');
  bgRect(g, 31, 29, 17, 1, 'K');
  bgRect(g, 36, 30, 7, 4, 'P');
  bgRect(g, 29, 34, 21, 1, 'K');
  bgRect(g, 28, 35, 23, 1, 'K');
  bgRect(g, 34, 36, 11, 8, 'P');
  bgRect(g, 38, 38, 3, 3, 'W');        // lit doorway
  // flanking stone pillars
  bgRect(g, 5, 25, 8, 2, 'K');
  bgRect(g, 6, 27, 6, 17, 'P');
  bgRect(g, 67, 25, 8, 2, 'K');
  bgRect(g, 68, 27, 6, 17, 'P');
  // ground mist
  for (let x = 2; x < 78; x += 7) bgRow(g, 42 + (x % 3), x, 'FFFF');
  // courtyard floor with tile seams
  bgRect(g, 0, 44, BG_W, 6, 'G');
  for (let x = 4; x < BG_W; x += 10) { g[46][x] = 'T'; g[48][x + 5 < BG_W ? x + 5 : x] = 'T'; }
  for (let x = 0; x < BG_W; x += 3) g[44][x] = 'H';
  return bgDone(g);
}

function buildPit() {
  const g = bgMake('.');
  bgRect(g, 0, 24, BG_W, 6, 'a');
  bgRect(g, 0, 30, BG_W, 14, 'b');
  // huge blood moon, low on the horizon
  bgDisc(g, 40, 18, 9, 'M');
  bgRect(g, 33, 19, 15, 1, 'm');
  bgRect(g, 35, 15, 11, 1, 'm');
  // hanging chains
  for (let y = 0; y < 14; y++) { g[y][18] = 'C'; g[y][61] = 'C'; }
  g[14][18] = 'C'; g[15][18] = 'C'; g[14][61] = 'C';
  // jagged crags closing in from both sides
  for (let i = 0; i < 14; i++) {
    bgRect(g, 0, 18 + i * 2, 10 + i, 2, 'K');
    bgRect(g, BG_W - 10 - i, 18 + i * 2, 10 + i, 2, 'K');
  }
  // brazier pedestals (flames animate on top of these)
  bgRect(g, 13, 36, 5, 8, 'K');
  bgRect(g, 12, 35, 7, 1, 'K');
  bgRect(g, 62, 36, 5, 8, 'K');
  bgRect(g, 61, 35, 7, 1, 'K');
  // scorched ground with bone-pale flecks
  bgRect(g, 0, 44, BG_W, 6, 'G');
  for (const [x, y] of [[9, 46], [26, 48], [44, 47], [58, 48], [71, 46], [35, 48]]) g[y][x] = 'B';
  for (let x = 0; x < BG_W; x += 3) g[44][x] = 'H';
  return bgDone(g);
}

function buildTemple() {
  const g = bgMake('.');
  bgRect(g, 0, 22, BG_W, 6, 'a');
  bgRect(g, 0, 28, BG_W, 16, 'b');
  // low amber sun
  bgDisc(g, 14, 22, 4, 'M');
  // mountain ridgeline
  for (let i = 0; i < 8; i++) {
    bgRect(g, 18 - i * 2, 30 + i, 16 + i * 3, 1, 'R');
    bgRect(g, 52 - i, 31 + i, 14 + i * 2, 1, 'R');
  }
  bgRect(g, 0, 38, BG_W, 6, 'R');
  // great gate (torii): double lintel + posts
  bgRect(g, 22, 12, 36, 2, 'K');
  bgRow(g, 11, 21, 'K' + ' '.repeat(36) + 'K');
  bgRect(g, 26, 16, 28, 2, 'K');
  bgRect(g, 28, 14, 4, 30, 'K');
  bgRect(g, 48, 14, 4, 30, 'K');
  bgRect(g, 38, 12, 4, 4, 'K');         // center crest
  // lantern cords under the lintel (glows animate at the tips)
  g[18][35] = 'C'; g[19][35] = 'C';
  g[18][44] = 'C'; g[19][44] = 'C';
  // mossy ground with a worn stone path
  bgRect(g, 0, 44, BG_W, 6, 'G');
  bgRect(g, 30, 44, 20, 6, 'T');
  bgRect(g, 26, 47, 28, 3, 'T');
  for (let x = 0; x < BG_W; x += 3) g[44][x] = 'H';
  return bgDone(g);
}

function buildGrove() {
  const g = bgMake('.');
  bgRect(g, 0, 24, BG_W, 6, 'a');
  bgRect(g, 0, 30, BG_W, 14, 'b');
  // crescent moon (a dark disc bites the bright one)
  bgDisc(g, 64, 8, 4, 'M');
  bgDisc(g, 66, 7, 4, '.');
  // mid-depth bamboo
  for (const x of [16, 24, 56, 63]) {
    bgRect(g, x, 6, 2, 38, 'B');
    for (let y = 10; y < 44; y += 7) { g[y][x] = 'L'; g[y][x + 1] = 'L'; }
  }
  // foreground bamboo, thick and dark, with joint rings
  for (const x of [4, 10, 69, 75]) {
    bgRect(g, x, 0, 3, 44, 'K');
    for (let y = 8; y < 44; y += 8) bgRect(g, x, y, 3, 1, 'L');
  }
  // hanging leaves
  bgRow(g, 4, 12, 'KKK..KK');
  bgRow(g, 6, 48, 'KK..KKK');
  bgRow(g, 2, 28, 'BB.BB');
  bgRow(g, 9, 33, 'B.BB');
  // mossy floor with grass tufts
  bgRect(g, 0, 44, BG_W, 6, 'G');
  for (const [x, y] of [[7, 46], [19, 48], [33, 47], [47, 48], [61, 46], [71, 47]]) g[y][x] = 'T';
  for (let x = 0; x < BG_W; x += 3) g[44][x] = 'H';
  return bgDone(g);
}

function buildPeak() {
  const g = bgMake('.');
  bgRect(g, 0, 22, BG_W, 8, 'a');
  bgRect(g, 0, 30, BG_W, 14, 'b');
  // rippling aurora
  for (let x = 0; x < BG_W; x++) {
    const y = 5 + (((x >> 3) % 3 === 1) ? 2 : 0) + ((x >> 4) % 2);
    g[y][x] = 'u'; g[y + 1][x] = 'v'; g[y + 2][x] = 'u';
  }
  bgDisc(g, 12, 6, 3, 'M');
  // the great peak, snow-capped
  for (let i = 0; i < 22; i++) bgRect(g, 38 - i, 22 + i, 2 + i * 2, 1, i < 5 ? 'S' : 'I');
  for (let i = 0; i < 14; i++) bgRect(g, 64 - (i >> 1), 30 + i, 2 + i, 1, i < 3 ? 'S' : 'i');
  // wind-swept snowfield
  bgRect(g, 0, 44, BG_W, 6, 'G');
  for (const [x, y] of [[10, 46], [24, 48], [40, 47], [55, 46], [68, 48]]) g[y][x] = 'g';
  for (let x = 0; x < BG_W; x += 3) g[44][x] = 'H';
  return bgDone(g);
}

function buildBridge() {
  const g = bgMake('.');
  // roiling storm clouds
  bgRect(g, 0, 3, BG_W, 3, 'C');
  bgRect(g, 8, 8, 30, 2, 'C');
  bgRect(g, 48, 10, 26, 2, 'C');
  bgRect(g, 0, 13, 18, 2, 'C');
  bgRect(g, 30, 16, 40, 2, 'C');
  // cliff walls dropping into the gorge
  for (let i = 0; i < 22; i++) {
    bgRect(g, 0, 22 + i, 16 - (i >> 1), 1, 'K');
    bgRect(g, BG_W - 16 + (i >> 1), 22 + i, 16 - (i >> 1), 1, 'K');
  }
  // black gorge with falling mist streaks
  bgRect(g, 18, 28, 44, 16, 'V');
  for (const x of [26, 38, 52]) bgRect(g, x, 32, 1, 9, 'C');
  // rope posts and sagging guard ropes
  bgRect(g, 6, 28, 3, 16, 'K');
  bgRect(g, 71, 28, 3, 16, 'K');
  for (let x = 9; x < 71; x++) {
    const t = (x - 40) / 31;
    const y = 31 + Math.round(4 * (1 - t * t));
    g[y][x] = 'R';
    g[y + 6][x] = 'R';
  }
  // plank deck (the arena floor)
  bgRect(g, 0, 44, BG_W, 6, 'G');
  for (let x = 2; x < BG_W; x += 6) bgRect(g, x, 44, 1, 6, 'g');
  for (let x = 0; x < BG_W; x += 3) g[44][x] = 'H';
  return bgDone(g);
}

function buildThrone() {
  const g = bgMake('.');
  bgRect(g, 0, 0, BG_W, 6, 'a');
  // stone columns
  for (const x of [6, 70]) {
    bgRect(g, x, 4, 4, 40, 'K');
    bgRect(g, x - 1, 4, 6, 2, 'K');
  }
  // war banners with ragged hems
  for (const x of [18, 56]) {
    bgRect(g, x, 5, 6, 24, 'V');
    bgRect(g, x + 2, 9, 2, 6, 'v');
    bgRect(g, x, 27, 6, 2, 'v');
    g[29][x + 1] = 'V'; g[29][x + 4] = 'V';
  }
  // the warlord's horned throne, empty -- he is in the arena
  bgRect(g, 36, 12, 8, 2, 't');
  bgRect(g, 37, 11, 2, 3, 't');
  bgRect(g, 41, 11, 2, 3, 't');
  bgRect(g, 34, 14, 12, 30, 't');
  bgRect(g, 32, 18, 16, 26, 't');
  bgRect(g, 30, 34, 20, 10, 't');
  // brazier pedestals
  bgRect(g, 13, 36, 5, 8, 'K');
  bgRect(g, 12, 35, 7, 1, 'K');
  bgRect(g, 62, 36, 5, 8, 'K');
  bgRect(g, 61, 35, 7, 1, 'K');
  // worn stone floor
  bgRect(g, 0, 44, BG_W, 6, 'G');
  for (let x = 5; x < BG_W; x += 12) g[47][x] = 'g';
  for (let x = 0; x < BG_W; x += 3) g[44][x] = 'H';
  return bgDone(g);
}

// note: decoration x/y are screen pixels; flames sit on the brazier tops
const STAGE_ART = [
  {
    name: 'MOONLIT COURTYARD',
    palette: {
      '.': '#16112a', a: '#1b1531', b: '#211a38', '*': '#d8d4ec',
      M: '#cfc9dd', m: '#9a92b4', K: '#0a0716', P: '#1c1530',
      W: '#6a5a2a', F: '#2a2344', G: '#2a2435', g: '#231e2d',
      T: '#332c44', H: '#3f3a4e',
    },
    line: '#3f3a4e',
    rows: buildCourtyard(),
    anims: [
      { frames: TWINKLE_FRAMES, palette: TWINKLE_PALETTE, order: ['a', 'b'], x: 80, y: 12, period: 38 },
      { frames: TWINKLE_FRAMES, palette: TWINKLE_PALETTE, order: ['b', 'a'], x: 188, y: 28, period: 46 },
      { frames: GLOW_FRAMES, palette: GLOW_PALETTE, order: ['a', 'b'], x: 155, y: 152, period: 30 },
    ],
  },
  {
    name: 'THE WARLORDS PIT',
    palette: {
      '.': '#170808', a: '#220b0b', b: '#2d0e0c',
      M: '#c2542f', m: '#8a3a22', K: '#0c0404', C: '#3a2418',
      G: '#241312', g: '#1b0e0d', B: '#7a6a52', H: '#4e3030',
    },
    line: '#4e3030',
    rows: buildPit(),
    anims: [
      { frames: FLAME_FRAMES, palette: FLAME_PALETTE, order: ['a', 'b'], x: 57, y: 126, period: 9 },
      { frames: FLAME_FRAMES, palette: FLAME_PALETTE, order: ['b', 'a'], x: 253, y: 126, period: 11 },
    ],
  },
  {
    name: 'TEMPLE GATES',
    palette: {
      '.': '#142420', a: '#1b2f26', b: '#23392b',
      M: '#d8b86a', R: '#0e1d18', K: '#081310', C: '#2a3a30',
      G: '#26302a', g: '#1d2622', T: '#39443c', H: '#44524a',
    },
    line: '#44524a',
    rows: buildTemple(),
    anims: [
      { frames: GLOW_FRAMES, palette: GLOW_PALETTE, order: ['a', 'b'], x: 138, y: 80, period: 22 },
      { frames: GLOW_FRAMES, palette: GLOW_PALETTE, order: ['b', 'a'], x: 174, y: 80, period: 26 },
    ],
  },
  {
    name: 'BAMBOO GROVE',
    palette: {
      '.': '#0e1f16', a: '#142a1c', b: '#1b3624', M: '#c9d4b8',
      K: '#06120c', B: '#1f4a2a', L: '#2a5c34', T: '#2a3c2c',
      G: '#1c2a1e', g: '#15211a', H: '#3a503c',
    },
    line: '#3a503c',
    rows: buildGrove(),
    anims: [
      { frames: TWINKLE_FRAMES, palette: FIREFLY_PALETTE, order: ['a', 'b'], x: 76, y: 118, period: 26 },
      { frames: TWINKLE_FRAMES, palette: FIREFLY_PALETTE, order: ['b', 'a'], x: 152, y: 100, period: 34 },
      { frames: TWINKLE_FRAMES, palette: FIREFLY_PALETTE, order: ['a', 'b'], x: 228, y: 128, period: 42 },
    ],
  },
  {
    name: 'FROZEN PEAK',
    palette: {
      '.': '#10182a', a: '#16213a', b: '#1d2b48', u: '#226a52', v: '#3a8a6a',
      M: '#e8ecf4', I: '#3a5a8a', i: '#2c4668', S: '#c8d8ec',
      G: '#536a8c', g: '#46597a', H: '#7088ac',
    },
    line: '#7088ac',
    rows: buildPeak(),
    anims: [
      { frames: TWINKLE_FRAMES, palette: GLINT_PALETTE, order: ['a', 'b'], x: 96, y: 110, period: 30 },
      { frames: TWINKLE_FRAMES, palette: GLINT_PALETTE, order: ['b', 'a'], x: 246, y: 140, period: 38 },
    ],
  },
  {
    name: 'STORM BRIDGE',
    palette: {
      '.': '#15131f', a: '#1c1930', C: '#2a2440', K: '#0b0a12', V: '#070610',
      R: '#5a4632', G: '#3a2e22', g: '#241c12', H: '#52432f',
    },
    line: '#52432f',
    rows: buildBridge(),
    anims: [
      { frames: BOLT_FRAMES, palette: BOLT_PALETTE, order: ['a', 'b', 'b', 'b'], x: 208, y: 12, period: 16 },
      { frames: BOLT_FRAMES, palette: BOLT_PALETTE, order: ['b', 'b', 'a', 'b'], x: 64, y: 18, period: 21 },
    ],
  },
  {
    name: 'THRONE HALL',
    palette: {
      '.': '#241a2e', a: '#1a1222', K: '#140e1a', V: '#6a1a22', v: '#8a2a32',
      t: '#0f0a14', G: '#33283c', g: '#2a2032', H: '#473a52',
    },
    line: '#473a52',
    rows: buildThrone(),
    anims: [
      { frames: FLAME_FRAMES, palette: FLAME_PALETTE, order: ['a', 'b'], x: 57, y: 126, period: 10 },
      { frames: FLAME_FRAMES, palette: FLAME_PALETTE, order: ['b', 'a'], x: 253, y: 126, period: 12 },
    ],
  },
];
