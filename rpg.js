const $startScreen = document.querySelector('#start-screen');
const $gameMenu = document.querySelector('#game-menu');
const $battleMenu = document.querySelector('#battle-menu');
const $heroName = document.querySelector('#hero-name');
const $heroLevel = document.querySelector('#hero-level');
const $heroHp = document.querySelector('#hero-hp');
const $heroXp = document.querySelector('#hero-xp');
const $heroAtt = document.querySelector('#hero-att');
const $monsterName = document.querySelector('#monster-name');
const $monsterHp = document.querySelector('#monster-hp');
const $monsterAtt = document.querySelector('#monster-att');
const $message = document.querySelector('#message');

const hero = { /* 주인공 초기 능력치 */
    name: '',
    lev: 1,
    maxHp: 100,
    hp: 100,
    xp: 0, 
    att: 10,
    attack(monster) {
        monster.hp -= this.att;
        this.hp -= monster.att;
    },
    heal(monster) {
        this.hp += 20;
        this.hp -= monster.att;
    },
};

let monster = null;

const monsterList = [
    {name: '슬라임', hp: 25, att: 10, xp: 10},
    {name: '스켈레톤', hp: 50, att: 15, xp: 20},
    {name: '마왕', hp: 150, att: 35, xp: 50},
];

$startScreen.addEventListener('submit',(event) => {
    event.preventDefault();
    const name = event.target['name-input'].value;
    /*이름 안에 하이픈 즉, 특수문자가 들어가 있는 경우
    앞에 .을 쓰지 못하기 때문에 []로 묶어줘야 한다
    target.input-name 불가 target['input-name']*/
    $startScreen.style.display ='none'; 
    $gameMenu.style.display = 'block';
    $heroName.textContent = name;  /* 주인공 이름 화면에 출력 */
    $heroLevel.textContent = `${hero.lev}Lev`;
    $heroHp.textContent = `Hp: ${hero.hp}/${hero.maxHp}`;
    $heroXp.textContent = `Xp: ${hero.xp}/${15*hero.lev}`; /* 15경험치당 1레벨업 */
    $heroAtt.textContent = `Att: ${hero.att}`; 
    hero.name = name
});
/* 주인공 능력치 창 */

$gameMenu.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = event.target['menu-input'].value;
    if(input === '1'){ //모험
        $gameMenu.style.display = 'none';
        $battleMenu.style.display = 'block';
        monster = JSON.parse( 
        //깊은 복사 / 서로 다른 객체로 인정하여 서로 다른 객체로 인식 => 재사용에 용이함
            JSON.stringify(monsterList[Math.floor(Math.random() * monsterList.length)])
            // 랜덤 몬스터 생성
        );
        monster.maxHp = monster.hp;
        $monsterName.textContent = monster.name;
        $monsterHp.textContent = `Hp: ${monster.hp}/${monster.maxHp}`;
        $monsterAtt.textContent = `ATT: ${monster.att}`;
    }else if(input === '2'){ //휴식

    }else if(input === '3'){ //종료
        
    }
});
/* 일반모드 */

$battleMenu.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = event.target['battle-input'].value;

    if(input === '1'){ //공격
        hero.attack(monster);
        monster.attack(hero);
        $heroHp.textContent = `HP : ${hero.hp}/${hero.maxHp}`;
        $monsterAtt.textContent = `HP : ${monster.hp}/${monster.maxHp}`;
        $message.textContent = `${hero.att}의 데미지를 주고, ${monster.name}로 부터 ${monster.att}만큼의 데미지를 받았다.`
    }else if(input === '2'){ //회복
        hero.heal(hero);
        monster.att(hero);
        $heroHp.textContent = `HP : ${hero.hp}/${hero.maxHp}`;
        $monsterAtt.textContent = `HP : ${monster.hp}/${monster.maxHp}`;
        $message.textContent = `${hero.heal}민큼의 hp를 회복하고, ${monster.name}로 부터 ${monster.att}만큼의 데미지를 받았다.`

    }else if(input === '3'){ //도망

    }
});
/* 전투모드 */



