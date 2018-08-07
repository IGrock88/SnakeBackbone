var IndexView = Backbone.View.extend({
    tagName: 'div',
    template: _.template('<div><a href="#game">Новая Игра</a><br/><a href="#options">Настройки</a></div>'),
    initialize: function(){
        console.log('test');
        this.render();
    },
    render: function () {
        this.$el.empty();
        this.$el.append(this.template);
    }
});