var Core = {};

Core.DropDownLoader = Backbone.Collection.extend({
	initialize : function(opt){
		this.url = opt.url;
		this.label = opt.label;
		this.value = opt.value;
	},
	parse : function(response){
		return _.map(response, function(x){ 
				return { label: x[this.label], value: x[this.value] }
		}, this);
	}

});

Core.FormView = Backbone.Epoxy.View.extend({
	template : 'FormView',
	events : {
		"click .save" : "saveForm",
    	"click .cansel" : "cansel"
	},
	
	saveForm : function(e){
		var view = this;
		this.model.save({
	            wait: true
	        },{
			success : function(model){
				view.trigger('close');
			}
		});
	},
	cansel : function(e){
    	this.trigger('close');
    },    
    initialize: function(opt) {
    	console.log('hello');
		var template = _.template(this.template);
    	this.$el.html(template());

    	for(var model in this.bindingSources){
    		this.bindingSources[model].fetch();
    	}
    	
    	if (!this.model.isNew())
			this.model.fetch();
		console.log('hello2');
    }
});

Core.BaseModel = Backbone.Epoxy.Model.extend({	
    idAttribute: "_id"
});

Core.GRUD = function(opt){

	var Model = (opt.Model || Core.BaseModel).extend({	
	    urlRoot : opt.resurce
	});

	
	var ListItemView = Backbone.Epoxy.View.extend({
		template : $("#item").html(),
	    tagName: "tr",
	    events : {
	    	"click .edit" : "editItem",
	    	"click .delete" : "delete"
	    },
	    delete : function(e){
	    	this.model.destroy();	
	    },
	    editItem : function(e){
	    	this.model.trigger('details', this.model.get('_id'));
	    },

	    initialize: function() {
	    	var template = _.template(this.template);
		    this.$el.html(template(this.model.toJSON()));  
	    }
	});

	var ListCollection = Backbone.Collection.extend({
	    model: Model,
	    view: ListItemView,
	    url : opt.resurce
	});


	var ListView = Backbone.Epoxy.View.extend({
		template : $('#list').html(),
	    initialize: function(opt) {
	    	var template = _.template(this.template);
	    	this.$el.html(template());

	    	this.collection.fetch();
	    },
	    events : {
	    	"click .add" : "newItem"
	    },
	    newItem : function(){
	    	this.collection.trigger('details');
	    },
	});


	var DetailsView = opt.FormView || Core.FormView;

	var show = function(view){
		$(opt.container).empty().html(view.render().el);
	}

	var collection =  new ListCollection();
			
	return {
		list : function(){
			
			collection.on('details', this.details, this);
			var listView = new ListView({ 
				collection : collection
			});
			
			show(listView);
		},

		details : function(id){
			var item = id ? collection.get(id) : new Model();
			var form = new DetailsView({
				model : item	
			}); 
			form.on('close', this.list, this);
			show(form);
		}

	};
}