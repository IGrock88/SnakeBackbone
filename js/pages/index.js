var IndexView = Backbone.View.extend({
    tagName: 'div',
    template: _.template('<div><a href="#game">Игра</a><br/><a href="#options">Настройки</a></div>'),
    initialize: function(){
        this.render();
    },
    render: function () {
        this.$el.empty();
        this.$el.append(this.template);
    }
});