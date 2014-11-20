$(function() {
    var LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var ref = new Firebase("https://walloftext.firebaseio.com/");
    var width = 86;
    var height = 43;
    var m = {};
    var seen = new Set();

    function randomizeFull(ref,width,height) {
        for (var r = 0; r < height; r++) {
            m[r] = {}
            for (var c = 0; c < width; c++) {
                m[r][c] = LETTERS.charAt(Math.floor(Math.random()*LETTERS.length));
            }
        }
        ref.set(m);
    }

    function listen(ref,width,height) {
        for (var r = 0; r < height; r++) {
            for (var c = 0; c < width; c++) {
                (function(r,c) {
                    ref.child(r).child(c).on("value", function(snapshot) {
                        var data = snapshot.val();
                        var selector = '.'+r.toString()+' .'+c.toString();
                        var concat = r.toString()+c.toString();
                        if (seen.has(concat)) {
                            $(selector).css('background-color','lightblue').fadeOut(1000, function() {
                                $(this).html(data).fadeIn(1000, function() {
                                    $(this).css('background-color','');
                                });
                            });
                        } else {
                            seen.add(concat);
                            $(selector).html(data);
                        }
                    });
                })(r,c);
            }
        }
    }

    function initializeTable(width,height) {
        var table = $('<table></table>');
        for (var r = 0; r < height; r++) {
            var row = $('<tr></tr>').addClass(r.toString());
            for (var c = 0; c < width; c++) {
                var col = $('<td></td>').addClass(c.toString()).css("min-width","18px");
                row.append(col);
            }
            table.append(row);
        }
        $('body').append(table);
    }
    
    function startChanges(ref,width,height) {
        window.setInterval(function() {
            var r = Math.floor(Math.random()*height);
            var c = Math.floor(Math.random()*width);
            var letter = LETTERS.charAt(Math.floor(Math.random()*LETTERS.length)); 
            ref.child(r).child(c).set(letter);
        }, 1);
    }

    initializeTable(width,height);
    listen(ref,width,height);
    startChanges(ref,width,height);
});