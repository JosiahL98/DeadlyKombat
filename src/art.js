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
// Authored at 20x22 (EPX bakes them to 40x44, drawn 1:1 in the select cells).
// Each fighter gets a dedicated palette and battle damage of their own:
// keyed by character id.
const PORTRAIT_ART = {

  // KIRO: blue hood and mask, an old scar splitting his left brow and eye
  kiro: {
    palette: {
      H: '#3e6fa8', D: '#1c2433', M: '#2c4f78', S: '#d6a273',
      k: '#161620', W: '#e8ecf4', r: '#9a5a48',
    },
    frame: { a: 0, r: [
      '......HHHHHHHH',
      '....HHHHHHHHHHHH',
      '...HHHHHHHHHHHHHH',
      '..HHHHHHHHHHHHHHHH',
      '..HHHHHHHHHHHHHHHH',
      '..HHHDDDDDDDDDDHHH',
      '..HHDSSSSSSSSSSDHH',
      '..HHDSSrSSSSSSSDHH',
      '..HHDkkrSSSkkkSDHH',
      '..HHDWkrSSSWWkSDHH',
      '..HHDSSrSSSSSSSDHH',
      '..HHDMMMMMMMMMMDHH',
      '..HHMMMMMMMMMMMMHH',
      '..HHMMMMMMMMMMMMHH',
      '...HHMMMMMMMMMMHH',
      '....HHMMMMMMMMHH',
      '.....HHMMMMMMHH',
      '......DDMMMMDD',
      '....DDDDDDDDDDDD',
      '..DDDDDDDDDDDDDDDD',
      '.DDDDDHHHHHHHHDDDDD',
      '.DDDDDHHHHHHHHDDDDD',
    ]},
  },

  // ASHKAR: gold hood, bandage-wrapped mask, burn scarring up the right side
  ashkar: {
    palette: {
      H: '#c07a1e', D: '#33231a', M: '#8a5414', m: '#a3661a',
      S: '#d6a273', k: '#161620', W: '#e8ecf4', r: '#8a3a2a',
    },
    frame: { a: 0, r: [
      '......HHHHHHHH',
      '....HHHHHHHHHHHH',
      '...HHHHHHHHHHHHHH',
      '..HHHHHHHHHHHHHHHH',
      '..HHHHHHHHHHHHHHHH',
      '..HHHDDDDDDDDDDHHH',
      '..HHDSSSSSSSrrSDHH',
      '..HHDSSSSSSSSrrDHH',
      '..HHDkkkSSSSkkrDHH',
      '..HHDWWkSSSSWkrDHH',
      '..HHDSSSSSSSrrSDHH',
      '..HHDMMMMMMMMMMDHH',
      '..HHmmmmmmmmmmmmHH',
      '..HHMMMMMMMMMMMMHH',
      '...HHmmmmmmmmmmHH',
      '....HHMMMMMMMMHH',
      '.....HHmmmmmmHH',
      '......DDMMMMDD',
      '....DDDDDDDDDDDD',
      '..DDDDDDDDDDDDDDDD',
      '.DDDDDHHHHHHHHDDDDD',
      '.DDDDDHHHHHHHHDDDDD',
    ]},
  },

  // VOLTAN: straw hat shadowing the face, eyes burning white, storm-gray beard
  voltan: {
    palette: {
      T: '#a89858', D: '#23283c', d: '#8a6a4e', S: '#d6a273',
      W: '#ffffff', B: '#d8d8e0', R: '#c8c8d8', k: '#161620',
    },
    frame: { a: 0, r: [
      '.........TT',
      '.......TTTTTT',
      '.....TTTTTTTTTT',
      '..TTTTTTTTTTTTTTTT',
      '.TTTTTTTTTTTTTTTTTT',
      '...DDDDDDDDDDDDDD',
      '...DddddddddddddD',
      '...DddWWddddWWddD',
      '...DSSSSSSSSSSSSD',
      '...DSSSSSSSSSSSSD',
      '...DSBBBBBBBBBBSD',
      '...DBBBBBBBBBBBBD',
      '...DBBBBBBBBBBBBD',
      '....DBBBBBBBBBBD',
      '.....DBBBBBBBBD',
      '......DBBBBBBD',
      '.......DBBBBD',
      '......DDDDDDDD',
      '....RRRRRRRRRRRR',
      '..RRRRRRRRRRRRRRRR',
      '.RRRRRDDDDDDDDRRRRR',
      '.RRRRRDDDDDDDDRRRRR',
    ]},
  },

  // STRIKER: buzz cut, field headband, stubble, cheek scar, dog tags
  striker: {
    palette: {
      K: '#262620', B: '#4a7a3a', S: '#d6a273', d: '#a3794f',
      k: '#161620', W: '#e8ecf4', r: '#8a4a3a', C: '#3a5230',
      c: '#55663a', T: '#c0c0c8',
    },
    frame: { a: 0, r: [
      '.....KKKKKKKKKK',
      '....KKKKKKKKKKKK',
      '...KKKKKKKKKKKKKK',
      '...BBBBBBBBBBBBBB',
      '...BBBBBBBBBBBBBB',
      '...SSSSSSSSSSSSSS',
      '...SSkkkSSSSkkkSS',
      '...SSWWkSSSSWWkSS',
      '...SSrSSSSSSSSSSS',
      '...CCCCCCCCCCCCCC',
      '...CCccCCCCccCCCC',
      '...CCCCCCcCCCCCCC',
      '...CCccCCCCCCccCC',
      '....CCCCCCccCCCC',
      '.....CCccCCCCCC',
      '......CCCCCCCC',
      '.......SSTTSS',
      '..CCCCCCCTTCCCCCCC',
      '..CCccCCCCTCCccCCC',
      '.CCCCCCCccCCCCCCCC',
      '.CCccCCCCCCCCccCCC',
      '.CCCCCCcCCCCCCCCCC',
    ]},
  },

  // GORRUK: a wall of scarred muscle -- brow ridge, red eyes, war paint, tusks
  gorruk: {
    palette: {
      S: '#b87848', P: '#7a2424', k: '#241208', E: '#d83030',
      W: '#e8e0c8', A: '#4a3018', G: '#c8a030',
    },
    frame: { a: 0, r: [
      '..SSSSSSSSSSSSSSSS',
      '.SSSSSSSSSSSSSSSSSS',
      '.SSSSSSSSSSSSSSSSSS',
      '.SSPPSSSSSSSSSSPPSS',
      '.SSPPSSSSSSSSSSPPSS',
      '.SkkkkSSSSSSSSkkkkS',
      '.SSkEESSSSSSSSEEkSS',
      '.SSSSSSSkkSSSSSSSSS',
      '.SSSSSSSkkSSSSSSSSS',
      '.SSWSSSSSSSSSSSSWSS',
      '.SSWWkkkkkkkkkkWWSS',
      '.SSWWSSSSSSSSSSWWSS',
      '..SSSSSSSSSSSSSSSS',
      '..SSSSSSSSSSSSSSSS',
      '...SSSSSSSSSSSSSS',
      '....SSSSSSSSSSSS',
      '..AAAAAAAAAAAAAAAA',
      '.AAAAGGAAAAAAGGAAAA',
      '.AAAAAAAAAAAAAAAAAA',
      '.AAAAAAAAAAAAAAAAAA',
      'AAAAAAAAAAAAAAAAAAA',
      'AAAAAAAAAAAAAAAAAAA',
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
};

const PROJ_PALETTE = {
  C: '#7ce0f8', W: '#f0fbff', B: '#2e8cc8', G: '#8a6a3a',
  R: '#48c048', Y: '#d8f8b0',
};

// ---- fighter palettes ----
// Low-saturation, ominous. P is the signature color.
const PALETTES = {
  kiro: {
    P: '#3e6fa8', D: '#23232e', S: '#d6a273', K: '#10101a',
    G: '#6f6f7a', W: '#e8e8f0',
  },
  kiro_alt: {
    P: '#2e8c84', D: '#23232e', S: '#d6a273', K: '#10101a',
    G: '#6f6f7a', W: '#e8e8f0',
  },
  ashkar: {
    P: '#c07a1e', D: '#2e2326', S: '#d6a273', K: '#10101a',
    G: '#6f6f7a', W: '#e8e8f0',
  },
  ashkar_alt: {
    P: '#a83a2e', D: '#2e2326', S: '#d6a273', K: '#10101a',
    G: '#6f6f7a', W: '#e8e8f0',
  },
  voltan: {
    P: '#c8c8d8', D: '#28283a', S: '#d6a273', K: '#10101a',
    G: '#c8a030', W: '#ffffff',
  },
  voltan_alt: {
    P: '#8888c8', D: '#28283a', S: '#d6a273', K: '#10101a',
    G: '#c8a030', W: '#ffffff',
  },
  striker: {
    P: '#4a7a3a', D: '#2a2a22', S: '#d6a273', K: '#10101a',
    G: '#7a6a4a', W: '#e8e8f0',
  },
  striker_alt: {
    P: '#8a8a4a', D: '#2a2a22', S: '#d6a273', K: '#10101a',
    G: '#7a6a4a', W: '#e8e8f0',
  },
  gorruk: {
    P: '#7a2424', D: '#2a2020', S: '#b87848', K: '#140e0e',
    G: '#c8a030', W: '#e8e8f0',
  },
  // frozen overlay palette: everything goes icy
  ice: {
    P: '#a8e0f4', D: '#5a9cc4', S: '#c4ecf8', K: '#3a7ca8',
    G: '#7cc0dc', W: '#ffffff',
  },
  // white silhouette for the 2-frame hit flash
  flash: {
    P: '#ffffff', D: '#ffffff', S: '#ffffff', K: '#ffffff',
    G: '#ffffff', W: '#ffffff',
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
];
