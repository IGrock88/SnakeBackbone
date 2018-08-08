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
            if(typeof this.game === 'undefined'){
                this.game = game();
            }
            else {
                this.game.drawField();
            }
        },
        chooseOptionPage: function () {
            console.log('options');
            options();
        }
    });
    window.router = new Router();
    Backbone.history.start();
});