define([], function(){
    return {
        isDifferent: false,

        /**
         * Javascript Diff Algorithm
         *  By John Resig (http://ejohn.org/)
         *  Modified by Nathan Toombs
         *
         * Released under the MIT license.
         *
         * More Info:
         *  http://ejohn.org/projects/javascript-diff-algorithm/
         * @param o
         * @param n
         * @returns {string}
         */
        diffString: function ( o, n ) {
            o = o.replace(/\s+$/, '');
            n = n.replace(/\s+$/, '');

            var out = this.diff(o == "" ? [] : o.replace(/([-.])/, ' $1').split(/\s+/), n == "" ? [] : n.replace(/([-.])/, ' $1').split(/\s+/));
            var str = "";

            var oSpace = o.match(/\s+/g);
            if (oSpace == null) {
                oSpace = [""];
            } else {
                oSpace.push("");
            }
            var nSpace = n.match(/\s+/g);
            if (nSpace == null) {
                nSpace = [""];
            } else {
                nSpace.push("");
            }

            if (out.n.length == 0) {
                for (var i = 0; i < out.o.length; i++) {
                    str += '<del>' + out.o[i] + "</del>" + oSpace[i] + " ";
                }
            } else {
                if (out.n[0].text == null) {
                    for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
                        str += '<del>' + out.o[n] + "</del>" + oSpace[n] + " ";
                    }
                }

                var j = 0;
                for ( var i = 0; i < out.n.length; i++ ) {
                    if (out.n[i].text == null) {
                        str += '<ins>' + out.n[i] + "</ins>" + nSpace[j];
                        j++;
                    } else {
                        var pre = "";

                        for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++ ) {
                            pre += '<del>' + out.o[n] + "</del>" + oSpace[n] + " ";
                        }
                        str += out.n[i].text + nSpace[i] + pre;
                    }
                }
            }

            return str.trim();
        },

        diff: function ( o, n ) {
            var ns = {};
            var os = {};

            for ( var i = 0; i < n.length; i++ ) {
                if ( ns[ n[i] ] == null )
                    ns[ n[i] ] = { rows: [], o: null };
                ns[ n[i] ].rows.push( i );
            }

            for ( var i = 0; i < o.length; i++ ) {
                if ( os[ o[i] ] == null )
                    os[ o[i] ] = { rows: [], n: null };
                os[ o[i] ].rows.push( i );
            }

            for ( var i in ns ) {
                if ( ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1 ) {
                    n[ ns[i].rows[0] ] = { text: n[ ns[i].rows[0] ], row: os[i].rows[0] };
                    o[ os[i].rows[0] ] = { text: o[ os[i].rows[0] ], row: ns[i].rows[0] };
                }
            }

            for ( var i = 0; i < n.length - 1; i++ ) {
                if ( n[i].text != null && n[i+1].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null &&
                    n[i+1] == o[ n[i].row + 1 ] ) {
                    n[i+1] = { text: n[i+1], row: n[i].row + 1 };
                    o[n[i].row+1] = { text: o[n[i].row+1], row: i + 1 };
                }
            }

            for ( var i = n.length - 1; i > 0; i-- ) {
                if ( n[i].text != null && n[i-1].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null &&
                    n[i-1] == o[ n[i].row - 1 ] ) {
                    n[i-1] = { text: n[i-1], row: n[i].row - 1 };
                    o[n[i].row-1] = { text: o[n[i].row-1], row: i - 1 };
                }
            }

            if (JSON.stringify(o) !== JSON.stringify(n)) {
                this.isDifferent = true;
            }

            return { o: o, n: n };
        }
    }
});