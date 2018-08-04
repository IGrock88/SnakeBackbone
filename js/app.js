var FIELD_WIDTH = 20;
var FIELD_HEIGHT = 20;
var SNAKE_START_SIZE = 4;
var SNAKE_STEP_INTERVAL = 500;
var FOOD_UPDATE_INTERVAL = 5000;
var FOODS_QUANTITY = 2;
var START_X_COORD = Math.floor(FIELD_WIDTH / 2);
var START_Y_COORD = Math.floor(FIELD_HEIGHT / 2);
var CELLS_TYPES = {
    food: 'food',
    snake: 'snake'
};
var MOVE_DIRECTIONS = {
    left: 11,
    top: 22,
    right: 33,
    bottom: 44
};

var KEY_CODE = {
    left: 37,
    up: 38,
    right: 39,
    down: 40

};

$(function () {
    'use strict';
    let FoodUnit = Backbone.Model.extend({});

    let Foods = Backbone.Collection.extend({
        initialize: function () {
            this.bind("add remove change", function () {
                gameField.renderFood();
            });
        },
        model: FoodUnit
    });
    let SnakeUnit = Backbone.Model.extend({
        defaults: {
            coordX: START_X_COORD,
            coordY: START_Y_COORD
        }
    });

    let Snake = Backbone.Collection.extend({
            initialize: function () {
                this.direction = MOVE_DIRECTIONS.right;
                this.bind("add remove change", function () {
                    gameField.renderSnake();
                });
            },
            model: SnakeUnit
        }
    );

    let GameField = Backbone.View.extend({
        tagName: 'table',
        events: {
            'click #start': 'startGame',
            'keydown': 'changeDirection'
        },
        initialize: function () {
            this.drawField();
        },
        startGame: function () {
            this.score = 0;
            this.foods = new Foods();
            this.respawnSnake();
            this.createFood();
            if(this.moveInterval != null){
                clearInterval(this.moveInterval);
            }
            if(this.foodInterval != null){
                clearInterval(this.foodInterval);
            }
            this.moveInterval = setInterval(function () {
                this.moveSnake();
            }.bind(this), SNAKE_STEP_INTERVAL);
            this.foodInterval = setInterval(function () {
                this.createFood();
            }.bind(this), FOOD_UPDATE_INTERVAL);
        },
        drawField: function () {
            var root = $('#root');
            var table = $('<table/>');

            for (let y = 0; y < FIELD_WIDTH; y++) {
                let row = $('<tr/>', {
                    class: 'row'
                });
                for (let x = 0; x < FIELD_HEIGHT; x++) {
                    row.append($('<td/>', {
                        class: 'cell',
                        'data-coord': x + '-' + y
                    }));
                }
                table.append(row);
            }
            root.append($('<button id="start">Start Game</button>'), table);
        },
        respawnSnake: function () {
            this.snake = new Snake();
            for (var i = 0; i < SNAKE_START_SIZE; i++) {
                var snakeUnit = new SnakeUnit({
                    coordX: START_X_COORD - i,
                    coordY: START_Y_COORD,
                });
                this.snake.add(snakeUnit);
            }
        },
        moveSnake: function () {
            var snakeHead = this.snake.at(0);
            var snakeTail = this.snake.at(this.snake.length - 1);
            var newSnakeUnit = '';
            switch (this.snake.direction) { // создаем новый элемент змейки в зависимости от направления движения
                case MOVE_DIRECTIONS.right: {
                    newSnakeUnit = new SnakeUnit({
                        coordX: snakeHead.get('coordX') + 1,
                        coordY: snakeHead.get('coordY')
                    });
                    break;
                }
                case MOVE_DIRECTIONS.left: {
                    newSnakeUnit = new SnakeUnit({
                        coordX: snakeHead.get('coordX') - 1,
                        coordY: snakeHead.get('coordY')
                    });
                    break;
                }
                case MOVE_DIRECTIONS.top: {
                    newSnakeUnit = new SnakeUnit({
                        coordX: snakeHead.get('coordX'),
                        coordY: snakeHead.get('coordY') - 1,
                    });
                    break;
                }
                case MOVE_DIRECTIONS.bottom: {
                    newSnakeUnit = new SnakeUnit({
                        coordX: snakeHead.get('coordX'),
                        coordY: snakeHead.get('coordY') + 1,
                    });

                    break;
                }
            }
            if(!this.isFood(newSnakeUnit)){ // проверяем была ли пища в клетке, если была не удаляем хвост
                this.snake.remove(snakeTail);
            }
            else {
                this.snakeEat(newSnakeUnit);
            }
            this.checkEndGame(newSnakeUnit); // проверяем условия окончания игры
            this.snake.unshift(newSnakeUnit); // добавляем голову
        },
        changeDirection: function (e) {
            var key = e.keyCode;
            if (this.snake.length === 0) {
                return;
            }
            switch (key) {
                case KEY_CODE.left: // нажата клавиша влево
                    if (this.snake.direction !== MOVE_DIRECTIONS.right) {
                        this.snake.direction = MOVE_DIRECTIONS.left;
                        this.moveSnake();// получаем ускорение змейки
                    }
                    break;
                case KEY_CODE.up: // нажата клавиша вверх
                    if (this.snake.direction !== MOVE_DIRECTIONS.bottom) {
                        this.snake.direction = MOVE_DIRECTIONS.top;
                        this.moveSnake();
                    }
                    break;
                case KEY_CODE.right: // нажата клавиша вправо
                    if (this.snake.direction !== MOVE_DIRECTIONS.left) {
                        this.snake.direction = MOVE_DIRECTIONS.right;
                        this.moveSnake();
                    }
                    break;
                case KEY_CODE.down: // нажата клавиша вниз
                    if (this.snake.direction !== MOVE_DIRECTIONS.top) {
                        this.snake.direction = MOVE_DIRECTIONS.bottom;
                        this.moveSnake();
                    }
                    break;
            }
        },
        checkEndGame: function(newUnit){
            if (this.isBorder(newUnit) || this.isSnake(newUnit)){
                this.stopGame();
            }
        },
        isBorder: function (newUnit) {
            if ($('td').is('[data-coord="' + newUnit.get('coordX') + '-' + newUnit.get('coordY') + '"]')) {// проверка есть ли ячейка с задаными координатами
                return false;
            }
            return true;
        },
        isSnake: function(newUnit){
            var snakeModels = this.snake.where({coordX: newUnit.get('coordX'), coordY: newUnit.get('coordY')});
            if(snakeModels.length >= 1){
                return true;
            }
            return false;
        },
        createFood: function(){
            for(let i = 0; i < FOODS_QUANTITY; i++) {
                let coordX = getRandomInt(0, FIELD_WIDTH);
                let coordY = getRandomInt(0, FIELD_HEIGHT);
                let foodUnit = new FoodUnit({coordX: coordX, coordY: coordY});
                if (!this.isSnake(foodUnit)) {
                    this.foods.add(foodUnit);
                }
                setTimeout(function () {
                    this.foods.remove(foodUnit);
                }.bind(this), FOOD_UPDATE_INTERVAL);
            }
        },
        isFood: function(newUnit){
            var foodModel = this.foods.where({coordX: newUnit.get('coordX'), coordY: newUnit.get('coordY')});
            if(foodModel.length >= 1){
                return true;
            }
            return false;
        },
        snakeEat: function(newUnit){
            var foodModel = this.foods.where({coordX: newUnit.get('coordX'), coordY: newUnit.get('coordY')});
            this.foods.remove(foodModel);
            this.score++;
        },
        stopGame: function () {
            clearInterval(this.moveInterval);
            clearInterval(this.foodInterval);
            this.foods.reset();
            this.snake.reset();
            alert('Game over. Score - ' + this.score);
        },
        renderFood: function(){
            $('.cell').removeClass('food');
            this.foods.forEach(function (foodUnit) {
                $('[data-coord="' + foodUnit.get('coordX') + '-' + foodUnit.get('coordY') + '"]').addClass(CELLS_TYPES.food);
            });
        },
        renderSnake: function () {
            $('.cell').removeClass('snake');
            this.snake.forEach(function (snakeUnit) {
                $('[data-coord="' + snakeUnit.get('coordX') + '-' + snakeUnit.get('coordY') + '"]').addClass(CELLS_TYPES.snake);
            });
        }
    });
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    let gameField = new GameField({el: '#root'});
});


