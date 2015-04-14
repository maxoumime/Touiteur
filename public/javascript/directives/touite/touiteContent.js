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

                    var hashtags = word.split("#");

                    for (var j = 0; j < hashtags.length; j++) {

                        var hashtag = hashtags[j];

                        if(hashtag.length > 0)
                            htmlText += '<a href="#/hashtag/'+ hashtag + '">#' + hashtag + "</a>";
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