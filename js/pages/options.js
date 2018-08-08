function options() {
    var OptionsView = Backbone.View.extend({
        tagName: 'div',
        events: {
            'click #saveOptions': 'saveOptions'
        },
        template: _.template('<div><a href="#">Меню</a><br/>' +
            '<label>Количество пищи на экране<input type="number" id="foodQuantity" value="<%= foodsQuatity%>"></label><br/>' +
            '<label>Время между шагами змейки<input type="number" id="snakeSpeed" value="<%= snakeStepInterval%>"></label><br/>' +
            '<label>Создавать препятвия(пока не реализовано)<input type="checkbox" id="isCreateBarriers"></label><br/>' +
            '<button id="saveOptions">Сохранить настройки</button>' +
            '<div id="message">Сохранено</div>' +
            '</div>'),
        initialize: function(){
            this.foodsQuatity = foodsQuatity;
            this.snakeStepInterval = snakeStepInterval;
            this.render();
        },
        saveOptions: function(){
            foodsQuatity = $('#foodQuantity').val();
            snakeStepInterval = $('#snakeSpeed').val();
            var message = $('#message');
            message.slideDown();
            setTimeout(function () {
                message.slideUp();
            }, 1000);
        },
        render: function () {
            this.$el.empty();
            this.$el.append(this.template(this.attributes));
        }
    });

    var optionsView = new OptionsView({el: "#root"});
}