var App = (function() {

    'use strict';

    var $ = {

        /*!
         * Initializer
         */
        init: function() {
            $.components.navigation();
        },

        components: {

            /*!
             * Get /nav.json then
             * populate menu items
             */
            navigation: function() {

                // get nav items
                $.ajax({
                    method: 'GET',
                    url: '/api/nav.json',
                    success: function( data ) {

                        var mask         = document.querySelector( '.mask' );
                        var navigation   = document.getElementById( 'navbar__dropdown' );

                        /*!
                         * Build Navigation
                         */
                        function navbuilder( items ) {
                            // create un-ordered list
                            var UL = $.createElement( 'UL' );

                            for ( var i = 0; i < items.length; i++ ) {
                                var item = items[i];

                                // create list item & anchor element
                                var LI = $.createElement( 'LI' );
                                var anchor = $.createElement( 'A' );

                                // configure anchor attribute and inner HTML
                                anchor.setAttribute( 'href', item.url );
                                anchor.innerHTML = item.label;

                                // append anchor to list item
                                LI.appendChild( anchor );

                                // if secondary menu
                                if ( item.items && item.items.length ) {
                                    var secondaryNav = navbuilder( item.items );
                                    LI.classList.add( 'dropdown' );
                                    LI.appendChild( secondaryNav );

                                    // add dropdown__secondary class to secondaryNav
                                    secondaryNav.classList.add( 'dropdown__secondary' );
                                }

                                // append list item to un-ordered list
                                UL.appendChild( LI );
                            }

                            return UL;
                        }

                        /*!
                          * Compile navigation items
                          */
                        navigation.appendChild( navbuilder(data.items) );

                        /*!
                         * Secondary Nav
                         * Event Listeners
                         */
                        var secondaryNav = document.querySelectorAll( '#navbar__dropdown li.dropdown' );

                        function closeSecondaryNav() {
                            // close open dropdown
                            for ( var i = 0; i < secondaryNav.length; i++ ) {
                                var s = secondaryNav[i];
                                if ( $.hasClass(s, 'open') ) {
                                    $.removeClass( s, 'open' );
                                }
                            }
                        }

                        function secondaryNavClickHandler( e ) {
                            e.preventDefault();
                            e.stopPropagation();

                            closeSecondaryNav();

                            var li = e.target.parentNode;
                            if ( $.hasClass(li, 'open') ) {
                                $.removeClass( li, 'open' );
                                $.removeClass( mask, 'mask--active' );
                            } else {
                                $.addClass( li, 'open' );
                                $.addClass( mask, 'mask--active' );
                            }
                        }

                        for ( var i = 0; i < secondaryNav.length; i++ ) {
                            secondaryNav[i].addEventListener( 'click', secondaryNavClickHandler );
                        }

                        /*!
                         * Navigation Toggle
                         */
                        var navigationToggle = document.querySelector( '.navbar__toggle' );
                        var navLogo = document.querySelector( '.navbar__logo' );

                        navigationToggle.addEventListener('click', function( e ) {
                            if ( $.hasClass(this, 'close') ) {
                                $.removeClass( navigation, 'open' );
                                $.removeClass( navigationToggle, 'close' );
                                $.removeClass( navigation, 'open' );
                                $.removeClass( navLogo, 'navbar__logo--visible' );
                                $.removeClass( mask, 'mask--active' );
                            } else {
                                $.addClass( navigation, 'open' );
                                $.addClass( navigationToggle, 'close' );
                                $.addClass( navigation, 'open' );
                                $.addClass( navLogo, 'navbar__logo--visible' );
                                $.addClass( mask, 'mask--active' );
                            }
                        });

                        mask.addEventListener('click', function() {
                            $.removeClass( mask, 'mask--active' );
                            $.removeClass( navLogo, 'navbar__logo--visible' );
                            $.removeClass( navigationToggle, 'close' );
                            $.removeClass( navigation, 'open' );
                            closeSecondaryNav();
                        });
                    }
                });
            }
        },

        /*!
         * determine if element
         * has CSS class
         */
        hasClass: function( element, className ) {
            return element.classList.contains( className );
        },

        /*!
         * add CSS class
         * to an element
         */
        addClass: function( element, className ) {
            return element.classList.add( className );
        },

        /*!
         * remove CSS class
         * from an element
         */
        removeClass: function( element, className ) {
            return element.classList.remove( className );
        },

        /*!
         * Create HTML element
         * @param {String} name - HTML element/node name
         */
        createElement: function( name ) {
            var element = document.createElement( name );
            return element;
        },

        /*!
         * ajax request
         * @param {Object} opt - request options
         * @param {Function} callback - request callback
         */
        ajax: function( opt ) {
            var xhr;

            if ( 'XMLHttpRequest' in window ) {
                xhr = new XMLHttpRequest();
            } else {
                xhr = new ActiveXObject( 'Microsoft.XMLHTTP' );
            }

            xhr.open( opt.method, opt.url, true );

            xhr.onreadystatechange = function() {
                if ( xhr.readyState === 4 && xhr.status === 200 ) {
                    var response = JSON.parse( xhr.responseText );
                    opt.success( response, xhr );
                }
            };

            xhr.send();
        }
    };

    return {
        init: $.init
    };

})();

window.addEventListener( 'DOMContentLoaded', App.init );