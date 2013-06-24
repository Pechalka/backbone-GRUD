









function GRUD(opt){
	var self = {};

var Model = Backbone.Epoxy.Model.extend({	
	    idAttribute: "_id",
	    defaults : opt.form.defaults
	});

var ListItemView = Backbone.View.extend({
    tagName: "li",
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
    	var templateText = $("#item").html();
    	var template = _.template(templateText);
	    this.$el.html(template(this.model.toJSON()));  
    }
});

var ListCollection = Backbone.Collection.extend({
    model: Model,
    view: ListItemView
});


var ListView = Backbone.Epoxy.View.extend({
    initialize: function(opt) {
    	var template = _.template(opt.templateText);
    	this.$el.html(template());
    },
    events : {
    	"click .add" : "newItem"
    },
    newItem : function(){
    	this.collection.trigger('details');
    },
});

	var DetailsView = Backbone.Epoxy.View.extend({
		events : {
			"click .save" : "saveForm",
	    	"click .cansel" : "cansel"
		},
		
		saveForm : function(e){
			this.model.save({
		            wait: true
		        },{
				success : function(model){
					model.trigger('showList');
				}
			});
		},
		cansel : function(e){
	    	this.model.trigger('showList');
	    },
	    bindingSources:  opt.form.bindingSources,

	    bindings : opt.form.bindings,	    
	    initialize: function(opt) {
			
	    	for(var model in this.bindingSources){
	    		this.bindingSources[model].fetch();
	    	}
	    	
	    	if (!this.model.isNew())
				this.model.fetch();


	    	var template = _.template(opt.templateText);
	    	this.$el.html(template());

	    	this.model.urlRoot = opt.resurce;
	    }
	});

	self.show = function(view){
		$(opt.container).empty().html(view.render().el);
	}

	self.list = function(){
		var templateText = $('#list').html();

		var collection = self.collection;
		var listView = new ListView({ 
			templateText : templateText,
			resurce : opt.resurce,
			collection : collection
		});
		
		collection.url = opt.resurce;

		self.show(listView);

		collection.fetch();
	}

	self.details = function(id){
		var detailsTemplate = $('#details').html();
		var item = id ? self.collection.get(id) : new Model();
		var form = new DetailsView({
			templateText : detailsTemplate,
			resurce : opt.resurce	,
			model : item	
		}); 
		item.on('showList', self.list, self);
		self.show(form);
	}

	self.start = function(){
		self.collection = new ListCollection();
		self.collection.on('details', self.details, self);
		self.list();
	}

	return self;
}