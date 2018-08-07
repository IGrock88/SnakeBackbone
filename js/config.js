var FIELD_WIDTH = 20;
var FIELD_HEIGHT = 20;
var SNAKE_START_SIZE = 4;
var SNAKE_STEP_INTERVAL = 500;
var FOOD_UPDATE_INTERVAL = 5000;
var FOODS_QUANTITY = 3;
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