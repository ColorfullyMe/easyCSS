/* MAIN JS */

(function($, b, _, w){
	//when page is loaded
	$(document).ready(function(e) {
        
		//DOM / Ajax library for backbone
		b.$ = $;
		
		//modeling
		var mCSS = b.Model.extend({}),
			cCSS = b.Collection.extend({
				model: mCSS,
				url: 'CSS.json',
				parse: function(response){
					return _.map(response, function(val, key){ val['name'] = key; return val; });
				}
			}),
			vCSS = b.View.extend({
				 tagName: 'ul',
				 id: 'ulCSS',
				 initialize: function(){
					 this.css = new cCSS();
					 this.listenTo(this.css, 'sync', this.render);
					 $('#s').on('keyup', this, this.apply_name_filter);
					//get the data
					 this.css.fetch();
				 },
				 render: function(){
					this.asJSON = this.css.toJSON();	//cashed data
					this.$el.html( this.doItems( this.asJSON ) );
					this.$el.appendTo('#content');
				},
				doItems: function(data){
					 //build html
					 var html = '<li id="s-results">Listing: '+data.length+' of '+this.asJSON.length+' properties.</li>';
					 _.each(data,function(item){
						 html+=
						 	'<li>'+
								'<p class="name">'+_.escape(item.name)+'</p>'+
								'<p class="desc">'+_.escape(item.desc)+'</p>'+
								'<p class="syntax">'+_.escape(item.syntax)+'</p>'+
								'<ul>'+
									'<li class="icon-initial" title="Initial value"> '+_.escape(item.initial)+'</li>'+
									'<li class="icon-inherited" title="Inherited"> '+_.escape(item.inherited)+'</li>'+
									'<li class="icon-vendors" title="Vendor prefixes"> '+(_.isArray(item.vendors)?item.vendors.join(', '):'n/a')+'</li>'+
								'</ul>'+
							'</li>';
					});
					return html;
				},
				apply_name_filter: function(e){
					var root = e.data,
						term = $.trim( $(e.target).val() ),
                        how = $('input:radio[name="how"]:checked').val();
					
                    if( term ){
                        var matches,replaced;
                        switch(how){
                            case 'contains': matches = term; replaced = "("+term+")"; break;
                            case 'begins': matches = "^"+term; replaced = "^("+term+")"; break;
                            case 'ends': matches = term+'$'; replaced = "("+term+")$"; break;
                        }
						//filter it
                        root.$el.html( root.doItems( _.filter(root.asJSON,function(item){
                            return new RegExp(matches,'g').test(item.name);
						})));
                        //highlight matches
                        $('#ulCSS .name:contains("'+term+'")').html(function(_, html){
                            return html.replace(new RegExp(replaced,'g'), '<span class="matched">$1</span>');
                        });
                    }
					else
						root.$el.html( root.doItems( root.asJSON ) );
				}
			});
			
		//global instance
		w.easyCSS = new vCSS();
		
    });
})(jQuery, Backbone, _, window);
