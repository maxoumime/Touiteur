//Affiche le contenu d'un touite (avec un lien par mot-dièse)
app.directive('touiteContent', function () {
    return {
        scope: {
            content: '=content'
        },
        link: function(scope, element, attrs)
        {
            var touiteContent = scope.content;

            var htmlText = '<h3 class="inline">“ <small>';

            var touiteContentArray = touiteContent.split(" ");

            for(var i = 0; i < touiteContentArray.length; i++){

                var word = touiteContentArray[i];

                if(word.match(/^#\w*$/) !== null) {

                    var motsdiese = word.split("#");

                    for (var j = 0; j < motsdiese.length; j++) {

                        var motdiese = motsdiese[j];

                        if(motdiese.length > 0)
                            htmlText += '<a href="#/motdiese/'+ motdiese + '">#' + motdiese + " </a>";
                    }
                }else{

                    htmlText += word + " ";
                }
            }

            htmlText += '</small> ”</h3>';

            element.replaceWith(htmlText);
        }
    };
});