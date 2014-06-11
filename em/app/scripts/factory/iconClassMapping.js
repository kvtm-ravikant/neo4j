/**
 * Created by Ravikant on 2/1/14.
 */

angular.module('educationMediaApp').factory("iconClassMapping",function(){
    var iconClassMapping={
        "search":"fa fa-search",
        "sitemap":"fa fa-sitemap",
        "plusCircle":"fa fa-plus-circle",
        "pencilSquare":"fa fa-pencil-square",
        "timesCircle":"fa fa-times-circle",
        "users":"fa fa-users"
    }
    return iconClassMapping;
});