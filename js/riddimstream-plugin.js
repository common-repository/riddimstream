(function() {
    tinymce.create('tinymce.plugins.RiddimStream', {
        /**
         * Initializes the plugin, this will be executed after the plugin has been created.
         * This call is done before the editor instance has finished it's initialization so use the onInit event
         * of the editor instance to intercept that event.
         *
         * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
         * @param {string} url Absolute URL to where the plugin is located.
         */
        init : function(ed, url) {
            ed.addButton('riddimstream', {
                title : 'Add Riddimstream shortcode',
                cmd : 'riddimstream',
                image : url + '/riddim.png'
            });
            
             ed.addCommand('riddimstream', function() {
                 var optionsurl = ajaxurl + '?action=riddimstream';
                 var url = '';
                 var height = '';
                 var width = '';
                  ed.windowManager.open({
                        title: 'Riddimstream Widget',
                        width:700,
                        height:200,
                        body: [
                            {//add header input
                                type: 'textbox',
                                name: 'url',
                                label: 'Riddimstream URL',
                                value: url,
                                tooltip: 'Enter the Riddimstream URL (or ID) of the stream you wish to embed'
                            },
                            {//add footer input
                                type: 'textbox',
                                name: 'width',
                                label: 'Width (optional)',
                                value: width,
                                tooltip: 'Defaults to 100%'
                            },{//add footer input
                                type: 'textbox',
                                name: 'height',
                                label: 'height (optional)',
                                value: height,
                                tooltip: 'Defaults to 100%'
                            }], onsubmit: function( e ) { //when the ok button is clicked
                                //start the shortcode tag
                                
                                 jQuery(document).ready(function($) {
                                    data = {
                                        action: 'riddimstream_get_id',
                                        url: e.data.url
                                    };
                                    $.post(ajaxurl, data, function (response) {
                                        var shortcode_str = '[riddimstream id="'+response+'"';

                                        //check for header
                                        if (e.data.width != undefined && e.data.width.length)
                                            shortcode_str += ' width="' + e.data.width + '"';
                                        //check for footer
                                        if (e.data.height != undefined && e.data.height.length)
                                            shortcode_str += ' height="' + e.data.height + '"';

                                        //add panel content
                                        shortcode_str += ']';

                                        //insert shortcode to TinyMCE
                                        ed.insertContent( shortcode_str);
                                    });
                                    return false;
                                });
                                
                            }
                  });
              
                
            });
        },
 
        /**
         * Creates control instances based in the incomming name. This method is normally not
         * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
         * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
         * method can be used to create those.
         *
         * @param {String} n Name of the control to create.
         * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
         * @return {tinymce.ui.Control} New control instance or null if no control was created.
         */
        createControl : function(n, cm) {
            return null;
        },
 
        /**
         * Returns information about the plugin as a name/value array.
         * The current keys are longname, author, authorurl, infourl and version.
         *
         * @return {Object} Name/value array containing information about the plugin.
         */
        getInfo : function() {
            return {
                longname : 'Riddimstream Widget',
                author : 'Riddimstream',
                authorurl : 'http://www.riddimstream.com',
                version : "1.0"
            };
        }
    });
 
    // Register plugin
    tinymce.PluginManager.add( 'riddimstream', tinymce.plugins.RiddimStream );
})();