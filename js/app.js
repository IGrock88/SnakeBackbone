$(function () {

    var Router = Backbone.Router.extend({
        routes: {
            "": 'loadIndex',
            "game": "chooseGameField",
            "options": 'chooseOptionPage'
        },
        loadIndex: function(){
            console.log('index');
            new IndexView({el: '#root'});
        },
        chooseGameField: function () {
            console.log('game');
            game();
        },
        chooseOptionPage: function () {
            console.log('options');
        }
    });
    window.router = new Router();
    Backbone.history.start();
});