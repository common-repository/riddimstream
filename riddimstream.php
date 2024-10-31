<?php

/*
Plugin Name: Riddim Stream
Description:  Embed Riddim Stream widgets
Version: 1.1.0
*/

class RiddimStream { 
    public static $instance;
    public static function create() { 
           if (RiddimStream::$instance == null) { 
               RiddimStream::$instance = new RiddimStream();
               add_action('init',array(RiddimStream::$instance, 'init'));
           }
           return RiddimStream::$instance;
    }
    public function init() { 
        // Add Shortcode for riddimstream
        add_shortcode( 'riddimstream', array( $this, 'do_shortcode' ));
        
        // Add and register the editor buttons
        add_filter( 'mce_external_plugins', array( $this, 'mce_add_plugin' ) );
        add_filter( 'mce_buttons', array( $this, 'mce_register_buttons' ) );
        
        add_action( 'wp_ajax_riddimstream_get_id', array($this,'ajax_get_id_from_url') );
        
        add_filter('riddimstream_process_id', array( $this, 'extract_id_from_url' ) );
    }
    public function ajax_get_id_from_url() { 
        $url = $_REQUEST['url'];
        
        $id = apply_filters('riddimstream_process_id', $url);
        echo $id;
        exit;
    }
    
    public function extract_id_from_url( $url ) { 
        $existing_matches = get_transient( 'riddimstream_url_matches' ); 
        if (  false === $existing_matches )
            $existing_matches = array();
        
        if ( isset( $existing_matches[$url] )  )
            return $existing_matches[$url];
        if ( false !== strpos($url, 'https://') || false !== strpos($url, 'http://') ) { 
            $content = file_get_contents($url);
            $doc = new DOMDocument();
            @$doc->loadHTML($content);
            $metas = $doc->getElementsByTagName('div');
            $finder = new DomXPath($doc);
            $classname="album_share_url";
            $nodes = $finder->query("//div[contains(concat(' ', normalize-space(@class), ' '), ' $classname ')]");

            if ($nodes->length > 0) { 
                $parts = parse_url( $nodes->item(0)->nodeValue );
                $query = array();
                parse_str( $parts['query'], $query );
                $id = $query['ids'];
                $existing_matches[$url] = $id;
                set_transient( 'riddimstream_url_matches', $existing_matches );
                
                return $id;
            }
            
            return false;
        }
        // Assume it is the ID
        return $url;
    }
    
    public function mce_add_plugin( $plugin_array ) { 
         $plugin_array['riddimstream'] = plugins_url( '/js/riddimstream-plugin.js', __FILE__ );
        return $plugin_array;
    }
    public function mce_register_buttons( $buttons  ) { 
        array_push( $buttons, 'riddimstream' );
        return $buttons;
    }
    
    public function do_shortcode( $atts ) { 
        $atts = shortcode_atts( array(
            'height' => '300px',
            'width' => '100%',
            'id' => ''
        ), $atts );
        include(dirname(__FILE__) . '/tpl/iframe.php');
        
    }
}

$GLOBALS['riddimstream'] = RiddimStream::create();
