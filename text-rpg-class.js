const $startScreen = document.querySelector('#start-screen');
const $gameMenu = document.querySelector('#game-menu'); /* 일반모드 */
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

class Game {
    constructor(name) { //게임 초기값 설정
        this.monster = null;
        this.hero = null;
        this.monsterList = [
            { name: '슬라임', hp: 25, att: 10, xp: 10},
            { name: '스켈레톤', hp: 50, att: 15, xp: 20},
            { name: '마왕', hp: 150, att: 35, xp: 50},
        ];
        this.start();
    }

    start(name) { //게임 시작 시 수행하는 동작
        $gameMenu.addEventListener('submit', this.onGameMenuInput);
        $battleMenu.addEventListener('submit', this.onBattleMenuInput);
        this.changeScreen('game');
        this.hero = new Hero(this, name); //주인공 생성
        this.updateHeroState(); // 주인공 스탯 초기화
    };

    changeScreen(screen) { //화면 변경
        if(screen === 'start') {
            $startScreen.style.display = 'block';
            $gameMenu.style.display = 'none';
            $battleMenu.style.display = 'none';
        } else if(screen === 'game') {
            $startScreen.style.display = 'none';
            $gameMenu.style.display = 'block';
            $battleMenu.style.display = 'none';
        } else if(screen === 'battle') {
            $startScreen.style.display = 'none';
            $gameMenu.style.display = 'none';
            $battleMenu.style.display = 'block';
        }
    }

    onGameMenuInput = (evnet) => { //일반모드에서의 활동선택
        event.preventDefault();
        const input =  event.target['menu-input'].value; 
        if(input === '1') {//모험
            this.changeScreen('battle');
            const randomIndex = Math.floor(Math.random() * this.monsterList.length);
            const randomMonster = this.monsterList[randomIndex];
            this.monster = new Monster( //생성자 문법
                this,
                randomMonster.name,
                randomMonster.hp,
                randomMonster.xp,
                randomMonster.att,
            );
            this.updateMonsterStat(); //몬스터 능력치 엡데이트
            this.showMessage(`몬스터와 마주쳤다. ${this.monster.name}인 것 같다!`);
        }else if(input === '2') { //휴식
            this.hero.hp += 20
        }else if(input === '3') { //종료
            this.quit();
        }
    };

    onBattleMenuInput = (event) => { //배틀모드에서의 활동 선택
        event.preventDefault();
        const input = event.target['battle-input'].value;
        if(input === '1') { //공격
            const {hero, monster} = this;
            hero.attack(monster);
            monster.attack(hero);
            if(hero.hp <= 0) { //주인공의 체력이 -일떄
                this.showMessage(`${hero.lev}Lev에서 전사, 새 주인공을 생성하세요.`);
            } else if(monster.hp <= 0) {
                this.showMessage(`몬스터를 잡아 ${monster.xp} 경험치를 얻었다!`);
                hero.getXp(monster.xp);
                this.monster = null;
                this.changeScreen('game');
            } else{ //전투가 진행 중일 경우
                this.showMessage(`${monster.name}에게 ${hero.att}만큼의 데미지를 입히고, ${monster.att}의 데미지를 받았다`);
                this.updateHeroState();
                this.updateMonsterStat();
            }
        }else if(input === '2') { //휴식
            this.hero.heal;
            this.showMessage(`20Hp를 회복하고, ${this.monster.name}으로부터 ${this.monster.att}만큼의 데미지를 입었다.`);
        }else if(input === '3') { //도망
            this.changeScreen('game');
            this.updateHeroState();
            this.updateMonsterStat();
            this.showMessage(`무사히 도망에 성공했다!`);
        }
    };

    showMessage(text) { //몬스터 정보를 보여주는 하단 메세지
        $message.textContent = text;
    };

    quit() { //게임 종료 및 초기화
        this.hero = null;
        this.monster = null;
        this.updateHeroState();
        this.updateMonsterStat();
        $gameMenu.removeEventListener('submit', this.onGameMenuInput); //게임모드를 일반모드로 변경
        $battleMenu.removeEventListener('submit', this.onBattleMenuInput); //게임모드를 전투모드로 변경
        this.changeScreen('start');
        game = null;
    }

    updateHeroState() { //주인공의 상태가 바뀌면 화면도 같이 바꿔줌 ,주인공이 없으면 안바꾸고, 있으면 바꿔줌
        const { hero } = this;
        if (hero === null) { //주인공 셋팅 초기화
            $heroName.textContent = '';
            $heroLevel.textContent = '';
            $heroHp.textContent = '';
            $heroXp.textContent = '';
            $heroAtt.textContent = '';
            return;
        }
        $heroName.textContent = hero.name;
        $heroLevel.textContent = `${hero.lev}Lev`;
        $heroHp.textContent = `HP: ${hero.hp}/${hero.maxHp}`;
        $heroXp.textContent = `XP: ${hero.xp}/${15 * hero.lev}`;
        $heroAtt.textContent = `ATT : ${hero.att}`;
    };

    updateMonsterStat() { //몬스터 능력치 초기화
        const { monster } = this;
        if (monster === null) {
            $monsterName.textContent = '';
            $monsterHp.textContent = '';
            $monsterAtt.textContent = '';
            return;
        };
        $monsterName.textContent = monster.name;
        $monsterHp.textContent = `HP: ${monster.hp}/${monster.maxHp}`;
        $monsterAtt.textContent = `ATT: ${monster.att}`;
    };
}; //GAME셋팅

class Unit { //class함수 상속 => class함수의 중복을 줄여줌
    constructor(game, name, hp, att, xp) {
        this.game = game;
        this.name = name; 
        this.hp = hp; 
        this.maxHp = hp; 
        this.att = att; 
        this.xp = xp; 
    };
    attack(target) {
        target.hp -= this.att;
    };
}

class Hero extends Unit{ /* 주인공 능력치 */
    constructor(game, name) {/* class문법에서는 한번 만든 메세드는 재사용이 가능 */
        super(game, name, 100, 10, 0); //상속받고 있는 부모 클래스 생성자 호출
        this.lev = 1;
    };

    heal(monster) {    /* 회복 시 */
        this.hp += 20;
        this.hp -= monster.att;
    };

    getXp(xp) {
        this.xp += xp;
        if(this.xp >= this.lev * 15) { //경험치를 다 채울 시 레벨업
            this.xp -= this.lev * 15;
            this.lev += 1;
            this.maxHp += 5;
            this.att += 5;
            this.hp = this.maxHp;
            this.game.showMessage(`레벨업! 레벨 ${this.lev}`);
        };
    };
}

class Monster extends Unit{ /* 몬스터 능력치 */
    constructor(game, name, hp, xp, att) {
        super(game, name, hp, xp, att); //상속받고 있는 부모 클래스 생성자 호출
    }
}

let game = null;
$startScreen.addEventListener('submit', (event) => { /* 주인공 이름 설정 */
    event.preventDefault();
    const name = event.target['name-input'].value;
    game = new Game(name); 
    //new를 붙여 호출하면 constructor함수가 실행되고 class문법에 있는 해당 객체 반환
});




/* 문제점 
-보완해야 할 문제점

1.초기 위쪽화면에 주인공 이름이 나타나지 않는다.
2.레벨업 시 경험치 부분이 이상하다.
3.주인공이 패배 시에 체력이 -가 되지 않고 바로 전사했다고 뜬다
4.레벨업 시 체력이 다 회복되지 않는다
5.주인공이 패배 시 몬스터의 능력치가 사라지지 않고 바로 다음줄에 전사했다고 나온다
6.몬스터를 잡아도 경험치를 얻었다는 설명중 밑에 몬스텉의 능력치가 뜬다
7.전투모드에서 도망을 선택해서 일반모드로 돌아가더라도 몬스터의 능렭치는 계속 아래에 뜬다
8.주인공 체력회복이 되지 않는다
*/




