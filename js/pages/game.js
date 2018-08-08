function game(){
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

    let GameMenu = Backbone.View.extend({

    })

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
            this.isGame = true;
            this.score = 0;
            this.foods = new Foods();
            this.respawnSnake();
            this.createFood();
            if (this.moveInterval != null) {
                clearInterval(this.moveInterval);
            }
            if (this.foodInterval != null) {
                clearInterval(this.foodInterval);
            }
            this.moveInterval = setInterval(function () {
                this.moveSnake();
            }.bind(this), snakeStepInterval);
            this.foodInterval = setInterval(function () {
                this.createFood();
            }.bind(this), FOOD_UPDATE_INTERVAL);
        },
        drawField: function () {
            let root = $('#root');
            root.empty();
            let table = $('<table/>');

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
            root.append($('<a href="#">Меню</a><br>'), $('<button id="start">Запуск игры</button>'), table,
                '<h3 id="info">Управление стрелками &#8592 &#8593 &#8594 &#8595</h3>');
        },
        respawnSnake: function () {
            console.log('respawn snake');
            this.snake = new Snake();
            for (let i = 0; i < SNAKE_START_SIZE; i++) {
                let snakeUnit = new SnakeUnit({
                    coordX: START_X_COORD - i,
                    coordY: START_Y_COORD,
                });
                this.snake.add(snakeUnit);
            }
        },
        moveSnake: function () {
            let snakeHead = this.snake.at(0);
            let newSnakeUnit = {};
            if (this.snake.length === 0) {
                return;
            }
            switch (this.snake.direction) {
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
            if (!this.isFood(newSnakeUnit)) { // проверяем была ли пища в клетке, если была не удаляем хвост
                this.snake.pop();
            }
            else {
                this.snakeEat(newSnakeUnit);
            }
            this.checkEndGame(newSnakeUnit); // проверяем условия окончания игры
            this.snake.unshift(newSnakeUnit); // добавляем голову
        },
        changeDirection: function (e) {
            let key = e.keyCode;
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
        checkEndGame: function (newUnit) {
            if (this.isBorder(newUnit) || this.isSnake(newUnit)) {
                this.stopGame();
            }
        },
        isBorder: function (newUnit) {
            return !$('td').is('[data-coord="' + newUnit.get('coordX') + '-' + newUnit.get('coordY') + '"]');
        },
        isSnake: function (newUnit) {
            let snakeModels = this.snake.where({coordX: newUnit.get('coordX'), coordY: newUnit.get('coordY')});
            return snakeModels.length >= 1;

        },
        createFood: function () {
            for (let i = 0; i < foodsQuatity; i++) {
                let foodUnit = {};
                do {
                    let coordX = getRandomInt(0, FIELD_WIDTH);
                    let coordY = getRandomInt(0, FIELD_HEIGHT);
                    foodUnit = new FoodUnit({coordX: coordX, coordY: coordY})
                } while (this.isSnake(foodUnit));// как только найдена свободная от змейки ячейка выходим из цикла

                this.foods.add(foodUnit);

                setTimeout(function () {
                    this.foods.remove(foodUnit);
                }.bind(this), FOOD_UPDATE_INTERVAL);
            }
        },
        isFood: function (newUnit) {
            let foodModel = this.foods.where({coordX: newUnit.get('coordX'), coordY: newUnit.get('coordY')});
            return foodModel.length >= 1;
        },
        snakeEat: function (newUnit) {
            let foodModel = this.foods.where({coordX: newUnit.get('coordX'), coordY: newUnit.get('coordY')});
            this.foods.remove(foodModel);
            this.score++;
        },
        stopGame: function () {
            this.isGame = false;
            clearInterval(this.moveInterval);
            clearInterval(this.foodInterval);
            this.foods.reset();
            this.snake.reset();
            alert('Game over. Score - ' + this.score);

        },
        renderFood: function () {
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

    var gameField = new GameField({el: '#root'});
    return gameField;
}




