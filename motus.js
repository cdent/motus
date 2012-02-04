var Set = function() {}
Set.prototype.add = function(o) { this[o] = true; }
Set.prototype.remove = function(o) { delete this[o]; }
var currentSelections = new Set();
var currentBag = '';

var stubData = {
    bagone: ['hello', 'goodbye', 'fast'],
    bagtwo: ['three', 'two', 'one'],
    bagthree:['alpha', 'beta', 'omega']
    };

function openBag() {
    bagName = $(this).text();
    currentBag = bagName;
    $('.tiddlers').empty();
    $.each(stubData[bagName], function(index, value) {
        $('<li draggable="true">').text(value).appendTo('.tiddlers');
    });
}


function init() {
    $.event.props.push('dataTransfer');
    $('[draggable]')
        .live('dragstart', function(e) {
            $(this).addClass('dragging');
            $(this).addClass('selected');
            e.dataTransfer.effectAllowed = 'copy';
            currentSelections.add($(this).text());
        })
        .live('dragend', function(e) {
            $(this).removeClass('dragging');
        })
        .live('click', function(e) {
            var title = $(this).text();
            if (title in currentSelections) {
                $(this).removeClass('selected');
            } else {
                $(this).addClass('selected');
                if (e.shiftKey) {
                    currentSelections.add(title);
                } else {
                    currentSelections = new Set();
                    currentSelections.add(title);
                }
            }
            console.log('click', currentSelections, title);
        });
                

    $('.bags > li')
        .live('click', function(e) {
            e.stopPropagation();
            e.preventDefault();     
            $('.chosen').removeClass('chosen');
            $(this).addClass('chosen');
            openBag.apply(this);
        });

    $('.bags > li:not(.chosen)')
        .live('dragenter', function(e) {
            e.stopPropagation();
            e.preventDefault();     
            console.log('dragenter', $(this));
            $(this).addClass('dragtarget');
        })
        .live('dragleave', function(e) {
            e.stopPropagation();
            e.preventDefault();     
            console.log('dragleave', e);
            $(this).removeClass('dragtarget');
        })
        .live('dragover', function(e) {
            e.stopPropagation();
            e.preventDefault();     
            console.log('dragover', e);
            e.dataTransfer.dropEffect = 'copy';
        })
        .live('drop', function(e) {
            e.stopPropagation();
            e.preventDefault();     
            $(this).removeClass('dragtarget');
            $('.selected').addClass('moved').removeClass('selected');
            console.log('drop', currentSelections);
            var bagName = $(this).text();
            $.each(currentSelections, function(key, value) {
                if (typeof value === 'boolean') {
                    console.log(currentBag, bagName, key);
                    stubData[bagName].push(key);
                    stubData[currentBag].splice(
                        stubData[currentBag].indexOf(key), 1);
                }
            });
            console.log('sd', stubData);
            currentSelections = new Set();
        })
}

$(init);
